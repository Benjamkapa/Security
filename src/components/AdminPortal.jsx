import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, 
  Eye, 
  Bell, 
  Lock, 
  Users, 
  Clock, 
  CheckCircle,
  Building, 
  GraduationCap, 
  Briefcase, 
  Home, 
  Factory,
  Heart, 
  Award, 
  TrendingUp,
  Plus, 
  X, 
  Save,
  EyeOff
} from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

const iconOptions = [
  { value: 'Users', label: 'Users' },
  { value: 'Eye', label: 'Eye' },
  { value: 'Bell', label: 'Bell' },
  { value: 'Lock', label: 'Lock' },
  { value: 'TrendingUp', label: 'TrendingUp' },
  { value: 'Award', label: 'Award' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Shield', label: 'Shield' },
  { value: 'CheckCircle', label: 'CheckCircle' },
  { value: 'Clock', label: 'Clock' },
  { value: 'Building', label: 'Building' },
  { value: 'GraduationCap', label: 'GraduationCap' },
  { value: 'Briefcase', label: 'Briefcase' },
  { value: 'Home', label: 'Home' },
  { value: 'Factory', label: 'Factory' }
];

function AdminPortal() {
  const [activeTab, setActiveTab] = useState('services');
  const [previewMode, setPreviewMode] = useState(false);
  const [data, setData] = useState({
    services: [],
    testimonials: [],
    industries: [],
    whyChooseUs: [],
    hero: {},
    about: {},
    careers: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [heroForm, setHeroForm] = useState({});
  const [aboutForm, setAboutForm] = useState({});
  const [careersForm, setCareersForm] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/all-content`);
      setData(response.data);
      setHeroForm(response.data.hero || {});
      setAboutForm(response.data.about || {});
      setCareersForm(response.data.careers || {});
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Hero handlers
  async function handleSaveHero(e) {
    e.preventDefault();
    try {
      setSaving(true);
      if (heroForm.id) {
        await axios.put(`${API_BASE}/hero/${heroForm.id}`, heroForm);
      } else {
        await axios.post(`${API_BASE}/hero`, heroForm);
      }
      await fetchAllData();
      alert('Hero saved successfully!');
    } catch (error) {
      console.error('Error saving hero:', error);
      alert('Failed to save hero');
    } finally {
      setSaving(false);
    }
  }

  // About handlers
  async function handleSaveAbout(e) {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put(`${API_BASE}/about`, aboutForm);
      await fetchAllData();
      alert('About section saved successfully!');
    } catch (error) {
      console.error('Error saving about:', error);
      alert('Failed to save about');
    } finally {
      setSaving(false);
    }
  }

  // Careers handlers
  async function handleSaveCareers(e) {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put(`${API_BASE}/careers`, careersForm);
      await fetchAllData();
      alert('Careers section saved successfully!');
    } catch (error) {
      console.error('Error saving careers:', error);
      alert('Failed to save careers');
    } finally {
      setSaving(false);
    }
  }

  // Services handlers
  async function addService() {
    const newService = {
      icon: 'Users',
      title: 'New Service',
      description: 'Service description',
      display_order: data.services.length + 1
    };
    try {
      setSaving(true);
      await axios.post(`${API_BASE}/services`, newService);
      await fetchAllData();
      alert('Service added successfully!');
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service');
    } finally {
      setSaving(false);
    }
  }

  async function updateService(id, field, value) {
    const service = data.services.find(s => s.id === id);
    if (!service) return;
    
    const updated = { ...service, [field]: value };
    try {
      await axios.put(`${API_BASE}/services/${id}`, updated);
      await fetchAllData();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  }

  async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      setSaving(true);
      await axios.delete(`${API_BASE}/services/${id}`);
      await fetchAllData();
      alert('Service deleted successfully!');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    } finally {
      setSaving(false);
    }
  }

  // Testimonials handlers
  async function addTestimonial() {
    const newTestimonial = {
      author: 'New Client',
      role: 'Job Title',
      text: 'New testimonial text',
      display_order: data.testimonials.length + 1
    };
    try {
      setSaving(true);
      await axios.post(`${API_BASE}/testimonials`, newTestimonial);
      await fetchAllData();
      alert('Testimonial added successfully!');
    } catch (error) {
      console.error('Error adding testimonial:', error);
      alert('Failed to add testimonial');
    } finally {
      setSaving(false);
    }
  }

  async function updateTestimonial(id, field, value) {
    const testimonial = data.testimonials.find(t => t.id === id);
    if (!testimonial) return;
    
    const updated = { ...testimonial, [field]: value };
    try {
      await axios.put(`${API_BASE}/testimonials/${id}`, updated);
      await fetchAllData();
    } catch (error) {
      console.error('Error updating testimonial:', error);
    }
  }

  async function deleteTestimonial(id) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      setSaving(true);
      await axios.delete(`${API_BASE}/testimonials/${id}`);
      await fetchAllData();
      alert('Testimonial deleted successfully!');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    } finally {
      setSaving(false);
    }
  }

  // Industries handlers
  async function addIndustry() {
    const newIndustry = {
      icon: 'Building',
      title: 'New Industry',
      description: 'Industry description',
      display_order: data.industries.length + 1
    };
    try {
      setSaving(true);
      await axios.post(`${API_BASE}/industries`, newIndustry);
      await fetchAllData();
      alert('Industry added successfully!');
    } catch (error) {
      console.error('Error adding industry:', error);
      alert('Failed to add industry');
    } finally {
      setSaving(false);
    }
  }

  async function updateIndustry(id, field, value) {
    const industry = data.industries.find(i => i.id === id);
    if (!industry) return;
    
    const updated = { ...industry, [field]: value };
    try {
      await axios.put(`${API_BASE}/industries/${id}`, updated);
      await fetchAllData();
    } catch (error) {
      console.error('Error updating industry:', error);
    }
  }

  async function deleteIndustry(id) {
    if (!confirm('Are you sure you want to delete this industry?')) return;
    try {
      setSaving(true);
      await axios.delete(`${API_BASE}/industries/${id}`);
      await fetchAllData();
      alert('Industry deleted successfully!');
    } catch (error) {
      console.error('Error deleting industry:', error);
      alert('Failed to delete industry');
    } finally {
      setSaving(false);
    }
  }

  // Why Choose Us handlers
  async function addWhyItem() {
    const newItem = {
      icon: 'Shield',
      title: 'New Benefit',
      description: 'Benefit description',
      display_order: data.whyChooseUs.length + 1
    };
    try {
      setSaving(true);
      await axios.post(`${API_BASE}/why-choose-us`, newItem);
      await fetchAllData();
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    } finally {
      setSaving(false);
    }
  }

  async function updateWhyItem(id, field, value) {
    const item = data.whyChooseUs.find(i => i.id === id);
    if (!item) return;
    
    const updated = { ...item, [field]: value };
    try {
      await axios.put(`${API_BASE}/why-choose-us/${id}`, updated);
      await fetchAllData();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }

  async function deleteWhyItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      setSaving(true);
      await axios.delete(`${API_BASE}/why-choose-us/${id}`);
      await fetchAllData();
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-portal" style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {!previewMode ? (
        <>
          {/* Admin Header */}
          <header style={{ 
            backgroundColor: '#0B1F3A', 
            color: 'white', 
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={28} />
              SecureGuard Admin
            </h1>
            <button 
              onClick={() => setPreviewMode(true)}
              style={{
                backgroundColor: '#3498DB',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Eye size={18} />
              Preview Site
            </button>
          </header>

          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            backgroundColor: 'white', 
            borderBottom: '1px solid #e0e0e0',
            padding: '0 20px',
            overflowX: 'auto'
          }}>
            {['services', 'testimonials', 'industries', 'whychooseus', 'hero', 'about', 'careers'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '15px 20px',
                  border: 'none',
                  backgroundColor: activeTab === tab ? '#0B1F3A' : 'transparent',
                  color: activeTab === tab ? 'white' : '#333',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: '500'
                }}
              >
                {tab === 'whychooseus' ? 'Why Choose Us' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>Manage Services</h2>
                  <button onClick={addService} style={addButtonStyle}>
                    <Plus size={16} /> Add Service
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '20px' }}>
                  {data.services.map(service => (
                    <div key={service.id} style={editCardStyle}>
                      <select 
                        value={service.icon}
                        onChange={(e) => updateService(service.id, 'icon', e.target.value)}
                        style={inputStyle}
                      >
                        {iconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <input 
                        type="text" 
                        value={service.title}
                        onChange={(e) => updateService(service.id, 'title', e.target.value)}
                        style={inputStyle}
                        placeholder="Title"
                      />
                      <textarea 
                        value={service.description}
                        onChange={(e) => updateService(service.id, 'description', e.target.value)}
                        style={{ ...inputStyle, minHeight: '80px' }}
                        placeholder="Description"
                      />
                      <input 
                        type="number" 
                        value={service.display_order}
                        onChange={(e) => updateService(service.id, 'display_order', parseInt(e.target.value))}
                        style={{ ...inputStyle, width: '80px' }}
                        placeholder="Order"
                      />
                      <button onClick={() => deleteService(service.id)} style={deleteButtonStyle}>
                        <X size={16} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'testimonials' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>Manage Testimonials</h2>
                  <button onClick={addTestimonial} style={addButtonStyle}>
                    <Plus size={16} /> Add Testimonial
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '20px' }}>
                  {data.testimonials.map(testimonial => (
                    <div key={testimonial.id} style={editCardStyle}>
                      <input 
                        type="text" 
                        value={testimonial.author}
                        onChange={(e) => updateTestimonial(testimonial.id, 'author', e.target.value)}
                        style={inputStyle}
                        placeholder="Author Name"
                      />
                      <input 
                        type="text" 
                        value={testimonial.role}
                        onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                        style={inputStyle}
                        placeholder="Role/Title"
                      />
                      <textarea 
                        value={testimonial.text}
                        onChange={(e) => updateTestimonial(testimonial.id, 'text', e.target.value)}
                        style={{ ...inputStyle, minHeight: '80px' }}
                        placeholder="Testimonial Text"
                      />
                      <input 
                        type="number" 
                        value={testimonial.display_order}
                        onChange={(e) => updateTestimonial(testimonial.id, 'display_order', parseInt(e.target.value))}
                        style={{ ...inputStyle, width: '80px' }}
                        placeholder="Order"
                      />
                      <button onClick={() => deleteTestimonial(testimonial.id)} style={deleteButtonStyle}>
                        <X size={16} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Industries Tab */}
            {activeTab === 'industries' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>Manage Industries</h2>
                  <button onClick={addIndustry} style={addButtonStyle}>
                    <Plus size={16} /> Add Industry
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '20px' }}>
                  {data.industries.map(industry => (
                    <div key={industry.id} style={editCardStyle}>
                      <select 
                        value={industry.icon}
                        onChange={(e) => updateIndustry(industry.id, 'icon', e.target.value)}
                        style={inputStyle}
                      >
                        {iconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <input 
                        type="text" 
                        value={industry.title}
                        onChange={(e) => updateIndustry(industry.id, 'title', e.target.value)}
                        style={inputStyle}
                        placeholder="Industry Title"
                      />
                      <textarea 
                        value={industry.description}
                        onChange={(e) => updateIndustry(industry.id, 'description', e.target.value)}
                        style={{ ...inputStyle, minHeight: '80px' }}
                        placeholder="Description"
                      />
                      <input 
                        type="number" 
                        value={industry.display_order}
                        onChange={(e) => updateIndustry(industry.id, 'display_order', parseInt(e.target.value))}
                        style={{ ...inputStyle, width: '80px' }}
                        placeholder="Order"
                      />
                      <button onClick={() => deleteIndustry(industry.id)} style={deleteButtonStyle}>
                        <X size={16} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Choose Us Tab */}
            {activeTab === 'whychooseus' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>Manage Why Choose Us</h2>
                  <button onClick={addWhyItem} style={addButtonStyle}>
                    <Plus size={16} /> Add Item
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '20px' }}>
                  {data.whyChooseUs.map(item => (
                    <div key={item.id} style={editCardStyle}>
                      <select 
                        value={item.icon}
                        onChange={(e) => updateWhyItem(item.id, 'icon', e.target.value)}
                        style={inputStyle}
                      >
                        {iconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <input 
                        type="text" 
                        value={item.title}
                        onChange={(e) => updateWhyItem(item.id, 'title', e.target.value)}
                        style={inputStyle}
                        placeholder="Title"
                      />
                      <textarea 
                        value={item.description}
                        onChange={(e) => updateWhyItem(item.id, 'description', e.target.value)}
                        style={{ ...inputStyle, minHeight: '80px' }}
                        placeholder="Description"
                      />
                      <input 
                        type="number" 
                        value={item.display_order}
                        onChange={(e) => updateWhyItem(item.id, 'display_order', parseInt(e.target.value))}
                        style={{ ...inputStyle, width: '80px' }}
                        placeholder="Order"
                      />
                      <button onClick={() => deleteWhyItem(item.id)} style={deleteButtonStyle}>
                        <X size={16} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hero Banner Tab */}
            {activeTab === 'hero' && (
              <div>
                <h2>Manage Hero Banner</h2>
                <form onSubmit={handleSaveHero} style={formStyle}>
                  <div style={formGroupStyle}>
                    <label>Video URL (for motion picture background)</label>
                    <input 
                      type="text" 
                      value={heroForm.video_url || ''}
                      onChange={(e) => setHeroForm({...heroForm, video_url: e.target.value})}
                      style={inputStyle}
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label>Image URL (fallback)</label>
                    <input 
                      type="text" 
                      value={heroForm.image_url || ''}
                      onChange={(e) => setHeroForm({...heroForm, image_url: e.target.value})}
                      style={inputStyle}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label>Headline</label>
                    <input 
                      type="text" 
                      value={heroForm.headline || ''}
                      onChange={(e) => setHeroForm({...heroForm, headline: e.target.value})}
                      style={inputStyle}
                      placeholder="Professional Security Solutions You Can Trust"
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label>Subtitle</label>
                    <textarea 
                      value={heroForm.subtitle || ''}
                      onChange={(e) => setHeroForm({...heroForm, subtitle: e.target.value})}
                      style={{ ...inputStyle, minHeight: '80px' }}
                      placeholder="24/7 protection services for hotels, schools..."
                    />
                  </div>
                  <button type="submit" disabled={saving} style={saveButtonStyle}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Hero'}
                  </button>
                </form>
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div>
                <h2>Manage About Section</h2>
                <form onSubmit={handleSaveAbout} style={formStyle}>
                  <div style={formGroupStyle}>
                    <label>Title</label>
                    <input 
                      type="text" 
                      value={aboutForm.title || ''}
                      onChange={(e) => setAboutForm({...aboutForm, title: e.target.value})}
                      style={inputStyle}
                      placeholder="About SecureGuard"
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label>Description</label>
                    <textarea 
                      value={aboutForm.description || ''}
                      onChange={(e) => setAboutForm({...aboutForm, description: e.target.value})}
                      style={{ ...inputStyle, minHeight: '120px' }}
                      placeholder="Company description..."
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label>Image URL</label>
                    <input 
                      type="text" 
                      value={aboutForm.image_url || ''}
                      onChange={(e) => setAboutForm({...aboutForm, image_url: e.target.value})}
                      style={inputStyle}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <button type="submit" disabled={saving} style={saveButtonStyle}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save About'}
                  </button>
                </form>
              </div>
            )}

            {/* Careers Tab */}
            {activeTab === 'careers' && (
              <div>
                <h2>Manage Careers Section</h2>
                <form onSubmit={handleSaveCareers} style={formStyle}>
                  <div style={formGroupStyle}>
                    <label>Title</label>
                    <input 
                      type="text" 
                      value={careersForm.title || ''}
                      onChange={(e) => setCareersForm({...careersForm, title: e.target.value})}
                      style={inputStyle}
                      placeholder="Join Our Team"
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label>Description</label>
                    <textarea 
                      value={careersForm.description || ''}
                      onChange={(e) => setCareersForm({...careersForm, description: e.target.value})}
                      style={{ ...inputStyle, minHeight: '120px' }}
                      placeholder="Careers description..."
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label>Image URL</label>
                    <input 
                      type="text" 
                      value={careersForm.image_url || ''}
                      onChange={(e) => setCareersForm({...careersForm, image_url: e.target.value})}
                      style={inputStyle}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <button type="submit" disabled={saving} style={saveButtonStyle}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Careers'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </>
      ) : (
        /* Preview Mode */
        <div>
          <div style={{ 
            backgroundColor: '#0B1F3A', 
            color: 'white', 
            padding: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}>
            <span style={{ fontWeight: 'bold' }}>Preview Mode</span>
            <button 
              onClick={() => setPreviewMode(false)}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <EyeOff size={16} /> Exit Preview
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            <p style={{ textAlign: 'center', color: '#666' }}>
              This is a preview. Changes you make in the admin panel will be reflected here after saving.
            </p>
            {/* You could embed the actual landing page component here for live preview */}
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const addButtonStyle = {
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontWeight: '500'
};

const editCardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  display: 'grid',
  gridTemplateColumns: '150px 1fr 1fr 80px auto',
  gap: '15px',
  alignItems: 'start'
};

const inputStyle = {
  padding: '10px 12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  width: '100%'
};

const deleteButtonStyle = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  whiteSpace: 'nowrap'
};

const formStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  maxWidth: '600px'
};

const formGroupStyle = {
  marginBottom: '20px'
};

const saveButtonStyle = {
  backgroundColor: '#3498DB',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: '600',
  fontSize: '14px'
};

export default AdminPortal;
