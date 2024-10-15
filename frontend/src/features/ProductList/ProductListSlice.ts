import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { callApi } from '../../api'

type PriceFromPayload = {
  amount: number
  currency: {
    symbol: string
  }
}

type ProductFromPayload = {
  productId: string
  name: string
  inStock: boolean
  images: string[]
  prices: PriceFromPayload[]
}

type ProductsFromPayload = {
  products: ProductFromPayload[]
}

export type Price = {
  amount: number
  currencySymbol: string
}

type Product = {
  id: string
  name: string
  inStock: boolean
  prices: Price[]
  imageSrc: string
}

export type ProductListState = {
  products: Product[]
  isLoading: boolean
  hasError: boolean
}

const initialState: ProductListState = {
  products: [],
  isLoading: false,
  hasError: false,
}

export const loadProductList = createAsyncThunk(
  'productList/update',
  async (categoryId: string) => {
    return callApi<ProductsFromPayload>({
      category: categoryId,
    })`
      query($category: String!) {
        products(category: $category) {
          productId
          name
          inStock
          images
          prices {
            amount
            currency {
              symbol
            }
          }
        }
      }
    `
  }
)

export const productListSlice = createSlice({
  name: 'productList',
  initialState,
  
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(
        loadProductList.pending, 
        state => {
          state.isLoading = true
        }
      )
      .addCase(
        loadProductList.fulfilled,
        (state, action) => {
          state.isLoading = false
          state.hasError = false
          state.products = action.payload!.products.map(
            payloadProduct => ({
              id: payloadProduct.productId,
              name: payloadProduct.name,
              inStock: payloadProduct.inStock,
              prices: payloadProduct.prices.map(
                payloadPrice => ({
                  amount: payloadPrice.amount,
                  currencySymbol: payloadPrice.currency.symbol,
                })
              ),
              imageSrc: payloadProduct.images[0],
            })
          )
        }
      )
      .addCase(
        loadProductList.rejected,
        (state, action) => {
          state.isLoading = false
          state.hasError = true
          console.error(action.error)
        }
      )
  },
})
