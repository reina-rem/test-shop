<?php

namespace Src\Entities;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: "attributes")]
class Attribute
{
  #[ORM\Id]
  #[ORM\GeneratedValue]
  #[ORM\Column(type: "integer")]
  private int $id;

  #[ORM\Column(type: "string", length: 255)]
  private string $attributeId;

  #[ORM\Column(type: "string", length: 255)]
  private string $type;

  /** @var Collection<int, Option> */
  #[ORM\OneToMany(targetEntity: Option::class, mappedBy: "attribute", fetch: "EAGER")]
  private Collection $options;

  /** @var Collection<int, Product> */
  #[ORM\ManyToMany(targetEntity: Product::class, inversedBy: "attributes")]
  private Collection $products;

  public function __construct()
  {
    $this->options = new ArrayCollection();
  }

  public function getId(): int
  {
    return $this->id;
  }

  public function getAttributeId(): string
  {
    return $this->attributeId;
  }

  public function setAttributeId(string $attributeId): void
  {
    $this->attributeId = $attributeId;
  }

  public function getType(): string
  {
    return $this->type;
  }

  public function setType(string $type): void
  {
    $this->type = $type;
  }

  /** @return Collection<int, Option> */
  public function getOptions(): Collection
  {
    return $this->options;
  }

  public function addOption(Option $option): void
  {
    if (!$this->options->contains($option)) {
      $this->options[] = $option;
    }
  }

  /** @return Collection<int, Product> */
  public function getProducts(): Collection
  {
    return $this->products;
  }

  public function addProduct(Product $product): void
  {
    $this->products[] = $product;
  }
}
