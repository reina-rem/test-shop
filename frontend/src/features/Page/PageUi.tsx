import styled from '@emotion/styled'

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { PageReduxProps } from './PageConnector'

import { HeaderUi as Header } from './components/HeaderUi'
import { CartOverlayUi as CartOverlay } from './components/CartOverlayUi'
import { ProductList } from '../ProductList'
import { ProductDetails } from '../ProductDetails'
import { Component } from '../Component'

export type PageProps = PageReduxProps

type PageState = {  
  isCartOpen: boolean
}

export class PageUi extends React.Component<PageProps, PageState>{
  componentDidMount(): void {
    this.props.loadCategories()
  }

  componentDidUpdate(prevProps: PageProps): void {
    if (
      (!prevProps.categories || prevProps.categories.length === 0) &&
      this.props.categories &&
      this.props.categories.length > 0
    ) {
      this.props.loadCategories()
    }
  }

  render(): React.ReactNode {
    return (
      <div>{
        !this.props.hasError &&
        this.props.categories &&
        <PageWrapper>
          <Header
            isCartOpen={this.state.isCartOpen}
            categories={this.props.categories}
            cartTotalItems={this.props.cartTotalItems}
            toggleCart={this.toggleCart}
          />

          <Routes>
            <Route path="/" element={<Navigate to={`/${this.props.categories[0].toLowerCase()}`} replace />} />

            {this.props.categories.map(categoryId => (
              <Route 
                key={categoryId}
                path={`/${categoryId.toLowerCase()}`}
              >
                <Route path="" element={<ProductList categoryId={categoryId} />} />
                <Route path=":productId" element={
                  <Component<{productId: string}>>{
                    params => {
                      return <ProductDetails 
                        category={categoryId}
                        productId={params.productId}
                        toggleCart={this.toggleCart}
                      />
                    }
                  }</Component>
                } />
              </Route>
            ))}

            <Route path="*" element={<Navigate to={`/${this.props.categories[0].toLowerCase()}`} replace />} />
          </Routes>

          <CartOverlay
            isVisible={this.state.isCartOpen}
            toggleCart={this.toggleCart}
          />
        </PageWrapper>
      }</div>
    )
  }

  toggleCart = () => {
    this.setState(state => ({
      isCartOpen: !state.isCartOpen,
    }))
  }

  constructor (props: PageProps) {
    super(props)
    this.state = {
      isCartOpen: false,
    }
  }
}

const PageWrapper = styled.div`
  max-width: 1440px;
  width: 90rem;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 6.25rem;
`
