<?php

namespace Src;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;

use Src\Resolvers\CategoriesQuery;
use Src\Resolvers\OrderQuery;
use Src\Resolvers\ProductsQuery;
use Src\Resolvers\ProductQuery;
use Src\Resolvers\PlaceOrderMutation;

class GraphQL {
  static public function handle() 
  {
    try {
      $queryType = new ObjectType([
        'name' => 'Query',
        'fields' => [
          'categories' => [
            'type' => CategoriesQuery::getType(),
            'resolve' => [new CategoriesQuery(), 'resolve'],
          ],
          'products' => [
            'type' => ProductsQuery::getType(),
            'args' => ProductsQuery::getArgs(),
            'resolve' => [new ProductsQuery(), 'resolve'],
          ],
          'product' => [
            'type' => ProductQuery::getType(),
            'args' => ProductQuery::getArgs(),
            'resolve' => [new ProductQuery(), 'resolve'],
          ],
          'order' => [
            'type' => OrderQuery::getType(),
            'args' => OrderQuery::getArgs(),
            'resolve' => [new OrderQuery(), 'resolve']
          ]
        ],
      ]);

      $mutationType = new ObjectType([
        'name' => 'Mutation',
        'fields' => [
          'placeOrder' => [
            'type' => PlaceOrderMutation::getType(),
            'args' => PlaceOrderMutation::getArgs(),
            'resolve' => [new PlaceOrderMutation(), 'resolve'],
          ],
        ],
      ]);
  
      $schema = new Schema(
        (new SchemaConfig())
        ->setQuery($queryType)
        ->setMutation($mutationType)
      );
  
      $rawInput = file_get_contents('php://input');
      if ($rawInput === false) {
        throw new RuntimeException('Failed to get php://input');
      }
  
      $input = json_decode($rawInput, true);
      $query = $input['query'];
      $variableValues = $input['variables'] ?? null;

      $contextValue = new DBConnection();
      $result = GraphQLBase::executeQuery($schema, $query, null, $contextValue, $variableValues);
      $output = $result->toArray();
    } catch (Throwable $e) {
      $output = [
        'error' => [
          'message' => $e->getMessage(),
        ],
      ];
    }

    header('Content-Type: application/json; charset=UTF-8');
    return json_encode($output);
  }
}
