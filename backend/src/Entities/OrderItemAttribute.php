<?php

namespace Src\Entities;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "order_items_attributes")]
class OrderItemAttribute
{
  #[ORM\Id]
  #[ORM\GeneratedValue]
  #[ORM\Column(type: "integer")]
  private int $id;

  #[ORM\ManyToOne(targetEntity: OrderItem::class, inversedBy: "attributes")]
  #[ORM\JoinColumn(name: "item_id", referencedColumnName: "id", nullable: false)]
  private OrderItem $item;

  #[ORM\ManyToOne(targetEntity: Attribute::class, fetch: "EAGER")]
  #[ORM\JoinColumn(name: "attribute_id", referencedColumnName: "id", nullable: false)]
  private Attribute $attribute;

  #[ORM\ManyToOne(targetEntity: Option::class, fetch: "EAGER")]
  #[ORM\JoinColumn(name: "option_id", referencedColumnName: "id", nullable: false)]
  private Option $option;

  

  public function getId(): int
  {
    return $this->id;
  }

  public function getItem(): OrderItem 
  {
    return $this->item;
  }

  public function setItem(OrderItem $item): void
  {
    $this->item = $item;
  }

  public function getOption(): Option 
  {
    return $this->option;
  }

  public function setOption(Option $option): void
  {
    $this->option = $option;
  }

  public function getAttribute(): Attribute 
  {
    return $this->attribute;
  }

  public function addAttribute(Attribute $attribute): void
  {
    $this->attribute = $attribute;
  }
}
