import { connector } from './CartModalConnector'
import { CartModalUi } from './CartModalUi'

export { cartModalSlice } from './CartModalSlice'

export const CartModal = connector(CartModalUi)
