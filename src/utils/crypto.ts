import CryptoJS from 'crypto-js';

/** Returns the SHA-256 hex digest of a string. Synchronous, pure JS, no native deps. */
export function sha256(message: string): string {
  return CryptoJS.SHA256(message).toString();
}
