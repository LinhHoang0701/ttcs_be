import crypto from "crypto";

//================AES====================

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
export function encryptAES(data: string, secretKey: string): string {
  const IV = generateIv();
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
export function decryptAES(data: string, secretKey: string): string {
  const IV = generateIv();
  let encryptionKey = crypto.scryptSync(secretKey, "salt", 24);
  let decipher = crypto.createDecipheriv(algorithm, encryptionKey, IV);
  let decrypted = decipher.update(data, "hex", "utf8");

  return decrypted + decipher.final("utf8");
}

export function formatEncryptOutput(data: any): string {
  const userJSON = JSON.stringify(data);

  let secureUser = encryptAES(userJSON, data.password);

  return secureUser;
}

export function formatDecryptOutput(response: string, data: any): any {
  let decryptUser = decryptAES(response, data.password);

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
