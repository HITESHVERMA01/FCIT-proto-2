import bcrypt from 'bcryptjs';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { User } from '../models/User.js';

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1];
  }
  return '';
}

async function seedSuperAdmin() {
  let name =
    getArg('--name') ||
    process.env.SEED_ADMIN_NAME ||
    'FCIT Super Administrator';
  let email = getArg('--email') || process.env.SEED_ADMIN_EMAIL || '';
  let password = getArg('--password') || process.env.SEED_ADMIN_PASSWORD || '';

  if (!email || !password) {
    if (!input.isTTY) {
      console.error(
        'Provide SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in server/.env or pass --email and --password.'
      );
      process.exit(1);
    }

    const rl = readline.createInterface({ input, output });
    try {
      if (!email) email = (await rl.question('Admin Email: ')).trim();
      if (!password) password = (await rl.question('Admin Password (min 10 chars): ')).trim();
    } finally {
      rl.close();
    }
  }

  email = email.toLowerCase();
  if (!email.includes('@') || password.length < 10) {
    console.error(
      'Invalid input: valid email and password of at least 10 characters are required.'
    );
    process.exit(1);
  }

  await connectDatabase();

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.name = name;
    existing.passwordHash = passwordHash;
    existing.role = 'super_admin';
    existing.isActive = true;
    await existing.save();
    console.log(`[FCIT Seed] Updated Super Admin account for ${email}`);
  } else {
    await User.create({
      name,
      email,
      passwordHash,
      role: 'super_admin',
      isActive: true,
    });
    console.log(`[FCIT Seed] Created Super Admin account for ${email}`);
  }

  await disconnectDatabase();
}

seedSuperAdmin().catch(async (err) => {
  console.error('[FCIT Seed] Failed:', err.message);
  await disconnectDatabase();
  process.exit(1);
});
