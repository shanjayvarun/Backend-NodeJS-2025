const environment = require('../config/env');

/**
 * DynamoDB user item design:
 * - Primary key: email
 * - Attribute 'id': UUID used in JWTs and internal lookups
 * - Global secondary index on id for get-by-id queries
 * - Additional attributes store auth state and user profile metadata
 */

const USERS_TABLE_NAME = environment.dynamodbUsersTable;
const USER_ID_INDEX_NAME = environment.dynamodbUserIdIndexName;

const buildUserItem = ({
  id,
  name,
  email,
  password,
  role = 'STAFF',
  profilePicture = '',
  phone = null,
  bio = '',
  isVerified = false,
  lastLoginAt,
  refreshToken = null,
  userStatus = 'active',
  createdAt,
  updatedAt,
}) => ({
  id,
  email,
  name,
  password,
  role,
  profilePicture,
  phone,
  bio,
  isVerified,
  lastLoginAt: lastLoginAt || new Date().toISOString(),
  refreshToken,
  userStatus,
  createdAt: createdAt || new Date().toISOString(),
  updatedAt: updatedAt || new Date().toISOString(),
});

module.exports = {
  USERS_TABLE_NAME,
  USER_ID_INDEX_NAME,
  buildUserItem,
};