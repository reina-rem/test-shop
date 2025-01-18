<?php

namespace Src\Resolvers;

use GraphQL\Error\UserError;
use GraphQL\Type\Definition\Type;

use Src\DBConnection;
use Src\Entities\Product;
use Src\Types\ProductType;

class ProductQuery extends AbstractResolver {
  public function resolve($root, $args, DBConnection $db): array 
  {
    $entityManager = $db->getEntityManager();
    $productId = $args['productId'];

    /** @var Product */
    $product = $entityManager->getRepository(Product::class)->findOneBy(['productId' => $productId]);

    if (!$product) {
      throw new UserError('Invalid product id provided');
    }

    return ProductType::resolve($product);
  }

  public static function getType(): Type
  {
    return Type::nonNull(ProductType::getType());
  }

  public static function getArgs(): array 
  {
    return [
      'productId' => [
        'type' => Type::nonNull(Type::string()),
      ]
    ];
  }
}
