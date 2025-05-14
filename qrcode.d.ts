// qrcode.d.ts
declare module 'qrcode' {
    export function toDataURL(text: string, options?: any): Promise<string>;
    export function toString(text: string, options?: any): Promise<string>;
    export function toFile(path: string, text: string, options?: any): Promise<void>;
  }
  