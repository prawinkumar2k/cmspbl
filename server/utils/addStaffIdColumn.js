import db from '../db.js';

/**
 * This script adds the staff_id column to the users table if it doesn't exist
 */

async function addStaffIdColumn() {
  try {
    // Wait for database connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🔄 Checking if staff_id column exists in users table...');
    
    // Check if staff_id column exists
    const [columns] = await db.query(
      `SHOW COLUMNS FROM users LIKE 'staff_id'`
    );
    
    if (columns.length > 0) {
      console.log('✅ staff_id column already exists in users table');
    } else {
      console.log('⚠️  staff_id column does not exist. Adding it now...');
      
      // Add the column
      await db.query(
        `ALTER TABLE users ADD COLUMN staff_id VARCHAR(50) NULL AFTER staff_name`
      );
      
      console.log('✅ Successfully added staff_id column to users table');
    }
    
    // Show table structure
    console.log('\n📋 Current users table structure:');
    const [tableStructure] = await db.query('DESCRIBE users');
    console.table(tableStructure);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
addStaffIdColumn();
