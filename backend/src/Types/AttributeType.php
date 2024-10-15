<?php

namespace Src\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Src\Entities\Attribute;
use Src\Entities\Option;

class AttributeType {
  private static $instance = null;

  public static function resolve(Attribute $attr): array 
  {
    return [
      'attributeId' => $attr->getAttributeId(),
      'type' => $attr->getType(),
      'options' => array_map(
        function (Option $option) {
          return OptionType::resolve($option);
        },
        $attr->getOptions()->toArray()
      ),
    ];
  }

  public static function getType(): ObjectType
  {
    if (self::$instance === null) {
      self::$instance = new ObjectType([
        'name' => 'Attribute',
        'fields' => [
          'attributeId' => Type::nonNull(Type::string()),
          'type' => Type::nonNull(Type::string()),
          'options' => Type::nonNull(Type::listOf(
            Type::nonNull(OptionType::getType())
          )),
        ],
      ]);
    }
  
    return self::$instance;
  }  
}
