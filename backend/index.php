<?php

require_once __DIR__.'/vendor/autoload.php';

use Bayfront\MimeTypes\MimeType;
use Src\GraphQL;

header('Access-Control-Allow-Origin: https://test-shop.infinityfreeapp.com');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

$publicDir = __DIR__ . '/public';

function isValidFilePath($file, $publicDir) {
  $realFilePath = realpath($file);
  $realPublicDir = realpath($publicDir);

  return $realFilePath && strpos($realFilePath, $realPublicDir) === 0;
}

if ($requestMethod === 'POST' && strpos($requestUri, '/graphql') !== false) {
  header('Content-Type: application/json');
  echo GraphQL::handle();
  exit;
}

$filePath = $publicDir . $requestUri;

if (is_file($filePath) && isValidFilePath($filePath, $publicDir)) {
  $mimeType = MimeType::fromFile($filePath);
  header('Content-Type: ' . $mimeType);
  
  readfile($filePath);
  exit;
}

$indexFile = $publicDir . '/index.html';

if (is_file($indexFile)) {
  header('Content-Type: text/html');
  readfile($indexFile);
}

exit;