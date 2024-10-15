import { connector } from './ProductDetailsConnector'
import { ProductDetailsUi } from './ProductDetailsUi'

export { productDetailsSlice } from './ProductDetailsSlice'


export const ProductDetails = connector(ProductDetailsUi)
