<?php

namespace Src\Resolvers;

use GraphQL\Type\Definition\Type;
use Src\DBConnection;
use Src\Entities\Category;

class CategoriesQuery extends AbstractResolver {
  public function resolve($root, $args, DBConnection $db): array 
  {
    $entityManager = $db->getEntityManager();
    $categories = $entityManager->getRepository(Category::class)->findAll();

    return array_map(
      function(Category $category) {
        return $category->getName();
      },
      $categories
    );
  }

  public static function getType(): Type
  {
    return Type::nonNull(Type::listOf(
      Type::nonNull(Type::string())
    ));
  }
}
