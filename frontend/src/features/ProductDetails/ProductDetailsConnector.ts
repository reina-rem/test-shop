import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../store'

import {
  goToNextImage,
  goToPrevImage,
  selectAttributeOption,
  selectImage,
  loadProductDetails,
  reset,
} from './ProductDetailsSlice'
import { addNewProduct } from '../CartModal/CartModalSlice'

const mapStateToProps = (state: RootState) => ({
  product: state.productDetails.product,
  hasError: state.productDetails.hasError,
  selectedCurrency: state.page.selectedCurrency,
})

const mapDispatchToProps = {
  loadProductDetails,
  addToCart: addNewProduct,
  selectImage,
  goToPrevImage,
  goToNextImage,
  selectAttributeOption,
  reset,
}

export const connector = connect(mapStateToProps, mapDispatchToProps)

export type ProductDetailsReduxProps = ConnectedProps<typeof connector>
