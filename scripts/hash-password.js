#!/usr/bin/env node

/**
 * Password Hash Generator
 * Usage: node scripts/hash-password.js <password>
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
    console.error('Error: Please provide a password');
    console.log('Usage: node scripts/hash-password.js <password>');
    process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log('\n=================================');
console.log('Password Hash Generated');
console.log('=================================\n');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nUse this hash in your Supabase admin_users table:');
console.log(`\nINSERT INTO admin_users (email, password_hash)`);
console.log(`VALUES ('admin@zyraedu.com', '${hash}');\n`);
