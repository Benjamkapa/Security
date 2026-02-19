/**
 * Seed Script for Admin Credentials
 *
 * Run this script to create admin users in the database.
 * Usage: node seed.js
 *
 * Default credentials created:
 * - Username: admin
 * - Password: admin123
 */

const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");
const db = new Database(dbPath);

// Ensure users table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

function seedAdminUsers() {
  const admins = [
    {
      username: "adminSecureGuard",
      password: "admin123",
      email: "admin@secureguard.co.ke",
      role: "admin",
    },
  ];

  console.log("Seeding admin users...\n");

  const insertStmt = db.prepare(
    "INSERT OR IGNORE INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
  );

  const updateStmt = db.prepare(
    "UPDATE users SET password = ?, email = ?, role = ? WHERE username = ?",
  );

  admins.forEach((admin) => {
    const hashedPassword = bcrypt.hashSync(admin.password, 10);

    try {
      const existingUser = db
        .prepare("SELECT id FROM users WHERE username = ?")
        .get(admin.username);

      if (existingUser) {
        // Update existing user
        updateStmt.run(hashedPassword, admin.email, admin.role, admin.username);
        console.log(`✓ Updated admin user: ${admin.username}`);
      } else {
        // Insert new user
        insertStmt.run(admin.username, hashedPassword, admin.email, admin.role);
        console.log(`✓ Created admin user: ${admin.username}`);
      }
    } catch (err) {
      console.error(`✗ Error for ${admin.username}:`, err.message);
    }
  });

  // Display all users
  console.log("\n--- Current Admin Users ---");
  const users = db
    .prepare("SELECT id, username, email, role, created_at FROM users")
    .all();
  users.forEach((user) => {
    console.log(
      `ID: ${user.id} | Username: ${user.username} | Email: ${user.email} | Role: ${user.role}`,
    );
  });

  console.log("\n--- Login Credentials ---");
  console.log("Username: admin");
  console.log("Password: admin123");
  console.log("\nSeed completed successfully!");
}

seedAdminUsers();

db.close();
