import { connect, ConnectedProps } from 'react-redux'

import { RootState } from '../../store'
import {
  increaseProductAmount,
  decreaseProductAmount,
  addNewProduct,
  placeOrder,
  clearCart,
} from './CartModalSlice'

const mapStateToProps = (state: RootState) => ({
  products: state.cartModal.products,
  totalPrice: state.cartModal.totalPrice,
  totalItems: state.cartModal.totalItems,
  selectedCurrency: state.cartModal.selectedCurrency,
  orderId: state.cartModal.orderId,
  hasError: state.cartModal.hasError,
})

const mapDispatchToProps = {
  clearCart,
  addNewProduct,
  increaseProductAmount,
  decreaseProductAmount,
  placeOrder,
}

export const connector = connect(mapStateToProps, mapDispatchToProps)

export type CartModalReduxProps = ConnectedProps<typeof connector>
