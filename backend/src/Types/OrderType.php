<?php

namespace Src\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Src\Entities\Order;
use Src\Entities\OrderItem;

class OrderType {
  private static $instance = null;

  public static function resolve(Order $order): array
  {
    return [
      'currency' => $order->getCurrency()->getSymbol(),
      'items' => array_map(
        function (OrderItem $item) {
          return OrderItemType::resolve($item);
        },
        $order->getItems()->toArray(),
      ),
    ];
  }

  public static function getType(): ObjectType
  {
    if (self::$instance === null) {
      self::$instance = new ObjectType([
        'name' => 'Order',
        'fields' => [
          'currency' => Type::nonNull(Type::string()),
          'items' => Type::nonNull(Type::listOf(
            Type::nonNull(OrderItemType::getType())
          )),
        ],
      ]);
    }
  
    return self::$instance;
  }  
}
