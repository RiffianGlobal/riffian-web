import emptyCover from '~/assets/empty.webp?inline'
export { emptyCover }

export const paginationDef = (opts = {}): Pagination => ({ pageNum: 1, pageSize: 10, hasMore: true, ...opts })
export type Pagination = {
  pageNum: number
  pageSize: number
  hasMore?: boolean
}
