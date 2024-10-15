import styled from '@emotion/styled'

import React from 'react'
import { NavLink } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { CartModal } from '../../CartModal'

type HeaderProps = {
  isCartOpen: boolean
  categories: string[]
  cartTotalItems: number
  toggleCart: () => void
}

type HeaderState = {
  categoryId: string
}

export class HeaderUi extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props)
    this.state = {
      // eslint-disable-next-line no-restricted-globals
      categoryId: location.pathname.split('/')[1]
    }

    window.addEventListener('popstate', () => {
      this.setState({
        // eslint-disable-next-line no-restricted-globals
        categoryId: location.pathname.split('/')[1]
      })
    })
  }

  render(): React.ReactNode {
    return (
      <HeaderContainer>
        <CSSTransition
          in={this.props.isCartOpen}
          timeout={2000}
          unmountOnExit
        >
          <CartModal toggleCart={this.props.toggleCart} />
        </CSSTransition>

        <HeaderWrapper>
          <HeaderContent>
            <NavigationContainer>
              <Navigation>
                {this.props.categories.map(categoryId => (
                  <CategoryLink
                    data-testid={(
                      this.state.categoryId === categoryId 
                        ? 'active-category-link'
                        : 'category-link'
                    )}
                    key={categoryId}
                    to={`/${categoryId.toLowerCase()}`}
                    onClick={() => {
                      this.setState({
                        categoryId
                      })
                    }}
                  >
                    {categoryId.toUpperCase()}
                  </CategoryLink>
                ))}
              </Navigation>
              
            </NavigationContainer>
            
            <Logo src="/assets/shop-logo.svg" alt="Shop Logo" />
    
            <CartContainer>
              <Cart
                onClick={this.props.toggleCart}
                data-testid="cart-btn"
              >
                <CartImage src="/assets/cart.svg" alt="Cart Image" />
                {this.props.cartTotalItems !== 0 && (
                  <CartCountBubble>
                    {this.props.cartTotalItems}
                  </CartCountBubble>
                )}
              </Cart>
            </CartContainer>
          </HeaderContent>
        </HeaderWrapper>
      </HeaderContainer>
    )
  }
}

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 50%;

  max-width: 1440px;
  width: 90rem;
  box-sizing: border-box;
  margin: 0 auto;
  padding: inherit;

  z-index: 1;
  transform: translateX(-50%);
`

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  
  max-width: 1440px;
  width: 90rem;
  box-sizing: border-box;
  margin: 0 auto;
  padding: inherit;

  background-color: white;

  transform: translateX(-50%);
`

const HeaderContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0px;

  width: 100%;
  height: 5rem;
  box-sizing: border-box;
`

const NavigationContainer = styled.div`
  flex: 1;
  display: flex;
  align-self: flex-end;
  
  height: 3.5rem;
`

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
`

const CategoryLink = styled(NavLink)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  padding: 0.25em 1em;
  border: none;
  
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  color: inherit;
  text-decoration: none;

  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }

  &.active {
    color: #5ECE7B;
    border-bottom: 2px solid #5ECE7B;
  }
`
  
const Logo = styled.img`
  width: 2.5rem;
  height: 2.5rem;
`

const CartContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;

  height: 2.5rem;
`

const Cart = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  width: 2.5rem;
  padding: 0;
  border: none;

  background-color: inherit;

  cursor: pointer;
`

const CartImage = styled.img`
  width: 1.25rem;
  height: 1.25rem;
`

const CartCountBubble = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;

  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;

  font-family: 'Roboto-700';
  font-size: 0.8125rem;
  color: white;

  background-color: #1D1F22;

  transform: translate(0.25rem, 0.125rem);
`
