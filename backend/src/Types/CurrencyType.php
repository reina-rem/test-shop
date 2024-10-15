<?php

namespace Src\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Src\Entities\Currency;

class CurrencyType {
  private static $instance = null;

  public static function resolve(Currency $currency): array
  {
    return [
      'label' => $currency->getLabel(),
      'symbol' => $currency->getSymbol(),
    ];
  }

  public static function getType(): ObjectType
  {
    if (self::$instance === null) {
      self::$instance = new ObjectType([
        'name' => 'Currency',
        'fields' => [
          'label' => Type::nonNull(Type::string()),
          'symbol' => Type::nonNull(Type::string()),
        ],
      ]);
    }
    
    return self::$instance;
  }  
}
