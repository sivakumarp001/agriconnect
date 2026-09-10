import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { imageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './DetailPages.css';

const Photo = ({ src, alt }) => src ? <img className="detail-photo" src={imageUrl(src)} alt={alt} /> : <div className="detail-photo detail-photo-empty">No photo uploaded</div>;
const Contact = ({ title, person }) => <div className="contact-card"><strong>{title}</strong><span>{person?.name || 'Not provided'}</span>{person?.phone ? <a href={`tel:${person.phone}`}>Phone: {person.phone}</a> : <span>Phone not provided</span>}</div>;

export function ProductDetailPage() {
  const { id } = useParams(); const { user } = useAuth(); const [product, setProduct] = useState(null);
  useEffect(() => { api.get(`/products/${id}`).then((response) => setProduct(response.data)); }, [id]);
  if (!product) return <main className="container py-5">Loading product...</main>;
  const addToCart = () => { const cart = JSON.parse(localStorage.cart || '[]'); const existing = cart.find((item) => item._id === product._id); existing ? existing.cartQuantity += 1 : cart.push({ ...product, cartQuantity: 1 }); localStorage.cart = JSON.stringify(cart); alert('Added to cart'); };
  return <main className="container py-5"><div className="row g-4 detail-layout"><div className="col-md-6"><Photo src={product.image} alt={product.productName} /></div><div className="col-md-6"><span className="text-success">{product.category}</span><h1>{product.productName}</h1><p>{product.description}</p><h3>Rs. {product.price}/unit</h3><p>{product.quantity} units available</p><Contact title="Seller details" person={product.farmer} />{user?.role === 'buyer' && <button className="btn btn-success" onClick={addToCart}>Add to cart</button>}</div></div></main>;
}

export function EquipmentDetailPage() {
  const { id } = useParams(); const { user } = useAuth(); const [equipment, setEquipment] = useState(null); const [acres, setAcres] = useState(''); const [notice, setNotice] = useState('');
  useEffect(() => { api.get(`/equipment/${id}`).then((response) => setEquipment(response.data)); }, [id]);
  if (!equipment) return <main className="container py-5">Loading equipment...</main>;
  const requestRental = async (event) => { event.preventDefault(); try { await api.post('/rentals', { equipment: equipment._id, acres }); setAcres(''); setNotice('Rental request sent. The equipment owner can now review it in their dashboard.'); } catch (error) { setNotice(error.response?.data?.message || 'Unable to send rental request.'); } };
  return <main className="container py-5"><Link className="btn btn-outline-success mb-4" to="/equipment">← Back to equipment</Link><div className="row g-4 detail-layout"><div className="col-md-6"><Photo src={equipment.image} alt={equipment.equipmentName} /></div><div className="col-md-6"><span className="text-success">{equipment.category}</span><h1>{equipment.equipmentName}</h1><p>{equipment.description}</p><h3>Rs. {equipment.rentalPrice}/hour</h3><p>Location: {equipment.location}</p><Contact title="Equipment owner details" person={equipment.owner} />{equipment.attachments?.length > 0 && <section className="mt-4"><h2 className="h5">Included tractor attachments</h2><div className="row g-2">{equipment.attachments.map((attachment, index) => <div className="col-sm-6" key={`${attachment.name}-${index}`}><div className="border rounded p-2 h-100"><b>{attachment.name}</b>{attachment.image && <img className="img-fluid rounded mt-2" style={{ width: '100%', height: 120, objectFit: 'cover' }} src={imageUrl(attachment.image)} alt={attachment.name} />}</div></div>)}</div></section>}{user?.role === 'farmer' && <form className="contact-card" onSubmit={requestRental}><strong>Book this equipment</strong><label className="form-label">Farm area (acres)</label><input className="form-control" required min="0.01" step="0.01" type="number" placeholder="Example: 2.5" value={acres} onChange={(event) => setAcres(event.target.value)} /><small>Tell the owner how many acres need to be worked.</small><button className="btn btn-success align-self-start" disabled={!equipment.availability}>Send booking request</button>{!equipment.availability && <small className="text-danger">This equipment is currently unavailable.</small>}</form>}{user && user.role !== 'farmer' && <p className="text-muted">Sign in as a farmer to request this equipment.</p>}{notice && <div className={notice.startsWith('Rental request sent') ? 'alert alert-success mt-3' : 'alert alert-danger mt-3'}>{notice}</div>}</div></div></main>;
}
