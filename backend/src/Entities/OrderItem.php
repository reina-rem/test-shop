<?php

namespace Src\Entities;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "order_items")]
class OrderItem
{
  #[ORM\Id]
  #[ORM\GeneratedValue]
  #[ORM\Column(type: "integer")]
  private int $id;

  #[ORM\ManyToOne(targetEntity: Order::class, inversedBy: "items")]
  #[ORM\JoinColumn(name: "order_id", referencedColumnName: "id", nullable: false)]
  private Order $order;

  #[ORM\ManyToOne(targetEntity: Product::class, fetch: "EAGER")]
  #[ORM\JoinColumn(name: "product_id", referencedColumnName: "id", nullable: false)]
  private Product $product;

  #[ORM\Column(type: "integer")]
  private int $quantity;

  #[ORM\ManyToOne(targetEntity: Price::class, fetch: "EAGER")]
  #[ORM\JoinColumn(name: "price_id", referencedColumnName: "id", nullable: false)]
  private Price $price;

  /** @var Collection<int, OrderItemAttribute> */
  #[ORM\OneToMany(
    targetEntity: OrderItemAttribute::class, 
    mappedBy: "item", 
    cascade: ["persist"],
    fetch: "EAGER",
  )]
  private Collection $attributes;

  public function __construct()
  {
    $this->attributes = new ArrayCollection();
  }

  public function getId(): int
  {
    return $this->id;
  }

  public function getOrder(): Order
  {
    return $this->order;
  }

  public function setOrder(Order $order): void
  {
    $this->order = $order;
  }

  public function getProduct(): Product 
  {
    return $this->product;
  }

  public function setProduct(Product $product): void
  {
    $this->product = $product;
  }

  public function getQuantity(): int 
  {
    return $this->quantity;
  }

  public function setQuantity(int $quantity): void
  {
    $this->quantity = $quantity;
  }

  public function getPrice(): Price 
  {
    return $this->price;
  }

  public function setPrice(Price $price): void
  {
    $this->price = $price;
  }

  /** @return Collection<int, OrderItemAttribute> */
  public function getAttributes(): Collection 
  {
    return $this->attributes;
  }

  public function addAttribute(OrderItemAttribute $attribute): void
  {
    $this->attributes[] = $attribute;
  }
}
