import styled from '@emotion/styled'
import React from 'react'

import { ProductProps } from './ProductUi'

import { AttributeOptionUi as AttributeOption } from './AttributeOptionUi'
import { Attribute } from '../CartModalSlice'
import kebabCase from 'lodash/kebabCase'

export type AttributeProps = ProductProps & {
  attribute: Attribute
  productIndex: number
}

export class AttributeUi extends React.Component<AttributeProps> {
  render(): React.ReactNode {
    return (
      <AttributeContainer
        data-testid={`cart-item-attribute-${kebabCase(this.props.attribute.id)}`}
      >
        {this.props.attribute.id}

        <AttributeOptions>
          {this.props.attribute.options.map(
            option => (
              <AttributeOption 
                key={option.id}
                {...this.props}
                option={option}
              />
            )
          )}
        </AttributeOptions>
      </AttributeContainer>
    )
  }
}

const AttributeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  font-family: inherit;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1rem;
`

const AttributeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`
