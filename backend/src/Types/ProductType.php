<?php

namespace Src\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Src\Entities\Attribute;
use Src\Entities\Image;
use Src\Entities\Price;
use Src\Entities\Product;

class ProductType {
  private static $instance = null;

  public static function resolve(Product $product): array
  {
    return [
      'productId' => $product->getProductId(),
      'name' => $product->getName(),
      'inStock' => $product->isInStock(),
      'description' => $product->getDescription(),
      'category' => $product->getCategory()->getName(),
      'brand' => $product->getBrand(),
      'images' => array_map(
        function (Image $image) {
          return $image->getSrc();
        },
        $product->getImages()->toArray()
      ),
      'prices' => array_map(
        function (Price $price) {
          return PriceType::resolve($price);
        },
        $product->getPrices()->toArray()
      ),
      'attributes' => array_map(
        function (Attribute $attr) {
          return AttributeType::resolve($attr); 
        },
        $product->getAttributes()->toArray()
      ),
    ];
  }

  public static function getType(): ObjectType
  {
    if (self::$instance === null) {
      self::$instance = new ObjectType([
        'name' => 'Product',
        'fields' => [
          'productId' => Type::nonNull(Type::string()),
          'name' => Type::nonNull(Type::string()),
          'inStock' => Type::nonNull(Type::boolean()),
          'description' => Type::nonNull(Type::string()),
          'category' => Type::nonNull(Type::string()),
          'brand' => Type::nonNull(Type::string()),
          'images' => Type::nonNull(Type::listOf(
            Type::nonNull(Type::string())
          )),
          'prices' => Type::nonNull(Type::listOf(
            Type::nonNull(PriceType::getType())
          )),
          'attributes' => Type::nonNull(Type::listOf(
            Type::nonNull(AttributeType::getType())
          )),
        ],
      ]);
    }
    
    return self::$instance;
  }  
}
