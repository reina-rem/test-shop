<?php

namespace Src\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Src\Entities\OrderItem;
use Src\Entities\OrderItemAttribute;

class OrderItemType {
  private static $instance = null;

  public static function resolve(OrderItem $item): array
  {
    return [
      'productId' => $item->getProduct()->getProductId(),
      'quantity' => $item->getQuantity(),
      'price' => $item->getPrice()->getAmount(),
      'attributes' => array_map(
        function (OrderItemAttribute $attr) {
          return OrderItemAttributeType::resolve($attr);
        },
        $item->getAttributes()->toArray(),
      ),
    ];
  }

  public static function getType(): ObjectType 
  {
    if (self::$instance === null) {
      self::$instance = new ObjectType([
        'name' => 'OrderItem',
        'fields' => [
          'productId' => Type::nonNull(Type::string()),
          'quantity' => Type::nonNull(Type::int()),
          'price' => Type::nonNull(Type::float()),
          'attributes' => Type::nonNull(Type::listOf(
            Type::nonNull(OrderItemAttributeType::getType())
          )),
        ],
      ]);
    }
  
    return self::$instance;
  }  
}
