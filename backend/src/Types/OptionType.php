<?php

namespace Src\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Src\Entities\Option;

class OptionType {
  private static $instance = null;

  public static function resolve(Option $option): array
  {
    return [
      'optionId' => $option->getOptionId(),
      'value' => $option->getValue(),
    ];
  }

  public static function getType(): ObjectType
  {
    if (self::$instance === null) {
      self::$instance = new ObjectType([
        'name' => 'Option',
        'fields' => [
          'optionId' => Type::nonNull(Type::string()),
          'value' => Type::nonNull(Type::string()),
        ],
      ]);
    }
  
    return self::$instance;
  }  
}
