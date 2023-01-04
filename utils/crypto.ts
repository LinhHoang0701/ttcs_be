import CryptoJS from "crypto-js";
import crypto from 'crypto';

//================AES====================

const algorithm = "AES-GCM";

/**
 * Generate an Initialization Vector
 * @returns {string}
 */
function generateIv(): Buffer {
  return Buffer.alloc(16, 0);
}

/**
 * Encrypt a secret
 * @param {String} data           Data to encrypt
 * @param {String} secretKey  Encryption key to uses to encrypt the secret
 *
 * @returns {String}              Encrypted data
 */
export function encryptAES(data: string, secretKey: string): string {
  const encrypted = CryptoJS.AES.encrypt(data, secretKey);
  return encrypted.toString();
}

/**
 * Decrypt a secret
 * @param {String} data           Encrypted data
 * @param {String} secretKey  Encryption key used to encrypt the data
 *
 * @returns {String}
 */
export function decryptAES(data: string, secretKey: any): string {
  const decrypted = CryptoJS.AES.decrypt(data, secretKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export function formatEncryptOutput(data: any, token: any): string {
  const userJSON = JSON.stringify(data);

  let secureUser = encryptAES(userJSON, token);

  return secureUser;
}

export function formatDecryptOutput(response: string, token: any): any {
  let decryptUser = decryptAES(response, token);

  return typeof decryptUser === "string"
    ? decryptUser
    : JSON.parse(decryptUser);
}

//================RSA====================

export const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: "top secret",
  },
});

export function encryptRSA(data: string): string {
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(data)
  );

  return encryptedData.toString();
}

export function decryptRSA(encryptedData: Buffer): any {
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedData
  );

  return decryptedData;
}

export function verifyRSA(verifiableData: any): boolean {
  const signature = crypto.sign("sha256", Buffer.from(verifiableData), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  });

  const isVerified = crypto.verify(
    "sha256",
    Buffer.from(verifiableData),
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    },
    signature
  );

  return isVerified;
}
