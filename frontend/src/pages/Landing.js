import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  Truck,
  BellRing,
  ShieldCheck,
  FileSpreadsheet,
  Check,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const Landing = () => {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does real-time stock adjustment work in BharatStock?',
      a: 'Stock increments and deductions are processed via RESTful APIs with optimistic updates. Every single intake or outbound dispatch logs an immutable audit trail entry tracking timestamp, previous quantity, updated quantity, and the operator in charge.',
    },
    {
      q: 'Can I connect my own MongoDB database to this project?',
      a: 'Yes. The Express.js backend connects directly to your MongoDB URI (local mongod or MongoDB Atlas) configured in backend/.env. If MongoDB is not reachable, the system uses an integrated client-side sync engine so your operations never freeze.',
    },
    {
      q: 'Does it support role-based user management for Indian warehouses?',
      a: 'Yes. Using secure JWT tokens, the platform separates Administrator (Depot Head with complete editing, deletion, and supplier controls) from Warehouse Floor Staff (stock adjustments, dispatch entries, and cycle counting).',
    },
    {
      q: 'Can I export stock reports and vendor sheets to CSV?',
      a: 'Yes. With a single click from the Products and Audit log views, you can download clean, formatted CSV spreadsheets ready for accounting, tallying, and management review.',
    },
  ];

  return (
    <div className="landing-page">
      {/* Top Header */}
      <header className="landing-header">
        <nav className="landing-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="brand-icon">
              <Package size={22} color="#FFFFFF" strokeWidth={2.2} />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'Outfit, sans-serif' }}>
                BharatStock
              </span>
              <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '9999px', fontWeight: 700 }}>
                India Edition
              </span>
            </div>
          </div>

          <div className="landing-nav-links">
            <a href="#features">Capabilities</a>
            <a href="#workflow">Operations Workflow</a>
            <a href="#pricing">Commercials</a>
            <a href="#faq">FAQ</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="landing-nav-links" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {user ? (
                <>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--text-heading)',
                      padding: '0.35rem 0.75rem',
                      background: 'rgba(6, 182, 212, 0.08)',
                      borderRadius: '9999px',
                      border: '1px solid rgba(6, 182, 212, 0.25)',
                    }}
                  >
                    👤 {user.name} ({user.role === 'admin' ? 'Owner' : 'Staff'})
                  </span>
                  <Link
                    to="/dashboard"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span>Dashboard</span>
                    <ArrowRight size={14} />
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary btn-sm">
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span>Register Facility</span>
                    <ArrowRight size={14} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="landing-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        <div className={`landing-mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>Capabilities</a>
          <a href="#workflow" onClick={() => setMobileMenuOpen(false)}>Operations Workflow</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Commercials</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                Open Dashboard ({user.name.split(' ')[0]})
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" style={{ padding: '6rem 2rem 4rem' }}>
        <div className="hero-pill" style={{ background: 'var(--primary-light)', borderColor: 'var(--border-cyan)', color: 'var(--primary)' }}>
          <span>🇮🇳</span> Designed for Indian Warehouses, Logistics Hubs & Supply Chains
        </div>

        <h1 className="hero-title">
          Intelligent Inventory Control for Modern Indian <span>Enterprises</span>.
        </h1>

        <p className="hero-subtitle">
          Eliminate manual registers and disconnected spreadsheets. Track SKU movements in Indian Rupees (₹), automate low-stock reorder alerts, manage verified suppliers, and maintain complete audit compliance across your distribution network.
        </p>

        <div className="hero-cta-group">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="btn btn-primary btn-lg"
                style={{ minWidth: '220px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Continue to Dashboard ({user.name.split(' ')[0]})</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/products" className="btn btn-secondary btn-lg">
                View Stock Catalog
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-primary btn-lg"
                style={{ minWidth: '220px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Register New Facility
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Metrics Counter Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 4.5rem', padding: '0 2rem' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>99.8%</div>
            <div style={{ fontWeight: 600, color: 'var(--text-heading)', marginTop: '0.25rem' }}>Physical Inventory Accuracy</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Real-time cycle count sync</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'Outfit' }}>4.8x</div>
            <div style={{ fontWeight: 600, color: 'var(--text-heading)', marginTop: '0.25rem' }}>Faster Dispatch Turnaround</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>From order intake to gate pass</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'Outfit' }}>₹4.5 Cr+</div>
            <div style={{ fontWeight: 600, color: 'var(--text-heading)', marginTop: '0.25rem' }}>Inventory Capital Managed</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Across active distribution depots</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--warning)', fontFamily: 'Outfit' }}>250+</div>
            <div style={{ fontWeight: 600, color: 'var(--text-heading)', marginTop: '0.25rem' }}>Active Warehouse Hubs</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Bhiwandi, Peenya, Okhla, Chakan</div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="features-section">
        <div className="section-header">
          <div className="section-tag">Enterprise Architecture</div>
          <h2 className="section-title">Built for High-Throughput Warehouse Operations</h2>
          <p className="section-desc">
            A comprehensive, human-centric management platform designed for warehouse managers, inventory controllers, and logistics heads.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box">
              <Package size={26} color="var(--primary)" />
            </div>
            <h3>Complete SKU Lifecycle (CRUD)</h3>
            <p>
              Instantly catalogue products with unique SKU codes, category tags, supplier affiliations, and unit pricing in Indian Rupees (₹).
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <FolderTree size={26} color="var(--primary)" />
            </div>
            <h3>Structured Taxonomy & Categories</h3>
            <p>
              Classify items logically from Electrical and Safety workwear to Packaging and Logistics hardware with live SKU density counts.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <Truck size={26} color="var(--primary)" />
            </div>
            <h3>Vendor & Supplier Directory</h3>
            <p>
              Maintain verified supplier profiles with GST numbers, contact persons, direct calling, and email links for seamless purchase reorders.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <BellRing size={26} color="var(--warning)" />
            </div>
            <h3>Low Stock Reorder Alerts</h3>
            <p>
              Proactive visual indicators highlight items dipping below the safety threshold (≤ 10 units), preventing critical stockouts before they affect dispatch.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <ShieldCheck size={26} color="var(--primary)" />
            </div>
            <h3>JWT Multi-Tier Role Access</h3>
            <p>
              Granular permissions separating Administrators (authorized for pricing revisions and item deletions) from Floor Staff (authorized for stock counting).
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <FileSpreadsheet size={26} color="var(--primary)" />
            </div>
            <h3>Audit Trails & CSV Reporting</h3>
            <p>
              Full chronological movement log recording who modified what, previous stock count, and reason. Export clean CSVs for reconciliation.
            </p>
          </div>
        </div>
      </section>

      {/* Operations Workflow */}
      <section id="workflow" className="workflow-section">
        <div className="section-header">
          <div className="section-tag">Standard Operating Procedure</div>
          <h2 className="section-title">How Inventory Moves Through BharatStock</h2>
          <p className="section-desc">
            Designed to match actual physical warehouse workflows without unnecessary friction.
          </p>
        </div>

        <div className="workflow-steps-grid">
          <div className="workflow-step-card">
            <div className="workflow-step-num">01</div>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Consignment Intake</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Receive freight against supplier Purchase Orders. Verify item counts, register new SKUs, and record batch quantities.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="workflow-step-num">02</div>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Categorization & Bin Allocation</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Assign items to their respective warehouse categories and associate designated supplier points of contact.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="workflow-step-num">03</div>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Real-Time Dispatch Adjustments</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              As orders are picked and packed, decrement stock with a single click. Every adjustment generates an immutable audit record.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="workflow-step-num">04</div>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Cycle Counts & Reorders</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Review low-stock alerts, trigger supplier replenishments (+10 quick restocks), and export audit sheets for management.
            </p>
          </div>
        </div>
      </section>

      {/* Commercial Plans in INR */}
      <section id="pricing" style={{ maxWidth: '1200px', margin: '5rem auto', padding: '0 2rem' }}>
        <div className="section-header">
          <div className="section-tag">Commercial Pricing</div>
          <h2 className="section-title">Transparent Plans in Indian Rupees (₹)</h2>
          <p className="section-desc">
            Affordable, scalable software for small MSME storerooms up to multi-state 3PL warehousing companies.
          </p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>MSME Starter</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>For single depot storerooms & retail hubs</p>
            <div className="pricing-price">₹0 <span>/ month</span></div>

            <ul className="pricing-features">
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Up to 500 Active SKUs</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Complete CRUD Catalog</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Low Stock Threshold Alerts</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> CSV Data Exports</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Single Administrator Account</li>
            </ul>

            <Link to="/register" className="btn btn-secondary" style={{ width: '100%' }}>
              Get Started Free
            </Link>
          </div>

          <div className="pricing-card featured" style={{ borderColor: 'var(--primary)' }}>
            <div className="pricing-badge" style={{ background: 'var(--primary)' }}>Most Recommended</div>
            <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>Regional Logistics Hub</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>For active warehouses & distribution centers</p>
            <div className="pricing-price">₹2,499 <span>/ month</span></div>

            <ul className="pricing-features">
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Unlimited SKU Cataloging</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Unlimited Category Classification</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Multi-Tier Role Access (Admin & Staff)</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Immutable Stock Movement Audit Trail</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Direct Supplier Calling & Email Integration</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Dedicated Phone & WhatsApp Support</li>
            </ul>

            <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
              <span>Launch Full Workspace</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="pricing-card">
            <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>Multi-State Enterprise</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>For national 3PL and multi-depot networks</p>
            <div className="pricing-price">₹7,999 <span>/ month</span></div>

            <ul className="pricing-features">
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Multi-Location Warehouse Hubs</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Dedicated MongoDB Cluster Pairing</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Custom ERP & Tally Connector Support</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> 99.95% Guaranteed SLA Uptime</li>
              <li><Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> Dedicated Account Executive</li>
            </ul>

            <Link to="/register" className="btn btn-secondary" style={{ width: '100%' }}>
              Contact Enterprise Desk
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" style={{ maxWidth: '860px', margin: '4rem auto 6rem', padding: '0 2rem' }}>
        <div className="section-header">
          <div className="section-tag">Frequently Asked Questions</div>
          <h2 className="section-title">Common Queries Answered</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text-heading)',
                }}
              >
                <span>{faq.q}</span>
                <span style={{ fontSize: '1.25rem', transform: activeFaq === idx ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--primary)' }}>
                  +
                </span>
              </button>
              {activeFaq === idx && (
                <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="brand-icon" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={18} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Outfit' }}>BharatStock OS</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '320px', lineHeight: 1.6 }}>
              Enterprise warehouse inventory management platform engineered for end-to-end stock visibility, audit traceability, and supplier operations.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className="badge badge-neutral">Node.js</span>
              <span className="badge badge-neutral">Express.js</span>
              <span className="badge badge-neutral">React</span>
              <span className="badge badge-neutral">MongoDB</span>
              <span className="badge badge-neutral">JWT Security</span>
            </div>
          </div>

          <div>
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Operations</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Link to="/dashboard">Operations Dashboard</Link>
              <Link to="/products">Products & Stock</Link>
              <Link to="/categories">Categories Catalog</Link>
              <Link to="/suppliers">Suppliers Directory</Link>
              <Link to="/records">Stock Movement Records</Link>
            </div>
          </div>

          <div>
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Facility Access</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Link to="/login">Sign In (Admin / Floor)</Link>
              <Link to="/register">Register Facility</Link>
              <a href="#features">Capabilities</a>
              <a href="#pricing">Commercials</a>
            </div>
          </div>

          <div>
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Technical Stack</h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Full-stack architecture featuring Express RESTful services, MongoDB persistence with Mongoose ODM, JWT authentication, and responsive modern interface.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <Link to={user ? "/dashboard" : "/login"} className="btn btn-primary btn-sm" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                {user ? 'Enter Dashboard →' : 'Sign In to Operations →'}
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 BharatStock Systems. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>GST Ready</span>
            <span>REST API Verified</span>
            <span>MongoDB Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
