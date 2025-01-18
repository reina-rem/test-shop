<?php

namespace Src\Resolvers;

use GraphQL\Error\UserError;
use GraphQL\Type\Definition\Type;
use Src\DBConnection;
use Src\Entities\Order;
use Src\Types\OrderType;

class OrderQuery extends AbstractResolver {
  public function resolve($root, $args, DBConnection $db): array
  {
    /** @var Order */
    $order = $db->getEntityManager()->getRepository(Order::class)->findOneBy(
      ['id' => $args['id']]
    );

    if ($order === null) {
      throw new UserError('Order not found');
    }

    return OrderType::resolve($order);
  }

  public static function getType(): Type
  {
    return Type::nonNull(OrderType::getType());
  }

  public static function getArgs(): array
  {
    return [
      'id' => [
        'type' => Type::nonNull(Type::int()),
      ]
    ];
  }
}
