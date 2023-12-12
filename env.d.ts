declare type PublicConstructor<T = {}> = new (...args: any[]) => T

declare module '*.scss'
declare module '*.css'
declare module '*.css?inline'
declare module '*.html'
declare module '*.js'
declare module '*.wasm'
declare module '*.svg' {
  export default SVGElement
}
//
interface ImportMeta {
  env: Record<string, string>
}
