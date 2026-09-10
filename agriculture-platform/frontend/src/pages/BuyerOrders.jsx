import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]); const [error, setError] = useState('');
  useEffect(() => { api.get('/orders').then((response) => setOrders(response.data)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load purchases.')); }, []);
  return <main className="container py-5"><div className="d-flex justify-content-between align-items-center mb-4"><div><h1>My purchases</h1><p className="text-muted mb-0">Your farmer approval status appears here.</p></div><Link className="btn btn-outline-success" to="/products">Continue shopping</Link></div>{error && <div className="alert alert-danger">{error}</div>}{orders.length ? orders.map((order) => <article className="card shadow-sm mb-3" key={order._id}><div className="card-body d-flex justify-content-between align-items-start gap-3"><div><h2 className="h5">Order #{order._id.slice(-6)}</h2><p className="mb-1">{order.products.map((item) => `${item.productName} × ${item.quantity}`).join(', ')}</p><small className="text-muted">Placed {new Date(order.createdAt).toLocaleDateString()}</small></div><div className="text-end"><b>Rs. {order.totalAmount}</b><span className={`badge d-block mt-2 ${order.orderStatus === 'confirmed' ? 'text-bg-success' : order.orderStatus === 'cancelled' ? 'text-bg-danger' : 'text-bg-warning'}`}>{order.orderStatus === 'confirmed' ? 'Accepted by farmer' : order.orderStatus === 'cancelled' ? 'Rejected by farmer' : 'Waiting for farmer approval'}</span></div></div></article>) : !error && <p className="text-muted">You have not placed any purchases yet.</p>}</main>;
}
