/**
 * ⚠️ LEGACY FILE — MySQL is no longer used
 * This file is kept temporarily so unconverted controllers fail with a clear
 * error message instead of a cryptic import crash.
 *
 * Once ALL controllers are converted to Mongoose, delete this file.
 * To find remaining files still using this:
 *   grep -r "from '../db.js'" server/controller/
 */

const dbLegacy = {
  query: async () => {
    throw new Error(
      '🚨 db.js (MySQL) is no longer used. This controller has not been converted to MongoDB yet. ' +
      'Please convert this controller to use the appropriate Mongoose model (server/models/).'
    );
  },
  transaction: async (fn) => {
    throw new Error('🚨 MySQL transactions removed. Use Mongoose sessions for MongoDB transactions.');
  },
  pool: null,
};

export default dbLegacy;
