/// <reference types="vite/client" />

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.webp" {
  const value: string;
  export default value;
}

declare module "*.avif" {
  const value: string;
  export default value;
}

// Declaração para queries do vite-imagetools
declare module "*?as=srcset" {
  const value: string;
  export default value;
}

declare module "*?format=avif" {
  const value: string;
  export default value;
}