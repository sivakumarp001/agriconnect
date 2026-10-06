import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import FertilizerPriceTable from '../components/FertilizerPriceTable';
import './FertilizerPrices.css';

export default function FertilizerPricePage() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('fert_lang') || 'en';
  });
  const isTa = language === 'ta';

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('fert_lang', lang);
  };

  const [fertilizers, setFertilizers] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState('');

  const [selectedId, setSelectedId] = useState('');
  const [currentFertilizer, setCurrentFertilizer] = useState(null);

  const [priceData, setPriceData] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState('');

  const resultsRef = useRef(null);

  // 1. Fetch fertilizer list on load
  const loadFertilizers = async () => {
    try {
      setLoadingList(true);
      setListError('');
      const res = await api.get('/fertilizers');
      const list = Array.isArray(res.data) ? res.data : [];
      setFertilizers(list);

      // Auto-load Urea (id 1) on first load
      if (list.length > 0) {
        const initial = list.find((f) => f.agrisnetId === '1') || list[0];
        if (initial) {
          setSelectedId(initial.agrisnetId);
          fetchPriceForId(initial.agrisnetId, initial, false);
        }
      }
    } catch (err) {
      console.error('Failed to load fertilizers list:', err);
      setListError('Unable to load fertilizer list. Please check internet connection.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadFertilizers();
  }, []);

  // 2. Fetch prices for given fertilizer ID
  const fetchPriceForId = async (agrisnetId, fertObj, shouldScroll = true) => {
    if (!agrisnetId) return;
    const targetFert = fertObj || fertilizers.find((f) => f.agrisnetId === agrisnetId);
    setCurrentFertilizer(targetFert || null);
    setLoadingPrice(true);
    setPriceError('');

    try {
      const res = await api.get(`/fertilizers/${agrisnetId}/prices`);
      setPriceData(res.data);
      if (shouldScroll && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } catch (err) {
      console.error(`Failed to fetch prices for ID ${agrisnetId}:`, err);
      setPriceError('Price not available now');
      setPriceData(null);
    } finally {
      setLoadingPrice(false);
    }
  };

  // Form submit handler (Search button)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!selectedId) {
      alert(isTa ? 'தயவுசெய்து ஒரு உரத்தைத் தேர்ந்தெடுக்கவும்.' : 'Please select a fertilizer from the dropdown.');
      return;
    }
    fetchPriceForId(selectedId, null, true);
  };

  // Dropdown change handler - live fetch on change
  const handleDropdownChange = (e) => {
    const val = e.target.value;
    setSelectedId(val);
    if (val) {
      const fert = fertilizers.find((f) => f.agrisnetId === val);
      fetchPriceForId(val, fert, false);
    } else {
      setPriceData(null);
      setCurrentFertilizer(null);
    }
  };

  return (
    <div className="fertilizer-page-wrapper">
      {/* Language Toggle */}
      <div className="fert-toolbar-row">
        <div className="lang-switch-box">
          <button
            type="button"
            className={`lang-switch-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => toggleLanguage('en')}
          >
            English
          </button>
          <button
            type="button"
            className={`lang-switch-btn ${language === 'ta' ? 'active' : ''}`}
            onClick={() => toggleLanguage('ta')}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {/* Green Alert Banner */}
      <div className="fert-alert-banner">
        <h2 className="fert-alert-banner-title">
          {isTa ? 'உரம் விலை விவரங்கள்' : 'Fertilizer Price Details'}
        </h2>
        <p className="fert-alert-banner-sub">
          {isTa
            ? 'தமிழ்நாடு வேளாண்மை & உழவர் நலத்துறை நேரடி விலை விவரங்கள்'
            : 'Department of Agriculture & Farmers Welfare, Government of Tamil Nadu'}
        </p>
      </div>

      {/* Selection Form */}
      <div className="fert-selection-panel">
        <form onSubmit={handleSearchSubmit} autoComplete="off">
          <div className="fert-form-group">
            <label className="fert-form-label" htmlFor="fert_select_input">
              {isTa ? 'உரம்' : 'Fertilizer'}
            </label>

            <select
              id="fert_select_input"
              name="fert_id"
              className="fert-dropdown-select"
              value={selectedId}
              onChange={handleDropdownChange}
              disabled={loadingList}
            >
              <option value="">
                {loadingList
                  ? (isTa ? 'ஏற்றப்படுகிறது...' : 'Loading fertilizers...')
                  : (isTa ? 'தேர்ந்தெடுக்கவும்' : 'SELECT')}
              </option>
              {fertilizers.map((fert) => {
                const en = fert.nameEn || fert.nameTa;
                const ta = fert.nameTa;
                const label = isTa ? `${ta} (${en})` : en;
                return (
                  <option key={fert.agrisnetId} value={fert.agrisnetId}>
                    {label}
                  </option>
                );
              })}
            </select>

            {listError && (
              <p style={{ color: '#b91c1c', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                ⚠️ {listError}
              </p>
            )}
          </div>

          {/* Centered Red Search Button */}
          <div className="fert-search-btn-wrap">
            <button
              type="submit"
              className="btn-fert-search"
              disabled={loadingPrice || !selectedId}
            >
              {loadingPrice
                ? (isTa ? 'தேடுகிறது...' : 'Searching...')
                : (isTa ? 'தேடுக' : 'Search')}
            </button>
          </div>
        </form>
      </div>

      {/* Results Panel */}
      <div ref={resultsRef}>
        <FertilizerPriceTable
          fertilizer={currentFertilizer}
          data={priceData}
          loading={loadingPrice}
          error={priceError}
          onRetry={() => fetchPriceForId(selectedId, currentFertilizer, false)}
          language={language}
        />
      </div>
    </div>
  );
}
