import { ProductListUi } from './ProductListUi'
import { connector } from './ProductListConnector'

export { productListSlice } from './ProductListSlice'

export const ProductList = connector(ProductListUi)
