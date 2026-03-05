import db from '../db.js';
import bcrypt from 'bcryptjs';

/**
 * This script will check all users and hash any plain text passwords
 * Run this once to fix existing users with plain text passwords
 */

async function hashExistingPasswords() {
  try {
    // Wait for database connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🔄 Checking for users with unhashed passwords...');
    
    // Get all users
    const [users] = await db.query('SELECT id, username, password FROM users');
    
    console.log(`📊 Found ${users.length} users in database`);
    
    let updatedCount = 0;
    
    for (const user of users) {
      // Check if password is already a bcrypt hash
      // Bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 characters long
      const isBcryptHash = user.password && 
                          (user.password.startsWith('$2a$') || 
                           user.password.startsWith('$2b$') || 
                           user.password.startsWith('$2y$')) &&
                          user.password.length === 60;
      
      if (!isBcryptHash) {
        console.log(`⚠️  User "${user.username}" (ID: ${user.id}) has unhashed password`);
        console.log(`   Original password: ${user.password}`);
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // Update in database
        await db.query(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPassword, user.id]
        );
        
        console.log(`✅ Updated password for user "${user.username}"`);
        console.log(`   New hash: ${hashedPassword.substring(0, 20)}...`);
        updatedCount++;
      } else {
        console.log(`✓ User "${user.username}" (ID: ${user.id}) already has hashed password`);
      }
    }
    
    console.log(`\n🎉 Complete! Updated ${updatedCount} user(s)`);
    console.log(`✅ ${users.length - updatedCount} user(s) already had hashed passwords`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error hashing passwords:', error);
    process.exit(1);
  }
}

// Run the script
hashExistingPasswords();
