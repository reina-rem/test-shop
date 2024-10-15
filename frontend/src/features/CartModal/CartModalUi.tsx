import styled from '@emotion/styled'
import React from 'react'

import { CartModalReduxProps } from './CartModalConnector'
import { ProductUi } from './components/ProductUi'

export type CartModalProps = CartModalReduxProps & {
  toggleCart: () => void
}

export class CartModalUi extends React.Component<CartModalProps> {
  componentDidUpdate(prevProps: CartModalProps): void {
    if (this.props.orderId !== prevProps.orderId) {
      alert(`Your order id: ${this.props.orderId}`)
    }
  }

  render(): React.ReactNode {
    return (
      !this.props.hasError &&
      <CartModalContainer>
        <CartHeader>
          My Bag
          <TotalItems data-testid='cart-total'>
            , {`${this.props.totalItems} ${this.props.totalItems === 1 ? 'item' : 'items'}`}
          </TotalItems>
        </CartHeader>

        <ProductList>
          {this.props.products.map(
            (product, i) => (
              <ProductUi
                key={i}
                {...this.props}
                product={product}
                productIndex={i}
              />
            )
          )}
        </ProductList>

        <TotalPrice>
          <TotalText>
            Total
          </TotalText>

          {this.props.selectedCurrency}{this.props.totalPrice.toFixed(2)}
        
        </TotalPrice>

        <PlaceOrderButton 
          disabled={this.props.totalItems === 0 && true}
          onClick={this.handleOrder}
        >
          PLACE ORDER
        </PlaceOrderButton>
      </CartModalContainer>
    )
  }

  handleOrder = async () => {
    const products = this.props.products

    const orderItems = products.map(
      p => ({
        productId: p.id,
        quantity: p.quantity,
        attributes: p.attributes.map(
          attr => {
            const selectedOption = attr.options.find(
              option => option.isSelected
            )

            if (!selectedOption) {
              throw new Error(`Selected option not found for attribute: ${attr.id}`)
            }

            return {
              attributeId: attr.id,
              optionId: selectedOption.id,
            }
          }
        )
      })
    )

    this.props.placeOrder({
      currencySymbol: this.props.selectedCurrency,
      items: orderItems,
    })

    this.props.clearCart()
    this.props.toggleCart()
  }
}

const CartModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  position: absolute;
  top: 5rem;
  right: 0;

  width: fit-content;
  height: fit-content;
  padding: 2rem 1rem;

  background-color: white;

  z-index: 0;
  transform: translateX(-4.5rem);

  &.enter {
    transform: translateX(-4.5rem) translateY(-100%);
  }

  &.enter-active {
    transform: translateX(-4.5rem) translateY(0);
    transition: transform 0.3s ease-in;
  }

  &.exit {
    transform: translateX(-4.5rem) translateY(0);
  }

  &.exit-active {
    transform: translateX(-4.5rem) translateY(-100%);
    transition: transform 0.3s ease-out;
  }
`

const CartHeader = styled.p`
  font-family: inherit;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.6rem;
`

const TotalItems = styled.span`
  font-family: inherit;
  font-weight: 500;
  font-size: 1rem;
`

const ProductList = styled.ul`
  max-height: 50vh;
  margin: 2rem 0;
  padding: 0.125rem 0;

  overflow-y: auto;
`

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 1.75rem;

  font-family: inherit;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.6rem;
`

const TotalText = styled.span`
  font-family: 'Roboto-500';
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.125rem;
`

const PlaceOrderButton = styled.button`
  align-self: flex-end;
  width: 18.25rem;
  height: 2.6875rem;
  margin-top: 2rem;
  padding: 0.8125rem;
  border: none;
  text-align: center;

  font-family: inherit;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  
  background-color: #5ECE7B;

  transition: background-color 0.3s ease-out;
  cursor: pointer;

  &:hover {
    background-color: #59c475;
  }

  &:disabled {
    background-color: #bbdbc3;
    cursor: default;
  }
`
