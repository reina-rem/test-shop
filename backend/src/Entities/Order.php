<?php

namespace Src\Entities;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "orders")]
class Order
{
  #[ORM\Id]
  #[ORM\GeneratedValue]
  #[ORM\Column(type: "integer")]
  private int $id;
  
  #[ORM\ManyToOne(targetEntity: Currency::class, fetch: "EAGER")]
  #[ORM\JoinColumn(name: "currency_id", referencedColumnName: "id", nullable: false)]
  private Currency $currency;

  /** @var Collection<int, OrderItem> */
  #[ORM\OneToMany(targetEntity: OrderItem::class, mappedBy: 'order', fetch: "EAGER")]
  private Collection $items;

  public function __construct()
  {
    $this->items = new ArrayCollection();
  }

  public function getId(): int
  {
    return $this->id;
  }

  public function getCurrency(): Currency
  {
    return $this->currency;
  }

  public function setCurrency(Currency $currency): void
  {
    $this->currency = $currency;
  }

  /** @return Collection<int, OrderItem> */
  public function getItems(): Collection
  {
    return $this->items;
  }

  public function addItem(OrderItem $item): void
  {
    $this->items[] = $item;
  }
}
