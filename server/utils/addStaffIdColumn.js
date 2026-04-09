/**
 * Legacy migration helper retained as a no-op for MongoDB-only repos.
 * The User schema already includes `staffId`; no column migration is required.
 */

console.log('MongoDB-only repo: no staff_id column migration is required.');
process.exit(0);
