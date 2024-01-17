export const MEDIA_URL_DEFAULTS = [
  'https://cdn.shopify.com/app-store/listing_images/a82167e02b45cadf681efc6c17c35f3a/icon/CMmMjb30lu8CEAE=.jpg'
]

export const paginationDef = () => ({ pageNum: 1, pageSize: 10, hasMore: true })
export type Pagination = {
  pageNum: number
  pageSize: number
}
