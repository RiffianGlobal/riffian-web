declare type tsIsh = bigint | number | string

declare type graphParams = {
  time?: tsIsh
  week?: tsIsh
  cate: string
  keyword?: string
  first?: 10 | number
  skip?: 0 | number
  id?: string
}
