<?php

namespace Src;

use Doctrine\DBAL\DriverManager;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;

class DBConnection {
  private EntityManager $entityManager;

  public function __construct()
  {
    $paths = [__DIR__.'/Entities'];
    $isDevMode = true;

    $ORMConfig = ORMSetup::createAttributeMetadataConfiguration($paths, $isDevMode);
    $connection = DriverManager::getConnection([
      'driver' => 'pdo_mysql',
      'host' => '172.17.0.2',
      'port' => '3306',
      'user' => 'root',
      'password' => 'qwerty',
      'dbname' => 'test_shop',
      'charset' => 'utf8mb4',
    ]);

    $this->entityManager = new EntityManager($connection, $ORMConfig);
  }

  public function getEntityManager(): EntityManager 
  {
    return $this->entityManager;
  }
}
