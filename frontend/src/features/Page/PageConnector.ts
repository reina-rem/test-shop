import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../store'
import { loadCategories } from './PageSlice';

const mapStateToProps = (state: RootState) => ({
  selectedCurrency: state.page.selectedCurrency,
  categories: state.page.categories,
  hasError: state.page.hasError,
  cartTotalItems: state.cartModal.totalItems,
})

const mapDispatchToProps = {
  loadCategories,
}

export const connector = connect(mapStateToProps, mapDispatchToProps)

export type PageReduxProps = ConnectedProps<typeof connector>
