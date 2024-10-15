import { connector } from './PageConnector'
import { PageUi } from './PageUi'

export { pageSlice } from './PageSlice'

export const Page = connector(PageUi)
