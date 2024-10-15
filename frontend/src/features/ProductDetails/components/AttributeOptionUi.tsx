import React from 'react'
import styled from '@emotion/styled'

import { Option } from '../ProductDetailsSlice'
import { AttributeProps } from './AttributeUi'

type AttributeOptionProps = AttributeProps & {
  option: Option
}

export class AttributeOptionUi extends React.Component<AttributeOptionProps> {
  onOptionClick = () => this.props.selectAttributeOption({
    productId: this.props.product!.id,
    attributeId: this.props.attribute.id,
    optionId: this.props.option.id,
  })

  render(): React.ReactNode {
    return (
      this.props.attribute.id === 'Color'
        ? <ColorOption
            style={{'--option-color': this.props.option.value} as React.CSSProperties}
            className={this.props.option.isSelected ? 'selected' : ''}
            onClick={this.onOptionClick}
          />
        : <TextOption
            className={this.props.option.isSelected ? 'selected' : ''}
            onClick={this.onOptionClick}
          >
            {this.props.option.value}
          </TextOption>
    )
  }
}

const TextOption = styled.button`
  width: 4rem;
  border: 1px solid #1D1F22;
  margin-right: 0.25rem;

  text-align: center;
  font-family: 'Source Sans Pro';
  font-weight: 400;
  font-size: 1rem;
  letter-spacing: 0.05em;

  background-color: inherit;

  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }

  &:last-child {
    margin-right: 0;
  }

  &.selected {
    color: white;
    background-color: #1D1F22;

    &:hover {
      background-color: #1D1F22;
    }
  }
`

const ColorOption = styled.button`
  position: relative;
  width: 2.25rem;
  height: 2.25rem;
  box-sizing: border-box;
  border: none;
  padding: 0;

  background-color: var(--option-color);
  
  box-shadow: inset 0 0 0 1px #b6b6b6;

  cursor: pointer;

  &.selected {
    &::after {
      content: '';

      position: absolute;
      top: -3px;
      left: -3px;

      width: 2.625rem;
      height: 2.625rem;
      box-sizing: border-box;
      border: 2px solid #5ECE7B;
    }
  }
`
