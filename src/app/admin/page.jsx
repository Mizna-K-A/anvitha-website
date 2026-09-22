"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Briefcase, 
  Settings, 
  FileText, 
  LogOut, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  
  // Data States
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [about, setAbout] = useState({ storyText: [], mission: '', vision: '', stats: [], values: [], team: [] });
  const [contact, setContact] = useState({ email: '', phone: '', address: '', companyName: '' });

  const router = useRouter();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setPortfolio(data.clientProjects || []);
        setServices(data.services || []);
        setAbout(data.about || { storyText: [], mission: '', vision: '', stats: [], values: [], team: [] });
        setContact(data.contact || { email: '', phone: '', address: '', companyName: '' });
      } else {
        showStatus('error', 'Failed to load page content.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Failed to communicate with API.');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: '', text: '' }), 5000);
  };

  const handleSave = async (type, data) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });

      if (res.ok) {
        showStatus('success', 'Changes saved successfully to MongoDB!');
        fetchContent(); // Refresh local states
      } else {
        const errData = await res.json();
        showStatus('error', errData.error || 'Failed to save changes.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Network error while saving.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/login', { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Content Mutators
  const addProduct = () => {
    setProducts([...products, { title: '', description: '', features: [], image: '/crm.png' }]);
  };

  const removeProduct = (idx) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  const updateProduct = (idx, field, value) => {
    const updated = [...products];
    if (field === 'features') {
      updated[idx][field] = Array.isArray(value) ? value : value.split(',').map(s => s.trim());
    } else {
      updated[idx][field] = value;
    }
    setProducts(updated);
  };

  const addProject = () => {
    setPortfolio([...portfolio, { 
      title: '', 
      category: 'web-apps', 
      categoryLabel: 'Web Application', 
      tagline: '', 
      description: '', 
      image: '/crm.png', 
      features: [], 
      technologies: [], 
      liveLink: '#' 
    }]);
  };

  const removeProject = (idx) => {
    setPortfolio(portfolio.filter((_, i) => i !== idx));
  };

  const updateProject = (idx, field, value) => {
    const updated = [...portfolio];
    if (field === 'features' || field === 'technologies') {
      updated[idx][field] = Array.isArray(value) ? value : value.split(',').map(s => s.trim());
    } else {
      updated[idx][field] = value;
    }
    setPortfolio(updated);
  };

  const handleImageUpload = async (e, type, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size limit (under 1 MB)
    const MAX_SIZE = 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showStatus('error', 'File size must be under 1 MB.');
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      showStatus('error', 'Only image files are allowed.');
      e.target.value = '';
      return;
    }

    setSaveLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        if (type === 'products') {
          updateProduct(idx, 'image', result.path);
        } else if (type === 'portfolio') {
          updateProject(idx, 'image', result.path);
        }
        showStatus('success', 'Image uploaded successfully!');
      } else {
        const errData = await res.json();
        showStatus('error', errData.error || 'Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Network error during file upload.');
    } finally {
      setSaveLoading(false);
      e.target.value = '';
    }
  };

  const addService = () => {
    setServices([...services, {
      title: '',
      category: 'development',
      tagline: '',
      description: '',
      features: [],
      technologies: [],
      startingPrice: '',
      iconName: 'Code'
    }]);
  };

  const removeService = (idx) => {
    setServices(services.filter((_, i) => i !== idx));
  };

  const updateService = (idx, field, value) => {
    const updated = [...services];
    if (field === 'features' || field === 'technologies') {
      updated[idx][field] = value.split(',').map(s => s.trim());
    } else {
      updated[idx][field] = value;
    }
    setServices(updated);
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-white mb-4" />
        <p className="text-white/60 font-light text-sm tracking-wider">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col lg:flex-row">
      {/* Sidebar Panel */}
      <aside className="w-full lg:w-72 bg-white/5 border-b lg:border-b-0 lg:border-r border-white/10 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image 
              src="/anvitha.png" 
              alt="Logo" 
              width={35} 
              height={35}
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-wider leading-none">ANVITHA</span>
              <span className="text-[10px] text-white/40 tracking-widest mt-1">CMS ADMIN PANEL</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-4 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'overview' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'products' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag size={18} />
              <span>Our Products</span>
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'portfolio' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase size={18} />
              <span>Client Portfolio</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'services' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings size={18} />
              <span>Services</span>
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'about' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText size={18} />
              <span>About Us Story</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'contact' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <PhoneCall size={18} />
              <span>Contact Info</span>
            </button>
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="pt-6 border-t border-white/10 mt-6 lg:mt-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">A</div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Administrator</span>
              <span className="text-[10px] text-white/40">Secure Session</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-white/60 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto max-h-screen">
        {/* Floating Status Notification */}
        {statusMessage.text && (
          <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border text-sm flex items-center gap-3 animate-[slideIn_0.3s_ease-out] ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Active Tab Component Render */}
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="flex justify-between items-center pb-6 border-b border-white/10">
            <div>
              <h1 className="text-3xl font-light capitalize tracking-wide">{activeTab}</h1>
              <p className="text-xs sm:text-sm text-white/40 font-light mt-1">Manage and update the dynamic database content.</p>
            </div>
            
            {activeTab !== 'overview' && (
              <button
                onClick={() => {
                  if (activeTab === 'products') handleSave('products', products);
                  if (activeTab === 'portfolio') handleSave('portfolio', portfolio);
                  if (activeTab === 'services') handleSave('services', services);
                  if (activeTab === 'about') handleSave('about', about);
                  if (activeTab === 'contact') handleSave('contact', contact);
                }}
                disabled={saveLoading}
                className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saveLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Save Database Changes</span>
              </button>
            )}
          </header>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-xl font-light">Welcome back, Administrator.</h3>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  This console connects directly to your **MongoDB database**. Updating entries here immediately changes what is displayed on the live frontend. Pages use Server-Side Rendering (SSR) for blazing-fast performance and optimal SEO.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <span className="text-2xl font-semibold">{products.length}</span>
                    <p className="text-xs text-white/40 mt-1">Own Products</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <span className="text-2xl font-semibold">{portfolio.length}</span>
                    <p className="text-xs text-white/40 mt-1">Client Websites</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <span className="text-2xl font-semibold">{services.length}</span>
                    <p className="text-xs text-white/40 mt-1">Services Offered</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <span className="text-2xl font-semibold">Active</span>
                    <p className="text-xs text-white/40 mt-1">MongoDB Connection</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
                <h4 className="text-base font-semibold">Database Status Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm py-2.5 border-b border-white/5">
                    <span className="text-white/60">Product Listing Collection</span>
                    <span className="font-mono text-xs">{products.length} documents</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2.5 border-b border-white/5">
                    <span className="text-white/60">Portfolio Listing Collection</span>
                    <span className="font-mono text-xs">{portfolio.length} documents</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2.5 border-b border-white/5">
                    <span className="text-white/60">Services Collection</span>
                    <span className="font-mono text-xs">{services.length} documents</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2.5">
                    <span className="text-white/60">About Story Collection</span>
                    <span className="font-mono text-xs">1 document (complete schema)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/40 font-light">List of in-house tools/products developed by Anvitha.</span>
                <button
                  onClick={addProduct}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Product</span>
                </button>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12 bg-white/5 border border-white/10 border-dashed rounded-2xl text-white/40 text-sm">
                  No products added yet. Click &quot;Add Product&quot; to begin.
                </div>
              ) : (
                <div className="space-y-6">
                  {products.map((product, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative space-y-4">
                      <button
                        onClick={() => removeProduct(idx)}
                        className="absolute top-6 right-6 p-2 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Product Title</label>
                          <input
                            type="text"
                            value={product.title}
                            onChange={(e) => updateProduct(idx, 'title', e.target.value)}
                            placeholder="e.g. Enterprise CRM"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Mockup Image URL / Upload</label>
                          <input
                            type="text"
                            value={product.image}
                            onChange={(e) => updateProduct(idx, 'image', e.target.value)}
                            placeholder="e.g. /crm.png"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                          <div className="mt-2 flex items-center space-x-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'products', idx)}
                              className="hidden"
                              id={`product-file-${idx}`}
                            />
                            <label
                              htmlFor={`product-file-${idx}`}
                              className="bg-white/10 hover:bg-white/15 text-white border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                            >
                              Choose File
                            </label>
                            <span className="text-[10px] text-white/40">Max 1 MB (PNG, JPG, WEBP)</span>
                          </div>
                          {product.image && (
                            <div className="mt-3 relative w-32 aspect-[16/10] rounded-lg overflow-hidden border border-white/10 bg-white/5">
                              <img
                                src={product.image}
                                alt="Product Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Product Description</label>
                        <textarea
                          rows={2}
                          value={product.description}
                          onChange={(e) => updateProduct(idx, 'description', e.target.value)}
                          placeholder="Provide a summary of the product's capability..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10 resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">
                          Features (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={Array.isArray(product.features) ? product.features.join(', ') : ''}
                          onChange={(e) => updateProduct(idx, 'features', e.target.value)}
                          placeholder="Sales Automation, Team Collaboration, Advanced Reports"
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PORTFOLIO TAB */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/40 font-light">List of client websites designed, developed, and deployed.</span>
                <button
                  onClick={addProject}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Project</span>
                </button>
              </div>

              {portfolio.length === 0 ? (
                <div className="text-center py-12 bg-white/5 border border-white/10 border-dashed rounded-2xl text-white/40 text-sm">
                  No projects added yet. Click &quot;Add Project&quot; to begin.
                </div>
              ) : (
                <div className="space-y-6">
                  {portfolio.map((project, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative space-y-4">
                      <button
                        onClick={() => removeProject(idx)}
                        className="absolute top-6 right-6 p-2 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Client Project Name</label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => updateProject(idx, 'title', e.target.value)}
                            placeholder="e.g. Luminar Academy"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Project Category Key</label>
                          <select
                            value={project.category}
                            onChange={(e) => {
                              const cat = e.target.value;
                              let label = 'Web Application';
                              if (cat === 'ecommerce') label = 'E-Commerce';
                              if (cat === 'corporate') label = 'Corporate & Creative';
                              const updated = [...portfolio];
                              updated[idx].category = cat;
                              updated[idx].categoryLabel = label;
                              setPortfolio(updated);
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white"
                          >
                            <option value="web-apps" className="bg-neutral-900 text-white">web-apps</option>
                            <option value="ecommerce" className="bg-neutral-900 text-white">ecommerce</option>
                            <option value="corporate" className="bg-neutral-900 text-white">corporate</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Live Link URL</label>
                          <input
                            type="text"
                            value={project.liveLink}
                            onChange={(e) => updateProject(idx, 'liveLink', e.target.value)}
                            placeholder="e.g. https://luminar.com"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Marketing Tagline</label>
                          <input
                            type="text"
                            value={project.tagline}
                            onChange={(e) => updateProject(idx, 'tagline', e.target.value)}
                            placeholder="e.g. Empowering Next-Gen Learning"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Screenshot Image path / Upload</label>
                          <input
                            type="text"
                            value={project.image}
                            onChange={(e) => updateProject(idx, 'image', e.target.value)}
                            placeholder="e.g. /luminarWebsite.png"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                          <div className="mt-2 flex items-center space-x-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'portfolio', idx)}
                              className="hidden"
                              id={`portfolio-file-${idx}`}
                            />
                            <label
                              htmlFor={`portfolio-file-${idx}`}
                              className="bg-white/10 hover:bg-white/15 text-white border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                            >
                              Choose File
                            </label>
                            <span className="text-[10px] text-white/40">Max 1 MB (PNG, JPG, WEBP)</span>
                          </div>
                          {project.image && (
                            <div className="mt-3 relative w-32 aspect-[16/10] rounded-lg overflow-hidden border border-white/10 bg-white/5">
                              <img
                                src={project.image}
                                alt="Project Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Detailed Description</label>
                        <textarea
                          rows={2}
                          value={project.description}
                          onChange={(e) => updateProject(idx, 'description', e.target.value)}
                          placeholder="Describe the client project achievements and scope..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Features (Comma separated)</label>
                          <input
                            type="text"
                            value={Array.isArray(project.features) ? project.features.join(', ') : ''}
                            onChange={(e) => updateProject(idx, 'features', e.target.value)}
                            placeholder="Interactive course directory, Optimized SEO, Stripe payment integration"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Technologies (Comma separated)</label>
                          <input
                            type="text"
                            value={Array.isArray(project.technologies) ? project.technologies.join(', ') : ''}
                            onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                            placeholder="Next.js, TailwindCSS, GSAP, Stripe API"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/40 font-light">List of services offered to clients, showing pricing estimates and details.</span>
                <button
                  onClick={addService}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Service</span>
                </button>
              </div>

              {services.length === 0 ? (
                <div className="text-center py-12 bg-white/5 border border-white/10 border-dashed rounded-2xl text-white/40 text-sm">
                  No services added yet. Click &quot;Add Service&quot; to begin.
                </div>
              ) : (
                <div className="space-y-6">
                  {services.map((service, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative space-y-4">
                      <button
                        onClick={() => removeService(idx)}
                        className="absolute top-6 right-6 p-2 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Service Title</label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => updateService(idx, 'title', e.target.value)}
                            placeholder="e.g. Web Development"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Starting Price Tag</label>
                          <input
                            type="text"
                            value={service.startingPrice}
                            onChange={(e) => updateService(idx, 'startingPrice', e.target.value)}
                            placeholder="e.g. $5,000"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Category</label>
                          <select
                            value={service.category}
                            onChange={(e) => updateService(idx, 'category', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white"
                          >
                            <option value="development" className="bg-neutral-900 text-white">development</option>
                            <option value="design" className="bg-neutral-900 text-white">design</option>
                            <option value="strategy" className="bg-neutral-900 text-white">strategy</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Marketing Tagline</label>
                          <input
                            type="text"
                            value={service.tagline}
                            onChange={(e) => updateService(idx, 'tagline', e.target.value)}
                            placeholder="e.g. Building Digital Excellence"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Lucide Icon Name</label>
                          <input
                            type="text"
                            value={service.iconName}
                            onChange={(e) => updateService(idx, 'iconName', e.target.value)}
                            placeholder="e.g. Code, Palette, Smartphone, Globe, Cloud, Users"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Service Description</label>
                        <textarea
                          rows={2}
                          value={service.description}
                          onChange={(e) => updateService(idx, 'description', e.target.value)}
                          placeholder="Provide a summary of the service's details..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Features (Comma separated)</label>
                          <input
                            type="text"
                            value={Array.isArray(service.features) ? service.features.join(', ') : ''}
                            onChange={(e) => updateService(idx, 'features', e.target.value)}
                            placeholder="API Integration, Full-Stack Solutions, E-commerce Platforms"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Technologies (Comma separated)</label>
                          <input
                            type="text"
                            value={Array.isArray(service.technologies) ? service.technologies.join(', ') : ''}
                            onChange={(e) => updateService(idx, 'technologies', e.target.value)}
                            placeholder="React, Next.js, Node.js, TypeScript"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABOUT US TAB */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <span className="text-sm text-white/40 font-light">Edit mission, vision, story contents, stats and leadership team.</span>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-light border-b border-white/10 pb-3">Mission & Vision</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Our Mission Statement</label>
                    <textarea
                      rows={3}
                      value={about.mission}
                      onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                      placeholder="Enter company mission..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10 resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Our Vision Statement</label>
                    <textarea
                      rows={3}
                      value={about.vision}
                      onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                      placeholder="Enter company vision..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-light border-b border-white/10 pb-3">Our Story Text Paragraphs</h3>
                <div className="space-y-4">
                  {about.storyText && about.storyText.map((para, pIdx) => (
                    <div key={pIdx} className="space-y-1 relative">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Paragraph {pIdx + 1}</label>
                      <textarea
                        rows={3}
                        value={para}
                        onChange={(e) => {
                          const updatedText = [...about.storyText];
                          updatedText[pIdx] = e.target.value;
                          setAbout({ ...about, storyText: updatedText });
                        }}
                        placeholder="Write story paragraph..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10 resize-none pr-12"
                      />
                      <button
                        onClick={() => {
                          const updatedText = about.storyText.filter((_, i) => i !== pIdx);
                          setAbout({ ...about, storyText: updatedText });
                        }}
                        className="absolute top-6 right-3 p-1.5 rounded-lg text-white/20 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Remove paragraph"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setAbout({ ...about, storyText: [...(about.storyText || []), ''] })}
                    className="bg-white/10 hover:bg-white/15 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Add Paragraph</span>
                  </button>
                </div>
              </div>

              {/* Stats & Leadership list editing can be expanded here but keeps page robust */}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <span className="text-sm text-white/40 font-light">Edit company name, email address, telephone contact, and mailing address.</span>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-light border-b border-white/10 pb-3">Contact Information</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Company Name</label>
                    <input
                      type="text"
                      value={contact.companyName}
                      onChange={(e) => setContact({ ...contact, companyName: e.target.value })}
                      placeholder="e.g. Anvitha Infotech"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Email Address</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        placeholder="e.g. info@anvithainfotech.com"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Phone Number</label>
                      <input
                        type="text"
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        placeholder="e.g. +91 903 709 5615"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Mailing Address</label>
                    <textarea
                      rows={4}
                      value={contact.address}
                      onChange={(e) => setContact({ ...contact, address: e.target.value })}
                      placeholder="Enter company address..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-white/20 text-white placeholder-white/10 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
