import crypto from "crypto";

const algorithm = "AES-192-CBC";

/**
 * Generate an Initialization Vector
 * @returns {Buffer}
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
export function encrypt(data: string, secretKey: string): string {
  const IV = generateIv();
  console.log(secretKey);

  let encryptionKey = crypto.scryptSync(secretKey, "salt", 24);
  let cipher = crypto.createCipheriv(algorithm, encryptionKey, IV);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

/**
 * Decrypt a secret
 * @param {String} data           Encrypted data
 * @param {String} secretKey  Encryption key used to encrypt the data
 *
 * @returns {String}
 */
export function decrypt(data: string, secretKey: string): string {
  const IV = generateIv();
  let encryptionKey = crypto.scryptSync(secretKey, "salt", 24);
  let decipher = crypto.createDecipheriv(algorithm, encryptionKey, IV);
  let decrypted = decipher.update(data, "hex", "utf8");

  return decrypted + decipher.final("utf8");
}

export function formatEncryptOutput(data: any): string {
  const userJSON = JSON.stringify(data);

  let secureUser = encrypt(userJSON, data.password);

  return secureUser;
}

export function formatDecryptOutput(response: string, data: any): any {
  let decryptUser = decrypt(response, data.password);

  return typeof decryptUser === "string"
    ? decryptUser
    : JSON.parse(decryptUser);
}
