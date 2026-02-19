import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import {
  Shield,
  Eye,
  Bell,
  Lock,
  Users,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ArrowRight,
  Award,
  TrendingUp,
  Heart,
  Building,
  GraduationCap,
  Briefcase,
  Home,
  Factory,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Settings,
} from "lucide-react";
import AdminPortal from "./components/AdminPortal";
import Login from "./components/Login";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const services = [
    {
      icon: <Users />,
      title: "Manned Guarding",
      description:
        "Professional security guards providing 24/7 protection for your premises with rigorous training and background checks.",
    },
    {
      icon: <Eye />,
      title: "CCTV Installation & Monitoring",
      description:
        "State-of-the-art surveillance systems with real-time monitoring from our advanced control center.",
    },
    {
      icon: <Bell />,
      title: "Alarm Response",
      description:
        "Rapid response to alarm activations with our trained security personnel available around the clock.",
    },
    {
      icon: <Lock />,
      title: "Access Control Systems",
      description:
        "Advanced biometric and card-based access control systems to manage and restrict facility entry.",
    },
    {
      icon: <TrendingUp />,
      title: "Risk Assessment",
      description:
        "Comprehensive security audits and risk assessments to identify vulnerabilities and recommend solutions.",
    },
    {
      icon: <Award />,
      title: "Event Security",
      description:
        "Specialized security services for corporate events, conferences, and private functions.",
    },
  ];

  const industries = [
    {
      icon: <Building />,
      title: "Hotels",
      description:
        "Trained guards ensuring guest safety and property protection.",
    },
    {
      icon: <GraduationCap />,
      title: "Schools",
      description:
        "Safe learning environments with controlled access management.",
    },
    {
      icon: <Briefcase />,
      title: "Corporate",
      description: "Comprehensive security for offices and business premises.",
    },
    {
      icon: <Home />,
      title: "Estates",
      description: "Residential community security with patrol services.",
    },
    {
      icon: <Factory />,
      title: "Industrial",
      description: "Heavy-duty security for factories and warehouses.",
    },
  ];

  const whyChooseUs = [
    {
      icon: <Users />,
      title: "Highly Trained Personnel",
      description:
        "All our guards undergo rigorous training and continuous professional development.",
    },
    {
      icon: <Eye />,
      title: "24/7 Monitoring Center",
      description:
        "Our state-of-the-art control room operates round the clock for immediate response.",
    },
    {
      icon: <Clock />,
      title: "Rapid Response Teams",
      description:
        "Quick deployment units strategically positioned across service areas.",
    },
    {
      icon: <CheckCircle />,
      title: "Strict Vetting Process",
      description:
        "Comprehensive background checks ensuring trustworthy personnel.",
    },
    {
      icon: <Shield />,
      title: "Professional Uniforms",
      description:
        "Well-groomed, identifiable security personnel representing your brand.",
    },
    {
      icon: <Heart />,
      title: "Client-Focused Service",
      description:
        "Tailored security solutions meeting your specific requirements.",
    },
  ];

  const testimonials = [
    {
      text: "SecureGuard has been instrumental in maintaining the safety of our guests and property. Their professional team provides excellent service round the clock.",
      author: "James Mwangi",
      role: "Hotel Manager, Safari Lodge",
    },
    {
      text: "Since engaging SecureGuard, our campus security has significantly improved. Their trained guards and modern systems give us peace of mind.",
      author: "Dr. Sarah Chen",
      role: "Principal, International School",
    },
    {
      text: "The professionalism and reliability of SecureGuard's team has made them an invaluable partner in protecting our residential estate.",
      author: "Michael Ochieng",
      role: "Property Manager, Green Valley Estates",
    },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPortal onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <>
              {/* HEADER */}
              <header className="header">
                <div className="header-container">
                  <a href="#" className="logo">
                    <Shield size={32} color="#D4AF37" />
                    <span className="logo-text">
                      Secure<span>Guard</span>
                    </span>
                  </a>

                  <button className="mobile-menu-btn" onClick={toggleMenu}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                  </button>

                  <nav className={`nav ${isMenuOpen ? "active" : ""}`}>
                    <a
                      href="#home"
                      className="nav-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </a>
                    <a
                      href="#about"
                      className="nav-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About Us
                    </a>
                    <a
                      href="#services"
                      className="nav-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Services
                    </a>
                    <a
                      href="#industries"
                      className="nav-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Industries
                    </a>
                    <a
                      href="#contact"
                      className="nav-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Contact
                    </a>
                    <a href="#contact" className="btn-quote">
                      Request a Quote
                    </a>
                  </nav>
                </div>
              </header>

              {/* HERO SECTION */}
              <section id="home" className="hero">
                <div className="hero-content">
                  <h1 className="hero-title">
                    Professional Security Solutions You Can Trust
                  </h1>
                  <p className="hero-subtitle">
                    24/7 protection services for hotels, schools, corporate
                    offices, and residential estates across Kenya.
                  </p>
                  <div className="hero-buttons">
                    <a href="#contact" className="btn btn-primary">
                      Request a Quote
                    </a>
                    <a href="tel:+254700000000" className="btn btn-secondary">
                      Call Now
                    </a>
                  </div>
                  <div className="trust-indicators">
                    <div className="trust-item">
                      <CheckCircle size={18} />
                      <span>Licensed & Compliant</span>
                    </div>
                    <div className="trust-item">
                      <Clock size={18} />
                      <span>24/7 Response</span>
                    </div>
                    <div className="trust-item">
                      <Shield size={18} />
                      <span>Fully Insured</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* TRUST STRIP */}
              <section className="trust-strip">
                <div className="trust-strip-container">
                  <div className="trust-strip-item">
                    <CheckCircle />
                    <span>Licensed & Certified</span>
                  </div>
                  <div className="trust-strip-item">
                    <Eye />
                    <span>24/7 Control Room</span>
                  </div>
                  <div className="trust-strip-item">
                    <Clock />
                    <span>Rapid Response Units</span>
                  </div>
                  <div className="trust-strip-item">
                    <Users />
                    <span>Background-Checked Guards</span>
                  </div>
                </div>
              </section>

              {/* ABOUT SECTION */}
              <section id="about" className="about">
                <div className="about-container">
                  <div className="about-image">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"
                      alt="Security professionals"
                    />
                  </div>
                  <div className="about-content">
                    <h2>About SecureGuard</h2>
                    <p>
                      With over 15 years of experience in the security industry,
                      SecureGuard has established itself as a trusted partner
                      for businesses and property owners across Kenya. Our
                      commitment to excellence and professionalism sets us
                      apart.
                    </p>
                    <p>
                      We serve a diverse range of clients including hotels,
                      schools, corporate offices, residential estates, and
                      industrial facilities. Our team of highly trained security
                      professionals is dedicated to providing reliable
                      protection services tailored to your specific needs.
                    </p>
                    <div className="about-features">
                      <div className="about-feature">
                        <CheckCircle />
                        <span>15+ Years Experience</span>
                      </div>
                      <div className="about-feature">
                        <CheckCircle />
                        <span>500+ Guards</span>
                      </div>
                      <div className="about-feature">
                        <CheckCircle />
                        <span>200+ Clients</span>
                      </div>
                      <div className="about-feature">
                        <CheckCircle />
                        <span>24/7 Operations</span>
                      </div>
                    </div>
                    <a href="#contact" className="btn btn-outline">
                      Learn More
                    </a>
                  </div>
                </div>
              </section>

              {/* SERVICES SECTION */}
              <section id="services" className="services">
                <div className="services-container">
                  <h2 className="section-title">Our Services</h2>
                  <p className="section-subtitle">
                    Comprehensive security solutions tailored to protect your
                    business, property, and people.
                  </p>
                  <div className="services-grid">
                    {services.map((service, index) => (
                      <div className="service-card" key={index}>
                        <div className="service-icon">{service.icon}</div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <a href="#contact" className="service-link">
                          Learn More <ArrowRight size={16} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* INDUSTRIES SECTION */}
              <section id="industries" className="industries">
                <div className="industries-container">
                  <h2 className="section-title">Industries We Serve</h2>
                  <p className="section-subtitle">
                    Specialized security solutions tailored to the unique needs
                    of each industry.
                  </p>
                  <div className="industries-grid">
                    {industries.map((industry, index) => (
                      <div className="industry-card" key={index}>
                        <div className="industry-icon">{industry.icon}</div>
                        <h3>{industry.title}</h3>
                        <p>{industry.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* WHY CHOOSE US */}
              <section className="why-choose-us">
                <div className="why-choose-us-container">
                  <h2 className="section-title">Why Choose Us</h2>
                  <p className="section-subtitle">
                    Discover what sets SecureGuard apart from other security
                    companies.
                  </p>
                  <div className="why-grid">
                    {whyChooseUs.map((item, index) => (
                      <div className="why-item" key={index}>
                        <div className="why-icon">{item.icon}</div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* TESTIMONIALS */}
              <section className="testimonials">
                <div className="testimonials-container">
                  <h2 className="section-title">What Our Clients Say</h2>
                  <p className="section-subtitle">
                    Trusted by leading organizations across Kenya.
                  </p>
                  <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                      <div className="testimonial-card" key={index}>
                        <p className="testimonial-text">{testimonial.text}</p>
                        <div className="testimonial-author">
                          <div className="testimonial-avatar">
                            {testimonial.author.charAt(0)}
                          </div>
                          <div className="testimonial-info">
                            <h4>{testimonial.author}</h4>
                            <p>{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA SECTION */}
              <section className="cta">
                <div className="cta-container">
                  <h2>Need Professional Security Services?</h2>
                  <p>
                    Get a free security consultation and customized quote for
                    your needs.
                  </p>
                  <a href="#contact" className="btn btn-primary">
                    Request a Free Security Consultation
                  </a>
                </div>
              </section>

              {/* CAREERS SECTION */}
              <section className="careers">
                <div className="careers-container">
                  <div className="careers-content">
                    <h2>Join Our Team</h2>
                    <p>
                      SecureGuard is always looking for dedicated professionals
                      to join our team. If you're committed to excellence and
                      want a rewarding career in security, we'd like to hear
                      from you.
                    </p>
                    <ul className="careers-list">
                      <li>
                        <CheckCircle />
                        <span>Competitive salary and benefits</span>
                      </li>
                      <li>
                        <CheckCircle />
                        <span>Professional training and development</span>
                      </li>
                      <li>
                        <CheckCircle />
                        <span>Career growth opportunities</span>
                      </li>
                      <li>
                        <CheckCircle />
                        <span>Work with a reputable company</span>
                      </li>
                    </ul>
                    <a href="#contact" className="btn btn-primary">
                      Apply Now
                    </a>
                  </div>
                  <div className="careers-image">
                    <img
                      src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80"
                      alt="Security team"
                    />
                  </div>
                </div>
              </section>

              {/* CONTACT SECTION */}
              <section id="contact" className="contact">
                <div className="contact-container">
                  <div className="contact-info">
                    <h2>Get In Touch</h2>
                    <p>
                      Ready to secure your property? Contact us today for a free
                      consultation and customized security solution.
                    </p>
                    <div className="contact-details">
                      <div className="contact-item">
                        <div className="contact-item-icon">
                          <Phone />
                        </div>
                        <div className="contact-item-content">
                          <h4>Phone</h4>
                          <p>+254 700 000 000</p>
                        </div>
                      </div>
                      <div className="contact-item">
                        <div className="contact-item-icon">
                          <Mail />
                        </div>
                        <div className="contact-item-content">
                          <h4>Email</h4>
                          <p>info@secureguard.co.ke</p>
                        </div>
                      </div>
                      <div className="contact-item">
                        <div className="contact-item-icon">
                          <MapPin />
                        </div>
                        <div className="contact-item-content">
                          <h4>Office Location</h4>
                          <p>Nairobi, Kenya</p>
                        </div>
                      </div>
                    </div>
                    <div className="map-container">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510593.3227777778!2d36.682!3d-1.292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d1d7a1e5%3A0x3d5b3f3f3f3f3f3f!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1234567890"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Office Location"
                      ></iframe>
                    </div>
                  </div>
                  <div className="contact-form">
                    <h3>Send Us a Message</h3>
                    <form>
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Your Name" required />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Your Email" required />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          placeholder="Your Phone Number"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Service Interested In</label>
                        <select>
                          <option value="">Select a Service</option>
                          <option value="guarding">Manned Guarding</option>
                          <option value="cctv">
                            CCTV Installation & Monitoring
                          </option>
                          <option value="alarm">Alarm Response</option>
                          <option value="access">Access Control Systems</option>
                          <option value="risk">Risk Assessment</option>
                          <option value="event">Event Security</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Message</label>
                        <textarea
                          placeholder="Tell us about your security needs"
                          required
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Send Message{" "}
                        <Send size={18} style={{ marginLeft: "8px" }} />
                      </button>
                    </form>
                  </div>
                </div>
              </section>

              {/* FOOTER */}
              <footer className="footer">
                <div className="footer-container">
                  <div className="footer-about">
                    <a href="#" className="logo">
                      <Shield size={32} color="#D4AF37" />
                      <span className="logo-text">
                        Secure<span>Guard</span>
                      </span>
                    </a>
                    <p>
                      Professional security solutions for hotels, schools,
                      corporate offices, and residential estates across Kenya.
                      Your safety is our priority.
                    </p>
                    <div className="footer-social">
                      <a href="#" aria-label="Facebook">
                        <Facebook size={18} />
                      </a>
                      <a href="#" aria-label="Twitter">
                        <Twitter size={18} />
                      </a>
                      <a href="#" aria-label="LinkedIn">
                        <Linkedin size={18} />
                      </a>
                      <a href="#" aria-label="Instagram">
                        <Instagram size={18} />
                      </a>
                    </div>
                  </div>
                  <div className="footer-column">
                    <h4>Quick Links</h4>
                    <div className="footer-links">
                      <a href="#home">Home</a>
                      <a href="#about">About Us</a>
                      <a href="#services">Services</a>
                      <a href="#industries">Industries</a>
                      <a href="#contact">Contact</a>
                    </div>
                  </div>
                  <div className="footer-column">
                    <h4>Services</h4>
                    <div className="footer-links">
                      <a href="#services">Manned Guarding</a>
                      <a href="#services">CCTV Monitoring</a>
                      <a href="#services">Alarm Response</a>
                      <a href="#services">Access Control</a>
                      <a href="#services">Risk Assessment</a>
                    </div>
                  </div>
                  <div className="footer-column">
                    <h4>Contact Info</h4>
                    <div className="footer-links">
                      <a href="tel:+254700000000">+254 700 000 000</a>
                      <a href="mailto:info@secureguard.co.ke">
                        info@secureguard.co.ke
                      </a>
                      <a href="#">Nairobi, Kenya</a>
                      <a href="#">Mon - Sat: 8:00 AM - 6:00 PM</a>
                    </div>
                  </div>
                </div>
                <div className="footer-bottom">
                  <p>&copy; 2024 SecureGuard. All rights reserved.</p>
                  <div className="footer-bottom-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Licensing Info</a>
                    <Link
                      to="/admin"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      <Settings size={14} /> Admin
                    </Link>
                  </div>
                </div>
              </footer>

              {/* WHATSAPP FLOATING BUTTON */}
              <a
                href="https://wa.me/254700000000?text=Hi, I'm interested in your security services"
                className="whatsapp-float"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
