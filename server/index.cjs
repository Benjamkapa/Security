require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// JWT Secret from environment variables
const JWT_SECRET =
  process.env.JWT_SECRET || "secureguard-secret-key-change-in-production";

// MySQL Configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "secureguard_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const app = express();
const PORT = parseInt(process.env.PORT) || 3001;

// Create connection pool
let pool;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Initialize MySQL Database
async function initDatabase() {
  try {
    // First connect without database to create it if needed
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`,
    );
    await connection.end();

    // Now create pool with database
    pool = mysql.createPool(dbConfig);

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT PRIMARY KEY AUTO_INCREMENT,
        icon VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        display_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT PRIMARY KEY AUTO_INCREMENT,
        author VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        display_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS industries (
        id INT PRIMARY KEY AUTO_INCREMENT,
        icon VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        display_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS hero_banners (
        id INT PRIMARY KEY AUTO_INCREMENT,
        video_url TEXT,
        image_url TEXT,
        headline VARCHAR(500),
        subtitle TEXT,
        is_active INT DEFAULT 1,
        display_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS about_content (
        id INT PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        image_url TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS why_choose_us (
        id INT PRIMARY KEY AUTO_INCREMENT,
        icon VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        display_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS careers_content (
        id INT PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        image_url TEXT,
        benefits TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("MySQL database tables created successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Seed default data if tables are empty
async function seedDefaultData() {
  try {
    const [servicesCount] = await pool.query(
      "SELECT COUNT(*) as count FROM services",
    );
    if (servicesCount[0].count === 0) {
      const services = [
        [
          "Users",
          "Manned Guarding",
          "Professional security guards providing 24/7 protection for your premises with rigorous training and background checks.",
          1,
        ],
        [
          "Eye",
          "CCTV Installation & Monitoring",
          "State-of-the-art surveillance systems with real-time monitoring from our advanced control center.",
          2,
        ],
        [
          "Bell",
          "Alarm Response",
          "Rapid response to alarm activations with our trained security personnel available around the clock.",
          3,
        ],
        [
          "Lock",
          "Access Control Systems",
          "Advanced biometric and card-based access control systems to manage and restrict facility entry.",
          4,
        ],
        [
          "TrendingUp",
          "Risk Assessment",
          "Comprehensive security audits and risk assessments to identify vulnerabilities and recommend solutions.",
          5,
        ],
        [
          "Award",
          "Event Security",
          "Specialized security services for corporate events, conferences, and private functions.",
          6,
        ],
      ];
      for (const service of services) {
        await pool.query(
          "INSERT INTO services (icon, title, description, display_order) VALUES (?, ?, ?, ?)",
          service,
        );
      }
    }

    const [testimonialsCount] = await pool.query(
      "SELECT COUNT(*) as count FROM testimonials",
    );
    if (testimonialsCount[0].count === 0) {
      const testimonials = [
        [
          "James Mwangi",
          "Hotel Manager, Safari Lodge",
          "SecureGuard has been instrumental in maintaining the safety of our guests and property. Their professional team provides excellent service round the clock.",
          1,
        ],
        [
          "Dr. Sarah Chen",
          "Principal, International School",
          "Since engaging SecureGuard, our campus security has significantly improved. Their trained guards and modern systems give us peace of mind.",
          2,
        ],
        [
          "Michael Ochieng",
          "Property Manager, Green Valley Estates",
          "The professionalism and reliability of SecureGuard's team has made them an invaluable partner in protecting our residential estate.",
          3,
        ],
      ];
      for (const testimonial of testimonials) {
        await pool.query(
          "INSERT INTO testimonials (author, role, text, display_order) VALUES (?, ?, ?, ?)",
          testimonial,
        );
      }
    }

    const [industriesCount] = await pool.query(
      "SELECT COUNT(*) as count FROM industries",
    );
    if (industriesCount[0].count === 0) {
      const industries = [
        [
          "Building",
          "Hotels",
          "Trained guards ensuring guest safety and property protection.",
          1,
        ],
        [
          "GraduationCap",
          "Schools",
          "Safe learning environments with controlled access management.",
          2,
        ],
        [
          "Briefcase",
          "Corporate",
          "Comprehensive security for offices and business premises.",
          3,
        ],
        [
          "Home",
          "Estates",
          "Residential community security with patrol services.",
          4,
        ],
        [
          "Factory",
          "Industrial",
          "Heavy-duty security for factories and warehouses.",
          5,
        ],
      ];
      for (const industry of industries) {
        await pool.query(
          "INSERT INTO industries (icon, title, description, display_order) VALUES (?, ?, ?, ?)",
          industry,
        );
      }
    }

    const [whyChooseUsCount] = await pool.query(
      "SELECT COUNT(*) as count FROM why_choose_us",
    );
    if (whyChooseUsCount[0].count === 0) {
      const whyChooseUs = [
        [
          "Users",
          "Highly Trained Personnel",
          "All our guards undergo rigorous training and continuous professional development.",
          1,
        ],
        [
          "Eye",
          "24/7 Monitoring Center",
          "Our state-of-the-art control room operates round the clock for immediate response.",
          2,
        ],
        [
          "Clock",
          "Rapid Response Teams",
          "Quick deployment units strategically positioned across service areas.",
          3,
        ],
        [
          "CheckCircle",
          "Strict Vetting Process",
          "Comprehensive background checks ensuring trustworthy personnel.",
          4,
        ],
        [
          "Shield",
          "Professional Uniforms",
          "Well-groomed, identifiable security personnel representing your brand.",
          5,
        ],
        [
          "Heart",
          "Client-Focused Service",
          "Tailored security solutions meeting your specific requirements.",
          6,
        ],
      ];
      for (const item of whyChooseUs) {
        await pool.query(
          "INSERT INTO why_choose_us (icon, title, description, display_order) VALUES (?, ?, ?, ?)",
          item,
        );
      }
    }

    const [heroCount] = await pool.query(
      "SELECT COUNT(*) as count FROM hero_banners",
    );
    if (heroCount[0].count === 0) {
      await pool.query(
        "INSERT INTO hero_banners (video_url, image_url, headline, subtitle, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?)",
        [
          "",
          "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1920&q=80",
          "Professional Security Solutions You Can Trust",
          "24/7 protection services for hotels, schools, corporate offices, and residential estates across Kenya.",
          1,
          1,
        ],
      );
    }

    const [aboutCount] = await pool.query(
      "SELECT COUNT(*) as count FROM about_content",
    );
    if (aboutCount[0].count === 0) {
      await pool.query(
        "INSERT INTO about_content (id, title, description, image_url) VALUES (1, ?, ?, ?)",
        [
          "About SecureGuard",
          "With over 15 years of experience in the security industry, SecureGuard has established itself as a trusted partner for businesses and property owners across Kenya. Our commitment to excellence and professionalism sets us apart.",
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
        ],
      );
    }

    const [careersCount] = await pool.query(
      "SELECT COUNT(*) as count FROM careers_content",
    );
    if (careersCount[0].count === 0) {
      const benefits = JSON.stringify([
        "Competitive salary and benefits",
        "Professional training and development",
        "Career growth opportunities",
        "Work with a reputable company",
      ]);
      await pool.query(
        "INSERT INTO careers_content (id, title, description, image_url, benefits) VALUES (1, ?, ?, ?, ?)",
        [
          "Join Our Team",
          "SecureGuard is always looking for dedicated professionals to join our team. If you're committed to excellence and want a rewarding career in security, we'd like to hear from you.",
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80",
          benefits,
        ],
      );
    }

    // Create default admin user if not exists
    const [usersCount] = await pool.query(
      "SELECT COUNT(*) as count FROM users",
    );
    if (usersCount[0].count === 0) {
      const hashedPassword = bcrypt.hashSync("admin123", 10);
      await pool.query(
        "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
        ["admin", hashedPassword, "admin@secureguard.co.ke", "admin"],
      );
      console.log(
        "Default admin user created - username: admin, password: admin123",
      );
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

// Database Status Endpoint
app.get("/api/db-status", async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({
        connected: false,
        message: "Database pool not initialized",
      });
    }
    // Try a simple query to check connection
    await pool.query("SELECT 1");
    res.json({
      connected: true,
      message: "Connected to database",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(503).json({
      connected: false,
      message: error.message || "Database connection failed",
    });
  }
});

// Reset admin password endpoint (for development only)
app.post("/api/auth/reset-admin", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "New password required" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    await pool.query("UPDATE users SET password = ? WHERE username = 'admin'", [
      hashedPassword,
    ]);
    res.json({ success: true, message: "Admin password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// Users API
app.get("/api/users", async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, username, email, role, status, created_at, last_login FROM users ORDER BY created_at DESC",
    );
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/users/count", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT COUNT(*) as count FROM users");
    res.json({ count: result[0].count });
  } catch (error) {
    console.error("Error fetching users count:", error);
    res.status(500).json({ error: "Failed to fetch users count" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email, role, password, status } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, role, password, status) VALUES (?, ?, ?, ?, ?)",
      [name, email, role || "Viewer", hashedPassword, status || "active"],
    );
    res.json({ id: result.insertId, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, email, role, password, status } = req.body;
    const userId = req.params.id;

    let query = "UPDATE users SET name = ?, email = ?, role = ?, status = ?";
    let params = [name, email, role, status];

    if (password) {
      query += ", password = ?";
      params.push(bcrypt.hashSync(password, 10));
    }

    query += " WHERE id = ?";
    params.push(userId);

    await pool.query(query, params);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Auth Routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = users[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/auth/logout", authenticateToken, (req, res) => {
  res.json({ success: true });
});

app.get("/api/auth/verify", authenticateToken, (req, res) => {
  res.json({ valid: true });
});

// ==================== API ROUTES ====================

// Services CRUD
app.get("/api/services", async (req, res) => {
  try {
    const [services] = await pool.query(
      "SELECT * FROM services ORDER BY display_order",
    );
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

app.post("/api/services", async (req, res) => {
  try {
    const { icon, title, description, display_order } = req.body;
    const [result] = await pool.query(
      "INSERT INTO services (icon, title, description, display_order) VALUES (?, ?, ?, ?)",
      [icon, title, description, display_order || 0],
    );
    res.json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create service" });
  }
});

app.put("/api/services/:id", async (req, res) => {
  try {
    const { icon, title, description, display_order } = req.body;
    await pool.query(
      "UPDATE services SET icon = ?, title = ?, description = ?, display_order = ? WHERE id = ?",
      [icon, title, description, display_order || 0, req.params.id],
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update service" });
  }
});

app.delete("/api/services/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM services WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

// Testimonials CRUD
app.get("/api/testimonials", async (req, res) => {
  try {
    const [testimonials] = await pool.query(
      "SELECT * FROM testimonials ORDER BY display_order",
    );
    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

app.post("/api/testimonials", async (req, res) => {
  try {
    const { author, role, text, display_order } = req.body;
    const [result] = await pool.query(
      "INSERT INTO testimonials (author, role, text, display_order) VALUES (?, ?, ?, ?)",
      [author, role, text, display_order || 0],
    );
    res.json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});

app.put("/api/testimonials/:id", async (req, res) => {
  try {
    const { author, role, text, display_order } = req.body;
    await pool.query(
      "UPDATE testimonials SET author = ?, role = ?, text = ?, display_order = ? WHERE id = ?",
      [author, role, text, display_order || 0, req.params.id],
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

app.delete("/api/testimonials/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM testimonials WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

// Industries CRUD
app.get("/api/industries", async (req, res) => {
  try {
    const [industries] = await pool.query(
      "SELECT * FROM industries ORDER BY display_order",
    );
    res.json(industries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch industries" });
  }
});

app.post("/api/industries", async (req, res) => {
  try {
    const { icon, title, description, display_order } = req.body;
    const [result] = await pool.query(
      "INSERT INTO industries (icon, title, description, display_order) VALUES (?, ?, ?, ?)",
      [icon, title, description, display_order || 0],
    );
    res.json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create industry" });
  }
});

app.put("/api/industries/:id", async (req, res) => {
  try {
    const { icon, title, description, display_order } = req.body;
    await pool.query(
      "UPDATE industries SET icon = ?, title = ?, description = ?, display_order = ? WHERE id = ?",
      [icon, title, description, display_order || 0, req.params.id],
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update industry" });
  }
});

app.delete("/api/industries/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM industries WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete industry" });
  }
});

// Hero Banner CRUD
app.get("/api/hero", async (req, res) => {
  try {
    const [hero] = await pool.query(
      "SELECT * FROM hero_banners WHERE is_active = 1 ORDER BY display_order LIMIT 1",
    );
    res.json(hero[0] || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch hero" });
  }
});

app.post("/api/hero", async (req, res) => {
  try {
    const {
      video_url,
      image_url,
      headline,
      subtitle,
      is_active,
      display_order,
    } = req.body;
    // Deactivate all other banners
    await pool.query("UPDATE hero_banners SET is_active = 0");
    const [result] = await pool.query(
      "INSERT INTO hero_banners (video_url, image_url, headline, subtitle, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?)",
      [
        video_url,
        image_url,
        headline,
        subtitle,
        is_active ? 1 : 0,
        display_order || 0,
      ],
    );
    res.json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create hero" });
  }
});

app.put("/api/hero/:id", async (req, res) => {
  try {
    const {
      video_url,
      image_url,
      headline,
      subtitle,
      is_active,
      display_order,
    } = req.body;
    if (is_active) {
      await pool.query("UPDATE hero_banners SET is_active = 0");
    }
    await pool.query(
      "UPDATE hero_banners SET video_url = ?, image_url = ?, headline = ?, subtitle = ?, is_active = ?, display_order = ? WHERE id = ?",
      [
        video_url,
        image_url,
        headline,
        subtitle,
        is_active ? 1 : 0,
        display_order || 0,
        req.params.id,
      ],
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update hero" });
  }
});

// About Content
app.get("/api/about", async (req, res) => {
  try {
    const [about] = await pool.query(
      "SELECT * FROM about_content WHERE id = 1",
    );
    res.json(about[0] || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch about content" });
  }
});

app.put("/api/about", async (req, res) => {
  try {
    const { title, description, image_url } = req.body;
    await pool.query(
      "UPDATE about_content SET title = ?, description = ?, image_url = ? WHERE id = 1",
      [title, description, image_url],
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update about content" });
  }
});

// Careers Content
app.get("/api/careers", async (req, res) => {
  try {
    const [careers] = await pool.query(
      "SELECT * FROM careers_content WHERE id = 1",
    );
    if (careers[0] && careers[0].benefits) {
      careers[0].benefits = JSON.parse(careers[0].benefits);
    }
    res.json(careers[0] || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch careers content" });
  }
});

app.put("/api/careers", async (req, res) => {
  try {
    const { title, description, image_url, benefits } = req.body;
    await pool.query(
      "UPDATE careers_content SET title = ?, description = ?, image_url = ?, benefits = ? WHERE id = 1",
      [title, description, image_url, JSON.stringify(benefits)],
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update careers content" });
  }
});

// Why Choose Us CRUD
app.get("/api/why-choose-us", async (req, res) => {
  try {
    const [items] = await pool.query(
      "SELECT * FROM why_choose_us ORDER BY display_order",
    );
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch why choose us items" });
  }
});

app.post("/api/why-choose-us", async (req, res) => {
  try {
    const { icon, title, description, display_order } = req.body;
    const [result] = await pool.query(
      "INSERT INTO why_choose_us (icon, title, description, display_order) VALUES (?, ?, ?, ?)",
      [icon, title, description, display_order || 0],
    );
    res.json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create why choose us item" });
  }
});

app.put("/api/why-choose-us/:id", async (req, res) => {
  try {
    const { icon, title, description, display_order } = req.body;
    await pool.query(
      "UPDATE why_choose_us SET icon = ?, title = ?, description = ?, display_order = ? WHERE id = ?",
      [icon, title, description, display_order || 0, req.params.id],
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update why choose us item" });
  }
});

app.delete("/api/why-choose-us/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM why_choose_us WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete why choose us item" });
  }
});

// File upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
  });
});

// Get all content (for preview)
app.get("/api/all-content", async (req, res) => {
  try {
    const [services] = await pool.query(
      "SELECT * FROM services ORDER BY display_order",
    );
    const [testimonials] = await pool.query(
      "SELECT * FROM testimonials ORDER BY display_order",
    );
    const [industries] = await pool.query(
      "SELECT * FROM industries ORDER BY display_order",
    );
    const [whyChooseUs] = await pool.query(
      "SELECT * FROM why_choose_us ORDER BY display_order",
    );
    const [hero] = await pool.query(
      "SELECT * FROM hero_banners WHERE is_active = 1 ORDER BY display_order LIMIT 1",
    );
    const [about] = await pool.query(
      "SELECT * FROM about_content WHERE id = 1",
    );
    const [careers] = await pool.query(
      "SELECT * FROM careers_content WHERE id = 1",
    );

    const content = {
      services,
      testimonials,
      industries,
      whyChooseUs,
      hero: hero[0] || {},
      about: about[0] || {},
      careers: careers[0] || {},
    };

    if (content.careers && content.careers.benefits) {
      content.careers.benefits = JSON.parse(content.careers.benefits);
    }

    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch all content" });
  }
});

// Start server
async function startServer() {
  try {
    await initDatabase();
    await seedDefaultData();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
