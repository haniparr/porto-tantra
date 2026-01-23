const crypto = require('crypto');

console.log('\n========================================');
console.log('   STRAPI SECURITY KEYS GENERATOR');
console.log('========================================\n');

// Generate APP_KEYS (4 keys)
const appKeys = Array.from({ length: 4 }, () => 
  crypto.randomBytes(16).toString('base64')
).join(',');

console.log('📋 Copy these values to Render environment variables:\n');

console.log('APP_KEYS=');
console.log(appKeys);
console.log('\n');

console.log('API_TOKEN_SALT=');
console.log(crypto.randomBytes(16).toString('base64'));
console.log('\n');

console.log('ADMIN_JWT_SECRET=');
console.log(crypto.randomBytes(16).toString('base64'));
console.log('\n');

console.log('TRANSFER_TOKEN_SALT=');
console.log(crypto.randomBytes(16).toString('base64'));
console.log('\n');

console.log('JWT_SECRET=');
console.log(crypto.randomBytes(16).toString('base64'));
console.log('\n');

console.log('========================================');
console.log('⚠️  SAVE THESE VALUES - You\'ll need them!');
console.log('========================================\n');