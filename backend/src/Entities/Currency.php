<?php

namespace Src\Entities;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "currencies")]
class Currency
{
  #[ORM\Id]
  #[ORM\Column(type: "integer")]
  #[ORM\GeneratedValue]
  private int $id;

  #[ORM\Column(type: "string", length: 3, unique: true)]
  private string $label;

  #[ORM\Column(type: "string", length: 1)]
  private string $symbol;

  public function getId(): int
  {
    return $this->id;
  }

  public function getLabel(): string
  {
    return $this->label;
  }

  public function setLabel(string $label): void
  {
    $this->label = $label;
  }

  public function getSymbol(): string
  {
    return $this->symbol;
  }

  public function setSymbol(string $symbol): void
  {
    $this->symbol = $symbol;
  }
}
