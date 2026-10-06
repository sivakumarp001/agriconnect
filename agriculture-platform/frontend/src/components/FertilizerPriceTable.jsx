import React from 'react';
import { CheckIcon } from './FarmerIcons';

export default function FertilizerPriceTable({
  fertilizer,
  data,
  loading,
  error,
  onRetry,
  language = 'en'
}) {
  const isTa = language === 'ta';

  // Loading skeleton
  if (loading) {
    return (
      <div className="fert-results-panel" aria-busy="true">
        <div className="fert-skeleton-box">
          <div className="fert-skeleton-line" style={{ width: '45%' }} />
          <div className="fert-skeleton-line" style={{ width: '75%' }} />
          <div className="fert-skeleton-line" />
          <div className="fert-skeleton-line" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fert-results-panel">
        <div className="fert-error-box">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
            {isTa ? 'விலை விவரங்கள் பெற முடியவில்லை' : 'Unable to Fetch Fertilizer Prices'}
          </h3>
          <p style={{ fontSize: '1.1rem', margin: '0 0 1rem 0' }}>
            {isTa
              ? 'அரசு சர்வர் தற்போது பிஸியாக இருக்கலாம். தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
              : 'The government server may be temporarily busy. Please retry.'}
          </p>
          <button type="button" className="btn-retry-danger" onClick={onRetry}>
            🔄 {isTa ? 'மீண்டும் முயற்சிக்கவும்' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  if (!data || !Array.isArray(data.prices) || data.prices.length === 0) {
    return (
      <div className="fert-results-panel">
        <div className="fert-state-box">
          <p>
            {isTa
              ? 'தற்போது இந்த உரத்திற்கான விலை விவரங்கள் கிடைக்கவில்லை.'
              : 'Price details for this fertilizer are currently unavailable.'}
          </p>
        </div>
      </div>
    );
  }

  const { prices, unit = '50 kg', source, fetchedAt } = data;
  const lowestPrice = prices[0]; // Pre-sorted ascending from backend

  // English & Tamil fertilizer names
  const fertNameEn = fertilizer?.nameEn || data.fertilizerNameEn || 'Fertilizer';
  const fertNameTa = fertilizer?.nameTa || data.fertilizerNameTa || '';
  const displayName = isTa ? (fertNameTa || fertNameEn) : fertNameEn;
  const subName = isTa ? fertNameEn : fertNameTa;

  // Format unit label
  const unitLabel = unit.includes('45') ? '45 kg' : '50 kg';
  const unitLabelFull = isTa
    ? (unit.includes('45') ? 'ரூபாய் / 45 கிலோ' : 'ரூபாய் / 50 கிலோ')
    : `₹ / ${unitLabel}`;

  // Formatted date
  const formattedDate = fetchedAt
    ? new Date(fetchedAt).toLocaleString(isTa ? 'ta-IN' : 'en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'Recent';

  return (
    <div className="fert-results-panel" id="fert-results-section">
      {/* Offline Old-Cache Banner */}
      {source === 'old-cache' && (
        <div className="offline-cache-banner" role="alert">
          <span style={{ fontSize: '1.3rem' }}>⚠️</span>
          <span>
            {isTa
              ? 'இணைப்பு இல்லை, கடைசியாக சேமித்த விலை காட்டப்படுகிறது.'
              : 'Network offline: Displaying last saved price from database cache.'}
          </span>
        </div>
      )}

      {/* Header bar with Official Bag Print Warning */}
      <div className="fert-results-panel-head">
        <div>
          <h3 className="fert-bag-printed-warning">
            {isTa
              ? 'விவசாயிகள் உரங்களை மூட்டையில் அச்சடிக்கப்பட்ட விலையில் வாங்கி பயன் அடையவும்'
              : 'Farmers should purchase fertilizers at the price printed on the bag'}
          </h3>
          <p className="fert-bag-printed-warning-sub">
            {isTa
              ? `தேர்ந்தெடுக்கப்பட்ட உரம்: ${displayName}`
              : `Selected: ${displayName} · Bag: ${unitLabel}`}
          </p>
        </div>
      </div>

      {/* Table (Forest Green Header) */}
      <div className="fert-table-container">
        <table className="fert-screenshot-table">
          <thead>
            <tr>
              <th>{isTa ? 'வ.எண்' : 'S.No'}</th>
              <th>{isTa ? 'நிறுவனம்' : 'Company'}</th>
              <th>{isTa ? `விலை (${unitLabelFull})` : `Price (${unitLabelFull})`}</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((item, index) => {
              const isLowest = index === 0;
              const companyDisplay = isTa
                ? (item.companyTamil || item.company)
                : (item.company || item.companyTamil);

              return (
                <tr key={`${item.company}-${index}`} className={isLowest ? 'best-price-row' : ''}>
                  <td>{index + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: isLowest ? 800 : 600 }}>
                        {companyDisplay}
                      </span>
                      {isLowest && (
                        <span className="best-price-pill">
                          <CheckIcon size={13} /> {isTa ? 'குறைவான விலை' : 'Lowest Price'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{item.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer: source & timestamp */}
      <div className="fert-results-footer">
        <div className="fert-source-text">
          🏛️ {isTa
            ? 'மூலம்: அக்ரிஸ்நெட், தமிழ்நாடு வேளாண்மைத் துறை'
            : 'Source: Department of Agriculture & Farmers Welfare, Tamil Nadu'}
        </div>
        <div>
          🕒 {isTa ? 'கடைசியாக புதுப்பிக்கப்பட்டது: ' : 'Last Updated: '}
          {formattedDate}
          {' '}
          <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>
            ({source === 'live' ? (isTa ? 'நேரலை' : 'Live') : (isTa ? 'சேமிக்கப்பட்டது' : 'Cached')})
          </span>
        </div>
      </div>
    </div>
  );
}
