<?php

namespace Src\Entities;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: "products")]
class Product
{
  #[ORM\Id]
  #[ORM\GeneratedValue]
  #[ORM\Column(type: "integer")]
  private int $id;

  #[ORM\Column(type: "string", length: 255)]
  private string $productId;

  #[ORM\Column(type: "string", length: 255)]
  private string $name;

  #[ORM\Column(type: "boolean")]
  private bool $inStock;

  /** @var Collection<int, Image> */
  #[ORM\OneToMany(targetEntity: Image::class, mappedBy: "product", fetch: "EAGER")]
  private Collection $images;

  #[ORM\Column(type: "text")]
  private string $description;

  #[ORM\ManyToOne(targetEntity: Category::class)]
  #[ORM\JoinColumn(name: "category_id", referencedColumnName: "id", nullable: false)]
  private Category $category;

  /** @var Collection<int, Attribute> */
  #[ORM\ManyToMany(targetEntity: Attribute::class, mappedBy: "products")]
  #[ORM\JoinTable(name: "attribute_product")]
  private Collection $attributes;

  /** @var Collection<int, Price> */
  #[ORM\OneToMany(targetEntity: Price::class, mappedBy: "product", fetch: "EAGER")]
  private Collection $prices;

  #[ORM\Column(type: "string", length: 255)]
  private string $brand;

  public function __construct()
  {
    $this->images = new ArrayCollection();
    $this->attributes = new ArrayCollection();
    $this->prices = new ArrayCollection();
  }

  public function getId(): int
  {
    return $this->id;
  }

  public function getProductId(): string
  {
    return $this->productId;
  }

  public function setProductId(string $productId): void
  {
    $this->productId = $productId;
  }

  public function getName(): string
  {
    return $this->name;
  }

  public function setName(string $name): void
  {
    $this->name = $name;
  }

  public function isInStock(): bool
  {
    return $this->inStock;
  }

  public function setInStock(bool $inStock): void
  {
    $this->inStock = $inStock;
  }

  /** @return Collection<int, Image> */
  public function getImages(): Collection
  {
    return $this->images;
  }

  public function addImage(Image $image): void 
  { 
    if (!$this->images->contains($image)) {
      $this->images[] = $image;
    }
  }

  public function getDescription(): string
  {
    return $this->description;
  }

  public function setDescription(string $description): void
  {
    $this->description = $description;
  }

  public function getCategory(): Category
  {
    return $this->category;
  }

  public function setCategory(Category $category): void
  {
    $this->category = $category;
  }

  /** @return Collection<int, Attribute> */
  public function getAttributes(): Collection
  {
    return $this->attributes;
  }

  public function addAttribute(Attribute $attribute): void
  {
    if (!$this->attributes->contains($attribute)) {
      $this->attributes[] = $attribute;
    }
  }

  /** @return Collection<int, Price> */
  public function getPrices(): Collection
  {
    return $this->prices;
  }

  public function addPrice(Price $price): void
  {
    if (!$this->prices->contains($price)) {
      $this->prices[] = $price;
    }
  }

  public function getBrand(): string
  {
    return $this->brand;
  }

  public function setBrand(string $brand): void
  {
    $this->brand = $brand;
  }
}
