import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../store'
import { loadProductList } from './ProductListSlice'
import { addProductById } from '../CartModal/CartModalSlice'

const mapStateToProps = (state: RootState) => ({
  products: state.productList.products,
  hasError: state.productList.hasError,
  selectedCurrency: state.page.selectedCurrency,
})

const mapDispatchToProps = {
  loadProductList,
  addToCart: addProductById,
}

export const connector = connect(mapStateToProps, mapDispatchToProps)

export type ProductListReduxProps = ConnectedProps<typeof connector>
