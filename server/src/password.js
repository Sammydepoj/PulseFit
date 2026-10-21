import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

// Stored as "<salt hex>:<hash hex>". Each password gets its own random salt.
export async function hashPassword(password) {
    const salt = randomBytes(16);
    const hash = await scryptAsync(password, salt, KEY_LENGTH);
    return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(password, stored) {
    const [saltHex, hashHex] = stored.split(":");
    const expected = Buffer.from(hashHex, "hex");
    const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), KEY_LENGTH);
    return timingSafeEqual(actual, expected);
}

// Used when the email doesn't exist, so a missing account takes as long to
// reject as a wrong password and the response time doesn't reveal which it was.
export const DUMMY_HASH = await hashPassword("not-a-real-password");
