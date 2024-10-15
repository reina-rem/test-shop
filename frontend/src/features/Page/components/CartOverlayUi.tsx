import React from 'react'
import styled from '@emotion/styled'
import { CSSTransition } from 'react-transition-group'

type CartOverlayProps = {
  isVisible: boolean
  toggleCart: () => void
}

export class CartOverlayUi extends React.Component<CartOverlayProps> {
  render(): React.ReactNode {
    return (
      <CSSTransition
        in={this.props.isVisible}
        timeout={300}
        unmountOnExit
      >
        <OverlayBackground
          onClick={this.props.toggleCart}
        />
      </CSSTransition>
    )
  }
}

const OverlayBackground = styled.div`
  position: fixed;
  top: 5rem;
  left: 0;

  width: 100%;
  height: 100%;

  background-color: rgb(57, 55, 72, 0.22);

  &.enter {
    opacity: 0;
  }

  &.enter-active {
    opacity: 1;
    transition: opacity 300ms ease-in;
  }

  &.exit {
    opacity: 1;
  }

  &.exit-active {
    opacity: 0;
    transition: opacity 300ms ease-out;
  }
`