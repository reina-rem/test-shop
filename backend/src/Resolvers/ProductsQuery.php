<?php

namespace Src\Resolvers;

use GraphQL\Error\UserError;
use GraphQL\Type\Definition\Type;
use Src\DBConnection;
use Src\Entities\Category;
use Src\Entities\Product;
use Src\Types\ProductType;

class ProductsQuery {
  public function resolve($root, $args, DBConnection $db): array
  {
    try {
      $entityManager = $db->getEntityManager();
      $argsCategory = $args['category'];

      if ($argsCategory === 'all') {
        $products = $entityManager->getRepository(Product::class)->findAll();
      } else {
        $category = $entityManager->getRepository(Category::class)
          ->findOneBy(['name' => $argsCategory]);

        if (!$category) {
          throw new UserError('Invalid category provided');
        }

        $products = $entityManager->getRepository(Product::class)
          ->findBy(['category' => $category]);
      }

      $productsData = [];
      if ($products) {
        $productsData = array_map(
          function(Product $product) {
            return ProductType::resolve($product);
          }, 
          $products
        );
      }
      
      return $productsData;
    } catch (\Exception $e) {
      throw new UserError('An error occurred while fetching products.');
    }
  }

  public static function getType(): Type
  {
    return Type::nonNull(Type::listOf(
      Type::nonNull(ProductType::getType())
    ));
  }

  public static function getArgs(): array
  {
    return [
      'category' => [
        'type' => Type::nonNull(Type::string()),
      ],
    ];
  }
}
