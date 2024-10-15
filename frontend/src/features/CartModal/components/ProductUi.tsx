import styled from '@emotion/styled'
import React from 'react'

import { CartModalProps } from '../CartModalUi'

import { AttributeUi as Attribute } from './AttributeUi'
import { Price, Product } from '../CartModalSlice'
import { NavLink } from 'react-router-dom'

export type ProductProps = CartModalProps & {
  product: Product
  productIndex: number
}

export class ProductUi extends React.Component<ProductProps> {
  render(): React.ReactNode {
    const product = {...this.props.product}

    return (
      <ProductContainer>
        <Details>
          <Name>
            {this.props.product.name}
          </Name>

          <PriceContainer>
            {
              this.getCurrencySymbol(product.prices)
            }{
              this.getPriceAmount(product.prices).toFixed(2)
            }
          </PriceContainer>

          {this.props.product.attributes.map(
            attribute => (
              <Attribute 
                key={attribute.id}
                {...this.props}
                attribute={attribute}
              />
            )
          )}
        </Details>

        <QuantityControls>
          <AdjustQuantityButton 
            data-testid='cart-item-amount-increase' 
            onClick={
              () => this.props.increaseProductAmount({
                product: this.props.product,
                productIndex: this.props.productIndex
              })
            }
          > 
            <img src="/assets/plus.svg" alt="plus" />
          </AdjustQuantityButton>

          <AmountIndicator data-testid='cart-item-amount'>
            {this.props.product.quantity}
          </AmountIndicator>

          <AdjustQuantityButton 
            data-testid='cart-item-amount-decrease'
            onClick={
              () => {
                this.props.decreaseProductAmount({
                  product: this.props.product,
                  productIndex: this.props.productIndex
                })
              }
            } 
          >
            <img src="/assets/minus.svg" alt="minus" />
          </AdjustQuantityButton>
        </QuantityControls>

        <ProductImageContainer
          key={product.id}
          to={`/${this.props.product.category}/${product.id}`}
          onClick={this.props.toggleCart}
        >
          <ProductImage src={this.props.product.imageSrc} alt={this.props.product.name} />
        </ProductImageContainer>
      </ProductContainer>
    )
  }

  getPriceAmount(prices: Price[]): number {
    const price = prices.find(
      price => price.currencySymbol === this.props.selectedCurrency
    )

    if (!price) {
      throw new Error('No products in selected currency')
    }

    return price.amount
  }

  getCurrencySymbol(prices: Price[]): string {
    const price = prices.find(
      price => price.currencySymbol === this.props.selectedCurrency
    )

    if (!price) {
      throw new Error('No products in selected currency')
    }

    return price.currencySymbol
  }
}

const ProductContainer = styled.li`
  display: grid;
  grid-template-columns: 8.25rem 1.5rem 7.5625rem;
  gap: 0.5rem;
  position: relative;

  margin-bottom: 2.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const Details = styled.div`
  grid-column: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Name = styled.p`
  font-family: inherit;
  font-weight: 300;
  font-size: 1.125rem;
  line-height: 1.8rem;
`

const PriceContainer = styled.p`
  font-family: inherit;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.6rem;
`

const QuantityControls = styled.div`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  
  width: 100%;
  height: 100%;

  font-family: inherit;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.6rem;
`

const AmountIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const AdjustQuantityButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 1.5rem;
  border: 1px solid #1D1F22;

  background-color: inherit;

  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`

const ProductImageContainer = styled(NavLink)`
  grid-column: 3;
  position: absolute;
  top: 50%;
  left: 50%;

  width: 100%;
  height: 100%;

  transform: translate(-50%, -50%);
  cursor: pointer;

  &:hover {
    &::after {
      content: '';

      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      background-color: rgba(186, 186, 186, 0.167);
    }
  }
`

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`
