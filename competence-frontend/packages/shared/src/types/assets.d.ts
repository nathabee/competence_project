// packages/shared/types/assets.d.ts or global.d.ts
declare module '*.png' {
  const content: import('next/image').StaticImageData;
  export default content;
}
