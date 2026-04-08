import './style.css';

// ---- Map setup ----
const map = L.map('map', { zoomControl: false }).setView([1.3521, 103.8198], 12);

L.control.zoom({ position: 'topright' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19
}).addTo(map);

// ---- Custom marker icon ----
const markerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
  <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.268 21.732 0 14 0z" fill="#2a5a3a" stroke="#1a3a2a" stroke-width="1"/>
  <circle cx="14" cy="13" r="6" fill="#f5f0e8"/>
  <path d="M14 8c0 0-3 2.5-3 5s1.5 3 3 3 3-.5 3-3-3-5-3-5z" fill="#2a5a3a"/>
</svg>`;

function createIcon() {
  return L.divIcon({
    html: markerSvg,
    className: '',
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -34]
  });
}

// ---- DOM refs ----
const searchInput  = document.getElementById('searchInput');
const gardenListEl = document.getElementById('gardenList');
const counterEl    = document.getElementById('counter');
const loadingEl    = document.getElementById('loading');
const sidebar      = document.getElementById('sidebar');
const mobileToggle = document.getElementById('mobileToggle');
const backdrop     = document.getElementById('backdrop');

// ---- State ----
let gardens = [];   // { name, lat, lng, marker, feature }
let filtered = [];
let userLocation = null;  // { lat, lng } when geolocation is granted

// ---- Mobile sidebar toggle ----
function toggleSidebar() {
  sidebar.classList.toggle('open');
  backdrop.classList.toggle('visible');
}
mobileToggle.addEventListener('click', toggleSidebar);
backdrop.addEventListener('click', toggleSidebar);

// ---- Render list & counter ----
function render() {
  const query = searchInput.value.trim().toLowerCase();
  filtered = query
    ? gardens.filter(g => g.name.toLowerCase().includes(query))
    : [...gardens];

  if (userLocation) {
    filtered.sort((a, b) => haversine(userLocation, a) - haversine(userLocation, b));
    counterEl.textContent = `${filtered.length} of ${gardens.length} gardens · sorted by distance`;
  } else {
    counterEl.textContent = `${filtered.length} of ${gardens.length} gardens shown`;
  }

  // Show / hide markers
  gardens.forEach(g => {
    if (filtered.includes(g)) {
      if (!map.hasLayer(g.marker)) g.marker.addTo(map);
    } else {
      map.removeLayer(g.marker);
    }
  });

  // Rebuild list
  gardenListEl.innerHTML = '';
  filtered.forEach(g => {
    const item = document.createElement('div');
    item.className = 'garden-item';
    const distHtml = userLocation
      ? `<span class="distance">${formatDistance(haversine(userLocation, g))}</span>`
      : '';
    item.innerHTML = `<span class="dot"></span><span class="name">${escapeHtml(g.name)}</span>${distHtml}`;
    item.addEventListener('click', () => {
      map.flyTo([g.lat, g.lng], 17, { duration: 0.8 });
      g.marker.openPopup();
      if (window.innerWidth <= 768) toggleSidebar();
    });
    gardenListEl.appendChild(item);
  });
}

searchInput.addEventListener('input', render);

// ---- Helpers ----
function escapeHtml(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

function haversine(from, to) {
  const R = 6371;
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

function popupContent(name, lat, lng) {
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  return `<div class="popup-name">${escapeHtml(name)}</div>
          <a class="popup-directions" href="${dirUrl}" target="_blank" rel="noopener">Get Directions</a>`;
}

// ---- Fetch data ----
async function loadGardens() {
  try {
    let geojson;
    if (import.meta.env.DEV) {
      const pollRes = await fetch('https://api-open.data.gov.sg/v1/public/api/datasets/d_f91a8b057cfb2bebf2e531ad8061e1c1/poll-download');
      const pollData = await pollRes.json();
      const downloadUrl = pollData.data.url.replace('https://s3.ap-southeast-1.amazonaws.com', '/s3-proxy');
      geojson = await (await fetch(downloadUrl)).json();
    } else {
      geojson = await (await fetch('/geojson')).json();
    }

    geojson.features.forEach(feature => {
      const props = feature.properties;
      const name = props.GARDEN_NAME || props.garden_name || 'Unnamed Garden';
      const lat = parseFloat(props.LATITUDE || props.latitude) || feature.geometry.coordinates[1];
      const lng = parseFloat(props.LONGITUDE || props.longitude) || feature.geometry.coordinates[0];

      if (isNaN(lat) || isNaN(lng)) return;

      const marker = L.marker([lat, lng], { icon: createIcon() })
        .bindPopup(popupContent(name, lat, lng));

      marker.addTo(map);
      gardens.push({ name, lat, lng, marker, feature });
    });

    gardens.sort((a, b) => a.name.localeCompare(b.name));

    // Fit bounds
    if (gardens.length) {
      const group = L.featureGroup(gardens.map(g => g.marker));
      map.fitBounds(group.getBounds().pad(0.05));
    }

    render();
  } catch (err) {
    console.error('Failed to load garden data:', err);
    counterEl.textContent = 'Failed to load data. Please refresh.';
  } finally {
    loadingEl.classList.add('hidden');
  }
}

// ---- User location ----
function getUserLocation() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    userLocation = { lat: coords.latitude, lng: coords.longitude };

    const dotHtml = `<div class="user-location-dot"><div class="user-location-pulse"></div></div>`;
    L.marker([userLocation.lat, userLocation.lng], {
      icon: L.divIcon({ html: dotHtml, className: '', iconSize: [20, 20], iconAnchor: [10, 10] }),
      zIndexOffset: 1000
    }).addTo(map);

    render();
  }, () => { /* denied or unavailable — do nothing */ }, { timeout: 10000 });
}

loadGardens();
getUserLocation();
