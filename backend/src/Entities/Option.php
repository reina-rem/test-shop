<?php

namespace Src\Entities;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "options")]
class Option
{
  #[ORM\Id]
  #[ORM\GeneratedValue]
  #[ORM\Column(type: "integer")]
  private int $id;

  #[ORM\Column(type: "string", length: 255)]
  private string $optionId;

  #[ORM\Column(type: "string", length: 255)]
  private string $value;

  #[ORM\ManyToOne(targetEntity: Attribute::class, inversedBy: "options")]
  #[ORM\JoinColumn(name: "attribute_id", referencedColumnName: "id", nullable: false)]
  private Attribute $attribute;

  public function getId(): int
  {
    return $this->id;
  }

  public function getOptionId(): string
  {
    return $this->optionId;
  }

  public function setOptionId(string $optionId): void
  {
    $this->optionId = $optionId;
  }

  public function getValue(): string
  {
    return $this->value;
  }

  public function setValue(string $value): void
  {
    $this->value = $value;
  }

  public function getAttribute(): Attribute
  {
    return $this->attribute;
  }

  public function setAttribute(Attribute $attribute): void
  {
    $this->attribute = $attribute;
  }
}
