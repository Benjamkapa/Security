const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// JWT Secret - change this in production!
const JWT_SECRET = "secureguard-secret-key-change-in-production";

const app = express();
const PORT = 3001;

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

// Initialize SQLite Database
const db = new Database(path.join(__dirname, "database.sqlite"));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS industries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS hero_banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_url TEXT,
    image_url TEXT,
    headline TEXT,
    subtitle TEXT,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS about_content (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    title TEXT,
    description TEXT,
    image_url TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS why_choose_us (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS careers_content (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    title TEXT,
    description TEXT,
    image_url TEXT,
    benefits TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
 username VARCHAR(100) NOT NULL UNIQUE ,
 password VARCHAR(255) NOT NULL ,
 email VARCHAR(255),
 role VARCHAR(50) DEFAULT 'admin',
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP 
);
`);

// Seed default data if tables are empty
const seedDefaultData = () => {
  const servicesCount = db
    .prepare("SELECT COUNT(*) as count FROM services")
    .get();
  if (servicesCount.count === 0) {
    const insertService = db.prepare(
      "INSERT INTO services (icon, title, description, display_order) VALUES (?, ?, ?, ?)",
    );
    insertService.run(
      "Users",
      "Manned Guarding",
      "Professional security guards providing 24/7 protection for your premises with rigorous training and background checks.",
      1,
    );
    insertService.run(
      "Eye",
      "CCTV Installation & Monitoring",
      "State-of-the-art surveillance systems with real-time monitoring from our advanced control center.",
      2,
    );
    insertService.run(
      "Bell",
      "Alarm Response",
      "Rapid response to alarm activations with our trained security personnel available around the clock.",
      3,
    );
    insertService.run(
      "Lock",
      "Access Control Systems",
      "Advanced biometric and card-based access control systems to manage and restrict facility entry.",
      4,
    );
    insertService.run(
      "TrendingUp",
      "Risk Assessment",
      "Comprehensive security audits and risk assessments to identify vulnerabilities and recommend solutions.",
      5,
    );
    insertService.run(
      "Award",
      "Event Security",
      "Specialized security services for corporate events, conferences, and private functions.",
      6,
    );
  }

  const testimonialsCount = db
    .prepare("SELECT COUNT(*) as count FROM testimonials")
    .get();
  if (testimonialsCount.count === 0) {
    const insertTestimonial = db.prepare(
      "INSERT INTO testimonials (author, role, text, display_order) VALUES (?, ?, ?, ?)",
    );
    insertTestimonial.run(
      "James Mwangi",
      "Hotel Manager, Safari Lodge",
      "SecureGuard has been instrumental in maintaining the safety of our guests and property. Their professional team provides excellent service round the clock.",
      1,
    );
    insertTestimonial.run(
      "Dr. Sarah Chen",
      "Principal, International School",
      "Since engaging SecureGuard, our campus security has significantly improved. Their trained guards and modern systems give us peace of mind.",
      2,
    );
    insertTestimonial.run(
      "Michael Ochieng",
      "Property Manager, Green Valley Estates",
      "The professionalism and reliability of SecureGuard's team has made them an invaluable partner in protecting our residential estate.",
      3,
    );
  }

  const industriesCount = db
    .prepare("SELECT COUNT(*) as count FROM industries")
    .get();
  if (industriesCount.count === 0) {
    const insertIndustry = db.prepare(
      "INSERT INTO industries (icon, title, description, display_order) VALUES (?, ?, ?, ?)",
    );
    insertIndustry.run(
      "Building",
      "Hotels",
      "Trained guards ensuring guest safety and property protection.",
      1,
    );
    insertIndustry.run(
      "GraduationCap",
      "Schools",
      "Safe learning environments with controlled access management.",
      2,
    );
    insertIndustry.run(
      "Briefcase",
      "Corporate",
      "Comprehensive security for offices and business premises.",
      3,
    );
    insertIndustry.run(
      "Home",
      "Estates",
      "Residential community security with patrol services.",
      4,
    );
    insertIndustry.run(
      "Factory",
      "Industrial",
      "Heavy-duty security for factories and warehouses.",
      5,
    );
  }

  const whyChooseUsCount = db
    .prepare("SELECT COUNT(*) as count FROM why_choose_us")
    .get();
  if (whyChooseUsCount.count === 0) {
    const insertWhy = db.prepare(
      "INSERT INTO why_choose_us (icon, title, description, display_order) VALUES (?, ?, ?, ?)",
    );
    insertWhy.run(
      "Users",
      "Highly Trained Personnel",
      "All our guards undergo rigorous training and continuous professional development.",
      1,
    );
    insertWhy.run(
      "Eye",
      "24/7 Monitoring Center",
      "Our state-of-the-art control room operates round the clock for immediate response.",
      2,
    );
    insertWhy.run(
      "Clock",
      "Rapid Response Teams",
      "Quick deployment units strategically positioned across service areas.",
      3,
    );
    insertWhy.run(
      "CheckCircle",
      "Strict Vetting Process",
      "Comprehensive background checks ensuring trustworthy personnel.",
      4,
    );
    insertWhy.run(
      "Shield",
      "Professional Uniforms",
      "Well-groomed, identifiable security personnel representing your brand.",
      5,
    );
    insertWhy.run(
      "Heart",
      "Client-Focused Service",
      "Tailored security solutions meeting your specific requirements.",
      6,
    );
  }

  const heroCount = db
    .prepare("SELECT COUNT(*) as count FROM hero_banners")
    .get();
  if (heroCount.count === 0) {
    const insertHero = db.prepare(
      "INSERT INTO hero_banners (video_url, image_url, headline, subtitle, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?)",
    );
    insertHero.run(
      "",
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1920&q=80",
      "Professional Security Solutions You Can Trust",
      "24/7 protection services for hotels, schools, corporate offices, and residential estates across Kenya.",
      1,
      1,
    );
  }

  const aboutCount = db
    .prepare("SELECT COUNT(*) as count FROM about_content")
    .get();
  if (aboutCount.count === 0) {
    const insertAbout = db.prepare(
      "INSERT INTO about_content (title, description, image_url) VALUES (?, ?, ?)",
    );
    insertAbout.run(
      "About SecureGuard",
      "With over 15 years of experience in the security industry, SecureGuard has established itself as a trusted partner for businesses and property owners across Kenya. Our commitment to excellence and professionalism sets us apart.",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
    );
  }

  const careersCount = db
    .prepare("SELECT COUNT(*) as count FROM careers_content")
    .get();
  if (careersCount.count === 0) {
    const insertCareers = db.prepare(
      "INSERT INTO careers_content (title, description, image_url, benefits) VALUES (?, ?, ?, ?)",
    );
    insertCareers.run(
      "Join Our Team",
      "SecureGuard is always looking for dedicated professionals to join our team. If you're committed to excellence and want a rewarding career in security, we'd like to hear from you.",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80",
      JSON.stringify([
        "Competitive salary and benefits",
        "Professional training and development",
        "Career growth opportunities",
        "Work with a reputable company",
      ]),
    );
  }

  // Create default admin user if not exists
  const usersCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
  if (usersCount.count === 0) {
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    db.prepare(
      "INSERT INTO users (username ,password ,email ,role) VALUES (? ,? ,? ,?)",
    ).run("admin", hashedPassword, "admin@secureguard.co .ke", "admin");
    console.log(
      "Default admin user created - username: admin password :admin123",
    );
  }
};

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

// Auth Routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }
    const user = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username);
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

seedDefaultData();

// ==================== API ROUTES ====================

// Services CRUD
app.get("/api/services", (req, res) => {
  const services = db
    .prepare("SELECT * FROM services ORDER BY display_order")
    .all();
  res.json(services);
});

app.post("/api/services", (req, res) => {
  const { icon, title, description, display_order } = req.body;
  const result = db
    .prepare(
      "INSERT INTO services (icon, title, description, display_order) VALUES (?, ?, ?, ?)",
    )
    .run(icon, title, description, display_order || 0);
  res.json({ id: result.lastInsertRowid });
});

app.put("/api/services/:id", (req, res) => {
  const { icon, title, description, display_order } = req.body;
  db.prepare(
    "UPDATE services SET icon = ?, title = ?, description = ?, display_order = ? WHERE id = ?",
  ).run(icon, title, description, display_order || 0, req.params.id);
  res.json({ success: true });
});

app.delete("/api/services/:id", (req, res) => {
  db.prepare("DELETE FROM services WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Testimonials CRUD
app.get("/api/testimonials", (req, res) => {
  const testimonials = db
    .prepare("SELECT * FROM testimonials ORDER BY display_order")
    .all();
  res.json(testimonials);
});

app.post("/api/testimonials", (req, res) => {
  const { author, role, text, display_order } = req.body;
  const result = db
    .prepare(
      "INSERT INTO testimonials (author, role, text, display_order) VALUES (?, ?, ?, ?)",
    )
    .run(author, role, text, display_order || 0);
  res.json({ id: result.lastInsertRowid });
});

app.put("/api/testimonials/:id", (req, res) => {
  const { author, role, text, display_order } = req.body;
  db.prepare(
    "UPDATE testimonials SET author = ?, role = ?, text = ?, display_order = ? WHERE id = ?",
  ).run(author, role, text, display_order || 0, req.params.id);
  res.json({ success: true });
});

app.delete("/api/testimonials/:id", (req, res) => {
  db.prepare("DELETE FROM testimonials WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Industries CRUD
app.get("/api/industries", (req, res) => {
  const industries = db
    .prepare("SELECT * FROM industries ORDER BY display_order")
    .all();
  res.json(industries);
});

app.post("/api/industries", (req, res) => {
  const { icon, title, description, display_order } = req.body;
  const result = db
    .prepare(
      "INSERT INTO industries (icon, title, description, display_order) VALUES (?, ?, ?, ?)",
    )
    .run(icon, title, description, display_order || 0);
  res.json({ id: result.lastInsertRowid });
});

app.put("/api/industries/:id", (req, res) => {
  const { icon, title, description, display_order } = req.body;
  db.prepare(
    "UPDATE industries SET icon = ?, title = ?, description = ?, display_order = ? WHERE id = ?",
  ).run(icon, title, description, display_order || 0, req.params.id);
  res.json({ success: true });
});

app.delete("/api/industries/:id", (req, res) => {
  db.prepare("DELETE FROM industries WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Hero Banner CRUD
app.get("/api/hero", (req, res) => {
  const hero = db
    .prepare(
      "SELECT * FROM hero_banners WHERE is_active = 1 ORDER BY display_order LIMIT 1",
    )
    .get();
  res.json(hero || {});
});

app.post("/api/hero", (req, res) => {
  const { video_url, image_url, headline, subtitle, is_active, display_order } =
    req.body;
  // Deactivate all other banners
  db.prepare("UPDATE hero_banners SET is_active = 0").run();
  const result = db
    .prepare(
      "INSERT INTO hero_banners (video_url, image_url, headline, subtitle, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(
      video_url,
      image_url,
      headline,
      subtitle,
      is_active ? 1 : 0,
      display_order || 0,
    );
  res.json({ id: result.lastInsertRowid });
});

app.put("/api/hero/:id", (req, res) => {
  const { video_url, image_url, headline, subtitle, is_active, display_order } =
    req.body;
  if (is_active) {
    db.prepare("UPDATE hero_banners SET is_active = 0").run();
  }
  db.prepare(
    "UPDATE hero_banners SET video_url = ?, image_url = ?, headline = ?, subtitle = ?, is_active = ?, display_order = ? WHERE id = ?",
  ).run(
    video_url,
    image_url,
    headline,
    subtitle,
    is_active ? 1 : 0,
    display_order || 0,
    req.params.id,
  );
  res.json({ success: true });
});

// About Content
app.get("/api/about", (req, res) => {
  const about = db.prepare("SELECT * FROM about_content WHERE id = 1").get();
  res.json(about || {});
});

app.put("/api/about", (req, res) => {
  const { title, description, image_url } = req.body;
  db.prepare(
    "UPDATE about_content SET title = ?, description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
  ).run(title, description, image_url);
  res.json({ success: true });
});

// Careers Content
app.get("/api/careers", (req, res) => {
  const careers = db
    .prepare("SELECT * FROM careers_content WHERE id = 1")
    .get();
  if (careers && careers.benefits) {
    careers.benefits = JSON.parse(careers.benefits);
  }
  res.json(careers || {});
});

app.put("/api/careers", (req, res) => {
  const { title, description, image_url, benefits } = req.body;
  db.prepare(
    "UPDATE careers_content SET title = ?, description = ?, image_url = ?, benefits = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
  ).run(title, description, image_url, JSON.stringify(benefits));
  res.json({ success: true });
});

// Why Choose Us CRUD
app.get("/api/why-choose-us", (req, res) => {
  const items = db
    .prepare("SELECT * FROM why_choose_us ORDER BY display_order")
    .all();
  res.json(items);
});

app.post("/api/why-choose-us", (req, res) => {
  const { icon, title, description, display_order } = req.body;
  const result = db
    .prepare(
      "INSERT INTO why_choose_us (icon, title, description, display_order) VALUES (?, ?, ?, ?)",
    )
    .run(icon, title, description, display_order || 0);
  res.json({ id: result.lastInsertRowid });
});

app.put("/api/why-choose-us/:id", (req, res) => {
  const { icon, title, description, display_order } = req.body;
  db.prepare(
    "UPDATE why_choose_us SET icon = ?, title = ?, description = ?, display_order = ? WHERE id = ?",
  ).run(icon, title, description, display_order || 0, req.params.id);
  res.json({ success: true });
});

app.delete("/api/why-choose-us/:id", (req, res) => {
  db.prepare("DELETE FROM why_choose_us WHERE id = ?").run(req.params.id);
  res.json({ success: true });
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
app.get("/api/all-content", (req, res) => {
  const content = {
    services: db.prepare("SELECT * FROM services ORDER BY display_order").all(),
    testimonials: db
      .prepare("SELECT * FROM testimonials ORDER BY display_order")
      .all(),
    industries: db
      .prepare("SELECT * FROM industries ORDER BY display_order")
      .all(),
    whyChooseUs: db
      .prepare("SELECT * FROM why_choose_us ORDER BY display_order")
      .all(),
    hero: db
      .prepare(
        "SELECT * FROM hero_banners WHERE is_active = 1 ORDER BY display_order LIMIT 1",
      )
      .get(),
    about: db.prepare("SELECT * FROM about_content WHERE id = 1").get(),
    careers: db.prepare("SELECT * FROM careers_content WHERE id = 1").get(),
  };
  if (content.careers && content.careers.benefits) {
    content.careers.benefits = JSON.parse(content.careers.benefits);
  }
  res.json(content);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
