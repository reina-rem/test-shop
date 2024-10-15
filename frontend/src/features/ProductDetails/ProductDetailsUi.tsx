import styled from '@emotion/styled'
import parse from 'html-react-parser'

import React from 'react'
import { Navigate } from 'react-router-dom'

import { ProductDetailsReduxProps } from './ProductDetailsConnector'

import { CarouselUi as Carousel } from './components/CarouselUi'
import { AttributeUi as Attribute } from './components/AttributeUi'
import { PriceContainer } from './ProductDetailsSlice'

export type ProductDetailsProps = ProductDetailsReduxProps & {
  category: string
  productId: string
  toggleCart: () => void
}

export class ProductDetailsUi extends React.Component<ProductDetailsProps> {
  componentDidMount(): void {
    this.props.loadProductDetails(this.props.productId)
  }

  componentDidUpdate(prevProps: ProductDetailsProps): void {
    if (this.props.productId !== prevProps.productId) {
      this.props.loadProductDetails(this.props.productId)
    }
  }

  componentWillUnmount(): void {
    this.props.reset()
  }

  render(): React.ReactNode {
    if (this.props.hasError) {
      return <Navigate to={`/${this.props.category}`} replace />
    }

    return (
      this.props.product &&
      <ProductDetailsContainer>
        <Carousel
          {...this.props}
          product={this.props.product}
        />

        <Details>
          <Name>
            {this.props.product.name}
          </Name>

          {this.props.product.attributes.map(
            attribute => (
              <Attribute
                key={attribute.id}
                {...this.props}
                attribute={attribute}
              />
            )
          )}

          <Price>
            PRICE:

            <PriceNumber>
              {
                this.getCurrencySymbol(this.props.product.prices)
              }{
                this.getPriceAmount(this.props.product.prices).toFixed(2)
              }
            </PriceNumber>
          </Price>

          <AddToCartButton
            data-testid='add-to-cart'
            disabled={!this.props.product.inStock || !this.props.product.attributesAreSelected}
            onClick={
              () => {
                this.props.addToCart({
                  ...this.props.product!,
                  imageSrc: this.props.product!.imageGallery[0],
                  quantity: 1,
                  category: this.props.category,
                })

                this.props.toggleCart()
              }
            }
          >
            {this.props.product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
          </AddToCartButton>

          <Description data-testid='product-description'>
            {parse(this.props.product.description)}
          </Description>
        </Details>
      </ProductDetailsContainer>
    )
  }

  getPriceAmount(prices: PriceContainer[]): number {
    const price = prices.find(
      price => price.currencySymbol === this.props.selectedCurrency
    )

    if (!price) {
      throw new Error('No products in selected currency')
    }

    return price.amount
  }

  getCurrencySymbol(prices: PriceContainer[]): string {
    const price = prices.find(
      price => price.currencySymbol === this.props.selectedCurrency
    )

    if (!price) {
      throw new Error('No products in selected currency')
    }

    return price.currencySymbol
  }
}

const ProductDetailsContainer = styled.div`
  display: flex;
  gap: 13%;

  margin-top: 5rem;
  padding: 5rem 0 5%;
`

const Details = styled.div`
  display: flex;
  flex-direction: column;

  width: 18.25rem;
  height: fit-content;
`

const Name = styled.p`
  width: fit-content;
  height: fit-content;

  font-family: inherit;
  font-weight: 600;
  font-size: 1.875rem;
  line-height: 1.6875rem;
`

const Price = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  margin-top: 1.75rem;

  font-family: 'Roboto Condensed';
  font-weight: 700;
  font-size: 1.125rem;
`

const PriceNumber = styled.p`
  width: 5.375rem;
  height: 2.875rem;

  font-family: inherit;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.125rem;
`

const AddToCartButton = styled.button`
  width: 18.25rem;
  height: 3.25rem;
  border: none;
  margin-top: 1.25rem;
  padding: 1rem 2rem;

  text-align: center;
  font-family: inherit;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.2rem;
  color: white;
  
  background-color: #5ECE7B;

  cursor: pointer;
  transition: background-color 0.3s ease-out;

  &:hover {
    background-color: #59c475;
  }

  &:disabled {
    background-color: #bbdbc3;
    cursor: default;
  }
`

const Description = styled.div`
  margin-top: 2.5rem;

  font-family: 'Roboto-400';
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6rem;

  h1, h2, h3, h4, h5, h6 {
    margin: 1.5rem 0;
    font-family: 'Roboto-700';
    font-weight: 700;
    color: inherit;
  }

  h1 {
    font-size: 2rem;
    line-height: 2.5rem;
  }

  h2 {
    font-size: 1.75rem;
    line-height: 2.25rem;
  }

  h3 {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  h4 {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  h5 {
    font-size: 1.125rem;
    line-height: 1.625rem;
  }

  h6 {
    font-size: 1rem;
    line-height: 1.5rem;
  }

  p {
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.6rem;
    margin: 1rem 0;
    color: inherit;
  }

  br {
    content: "";
    margin-bottom: 1rem;
  }

  strong, b {
    font-weight: 700;
  }

  em, i {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }

  mark {
    background-color: #ffeb3b;
    color: inherit;
  }

  small {
    font-size: 0.875rem;
    color: #8D8F9A;
  }

  ul, ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.6rem;
    color: inherit;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    margin-bottom: 0.25rem;
  }

  div, span {
    font-family: inherit;
    color: inherit;
  }
`
