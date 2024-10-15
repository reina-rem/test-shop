<?php

namespace Src\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Src\Entities\Price;

class PriceType {
  private static $instance = null;

  public static function resolve(Price $price): array
  {
    return [
      'amount' => $price->getAmount(),
      'currency' => CurrencyType::resolve($price->getCurrency()),
    ];
  }

  public static function getType(): ObjectType
  {
    if (self::$instance === null) {
      self::$instance = new ObjectType([
        'name' => 'Price',
        'fields' => [
          'amount' => Type::nonNull(Type::float()),
          'currency' => Type::nonNull(CurrencyType::getType()),
        ],
      ]);
    }
  
    return self::$instance;
  }  
}
