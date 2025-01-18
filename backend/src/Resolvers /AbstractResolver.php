<?php

namespace Src\Resolvers;

use GraphQL\Type\Definition\Type;
use Src\DBConnection;

abstract class AbstractResolver {
  abstract public function resolve($root, $args, DBConnection $db);
  
  abstract public static function getType(): Type;

  public static function getArgs(): array
  {
    return [];
  }
}
