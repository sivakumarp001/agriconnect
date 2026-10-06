import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { TAMIL_NADU_DISTRICTS } from '../constants/tamilNaduLocations';

export default function AdminDashboard() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState({ name: '', phone: '', location: '' });
  const [notice, setNotice] = useState('');
  const [doctorLocationFilter, setDoctorLocationFilter] = useState('');
  const [doctorSearchFilter, setDoctorSearchFilter] = useState('');

  const load = async () => {
    try {
      const [userData, productData, doctorData] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/products'),
        api.get('/agri-doctors')
      ]);
      setUsers(userData.data);
      setProducts(productData.data);
      setDoctors(doctorData.data);
    } catch (error) {
      setNotice(error.response?.data?.message || 'Unable to load admin data.');
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (path, id, label) => {
    if (!window.confirm(`Remove this ${label}?`)) return;
    try {
      await api.delete(`${path}/${id}`);
      setNotice(`${label} removed.`);
      load();
    } catch (error) {
      setNotice(error.response?.data?.message || `Unable to remove ${label}.`);
    }
  };

  const addDoctor = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/agri-doctors', doctor);
      setDoctor({ name: '', phone: '', location: '' });
      setNotice('Agricultural doctor added.');
      load();
    } catch (error) {
      setNotice(error.response?.data?.message || 'Unable to add doctor.');
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchLoc = !doctorLocationFilter || (doc.location && doc.location.toLowerCase().includes(doctorLocationFilter.toLowerCase()));
    const matchSearch = !doctorSearchFilter || (
      (doc.name && doc.name.toLowerCase().includes(doctorSearchFilter.toLowerCase())) ||
      (doc.location && doc.location.toLowerCase().includes(doctorSearchFilter.toLowerCase())) ||
      (doc.phone && doc.phone.includes(doctorSearchFilter))
    );
    return matchLoc && matchSearch;
  });

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="text-success fw-semibold">ADMINISTRATION</span>
          <h1>Platform management</h1>
        </div>
      </div>

      {notice && (
        <div className="alert alert-info">
          {notice}
          <button className="btn-close float-end" onClick={() => setNotice('')} />
        </div>
      )}

      <div className="btn-group mb-4">
        {[
          ['users', 'Users'],
          ['products', 'Products'],
          ['doctors', 'Agri doctors']
        ].map(([key, label]) => (
          <button
            key={key}
            className={`btn ${tab === key ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <section className="card shadow-sm">
          <div className="card-body">
            <h2 className="h4">All users</h2>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td><span className="badge text-bg-secondary">{item.role}</span></td>
                      <td>
                        {item.role !== 'admin' && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => remove('/admin/users', item._id, 'user')}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {tab === 'products' && (
        <section className="card shadow-sm">
          <div className="card-body">
            <h2 className="h4">All product listings</h2>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Farmer</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item._id}>
                      <td>{item.productName}</td>
                      <td>{item.farmer?.name}</td>
                      <td>Rs. {item.price}</td>
                      <td>{item.isSold ? 'Sold' : 'Available'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove('/admin/products', item._id, 'product')}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {tab === 'doctors' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <form className="card card-body shadow-sm" onSubmit={addDoctor}>
              <h2 className="h4">Add agricultural doctor</h2>
              <p className="text-muted small">Register a verified agricultural specialist.</p>
              
              <label className="form-label small fw-semibold">Doctor Name</label>
              <input
                className="form-control mb-2"
                required
                placeholder="Dr. S. Murugan / Specialist"
                value={doctor.name}
                onChange={(event) => setDoctor({ ...doctor, name: event.target.value })}
              />

              <label className="form-label small fw-semibold">Contact Phone Number</label>
              <input
                className="form-control mb-2"
                required
                placeholder="Example: 9876543210"
                value={doctor.phone}
                onChange={(event) => setDoctor({ ...doctor, phone: event.target.value })}
              />

              <label className="form-label small fw-semibold">Location / District</label>
              <input
                className="form-control mb-3"
                required
                list="tn-districts-datalist"
                placeholder="Select or enter district (e.g., Coimbatore)"
                value={doctor.location}
                onChange={(event) => setDoctor({ ...doctor, location: event.target.value })}
              />
              <datalist id="tn-districts-datalist">
                {TAMIL_NADU_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist} />
                ))}
              </datalist>

              <button className="btn btn-success">Add doctor</button>
            </form>
          </div>

          <div className="col-lg-7">
            <section className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h4 mb-0">Doctor contacts ({filteredDoctors.length})</h2>
                </div>

                {/* Filter Controls for Doctors */}
                <div className="bg-light p-2 mb-3 rounded border">
                  <div className="row g-2">
                    <div className="col-sm-6">
                      <select
                        className="form-select form-select-sm"
                        value={doctorLocationFilter}
                        onChange={(e) => setDoctorLocationFilter(e.target.value)}
                      >
                        <option value="">All Locations</option>
                        {TAMIL_NADU_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <input
                        className="form-control form-control-sm"
                        placeholder="Search name or location..."
                        value={doctorSearchFilter}
                        onChange={(e) => setDoctorSearchFilter(e.target.value)}
                      />
                    </div>
                  </div>
                  {(doctorLocationFilter || doctorSearchFilter) && (
                    <div className="d-flex justify-content-end align-items-center mt-2 pt-2 border-top">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary px-3 py-1"
                        onClick={() => {
                          setDoctorLocationFilter('');
                          setDoctorSearchFilter('');
                        }}
                      >
                        ✕ Clear Filters
                      </button>
                    </div>
                  )}
                </div>

                {filteredDoctors.length ? (
                  filteredDoctors.map((item) => (
                    <div
                      className="d-flex justify-content-between align-items-center border-bottom py-3"
                      key={item._id}
                    >
                      <div>
                        <b>{item.name}</b>
                        <small className="d-block text-muted">
                          <span className="badge text-bg-light border me-2">📍 {item.location}</span>
                          <a href={`tel:${item.phone}`}>{item.phone}</a>
                        </small>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove('/admin/agri-doctors', item._id, 'doctor')}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted mb-0">
                    {doctorLocationFilter || doctorSearchFilter
                      ? 'No doctors match the selected filters.'
                      : 'No agricultural doctors added yet.'}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </main>
  );
}
