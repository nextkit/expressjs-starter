import { Request } from 'express';
import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';

// Read keys.
const publicCert = fs.readFileSync(process.env.JWT_PUBLIC_KEY || 'keys/jwt.pub.key');
const privateCert = fs.readFileSync(process.env.JWT_PRIVATE_KEY || 'keys/jwt.private.key', 'utf8');

export interface IJwtConfig {
  issuer: string;
  secret: string | Buffer;
}

export interface IJwtData {
  _id: string;
  username: string;
}

export interface IJwtRequest extends Request {
  user: IJwtData;
}

/**
 * @class JwtAction.
 */
export default class JwtAction {

  /**
   * Generates a jsonwebtoken.
   *
   * @param data to be saved in the JWT
   * @param subject of the JWT
   *
   * @returns {Promise<string>} Promise returning the token.
   */
  public static async token(data: IJwtData, subject: string): Promise<string> {
    const token = await jsonwebtoken.sign(data, privateCert, {
      algorithm: process.env.JWT_ALGORITHM || 'RS512',
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      issuer: process.env.JWT_ISSUER || 'dummy_issuer',
      subject,
    });

    return token;
  }

  /**
   * Returns the configuration for checking the JsonWebToken.
   *
   * @returns {IJwtConfig}
   */
  public static getConfig(): IJwtConfig {
    return {
      issuer: process.env.JWT_ISSUER || 'dummy_issuer',
      secret: publicCert,
    };
  }
}
