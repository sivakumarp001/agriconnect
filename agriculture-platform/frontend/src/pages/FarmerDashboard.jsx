import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Dashboard } from './Pages';
import RentalOwnerDashboard from './RentalOwnerDashboard';
import './FarmerDashboard.css';

const blankProduct = { productName: '', category: '', description: '', price: '', quantity: '', image: null };

function LegacyFarmerDashboard() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [posts, setPosts] = useState([]);
  const [product, setProduct] = useState(blankProduct);
  const [rental, setRental] = useState({ equipment: '', startDate: '', endDate: '' });
  const [post, setPost] = useState({ title: '', content: '' });
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [productData, orderData, equipmentData, rentalData, postData] = await Promise.all([
        api.get('/products'), api.get('/orders'), api.get('/equipment'), api.get('/rentals'), api.get('/posts'),
      ]);
      setProducts(productData.data.filter((item) => item.farmer?._id === user.id));
      setOrders(orderData.data);
      setEquipment(equipmentData.data.filter((item) => item.availability));
      setRentals(rentalData.data);
      setPosts(postData.data);
    } catch (error) {
      setNotice(error.response?.data?.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const activeProducts = products.filter((item) => Number(item.quantity) > 0).length;
  const pendingOrders = orders.filter((item) => item.orderStatus === 'pending').length;
  const pendingRentals = rentals.filter((item) => item.requestStatus === 'pending').length;
  const activities = useMemo(() => [
    ...orders.map((item) => ({ id: `order-${item._id}`, text: `Order #${item._id.slice(-6)} received`, date: item.createdAt })),
    ...rentals.map((item) => ({ id: `rental-${item._id}`, text: `${item.equipment?.equipmentName || 'Equipment'} rental ${item.requestStatus}`, date: item.createdAt })),
    ...products.map((item) => ({ id: `product-${item._id}`, text: `${item.productName} is listed for sale`, date: item.createdAt })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), [orders, rentals, products]);

  const addProduct = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData();
      Object.entries(product).forEach(([key, value]) => { if (value !== null && value !== '') data.append(key, value); });
      await api.post('/products', data);
      setProduct(blankProduct);
      setNotice('Product and photo listed successfully.');
      load();
    }
    catch (error) { setNotice(error.response?.data?.message || 'Unable to list product.'); }
  };
  const removeProduct = async (id) => {
    if (!window.confirm('Remove this product listing?')) return;
    try { await api.delete(`/products/${id}`); setNotice('Product removed.'); load(); }
    catch (error) { setNotice(error.response?.data?.message || 'Unable to remove product.'); }
  };
  const updateOrder = async (id, orderStatus) => {
    try { await api.put(`/orders/${id}/status`, { orderStatus }); setNotice('Order status updated.'); load(); }
    catch (error) { setNotice(error.response?.data?.message || 'Unable to update order.'); }
  };
  const requestRental = async (event) => {
    event.preventDefault();
    try { await api.post('/rentals', rental); setRental({ equipment: '', startDate: '', endDate: '' }); setNotice('Rental request sent.'); load(); }
    catch (error) { setNotice(error.response?.data?.message || 'Unable to send rental request.'); }
  };
  const createPost = async (event) => {
    event.preventDefault();
    try { await api.post('/posts', post); setPost({ title: '', content: '' }); setNotice('Community post published.'); load(); }
    catch (error) { setNotice(error.response?.data?.message || 'Unable to publish post.'); }
  };
  const saveProfile = async (event) => {
    event.preventDefault();
    try { const result = await api.put('/users/profile', { name, phone }); setUser(result.data.user); localStorage.user = JSON.stringify(result.data.user); setNotice('Profile updated.'); }
    catch (error) { setNotice(error.response?.data?.message || 'Unable to update profile.'); }
  };
  const leave = () => { logout(); navigate('/'); };
  const field = (setter, state, key) => (event) => setter({ ...state, [key]: event.target.value });

  if (loading) return <main className="container py-5">Loading dashboard...</main>;
  return <main className="farmer-dashboard"><aside className="farmer-sidebar"><div className="farmer-brand">🌱 AgroConnect</div><p className="farmer-user">Hello, <b>{user.name}</b></p>{[['overview', 'Overview'], ['products', 'My Products'], ['orders', 'Orders'], ['equipment', 'Rent Equipment'], ['rentals', 'Rental Requests'], ['community', 'Community'], ['profile', 'My Profile']].map(([key, label]) => <button key={key} className={section === key ? 'active' : ''} onClick={() => setSection(key)}>{label}</button>)}<button className="logout" onClick={leave}>Log out</button></aside><section className="farmer-content"><header className="farmer-header"><div><h1>{section === 'overview' ? 'Farmer Dashboard' : section.replace(/\b\w/g, (letter) => letter.toUpperCase())}</h1><p>Manage your farm business in one place.</p></div><button className="btn btn-success" onClick={() => setSection('products')}>+ Add product</button></header>{notice && <div className="alert alert-success alert-dismissible"><span>{notice}</span><button type="button" className="btn-close" onClick={() => setNotice('')} /></div>}{section === 'overview' && <><div className="farm-stats"><Stat label="Total products" value={products.length} icon="▣" /><Stat label="Active products" value={activeProducts} icon="✓" /><Stat label="Received orders" value={orders.length} icon="□" /><Stat label="Pending orders" value={pendingOrders} icon="◷" /><Stat label="Rental requests" value={pendingRentals} icon="⚙" /></div><div className="farm-panel"><h2>Recent activities</h2>{activities.length ? activities.map((activity) => <div className="activity" key={activity.id}><span>●</span><div>{activity.text}<small>{new Date(activity.date).toLocaleDateString()}</small></div></div>) : <p className="text-muted mb-0">Your recent orders, products, and rentals will appear here.</p>}</div></>}{section === 'products' && <div className="farm-grid"><form className="farm-panel" onSubmit={addProduct}><h2>Add product for sale</h2><input className="form-control mb-2" required placeholder="Product name" value={product.productName} onChange={field(setProduct, product, 'productName')} /><input className="form-control mb-2" required placeholder="Category" value={product.category} onChange={field(setProduct, product, 'category')} /><textarea className="form-control mb-2" required placeholder="Description" value={product.description} onChange={field(setProduct, product, 'description')} /><div className="row g-2"><div className="col"><input className="form-control" required min="0" type="number" placeholder="Price" value={product.price} onChange={field(setProduct, product, 'price')} /></div><div className="col"><input className="form-control" required min="0" type="number" placeholder="Quantity" value={product.quantity} onChange={field(setProduct, product, 'quantity')} /></div></div><button className="btn btn-success mt-3">List product</button></form><div className="farm-panel"><h2>Manage products</h2>{products.length ? products.map((item) => <div className="simple-row" key={item._id}><div><b>{item.productName}</b><small>{item.category} · {item.quantity} available · ₹{item.price}</small></div><button className="btn btn-sm btn-outline-danger" onClick={() => removeProduct(item._id)}>Remove</button></div>) : <p className="text-muted">No products yet.</p>}</div></div>}{section === 'orders' && <div className="farm-panel"><h2>Received orders</h2>{orders.length ? orders.map((order) => <div className="order-row" key={order._id}><div><b>Order #{order._id.slice(-6)}</b><small>{order.products.map((item) => `${item.productName} × ${item.quantity}`).join(', ')} · ₹{order.totalAmount}</small></div><select className="form-select" value={order.orderStatus} onChange={(event) => updateOrder(order._id, event.target.value)}>{['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => <option key={status}>{status}</option>)}</select></div>) : <p className="text-muted">No orders received yet.</p>}</div>}{section === 'equipment' && <div className="farm-grid"><form className="farm-panel" onSubmit={requestRental}><h2>Rent agricultural equipment</h2><select className="form-select mb-2" required value={rental.equipment} onChange={field(setRental, rental, 'equipment')}><option value="">Choose available equipment</option>{equipment.map((item) => <option key={item._id} value={item._id}>{item.equipmentName} — ₹{item.rentalPrice}/day</option>)}</select><label className="form-label">Start date</label><input className="form-control mb-2" required type="date" value={rental.startDate} onChange={field(setRental, rental, 'startDate')} /><label className="form-label">End date</label><input className="form-control mb-3" required type="date" value={rental.endDate} onChange={field(setRental, rental, 'endDate')} /><button className="btn btn-success">Request rental</button></form><div className="farm-panel"><h2>Available equipment</h2>{equipment.map((item) => <div className="simple-row" key={item._id}><div><b>{item.equipmentName}</b><small>{item.category} · {item.location} · ₹{item.rentalPrice}/day</small></div></div>) || <p className="text-muted">No equipment available.</p>}</div></div>}{section === 'rentals' && <div className="farm-panel"><h2>Equipment rental requests</h2>{rentals.length ? rentals.map((item) => <div className="simple-row" key={item._id}><div><b>{item.equipment?.equipmentName}</b><small>{new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}</small></div><span className="status-pill">{item.requestStatus}</span></div>) : <p className="text-muted">No rental requests yet.</p>}</div>}{section === 'community' && <div className="farm-grid"><form className="farm-panel" onSubmit={createPost}><h2>Share with farmers</h2><input className="form-control mb-2" required placeholder="Post title" value={post.title} onChange={field(setPost, post, 'title')} /><textarea className="form-control mb-3" required placeholder="Share an experience or ask a question" value={post.content} onChange={field(setPost, post, 'content')} /><button className="btn btn-success">Publish post</button></form><div className="farm-panel"><h2>Recent community posts</h2>{posts.slice(0, 5).map((item) => <article className="community-post" key={item._id}><b>{item.title}</b><p>{item.content}</p><small>By {item.author?.name}</small></article>)}</div></div>}{section === 'profile' && <form className="farm-panel profile-panel" onSubmit={saveProfile}><h2>My profile</h2><label className="form-label">Name</label><input className="form-control mb-3" required value={name} onChange={(event) => setName(event.target.value)} /><label className="form-label">Email</label><input className="form-control mb-3" disabled value={user.email} /><label className="form-label">Account type</label><input className="form-control mb-3" disabled value="Farmer" /><button className="btn btn-success">Save profile</button></form>}</section></main>;
}

function FarmerDashboard() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState(blankProduct);
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [notice, setNotice] = useState('');

  const load = async () => {
    try {
      const [productResponse, orderResponse] = await Promise.all([api.get('/products'), api.get('/orders')]);
      setProducts(productResponse.data.filter((item) => item.farmer?._id === user.id));
      setOrders(orderResponse.data);
    } catch (error) { setNotice(error.response?.data?.message || 'Unable to load farmer data.'); }
  };
  useEffect(() => { load(); }, []);

  const listProduct = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData();
      Object.entries(product).forEach(([key, value]) => { if (value !== null && value !== '') data.append(key, value); });
      await api.post('/products', data);
      setProduct(blankProduct);
      setNotice('Product listed with its photo.');
      load();
    } catch (error) { setNotice(error.response?.data?.message || 'Unable to list product.'); }
  };
  const removeProduct = async (id) => { if (window.confirm('Remove this product listing?')) { await api.delete(`/products/${id}`); setNotice('Product removed.'); load(); } };
  const saveProfile = async (event) => { event.preventDefault(); try { const result = await api.put('/users/profile', { name, phone }); setUser(result.data.user); localStorage.user = JSON.stringify(result.data.user); setNotice('Profile updated.'); } catch { setNotice('Unable to update profile.'); } };
  const updateOrder = async (id, orderStatus) => { try { await api.put(`/orders/${id}/status`, { orderStatus }); setNotice('Order status updated.'); load(); } catch { setNotice('Unable to update order.'); } };
  const imagePreview = product.image ? URL.createObjectURL(product.image) : null;

  return <main className="farmer-dashboard"><aside className="farmer-sidebar"><div className="farmer-brand">AgroConnect</div><p className="farmer-user">Hello, <b>{user.name}</b></p>{[['products', 'My Products'], ['orders', 'Orders'], ['profile', 'My Profile']].map(([key, label]) => <button key={key} className={section === key ? 'active' : ''} onClick={() => setSection(key)}>{label}</button>)}<button className="logout" onClick={() => { logout(); navigate('/'); }}>Log out</button></aside><section className="farmer-content"><header className="farmer-header"><div><h1>{section === 'products' ? 'My Products' : section === 'orders' ? 'Customer Orders' : 'My Profile'}</h1><p>Manage your products, photos, and customer contacts.</p></div></header>{notice && <div className="alert alert-success">{notice}<button className="btn-close float-end" onClick={() => setNotice('')} /></div>}{section === 'products' && <div className="farm-grid"><form className="farm-panel" onSubmit={listProduct}><h2>Add product for sale</h2><input className="form-control mb-2" required placeholder="Product name" value={product.productName} onChange={(event) => setProduct({ ...product, productName: event.target.value })} /><input className="form-control mb-2" required placeholder="Category" value={product.category} onChange={(event) => setProduct({ ...product, category: event.target.value })} /><textarea className="form-control mb-2" required placeholder="Description" value={product.description} onChange={(event) => setProduct({ ...product, description: event.target.value })} /><div className="row g-2"><div className="col"><input className="form-control" required min="0" type="number" placeholder="Price" value={product.price} onChange={(event) => setProduct({ ...product, price: event.target.value })} /></div><div className="col"><input className="form-control" required min="0" type="number" placeholder="Quantity" value={product.quantity} onChange={(event) => setProduct({ ...product, quantity: event.target.value })} /></div></div><label className="form-label mt-3">Product photo</label><input className="form-control" required type="file" accept="image/*" onChange={(event) => setProduct({ ...product, image: event.target.files[0] || null })} />{imagePreview && <img className="listing-preview" src={imagePreview} alt="Product preview" />}<button className="btn btn-success mt-3">List product with photo</button></form><div className="farm-panel"><h2>Listed products</h2>{products.length ? products.map((item) => <article className="listing-row" key={item._id}>{item.image && <img src={`${api.defaults.baseURL.replace('/api', '')}${item.image}`} alt={item.productName} />}<div><b>{item.productName}</b><small>{item.category} · {item.quantity} available · Rs. {item.price}</small></div><button className="btn btn-sm btn-outline-danger" onClick={() => removeProduct(item._id)}>Remove</button></article>) : <p className="text-muted">No products yet.</p>}</div></div>}{section === 'orders' && <div className="farm-panel"><h2>Customer orders</h2>{orders.length ? orders.map((order) => <div className="order-row" key={order._id}><div><b>Order #{order._id.slice(-6)}</b><small>{order.products.map((item) => `${item.productName} × ${item.quantity}`).join(', ')} · Rs. {order.totalAmount}</small><small>Buyer: {order.buyer?.name} · Phone: {order.buyer?.phone || 'Not provided'}</small></div><select className="form-select" value={order.orderStatus} onChange={(event) => updateOrder(order._id, event.target.value)}>{['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => <option key={status}>{status}</option>)}</select></div>) : <p className="text-muted">No orders received yet.</p>}</div>}{section === 'profile' && <form className="farm-panel profile-panel" onSubmit={saveProfile}><h2>Contact details</h2><label className="form-label">Name</label><input className="form-control mb-3" required value={name} onChange={(event) => setName(event.target.value)} /><label className="form-label">Phone number</label><input className="form-control mb-3" required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} /><label className="form-label">Email</label><input className="form-control mb-3" disabled value={user.email} /><button className="btn btn-success">Save profile</button></form>}</section></main>;
}

function Stat({ label, value, icon }) { return <div className="farm-stat"><span>{icon}</span><div><small>{label}</small><b>{value}</b></div></div>; }

export default function RoleDashboard() { const { user } = useAuth(); return user?.role === 'farmer' ? <FarmerDashboard /> : user?.role === 'rentalOwner' ? <RentalOwnerDashboard /> : <Dashboard />; }
