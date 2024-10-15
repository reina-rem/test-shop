import styled from '@emotion/styled'
import React from 'react'

import { NavLink } from 'react-router-dom'
import { ProductListReduxProps } from './ProductListConnector'
import { Price } from './ProductListSlice'
import kebabCase from 'lodash/kebabCase'

type ProductListProps = ProductListReduxProps & {
  categoryId: string
}

export class ProductListUi extends React.Component<ProductListProps> {
  componentDidMount(): void {
    this.props.loadProductList(this.props.categoryId)
  }

  componentDidUpdate(prevProps: Readonly<ProductListProps>): void {
    if (this.props.categoryId !== prevProps.categoryId) {
      this.props.loadProductList(this.props.categoryId)
    }
  }

  render(): React.ReactNode {
    return (
      !this.props.hasError &&
      <ProductListContainer>
        <CategoryContainer>
          {this.capitalizeFirstLetter(this.props.categoryId)}
        </CategoryContainer>

        <CardGallery>
          {this.props.products.map(
            product => (
              <Card
                data-testid={`product-${kebabCase(product.name)}`}
                key={product.id}
                to={`${product.id}`}
                className={product.inStock ? '' : 'out-of-stock'}
              >
                <ProductImage src={product.imageSrc} alt={product.name} />
                <QuickShopButton 
                  onClick={
                    async e => {
                      e.preventDefault()
                      this.props.addToCart(product.id)
                    }
                  }
                >
                  <QuickShopImage src="/assets/quick-shop.svg" alt="Cart image" />
                </QuickShopButton>
                <CardContent>
                  <ProductName>
                    {product.name}
                  </ProductName>
                  <ProductPrice>
                    {
                      this.getCurrencySymbol(product.prices)
                    }{
                      this.getPriceAmount(product.prices).toFixed(2)
                    }
                  </ProductPrice>
                </CardContent>
              </Card>
            )
          )}
        </CardGallery>
      </ProductListContainer>
    )
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
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

const ProductListContainer = styled.div`
  margin-top: 5rem;
  padding: 5rem 0 5%;
`

const CategoryContainer = styled.h1`
  max-width: fit-content;
  line-height: 4.25rem;
  font-size: 2.625rem;
`

const CardGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(22.125rem, 1fr));
  gap: 2.5rem;
  width: 100%;
`

const QuickShopButton = styled.button`
  position: absolute;
  right: 0;
  bottom: 0;

  width: 3.25rem;
  height: 3.25rem;
  border: none;
  border-radius: 50%;

  background-color: #5ECE7B;
  opacity: 0;
  
  visibility: hidden;
  z-index: 1;
  cursor: pointer;

  transform: translate(-1.9375rem, -4.5rem);
  transition: opacity 0.3s ease, visibility 0.3s ease;

  &:hover {
    background-color: #59c475;
  }
`

const QuickShopImage = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`

const Card = styled(NavLink)`
  position: relative;

  width: 24.125rem;
  box-sizing: border-box;
  margin-top: 6.4375rem;
  padding: 1rem;

  text-decoration: none;
  color: inherit;

  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0.25rem 2.1875rem rgba(168, 172, 176, 0.19);
  }

  &:hover ${QuickShopButton} {
    visibility: visible;
    opacity: 1;
  }

  &.out-of-stock {
    ${QuickShopButton} {
      visibility: hidden;
    }

    &::after {
      content: 'OUT OF STOCK';
      
      display: flex;
      justify-content: center;
      align-items: center;

      position: absolute;
      top: 1rem;
      left: 1rem;
      width: 22.125rem;
      height: 22.125rem;

      font-family: inherit;
      font-weight: 400;
      font-size: 1.5rem;
      color: #8D8F9A;

      background-color: rgba(255, 255, 255, 0.5);
    }
  }
`

const ProductImage = styled.img`
  width: 100%;
  height: 22.125rem;
  object-fit: contain;
  cursor: pointer;
`

const CardContent = styled.div`
  width: 100%;
  margin-top: 1.5rem;
`

const ProductName = styled.p`
  font-size: 1.125rem;
  font-weight: 300;
  line-height: 1.8125rem;
`

const ProductPrice = styled.p`
  font-size: 1.125rem;
  line-height: 1.8125rem;

  ${Card}.out-of-stock & {
    color: #8D8F9A;
  }
`
