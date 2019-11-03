import fs from 'fs';

// Read public key.
const publicCert = fs.readFileSync(process.env.JWT_PUBLIC_KEY || 'keys/jwt.pub.key');

export default {
  issuer: process.env.JWT_ISSUER || 'dummy_issuer',
  secret: publicCert,
};
