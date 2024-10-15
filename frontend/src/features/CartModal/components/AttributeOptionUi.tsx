import styled from '@emotion/styled'
import React from 'react'

import { AttributeProps } from './AttributeUi'
import { Option } from '../CartModalSlice'
import kebabCase from 'lodash/kebabCase'

type AttributeOptionProps = AttributeProps & {
  option: Option
  productIndex: number
}

export class AttributeOptionUi extends React.Component<AttributeOptionProps> {
  render(): React.ReactNode {
    const dataTestid = (
      `cart-item-attribute-${kebabCase(this.props.attribute.id)}-${kebabCase(this.props.option.id)}${
        this.props.option.isSelected ? '-selected' : ''
      }`
    )
    
    return (
      this.props.attribute.id === 'Color' 
        ? <ColorOption
            className={this.props.option.isSelected ? 'selected' : ''}
            style={{'--option-color': this.props.option.value} as React.CSSProperties}
            data-testid={dataTestid}
          />

        : <TextOption
            className={this.props.option.isSelected ? 'selected' : ''}
            data-testid={dataTestid}
          >
            {this.props.option.value}
          </TextOption>
    )
  }
}

const TextOption = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: 1.5rem;
  max-width: 3rem;
  height: 1.5rem;
  border: 1px solid #1D1F22;

  font-family: 'Source Sans Pro';
  font-size: 0.875rem;

  background-color: inherit;

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
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  border: none;
  padding: 0;

  background-color: var(--option-color);
  
  box-shadow: inset 0 0 0 0.5px #b6b6b6;

  &:first-of-type {
    margin-left: 3px;
  }

  &.selected {
    &::after {
      content: '';

      position: absolute;
      top: -3px;
      left: -3px;

      width: 22px;
      height: 22px;
      box-sizing: border-box;
      border: 2px solid #5ECE7B;
    }
  }
`
