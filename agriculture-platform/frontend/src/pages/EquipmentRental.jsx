import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './EquipmentRental.css';

const fallbackImage = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=80';
const origin = api.defaults.baseURL.replace(/\/api\/?$/, '');
const imageUrl = (image) => !image ? fallbackImage : /^https?:\/\//i.test(image) ? image : `${origin}/${image.replace(/^[/\\]+/, '').replace(/\\/g, '/')}`;

export default function EquipmentRental() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ equipment: '', acres: '' });
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const response = await api.get('/equipment', { params: { search } });
      setEquipment(response.data);
    } catch {
      setNotice('Unable to load equipment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search]);

  const choose = (item) => {
    setSelected(item);
    setForm({ ...form, equipment: item._id });
    document.getElementById('rental-request')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/rentals', form);
      setNotice('Rental request sent successfully.');
      setForm({ equipment: '', acres: '' });
      setSelected(null);
    } catch (error) {
      setNotice(error.response?.data?.message || 'Unable to send rental request.');
    }
  };

  return (
    <main className="equipment-rental-page">
      <section className="equipment-intro"><div className="container"><span>AGRICULTURAL EQUIPMENT</span><h1>Find the right equipment for your farm</h1><p>Browse reliable machinery from verified local equipment owners, view details, and request a booking in minutes.</p></div></section>
      <section className="container py-5">
        {notice && <div className="alert alert-success d-flex justify-content-between">{notice}<button className="btn-close" onClick={() => setNotice('')} aria-label="Dismiss message" /></div>}
        <div className="equipment-page-head"><div><h2>Available equipment</h2><p>Choose from equipment available for rental near you.</p></div><div className="equipment-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tractors, harvesters..." /></div></div>
        {loading ? <div className="equipment-loading">Loading available equipment...</div> : (
          <div className="rental-layout">
            <div className="equipment-card-grid">
              {equipment.length ? equipment.map((item) => (
                <article className={`rental-equipment-card ${selected?._id === item._id ? 'selected' : ''}`} key={item._id}>
                  <div className="rental-image-wrap"><img src={imageUrl(item.image)} alt={item.equipmentName} onError={(event) => { event.currentTarget.src = fallbackImage; }} /><span className={item.availability ? 'equipment-status available' : 'equipment-status unavailable'}>{item.availability ? 'Available now' : 'Unavailable'}</span></div>
                  <div className="rental-card-content"><p className="rental-category">{item.category}</p><h3>{item.equipmentName}</h3><p className="rental-meta"><span>Location: {item.location}</span><span>Owner: {item.owner?.name || 'Equipment owner'}</span>{item.owner?.phone && <a className="rental-phone" href={`tel:${item.owner.phone}`}>Phone: {item.owner.phone}</a>}</p><div className="rental-price"><b>Rs. {item.rentalPrice}</b><span>per hour</span></div><Link className="btn btn-success w-100" to={`/equipment/${item._id}`}>{item.availability ? 'View details & book' : 'View details'}</Link></div>
                </article>
              )) : <div className="equipment-empty"><h3>No equipment found</h3><p>Try a different search term.</p></div>}
            </div>
            <aside className="rental-request-panel" id="rental-request">
              <h2>Request equipment</h2>
              {selected ? <div className="selected-equipment"><img src={imageUrl(selected.image)} alt="" onError={(event) => { event.currentTarget.src = fallbackImage; }} /><div><b>{selected.equipmentName}</b><small>Rs. {selected.rentalPrice} per hour</small></div><button onClick={() => { setSelected(null); setForm({ ...form, equipment: '' }); }} aria-label="Remove selected equipment">x</button></div> : <p className="text-muted">Select available equipment to start your request.</p>}
              <form onSubmit={submit}>
                <label className="form-label">Equipment</label>
                <select className="form-select mb-3" required value={form.equipment} onChange={(event) => { const item = equipment.find((entry) => entry._id === event.target.value); setForm({ ...form, equipment: event.target.value }); setSelected(item || null); }}><option value="">Choose equipment</option>{equipment.filter((item) => item.availability).map((item) => <option key={item._id} value={item._id}>{item.equipmentName} - Rs. {item.rentalPrice}/hour</option>)}</select>
                <label className="form-label">Farm area (acres)</label><input className="form-control mb-3" required min="0.01" step="0.01" type="number" placeholder="Example: 2.5" value={form.acres} onChange={(event) => setForm({ ...form, acres: event.target.value })} />
                <button className="btn btn-success w-100" disabled={!form.equipment || user?.role !== 'farmer'}>Send rental request</button>
              </form>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
