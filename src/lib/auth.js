import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecretkeyforjwtsigning123!';

export function signToken(payload, expirySeconds = 86400) {
  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  const base64Header = Buffer.from(header).toString('base64url');
  
  const exp = Math.floor(Date.now() / 1000) + expirySeconds;
  const fullPayload = { ...payload, exp };
  const base64Payload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');
    
  return `${base64Header}.${base64Payload}.${signature}`;
}

export function verifyToken(token) {
  if (!token) return null;
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return null;

    const calculatedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');
      
    if (signature !== calculatedSignature) return null;
    
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    
    // Check expiration
    if (decodedPayload.exp && Math.floor(Date.now() / 1000) > decodedPayload.exp) {
      return null; // Expired
    }
    
    return decodedPayload;
  } catch (e) {
    return null;
  }
}
