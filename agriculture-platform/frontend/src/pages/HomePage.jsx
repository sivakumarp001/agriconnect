import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return <main className="simple-home"><section className="simple-hero"><div className="container simple-hero-content"><div className="market-logo" aria-label="Integrated Farmer Market Place logo"><div className="market-logo-mark">🌳</div><div><strong>INTEGRATED FARMER</strong><b>MARKET PLACE</b><small>Cultivating Community. Connecting Markets.</small></div></div><span className="simple-badge">Growing together</span><h1>From farm to community,<br />all in one place.</h1><p>Sell produce fairly, rent reliable machinery, and share knowledge with farmers across the country.</p><div className="d-flex flex-wrap gap-2"><Link className="btn btn-warning btn-lg" to="/products">Explore marketplace</Link><Link className="btn btn-light btn-lg" to="/register">Create an account</Link></div></div></section><section className="container simple-features"><h2>Everything agriculture needs</h2><div className="row g-4"><Feature title="Direct marketplace" text="Farmers sell fresh produce directly to buyers." /><Feature title="Equipment rental" text="Find reliable machinery near your farm." /><Feature title="Farmer community" text="Share knowledge and grow together." /></div></section></main>;
}

function Feature({ title, text }) { return <div className="col-md-4"><article className="simple-feature"><h3>{title}</h3><p>{text}</p></article></div>; }
