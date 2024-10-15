<?php

namespace Src\Entities;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "prices")]
class Price
{
  #[ORM\Id]
  #[ORM\GeneratedValue]
  #[ORM\Column(type: "integer")]
  private int $id;

  #[ORM\Column(type: "decimal", precision:10, scale: 2)]
  private float $amount;

  #[ORM\ManyToOne(targetEntity: Currency::class, fetch: "EAGER")]
  #[ORM\JoinColumn(name: "currency_id", referencedColumnName: "id", nullable: false)]
  private Currency $currency;

  #[ORM\ManyToOne(targetEntity: Product::class, inversedBy: "prices")]
  #[ORM\JoinColumn(name: "product_id", referencedColumnName: "id", nullable: false)]
  private Product $product;   

  public function getId(): int
  {
    return $this->id;
  }

  public function getAmount(): float
  {
    return $this->amount;
  }

  public function setAmount(float $amount): void
  {
    $this->amount = $amount;
  }

  public function getCurrency(): Currency
  {
    return $this->currency;
  }

  public function setCurrency(Currency $currency): void
  {
    $this->currency = $currency;
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
