import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { callApi } from '../../api'

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
  inStock: boolean
  description: string
  images: string[]
  prices: PriceFromPayload[]
  attributes: AttributeFromPayload[]
}

type FromPayload = {
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
  isSelected: boolean
}

export type PriceContainer = {
  amount: number
  currencySymbol: string
}

export type Product = {
  id: string
  inStock: boolean
  name: string
  prices: PriceContainer[]
  imageGallery: string[]
  selectedImage: string
  description: string
  attributes: Attribute[]
  attributesAreSelected: boolean
}

type ProductDetailsState = {
  product?: Product
  isLoading: boolean
  hasError: boolean
}

const initialState: ProductDetailsState = {
  product: undefined,
  isLoading: false,
  hasError: false,
}

export const loadProductDetails = createAsyncThunk(
  'productDetails/loadProductDetails',
  async (productId: string) => {
    const response = await callApi<FromPayload>({
      productId,
    })`
      query($productId: String!) {
        product(productId: $productId) {
          productId
          name
          inStock
          description
          images
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
    return response
  }
)

export const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState,
  reducers: {
    selectAttributeOption(
      { product }, 
      action: PayloadAction<{
        productId: string,
        attributeId: string,
        optionId: string,
      }>
    ) {
      if (!product) {
        throw new Error('Product not found')
      }

      const attribute = product.attributes.find(attribute => attribute.id === action.payload.attributeId)

      if (!attribute) {
        throw new Error('Attribute not found')
      }

      for (const option of attribute.options) {
        if (option.id === action.payload.optionId) {
          option.isSelected = true
          attribute.isSelected = true
        } else {
          option.isSelected = false
        }
      }

      product.attributesAreSelected = product.attributes.every(
        attribute => attribute.isSelected
      )
    },

    selectImage({ product }, action: PayloadAction<string>) {
      if (!product) {
        throw new Error('Product not found')
      }

      product.selectedImage = action.payload
    },

    goToPrevImage({ product }) {
      if (!product) {
        throw new Error('Product not found')
      }

      const imageGallery = product.imageGallery
      const selectedImageIndex = imageGallery.indexOf(product.selectedImage)

      if (selectedImageIndex > 0) {
        product.selectedImage = imageGallery[selectedImageIndex - 1]
      } else if (selectedImageIndex === 0) {
        product.selectedImage = imageGallery[imageGallery.length - 1]
      }
    },

    goToNextImage({ product }) {
      if (!product) {
        throw new Error('Product not found')
      }

      const imageGallery = product.imageGallery
      const selectedImageIndex = imageGallery.indexOf(product.selectedImage)

      if (selectedImageIndex + 1 < imageGallery.length) {
        product.selectedImage = imageGallery[selectedImageIndex + 1]
      } else if (selectedImageIndex + 1 === imageGallery.length) {
        product.selectedImage = imageGallery[0]
      }
    },

    reset(state) {
      Object.assign(state, initialState)
    }
  },

  extraReducers: builder => {
    builder
      .addCase(
        loadProductDetails.pending,
        state => {
          state.isLoading = true
        }
      )
      .addCase(
        loadProductDetails.fulfilled,
        (state, action) => {
          state.isLoading = false
          state.hasError = false
          
          const payloadProduct = action.payload.product
          
          state.product = {
            id: payloadProduct.productId,
            name: payloadProduct.name,
            inStock: payloadProduct.inStock,
            description: payloadProduct.description,
            imageGallery: payloadProduct.images,
            selectedImage: payloadProduct.images[0],
            prices: payloadProduct.prices.map(
              payloadPrice => ({
                amount: payloadPrice.amount,
                currencySymbol: payloadPrice.currency.symbol
              })
            ),
            attributes: payloadProduct.attributes.map(
              payloadAttribute => ({
                id: payloadAttribute.attributeId,
                isSelected: false,
                options: payloadAttribute.options.map(
                  payloadOption => ({
                    id: payloadOption.optionId,
                    value: payloadOption.value,
                    isSelected: false
                  })
                )
              })
            ),
            attributesAreSelected: false,
          }
        }
      )
      .addCase(
        loadProductDetails.rejected,
        (state, action) => {
          state.isLoading = false
          state.hasError = true
          console.error(action.error)
        }
      )
  }
})

export const {
  selectAttributeOption,
  selectImage,
  goToPrevImage,
  goToNextImage,
  reset
} = productDetailsSlice.actions
