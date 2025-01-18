<?php

namespace Src\Resolvers;

use GraphQL\Error\UserError;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

use Src\DBConnection;

use Src\Entities\Attribute;
use Src\Entities\Order;
use Src\Entities\OrderItem;
use Src\Entities\Currency;
use Src\Entities\Option;
use Src\Entities\OrderItemAttribute;
use Src\Entities\Price;
use Src\Entities\Product;

class PlaceOrderMutation extends AbstractResolver {
  public function resolve($root, $args, DBConnection $db): array
  {
    if (!isset($args['currencySymbol']) || !is_string($args['currencySymbol'])) {
      throw new UserError('Invalid currency symbol');
    }
    if (!isset($args['items']) || !is_array($args['items'])) {
      throw new UserError('Items should be an array');
    }

    $entityManager = $db->getEntityManager();
    $order = new Order();

    /** @var Currency */
    $currency = $entityManager->getRepository(Currency::class)->findOneBy([
      'symbol' => $args['currencySymbol']
    ]);

    if (!$currency) {
      throw new UserError("Currency not found for symbol: " . $args['currencySymbol']);
    }
    $order->setCurrency($currency);

    $productIds = array_map(
      function ($item) {
        return $item['productId'];
      },
      $args['items']
    );

    /** @var array<int, Product> */
    $products = $entityManager->getRepository(Product::class)->findBy([
      'productId' => $productIds,
    ]);

    if (empty($products)) {
      throw new UserError('No products found for given IDs');
    }

    $attributeIds = array_map(
      function ($attribute) {
        return $attribute['attributeId'];
      },
      array_merge(
        ...array_map(function ($item) {
          return $item['attributes'] ?? [];
        }, $args['items'])
      )
    );

    $attributes = $entityManager->getRepository(Attribute::class)->findBy([
      'attributeId' => $attributeIds,
    ]);

    if (empty($attributes)) {
      throw new UserError('No attributes found for given IDs');
    }

    foreach ($args['items'] as $itemData) {
      $filteredProducts = array_filter(
        $products,
        function (Product $product) use ($itemData) {
          return $product->getProductId() === $itemData['productId'];
        }
      );

      if (empty($filteredProducts)) {
        throw new UserError("Product not found for ID: " . $itemData['productId']);
      }

      /** @var Product */
      $product = array_values($filteredProducts)[0];

      $item = new OrderItem();

      $item->setProduct($product);
      $item->setQuantity($itemData['quantity']);

      $prices = array_filter(
        $product->getPrices()->toArray(),
        function(Price $price) use ($currency) {
          return $price->getCurrency()->getId() === $currency->getId();
        }
      );

      if (empty($prices)) {
        throw new UserError("Price not found for currency: " . $currency);
      }
      /** @var Price */
      $price = array_values($prices)[0];

      $item->setPrice($price);

      $entityManager->persist($item);

      if (isset($itemData['attributes'])) {
        foreach ($itemData['attributes'] as $attributeData) {

          $filteredAttributes = array_filter(
            $attributes,
            function (Attribute $attribute) use ($attributeData, $product) {
              return (
                $attribute->getAttributeId() === $attributeData['attributeId'] &&
                in_array($product, $attribute->getProducts()->toArray())
              );
            }
          );

          if (empty($filteredAttributes)) {
            throw new UserError("Attribute not found for ID: " . $attributeData['attributeId']);
          }
    
          /** @var Attribute */
          $attribute = array_values($filteredAttributes)[0];

          $filteredOptions = array_filter(
            $attribute->getOptions()->toArray(),
            function (Option $option) use ($attributeData) {
              return $option->getOptionId() === $attributeData['optionId'];
            }
          );

          if (empty($filteredOptions)) {
            throw new UserError("Option not found for ID: " . $attributeData['optionId']);
          }
    
          /** @var Option */
          $option = array_values($filteredOptions)[0];

          $itemAttribute = new OrderItemAttribute();
          $itemAttribute->setItem($item);
          $itemAttribute->addAttribute($attribute);
          $itemAttribute->setOption($option);
          
          $item->addAttribute($itemAttribute);
        }
      }

      $item->setOrder($order);
      $order->addItem($item);
    }

    $entityManager->persist($order);
    $entityManager->flush();

    return [
      'id' => $order->getId(),
    ];
  }

  public static function getType(): ObjectType
  {
    return new ObjectType([
      'name' => 'PlaceOrderResponse',
      'fields' => [
        'id' => Type::nonNull(Type::int()),
      ],
    ]);
  }

  private static $orderItemInputType;
  private static $orderItemAttributeInputType;

  public static function getArgs(): array
  {
    if (!self::$orderItemInputType) {
      self::$orderItemAttributeInputType = new InputObjectType([
        'name' => 'OrderItemAttributeInput',
        'fields' => [
          'attributeId' => Type::nonNull(Type::string()),
          'optionId' => Type::nonNull(Type::string()),
        ],
      ]);

      self::$orderItemInputType = new InputObjectType([
        'name' => 'OrderItemInput',
        'fields' => [
          'productId' => Type::nonNull(Type::string()),
          'quantity' => Type::nonNull(Type::int()),
          'attributes' => Type::nonNull(Type::listOf(
            Type::nonNull(self::$orderItemAttributeInputType)
          )),
        ],
      ]);
    }
  
    return [
      'currencySymbol' => [
        'type' => Type::nonNull(Type::string()),
      ],
      'items' => Type::nonNull(Type::listOf(self::$orderItemInputType)),
    ];
  }
}
