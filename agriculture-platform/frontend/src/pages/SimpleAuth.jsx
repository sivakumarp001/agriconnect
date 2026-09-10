import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './SimpleAuth.css';

const roles = [
  { value: 'farmer', label: 'Farmer', icon: 'Farmer' },
  { value: 'buyer', label: 'Buyer', icon: 'Buyer' },
  { value: 'rentalOwner', label: 'Equipment', icon: 'Owner' },
];

export default function SimpleAuth({ mode }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'farmer' });
  const [error, setError] = useState('');
  const registering = mode === 'register';
  const set = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await api.post(`/auth/${mode}`, form);
      login(response.data);
      navigate(response.data.user.role === 'buyer' ? '/products' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to continue.');
    }
  };

  return <main className="auth-page"><section className="auth-visual"><Link className="auth-logo" to="/"><span>AgroConnect</span></Link><div className="auth-visual-copy"><h1>{registering ? 'Cultivating Digital Growth.' : 'Growing better, together.'}</h1><p>{registering ? 'Join a trusted platform connecting farmers, buyers, and equipment owners across the agricultural supply chain.' : 'Sign in to manage your farm business, purchases, rentals, and community.'}</p></div></section><section className="auth-form-area"><div className="auth-form-card"><div className="auth-heading"><h2>{registering ? 'Create your account' : 'Welcome back'}</h2><p>{registering ? 'Select how you want to use the platform to get started.' : 'Enter your details to continue to AgroConnect.'}</p></div>{error && <div className="alert alert-danger py-2">{error}</div>}<form onSubmit={submit}>{registering && <><label className="form-label">I am joining as a...</label><div className="role-options">{roles.map((role) => <button type="button" key={role.value} className={form.role === role.value ? 'selected' : ''} onClick={() => setForm({ ...form, role: role.value })}><span>{role.icon}</span>{role.label}</button>)}</div><hr /><label className="form-label">Full name</label><input className="form-control mb-3" required placeholder="Jane Doe" value={form.name} onChange={set('name')} /><label className="form-label">Phone number</label><input className="form-control mb-3" type="tel" required placeholder="9876543210" value={form.phone} onChange={set('phone')} /></>}<label className="form-label">Email address</label><input className="form-control mb-3" type="email" required placeholder="name@example.com" value={form.email} onChange={set('email')} /><label className="form-label">Password</label><input className="form-control mb-2" type="password" required placeholder="Enter your password" value={form.password} onChange={set('password')} />{registering && <p className="auth-help">Your number is shared only with the other party in a product order or rental request.</p>}<button className="auth-submit" type="submit">{registering ? 'Create account' : 'Sign in'} <span>→</span></button></form><p className="auth-switch">{registering ? <>Already have an account? <Link to="/login">Sign in</Link></> : <>New to AgroConnect? <Link to="/register">Create an account</Link></>}</p></div></section></main>;
}
