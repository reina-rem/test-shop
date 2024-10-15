import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { callApi } from '../../api'

type OrderDataFromPayload = {
  placeOrder: {
    id: number
  }
}

type OrderItemAttribute = {
  attributeId: string
  optionId: string
}

type OrderItem = {
  productId: string
  quantity: number
  attributes: OrderItemAttribute[]
}

type PlaceOrderParams = {
  currencySymbol: string
  items: OrderItem[]
}

type OptionFromPayload = {
  optionId: string
  value: string
}

type AttributeFromPayload = {
  attributeId: string
  type: string
  options: OptionFromPayload[]
}

type PriceFromPayload = {
  amount: number
  currency: {
    symbol: string
  }
}

type ProductFromPayload = {
  productId: string
  name: string
  images: string[]
  category: string
  prices: PriceFromPayload[]
  attributes: AttributeFromPayload[]
}

export type ProductDataFromPayload = {
  product: ProductFromPayload
}

export type Option = {
  id: string
  value: string
  isSelected: boolean
}

export type Attribute = {
  id: string
  options: Option[]
}

export type Price = {
  amount: number
  currencySymbol: string
}

export type Product = {
  id: string
  name: string
  prices: Price[]
  quantity: number
  imageSrc: string
  category: string
  attributes: Attribute[]
}

export type CartModalState = {
  products: Product[]
  totalPrice: number
  selectedCurrency: string
  totalItems: number
  orderId?: number
  isLoading: boolean
  hasError: boolean
}

const initialState: CartModalState = {
  products: [],
  totalPrice: 0,
  totalItems: 0,
  selectedCurrency: '$',
  isLoading: false,
  hasError: false,
}

const findSelectedOptions = (attributes: Attribute[]): Option[] => {
  const selectedOptions = attributes.map(
    attribute => (
      attribute.options.find(
        option => option.isSelected
      )
    )
  )

  if (selectedOptions.every(option => option === undefined)) {
    throw new Error('Options are not selected')
  }

  return selectedOptions as Option[]
}

export const placeOrder = createAsyncThunk(
  'cartModal/placeOrder',
  async ({currencySymbol, items}: PlaceOrderParams) => {
    return callApi<OrderDataFromPayload>({
      currencySymbol,
      items
    })`
      mutation PlaceOrder($currencySymbol: String!, $items: [OrderItemInput!]!) {
        placeOrder(currencySymbol: $currencySymbol, items: $items) {
          id
        }
      }
    `
  }
)

export const addProductById = createAsyncThunk(
  'cartModal/addProductById',
  async (productId: string, thunkApi) => {
      const payload = await callApi<ProductDataFromPayload>({
        productId,
      })`
        query($productId: String!) {
          product(productId: $productId) {
            productId
            name
            images
            category
            prices {
              amount
              currency {
                symbol
              }
            }
            attributes {
              attributeId
              type
              options {
                optionId
                value
              }
            }
          }
        }
      `
  
      const payloadProduct = payload.product
  
      thunkApi.dispatch(cartModalSlice.actions.addNewProduct({
        id: payloadProduct.productId,
        name: payloadProduct.name,
        quantity: 1,
        category: payloadProduct.category,
        attributes: payloadProduct.attributes.map(
          payloadAttribute => ({
            id: payloadAttribute.attributeId,
            options: payloadAttribute.options.map(
              (payloadOption, i) => ({
                id: payloadOption.optionId,
                value: payloadOption.value,
                isSelected: i === 0,
              })
            ),
          })
        ),
        prices: payloadProduct.prices.map(
          payloadPrice => ({
            amount: payloadPrice.amount,
            currencySymbol: payloadPrice.currency.symbol
          })
        ),
        imageSrc: payloadProduct.images[0],
      }))
  }
)

const getInitialState = () => {
  const cart = localStorage.getItem('cart')
  
  return (
    cart 
      ? JSON.parse(cart) as typeof initialState
      : initialState
  )
}

export const cartModalSlice = createSlice({
  name: 'cartModal',
  initialState: getInitialState(),
  
  reducers: {
    clearCart(state) {
      state.products = []
      state.totalItems = 0
      state.totalPrice = 0
      localStorage.clear()
    },

    addNewProduct(
      state, 
      { payload }: PayloadAction<Product>
    ) {
      const existingProduct = state.products.find(
        p => {
          if (p.id !== payload.id) {
            return false
          }

          const selectedOptions = findSelectedOptions(p.attributes)
          const payloadSelectedOptions = findSelectedOptions(payload.attributes)

          return selectedOptions.every(
            (option, i) => (
              option.id === payloadSelectedOptions[i]!.id
            )
          )
        }
      )

      if (existingProduct) {
        existingProduct.quantity += payload.quantity
        state.totalItems += payload.quantity
      } else {
        state.products.push(payload)
        state.totalItems += payload.quantity
      }

      const price = payload.prices.find(
        price => price.currencySymbol === state.selectedCurrency
      )

      if (!price) {
        throw new Error('No products in selected currency')
      }

      state.totalPrice += price.amount * payload.quantity

      localStorage.setItem(
        'cart',
        JSON.stringify(state)
      )
    },

    increaseProductAmount(
      state, 
      { payload }: PayloadAction<{
        product: Product
        productIndex: number
      }>
    ) {
      const product = state.products[payload.productIndex]

      if (!product) {
        throw new Error('Product not found')
      }

      if (product.quantity < 999) {
        product.quantity++
        state.totalItems++

        const price = payload.product.prices.find(
          price => price.currencySymbol === state.selectedCurrency
        )
  
        if (!price) {
          throw new Error('No products in selected currency')
        }

        state.totalPrice += price.amount
      }

      localStorage.setItem(
        'cart',
        JSON.stringify(state)
      )
    },

    decreaseProductAmount(
      state, 
      { payload }: PayloadAction<{
        product: Product
        productIndex: number
      }>
    ) {
      const product = state.products[payload.productIndex]

      if (!product) {
        throw new Error('Product not found')
      }

      if (product.quantity === 1) {
        state.products = state.products.filter(
          (_, i) => i !== payload.productIndex
        )
      } else {
        product.quantity--
      }

      state.totalItems--

      const price = payload.product.prices.find(
        price => price.currencySymbol === state.selectedCurrency
      )

      if (!price) {
        throw new Error('No products in selected currency')
      }

      state.totalPrice -= price.amount

      localStorage.setItem(
        'cart',
        JSON.stringify(state)
      )
    },
  },

  extraReducers: builder => {
    builder
      .addCase(
        addProductById.pending,
        state => {
          state.isLoading = true
        }
      )
      .addCase(
        addProductById.fulfilled,
        state => {
          state.isLoading = false
          state.hasError = false
        }
      )
      .addCase(
        addProductById.rejected,
        (state, action) => {
          state.isLoading = false
          state.hasError = true
          console.error(action.error)
        }
      )
      
      .addCase(
        placeOrder.pending,
        state => {
          state.isLoading = true
        }
      )
      .addCase(
        placeOrder.fulfilled,
        (state, action) => {
          state.isLoading = false
          state.hasError = false
          state.orderId = action.payload.placeOrder.id
        }
      )
      .addCase(
        placeOrder.rejected,
        (state, action) => {
          state.isLoading = false
          state.hasError = true
          console.error(action.error)
        }
      )
  }
})

export const {
  clearCart,
  addNewProduct,
  increaseProductAmount,
  decreaseProductAmount,
} = cartModalSlice.actions
