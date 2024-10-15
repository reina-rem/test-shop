<?php

namespace Src\Entities;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "images")]
class Image
{
  #[ORM\Id]
  #[ORM\Column(type: "integer")]
  #[ORM\GeneratedValue]
  private int $id;

  #[ORM\Column(type: "text")]
  private string $src;

  #[ORM\ManyToOne(targetEntity: Product::class, inversedBy: "images")]
  #[ORM\JoinColumn(name: "product_id", referencedColumnName: "id", nullable: false)]
  private Product $product;

  public function getId(): int
  {
    return $this->id;
  }

  public function getSrc(): string
  {
    return $this->src;
  }

  public function setSrc(string $src): void
  {
    $this->src = $src;
  }

  public function getProduct(): Product
  {
    return $this->product;
  }

  public function setProduct(Product $product): void
  {
    $this->product = $product;
  }
}
