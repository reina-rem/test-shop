import styled from '@emotion/styled'
import React from 'react'

import { Attribute } from '../ProductDetailsSlice'

import { AttributeOptionUi as AttributeOption } from './AttributeOptionUi'
import { ProductDetailsProps } from '../ProductDetailsUi'
import kebabCase from 'lodash/kebabCase'

export type AttributeProps = ProductDetailsProps & {
  attribute: Attribute
}

export class AttributeUi extends React.Component<AttributeProps> {
  render(): React.ReactNode {
    return (
      <AttributeContainer 
        key={this.props.attribute.id}
        data-testid={`product-attribute-${kebabCase(this.props.attribute.id)}`}
      >
        {this.props.attribute.id.toUpperCase()}:
        
        <AttributeOptions>
          {this.props.attribute.options.map(
            attributeOption => (
              <AttributeOption
                key={attributeOption.id}
                {...this.props}
                option={attributeOption}
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

  margin-top: 2rem;

  font-family: 'Roboto Condensed';
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.125rem;
`

const AttributeOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  height: 2.8rem;
`
