import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TAMIL_NADU_DISTRICTS } from '../constants/tamilNaduLocations';
import MyProductsSection from '../components/MyProductsSection';
import FarmerCollaborationSection from '../components/FarmerCollaborationSection';
import ErrorBoundary from '../components/ErrorBoundary';
import {
  LeafIcon,
  DashboardIcon,
  UserIcon,
  LogoutIcon,
  ClipboardIcon,
  TractorIcon,
  CalendarIcon,
  StethoscopeIcon,
  UsersIcon,
  SidebarHillsIllustration,
  FertilizerIcon,
  GovtSchemeIcon
} from '../components/FarmerIcons';
import FertilizerPricePage from './FertilizerPricePage';
import GovernmentSchemesPage from './GovernmentSchemesPage';
import './DetailPages.css';
import './FarmerProductsDashboard.css';

const emptyProduct = { productName: '', category: '', description: '', price: '', quantity: '', sellerPhone: '', image: null };

const THEMES = [
  {
    id: 'forest',
    name: 'Forest Emerald',
    label: 'Rich Forest Navbar & Deep Pine Sidebar',
    icon: '🌲',
    topbar: '#184D31',
    sidebar: '#1A5336',
    bg: '#F4F8F3'
  },
  {
    id: 'midnight',
    name: 'Midnight Slate',
    label: 'Rich Slate Navbar & Deep Modern Navy Sidebar',
    icon: '🌌',
    topbar: '#223247',
    sidebar: '#1B2738',
    bg: '#F8FAFC'
  }
];

export default function FarmerDashboardMain({ initialSection }) {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState(() => {
    if (initialSection) return initialSection;
    if (typeof window !== 'undefined' && window.location.pathname === '/community') return 'collaboration';
    if (typeof window !== 'undefined' && window.location.pathname === '/fertilizers') return 'fertilizers';
    if (typeof window !== 'undefined' && window.location.pathname === '/schemes') return 'schemes';
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    return params?.get('tab') || 'products';
  });
  const [activeTheme, setActiveTheme] = useState(() => {
    const saved = localStorage.getItem('farmer_theme');
    return saved === 'midnight' ? 'midnight' : 'forest';
  });
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const changeTheme = (themeId) => {
    setActiveTheme(themeId);
    localStorage.setItem('farmer_theme', themeId);
  };
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [product, setProduct] = useState({ ...emptyProduct, sellerPhone: user?.phone || '' });
  const [notice, setNotice] = useState('');

  // Equipment filters
  const [equipmentLocation, setEquipmentLocation] = useState('');
  const [equipmentSearch, setEquipmentSearch] = useState('');

  // Agri Doctor filters
  const [doctorLocation, setDoctorLocation] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');

  const load = async () => {
    try {
      const [productData, orderData, rentalData, equipmentData, doctorData] = await Promise.all([
        api.get('/products', { params: { includeSold: true } }),
        api.get('/orders'),
        api.get('/rentals'),
        api.get('/equipment'),
        api.get('/agri-doctors')
      ]);
      const currentUserId = user?.id || user?._id;
      setProducts(productData.data.filter((item) => String(item.farmer?._id || item.farmer) === String(currentUserId)));
      setOrders(orderData.data || []);
      setRentals(rentalData.data || []);
      setEquipment((equipmentData.data || []).filter((item) => item.availability));
      setDoctors(doctorData.data || []);
    } catch (error) {
      setNotice(error.response?.data?.message || 'Unable to load dashboard data.');
    }
  };

  useEffect(() => {
    if (user) {
      load();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const listProduct = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (value !== null && value !== '') data.append(key, value);
      });
      await api.post('/products', data);
      const profile = await api.get('/auth/me');
      if (profile?.data?.user) {
        setUser(profile.data.user);
        localStorage.user = JSON.stringify(profile.data.user);
        setProduct({ ...emptyProduct, sellerPhone: profile.data.user?.phone || '' });
      }
      setNotice('Product listed successfully.');
      load();
    } catch (error) {
      setNotice(error.response?.data?.message || 'Unable to list product.');
    }
  };

  const updateOrder = async (id, orderStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { orderStatus });
      setNotice(`Order ${orderStatus}.`);
      load();
    } catch {
      setNotice('Unable to update order.');
    }
  };

  const markAsSold = async (id) => {
    try {
      await api.put(`/products/${id}`, { isSold: true });
      setNotice('Product marked as sold.');
      load();
    } catch {
      setNotice('Unable to update product.');
    }
  };

  // Filtered equipment by Tamil Nadu location and search
  const filteredEquipment = equipment.filter((item) => {
    const matchesLoc = !equipmentLocation || (item.location && item.location.toLowerCase().includes(equipmentLocation.toLowerCase()));
    const matchesSearch = !equipmentSearch || (
      (item.equipmentName && item.equipmentName.toLowerCase().includes(equipmentSearch.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(equipmentSearch.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(equipmentSearch.toLowerCase()))
    );
    return matchesLoc && matchesSearch;
  });

  // Filtered doctors by Tamil Nadu location and search
  const filteredDoctors = doctors.filter((doc) => {
    const matchesLoc = !doctorLocation || (doc.location && doc.location.toLowerCase().includes(doctorLocation.toLowerCase()));
    const matchesSearch = !doctorSearch || (
      (doc.name && doc.name.toLowerCase().includes(doctorSearch.toLowerCase())) ||
      (doc.location && doc.location.toLowerCase().includes(doctorSearch.toLowerCase())) ||
      (doc.phone && doc.phone.includes(doctorSearch))
    );
    return matchesLoc && matchesSearch;
  });

  const title = {
    products: 'My Products',
    orders: 'Customer Orders',
    equipment: 'Rent Equipment',
    rentals: 'Rental Status',
    doctors: 'Agricultural Doctors',
    fertilizers: 'Fertilizer Prices',
    schemes: 'Government Schemes & Subsidies'
  }[section];

  const NAV_ITEMS = [
    { key: 'products', label: 'My Products', icon: LeafIcon },
    { key: 'orders', label: 'Orders', icon: ClipboardIcon },
    { key: 'equipment', label: 'Rent Equipment', icon: TractorIcon },
    { key: 'rentals', label: 'Rental Status', icon: CalendarIcon },
    { key: 'doctors', label: 'Agri Doctors', icon: StethoscopeIcon },
    { key: 'collaboration', label: 'Farmer Collaboration', icon: UsersIcon },
    { key: 'fertilizers', label: 'Fertilizer Prices', icon: FertilizerIcon },
    { key: 'schemes', label: 'Govt Schemes', icon: GovtSchemeIcon }
  ];

  return (
    <div className={`agri-farmer-app theme-${activeTheme}`}>
      {/* 1. Global Modern Full-width Topbar */}
      <header className="farmer-topbar-clean">
        <div className="topbar-left-controls">
          <button
            type="button"
            className={`topbar-hamburger-btn ${sidebarOpen ? 'active' : ''}`}
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            title={sidebarOpen ? 'Close Menu' : 'Open Menu'}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>

          <div
            className="topbar-brand-link"
            onClick={() => {
              setSection('products');
              setSidebarOpen(false);
            }}
            role="button"
            tabIndex={0}
          >
            <span className="topbar-brand-leaf">
              <LeafIcon size={22} />
            </span>
            <span className="topbar-brand-title">
              <span className="auth-logo-yellow">Agri</span><span className="auth-logo-white">Connect</span>
            </span>
          </div>

          <div className="topbar-current-tab-pill">
            <span className="tab-pill-dot">●</span>
            <span className="tab-pill-text">
              {NAV_ITEMS.find((n) => n.key === section)?.label || 'Farmer Dashboard'}
            </span>
          </div>
        </div>

        <div className="topbar-right-controls">
            {/* Live Theme Switcher */}
            <div className="theme-switcher-wrapper">
              <button
                type="button"
                className="topbar-theme-toggle-btn"
                onClick={() => {
                  setShowThemePicker(!showThemePicker);
                  setShowAtmospherePicker(false);
                }}
                title="Switch between Forest Emerald and Midnight Slate"
              >
                <span>{activeTheme === 'forest' ? '🌲 Forest Emerald' : '🌌 Midnight Slate'}</span>
                <span style={{ fontSize: 10 }}>▼</span>
              </button>

              {showThemePicker && (
                <div className="theme-switcher-dropdown">
                  <div className="theme-switcher-header">
                    <b>Theme Settings</b>
                    <button
                      type="button"
                      className="theme-close-btn"
                      onClick={() => setShowThemePicker(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="theme-options-list">
                    {THEMES.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        className={`theme-option-item ${activeTheme === th.id ? 'active' : ''}`}
                        onClick={() => {
                          changeTheme(th.id);
                          setShowThemePicker(false);
                        }}
                      >
                        <div className="theme-swatch-duo">
                          <span className="swatch-half" style={{ background: th.topbar }} title="Topbar" />
                          <span className="swatch-half" style={{ background: th.sidebar }} title="Sidebar" />
                          <span className="swatch-half" style={{ background: th.bg }} title="Page BG" />
                        </div>
                        <div className="theme-option-text">
                          <span className="theme-option-name">{th.name}</span>
                          <span className="theme-option-desc">{th.label}</span>
                        </div>
                        {activeTheme === th.id && <span className="theme-check">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="topbar-dashboard-pill"
              onClick={() => setSection('products')}
            >
              Dashboard
            </button>

            <div className="topbar-user-profile-badge">
              <UserIcon size={16} />
              <span>Hi, {user?.name || 'Farmer'}</span>
              <span style={{ fontSize: 10, opacity: 0.65 }}>▼</span>
            </div>

            <button
              type="button"
              className="topbar-clean-logout-btn"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogoutIcon size={14} />
              <span>Log out</span>
            </button>
          </div>
        </header>

      {/* 2. Backdrop Scrim Overlay when Sidebar is popped open */}
      {sidebarOpen && (
        <div
          className="farmer-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* 3. Pop-out Sidebar Drawer - only pops when clicked */}
      <aside className={`farmer-sidebar-v2 ${sidebarOpen ? 'open' : ''}`} aria-hidden={!sidebarOpen}>
        <div className="sidebar-brand-top">
          <div
            className="sidebar-brand-title-wrap"
            onClick={() => {
              setSection('products');
              setSidebarOpen(false);
            }}
            role="button"
            tabIndex={0}
          >
            <span className="sidebar-brand-icon">
              <LeafIcon size={22} />
            </span>
            <span className="sidebar-brand-title">
              <span className="auth-logo-yellow">Agri</span><span className="auth-logo-white">Connect</span>
            </span>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Menu"
            title="Close Menu"
          >
            ✕
          </button>
        </div>

        <div className="sidebar-user-header">
          <div className="sidebar-avatar-circle">
            <LeafIcon size={18} />
          </div>
          <div className="sidebar-greeting-text">
            <p className="sidebar-greeting-sub">FARMER DASHBOARD</p>
            <p className="sidebar-farmer-name">Hello, {user?.name || 'Farmer'}</p>
          </div>
        </div>

        <nav className="sidebar-nav-list">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = section === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setSection(item.key);
                  setSidebarOpen(false);
                }}
              >
                <span className="sidebar-nav-icon">
                  <Icon size={17} />
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom-wrap">
          <SidebarHillsIllustration />
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <LogoutIcon size={15} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* 4. Full Viewport Main Content */}
      <div className="farmer-right-viewport">
        {/* Scrollable Content Area */}
        <main className="farmer-scroll-content">
          {notice && (
            <div className="alert alert-success alert-dismissible mb-4">
              <span>{notice}</span>
              <button
                type="button"
                className="btn-close"
                onClick={() => setNotice('')}
              />
            </div>
          )}

          {section === 'products' ? (
            <ErrorBoundary>
              <MyProductsSection
                products={products}
                orders={orders}
                user={user}
                onProductChange={load}
                setUser={setUser}
                onNavigateSection={setSection}
              />
            </ErrorBoundary>
          ) : section === 'collaboration' ? (
            <ErrorBoundary>
              <FarmerCollaborationSection onNavigateSection={setSection} />
            </ErrorBoundary>
          ) : section === 'fertilizers' ? (
            <ErrorBoundary>
              <FertilizerPricePage />
            </ErrorBoundary>
          ) : section === 'schemes' ? (
            <ErrorBoundary>
              <GovernmentSchemesPage embedded={true} />
            </ErrorBoundary>
          ) : (
            <>
              <header className="farmer-content-header-row mb-4">
                <div className="header-left-title-box">
                  <h1>{title}</h1>
                </div>
              </header>

        {section === 'orders' && (
          <div className="farm-panel">
            <h2>Customer orders</h2>
            {orders.length ? (
              orders.map((order) => (
                <div className="order-row" key={order._id}>
                  <div>
                    <b>Order #{order._id.slice(-6)}</b>
                    <small>Buyer: {order.buyer?.name} · Phone: {order.buyer?.phone || 'Not provided'}</small>
                  </div>
                  {order.orderStatus === 'pending' ? (
                    <div>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => updateOrder(order._id, 'confirmed')}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => updateOrder(order._id, 'cancelled')}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="status-pill">{order.orderStatus}</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted">No orders received yet.</p>
            )}
          </div>
        )}

        {/* Section: Equipment with Tamil Nadu location filtering */}
        {section === 'equipment' && (
          <div className="farm-panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="mb-1">Available equipment</h2>
                <small className="text-muted">
                  {equipmentLocation
                    ? `Showing equipment in ${equipmentLocation} (${filteredEquipment.length} found)`
                    : `Showing all available equipment (${filteredEquipment.length} found)`}
                </small>
              </div>
              <Link className="btn btn-sm btn-success" to="/equipment">
                Open full rental catalog →
              </Link>
            </div>

            {/* Location Filter Bar */}
            <div className="dashboard-filter-box">
              <div className="row g-3">
                <div className="col-md-4 col-sm-5">
                  <label className="filter-subheading">📍 District</label>
                  <select
                    className="form-select form-select-sm"
                    value={equipmentLocation}
                    onChange={(e) => setEquipmentLocation(e.target.value)}
                  >
                    <option value="">All Districts</option>
                    {TAMIL_NADU_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-8 col-sm-7">
                  <label className="filter-subheading">🔍 Search Machinery</label>
                  <input
                    className="form-control form-control-sm"
                    placeholder="Search tractor, harvester, tiller..."
                    value={equipmentSearch}
                    onChange={(e) => setEquipmentSearch(e.target.value)}
                  />
                </div>
              </div>

              {(equipmentLocation || equipmentSearch) && (
                <div className="d-flex justify-content-end align-items-center mt-3 pt-2 border-top">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary px-3 py-1 btn-clear-filter"
                    onClick={() => {
                      setEquipmentLocation('');
                      setEquipmentSearch('');
                    }}
                  >
                    ✕ Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Equipment Grid */}
            {filteredEquipment.length ? (
              <div className="farmer-equipment-grid">
                {filteredEquipment.map((item) => (
                  <article className="farmer-equipment-card" key={item._id}>
                    <div className="farmer-equipment-img-wrap">
                      {item.image ? (
                        <img
                          src={`${api.defaults.baseURL.replace('/api', '')}${item.image}`}
                          alt={item.equipmentName}
                        />
                      ) : (
                        <div className="farmer-equipment-placeholder">
                          <span style={{ fontSize: '32px' }}>🚜</span>
                          <small>No photo available</small>
                        </div>
                      )}
                      {item.category && (
                        <span className="farmer-equipment-cat-pill">
                          {item.category}
                        </span>
                      )}
                      <span className={`farmer-equipment-badge ${item.availability === false ? 'rented' : 'avail'}`}>
                        {item.availability === false ? 'Rented' : 'Available'}
                      </span>
                    </div>

                    <div className="farmer-equipment-card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge-tn-location">📍 {item.location || 'Tamil Nadu'}</span>
                      </div>

                      <h3 className="farmer-equipment-title" title={item.equipmentName}>
                        {item.equipmentName}
                      </h3>

                      {item.description && (
                        <p className="farmer-equipment-desc" title={item.description}>
                          {item.description}
                        </p>
                      )}

                      <div className="farmer-equipment-price-row">
                        <span className="farmer-equipment-price">₹{item.rentalPrice}</span>
                        <span className="farmer-equipment-unit">/hour</span>
                      </div>

                      <Link className="farmer-equipment-book-btn" to={`/equipment/${item._id}`}>
                        View & book
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🚜</div>
                <p className="text-muted mb-2 fw-medium" style={{ fontSize: '14px' }}>
                  No machinery found {equipmentLocation ? `in ${equipmentLocation}` : ''}.
                </p>
                {(equipmentLocation || equipmentSearch) && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success px-3 mt-1"
                    onClick={() => {
                      setEquipmentLocation('');
                      setEquipmentSearch('');
                    }}
                  >
                    View All Equipment
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {section === 'rentals' && (
          <div className="farm-panel full-width-panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="mb-1">My Rental Requests</h2>
                <small className="text-muted">Track your hired machinery, approval status, and owner contacts</small>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-success px-3"
                onClick={() => setSection('equipment')}
              >
                + Rent Machinery
              </button>
            </div>

            {rentals.length ? (
              <div className="rentals-card-grid">
                {rentals.map((item) => {
                  const status = (item.requestStatus || 'pending').toLowerCase();
                  let badgeClass = 'badge-rental-pending';
                  let statusLabel = 'Pending';
                  if (status === 'approved' || status === 'confirmed') {
                    badgeClass = 'badge-rental-approved';
                    statusLabel = 'Approved';
                  } else if (status === 'completed') {
                    badgeClass = 'badge-rental-completed';
                    statusLabel = 'Completed';
                  } else if (status === 'cancelled' || status === 'rejected') {
                    badgeClass = 'badge-rental-cancelled';
                    statusLabel = 'Cancelled';
                  }

                  const equipImage = item.equipment?.image
                    ? `${api.defaults.baseURL.replace('/api', '')}${item.equipment.image}`
                    : null;

                  return (
                    <article className="rental-grid-card" key={item._id}>
                      <div className="rental-grid-card-head">
                        <div className="rental-equipment-visual">
                          {equipImage ? (
                            <img src={equipImage} alt={item.equipment?.equipmentName || 'Equipment'} />
                          ) : (
                            <span style={{ fontSize: 28 }}>🚜</span>
                          )}
                        </div>
                        <span className={`rental-status-badge ${badgeClass}`}>
                          {statusLabel}
                        </span>
                      </div>

                      <div className="rental-grid-card-body">
                        <h3 className="rental-grid-title">
                          {item.equipment?.equipmentName || 'Agricultural Machinery'}
                        </h3>

                        <div className="rental-grid-specs">
                          <div className="rental-spec-pill">
                            🌾 <span><b>{item.acres || 1}</b> Acres farm area</span>
                          </div>
                          {item.equipment?.rentalPrice && (
                            <div className="rental-spec-pill">
                              💰 <span><b>₹{item.equipment.rentalPrice}</b> / hr</span>
                            </div>
                          )}
                        </div>

                        <div className="rental-owner-box">
                          <div className="rental-owner-label">Owner Information</div>
                          <div className="rental-owner-name">
                            👤 {item.rentalOwner?.name || 'Equipment Owner'}
                          </div>
                          <div className="rental-owner-contact">
                            📞 {item.rentalOwner?.phone || item.rentalOwner?.email || 'Contact on approval'}
                          </div>
                          {item.equipment?.location && (
                            <div className="rental-owner-location">
                              📍 {item.equipment.location}
                            </div>
                          )}
                        </div>

                        <div className="rental-grid-footer">
                          <small className="text-muted">
                            Request #{item._id.slice(-6).toUpperCase()}
                          </small>
                          {item.createdAt && (
                            <small className="text-muted">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🚜</div>
                <h4 className="fw-bold mb-1">No rental requests yet</h4>
                <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                  Looking to rent a tractor, power tiller, or harvester?
                </p>
                <button
                  type="button"
                  className="btn btn-success px-4"
                  onClick={() => setSection('equipment')}
                >
                  Browse Equipment Catalog
                </button>
              </div>
            )}
          </div>
        )}

        {/* Section: Agri Doctors with Tamil Nadu location filtering */}
        {section === 'doctors' && (
          <div className="farm-panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="mb-1">Available agricultural doctors</h2>
                <small className="text-muted">
                  {doctorLocation
                    ? `Showing verified doctors in ${doctorLocation} (${filteredDoctors.length} found)`
                    : `Showing all agricultural doctors (${filteredDoctors.length} found)`}
                </small>
              </div>
            </div>

            {/* Location Filter Bar for Doctors */}
            <div className="dashboard-filter-box">
              <div className="row g-3">
                <div className="col-md-4 col-sm-5">
                  <label className="filter-subheading">📍 Filter by District</label>
                  <select
                    className="form-select form-select-sm"
                    value={doctorLocation}
                    onChange={(e) => setDoctorLocation(e.target.value)}
                  >
                    <option value="">All Districts</option>
                    {TAMIL_NADU_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-8 col-sm-7">
                  <label className="filter-subheading">🔍 Search Doctor Name / Town</label>
                  <input
                    className="form-control form-control-sm"
                    placeholder="Search doctor name or specific location..."
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                  />
                </div>
              </div>

              {(doctorLocation || doctorSearch) && (
                <div className="d-flex justify-content-end align-items-center mt-3 pt-2 border-top">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary px-3 py-1 btn-clear-filter"
                    onClick={() => {
                      setDoctorLocation('');
                      setDoctorSearch('');
                    }}
                  >
                    ✕ Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Doctors Cards */}
            {filteredDoctors.length ? (
              <div className="row g-3">
                {filteredDoctors.map((doc) => (
                  <div className="col-md-6" key={doc._id}>
                    <article className="border rounded p-3 h-100 doctor-card d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <b className="fs-6 text-dark">{doc.name}</b>
                          <span className="badge-tn-location">📍 {doc.location}</span>
                        </div>
                        <p className="text-muted small mb-3">
                          Expert Agricultural Advisory & Crop Health Assistance
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <a
                          className="btn btn-sm btn-success flex-grow-1"
                          href={`tel:${doc.phone}`}
                        >
                          📞 Call {doc.phone}
                        </a>
                        <a
                          className="btn btn-sm btn-outline-success"
                          href={`https://wa.me/91${doc.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp consultation"
                        >
                          💬 WhatsApp
                        </a>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>👨‍⚕️</div>
                <p className="text-muted mb-2 fw-medium" style={{ fontSize: '14px' }}>
                  No agricultural doctors found {doctorLocation ? `in ${doctorLocation}` : ''}.
                </p>
                {(doctorLocation || doctorSearch) && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success px-3 mt-1"
                    onClick={() => {
                      setDoctorLocation('');
                      setDoctorSearch('');
                    }}
                  >
                    View All Doctors
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </>
    )}
  </main>
</div>
</div>
);
}
