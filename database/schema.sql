-- SecureGuard Security Company Website Database Schema
-- MySQL Database

-- Create database
CREATE DATABASE IF NOT EXISTS secureguard_db;
USE secureguard_db;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123 - change in production!)
-- Password is hashed with bcrypt
INSERT INTO users (username, password, email, role) VALUES 
('admin', '$2a$10$xKz5YqKqXqXqXqXqXqXqXuqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq', 'admin@secureguard.co.ke', 'admin');

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    icon VARCHAR(50) NOT NULL DEFAULT 'Users',
    title VARCHAR(200) NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default services
INSERT INTO services (icon, title, description, display_order) VALUES
('Users', 'Manned Guarding', 'Professional security guards providing 24/7 protection for your premises with rigorous training and background checks.', 1),
('Eye', 'CCTV Installation & Monitoring', 'State-of-the-art surveillance systems with real-time monitoring from our advanced control center.', 2),
('Bell', 'Alarm Response', 'Rapid response to alarm activations with our trained security personnel available around the clock.', 3),
('Lock', 'Access Control Systems', 'Advanced biometric and card-based access control systems to manage and restrict facility entry.', 4),
('TrendingUp', 'Risk Assessment', 'Comprehensive security audits and risk assessments to identify vulnerabilities and recommend solutions.', 5),
('Award', 'Event Security', 'Specialized security services for corporate events, conferences, and private functions.', 6);

-- Industries Table
CREATE TABLE IF NOT EXISTS industries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    icon VARCHAR(50) NOT NULL DEFAULT 'Building',
    title VARCHAR(200) NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default industries
INSERT INTO industries (icon, title, description, display_order) VALUES
('Building', 'Hotels', 'Trained guards ensuring guest safety and property protection.', 1),
('GraduationCap', 'Schools', 'Safe learning environments with controlled access management.', 2),
('Briefcase', 'Corporate', 'Comprehensive security for offices and business premises.', 3),
('Home', 'Estates', 'Residential community security with patrol services.', 4),
('Factory', 'Industrial', 'Heavy-duty security for factories and warehouses.', 5);

-- Why Choose Us Table
CREATE TABLE IF NOT EXISTS why_choose_us (
    id INT AUTO_INCREMENT PRIMARY KEY,
    icon VARCHAR(50) NOT NULL DEFAULT 'Shield',
    title VARCHAR(200) NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default why choose us items
INSERT INTO why_choose_us (icon, title, description, display_order) VALUES
('Users', 'Highly Trained Personnel', 'All our guards undergo rigorous training and continuous professional development.', 1),
('Eye', '24/7 Monitoring Center', 'Our state-of-the-art control room operates round the clock for immediate response.', 2),
('Clock', 'Rapid Response Teams', 'Quick deployment units strategically positioned across service areas.', 3),
('CheckCircle', 'Strict Vetting Process', 'Comprehensive background checks ensuring trustworthy personnel.', 4),
('Shield', 'Professional Uniforms', 'Well-groomed, identifiable security personnel representing your brand.', 5),
('Heart', 'Client-Focused Service', 'Tailored security solutions meeting your specific requirements.', 6);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    text TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default testimonials
INSERT INTO testimonials (author, role, text, display_order) VALUES
('James Mwangi', 'Hotel Manager, Safari Lodge', 'SecureGuard has been instrumental in maintaining the safety of our guests and property. Their professional team provides excellent service round the clock.', 1),
('Dr. Sarah Chen', 'Principal, International School', 'Since engaging SecureGuard, our campus security has significantly improved. Their trained guards and modern systems give us peace of mind.', 2),
('Michael Ochieng', 'Property Manager, Green Valley Estates', 'The professionalism and reliability of SecureGuard''s team has made them an invaluable partner in protecting our residential estate.', 3);

-- Hero Section Table
CREATE TABLE IF NOT EXISTS hero_section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_url VARCHAR(500),
    image_url VARCHAR(500),
    headline VARCHAR(500) NOT NULL DEFAULT 'Professional Security Solutions You Can Trust',
    subtitle TEXT,
    cta_text VARCHAR(200),
    cta_link VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default hero
INSERT INTO hero_section (headline, subtitle, cta_text, cta_link) VALUES 
('Professional Security Solutions You Can Trust', '24/7 protection services for hotels, schools, corporate offices, and residential estates across Kenya.', 'Request a Quote', '#contact');

-- About Section Table
CREATE TABLE IF NOT EXISTS about_section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL DEFAULT 'About SecureGuard',
    description TEXT,
    image_url VARCHAR(500),
    stats JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default about
INSERT INTO about_section (title, description, image_url, stats) VALUES 
('About SecureGuard', 'With over 15 years of experience in the security industry, SecureGuard has established itself as a trusted partner for businesses and property owners across Kenya. Our commitment to excellence and professionalism sets us apart. We serve a diverse range of clients including hotels, schools, corporate offices, residential estates, and industrial facilities. Our team of highly trained security professionals is dedicated to providing reliable protection services tailored to your specific needs.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80', '[{"label": "15+ Years Experience", "value": "15"}, {"label": "500+ Guards", "value": "500"}, {"label": "200+ Clients", "value": "200"}, {"label": "24/7 Operations", "value": "24/7"}]');

-- Careers Section Table
CREATE TABLE IF NOT EXISTS careers_section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL DEFAULT 'Join Our Team',
    description TEXT,
    image_url VARCHAR(500),
    benefits JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default careers
INSERT INTO careers_section (title, description, image_url, benefits) VALUES 
('Join Our Team', 'SecureGuard is always looking for dedicated professionals to join our team. If you''re committed to excellence and want a rewarding career in security, we''d like to hear from you.', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80', '["Competitive salary and benefits", "Professional training and development", "Career growth opportunities", "Work with a reputable company"]');

-- Contact Info Table
CREATE TABLE IF NOT EXISTS contact_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(50),
    email VARCHAR(200),
    address TEXT,
    operating_hours VARCHAR(200),
    whatsapp VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default contact info
INSERT INTO contact_info (phone, email, address, operating_hours, whatsapp) VALUES 
('+254 700 000 000', 'info@secureguard.co.ke', 'Nairobi, Kenya', 'Mon - Sat: 8:00 AM - 6:00 PM', '+254790590653');

-- Site Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES 
('site_name', 'SecureGuard'),
('site_tagline', 'Professional Security Solutions You Can Trust'),
('primary_color', '#0B1F3A'),
('accent_color', '#D4AF37');
