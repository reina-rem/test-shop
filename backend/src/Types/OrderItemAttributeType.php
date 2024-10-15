<?php

namespace Src\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Src\Entities\OrderItemAttribute;

class OrderItemAttributeType {
  private static $instance = null;

  public static function resolve(OrderItemAttribute $attr): array
  {
    return [
      'attributeId' => $attr->getAttribute()->getAttributeId(),
      'optionId' => $attr->getOption()->getOptionId(),
    ];
  }

  public static function getType(): ObjectType
  {
    if (self::$instance === null) {
      self::$instance = new ObjectType([
        'name' => 'OrderItemAttribute',
        'fields' => [
          'attributeId' => Type::nonNull(Type::string()),
          'optionId' => Type::nonNull(Type::string()),
        ]
      ]);
    }
  
    return self::$instance;
  }  
}
