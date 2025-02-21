// types/qrcode.d.ts
declare module 'qrcode' {
    export function toDataURL(text: string, callback: (error: Error | null, url: string) => void): void;
    // Add other necessary exports and types as needed
  }
  