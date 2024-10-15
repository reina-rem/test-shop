import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { callApi } from '../../api'

type CategoriesFromPayload = {
  categories: string[]
}

type PageState = {
  categories?: string[]
  selectedCurrency: string
  isLoading: boolean
  hasError: boolean
}

const initialState: PageState = {
  selectedCurrency: '$',
  isLoading: false,
  hasError: false,
}

export const loadCategories = createAsyncThunk(
  'page/categories/update',
  async () => {
    return callApi<CategoriesFromPayload>`
      query {
        categories
      }
    `
  }
)

export const pageSlice = createSlice({
  name: 'page',
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        loadCategories.pending,
        (state) => {
          state.isLoading = true
          state.hasError = false
        }
      )
      .addCase(
        loadCategories.fulfilled,
        (state, action) => {
          state.isLoading = false
          state.hasError = false
          state.categories = action.payload.categories
        }
      )
      .addCase(
        loadCategories.rejected,
        (state, action) => {
          state.isLoading = false
          state.hasError = true
          console.error(action.error)
        }
      )
  },
})
