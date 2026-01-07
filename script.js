const CONFIG = {
    apis: {
        source1: 'https://ipinfo.io/',
        source2: 'http://ip-api.com/json/',
        source3: 'https://ipapi.co/',
        rdap: 'https://rdap.arin.net/registry/ip/'
    }
};

// Internal Directory of Verified Carrier Contacts
const CARRIER_DIRECTORY = [
    {
        name: 'Google LLC',
        keywords: ['google', 'gmail', 'youtube'],
        email: 'network-abuse@google.com',
        phone: '+1-650-253-0000',
        address: '1600 Amphitheatre Parkway, Mountain View, CA'
    },
    {
        name: 'Comcast Cable / Xfinity',
        keywords: ['comcast', 'xfinity', 'nbc'],
        email: 'abuse@comcast.net',
        phone: '+1-888-565-4329',
        address: '1800 Bishops Gate Blvd, Mount Laurel, NJ'
    },
    {
        name: 'Level 3 / Lumen',
        keywords: ['level3', 'level 3', 'lumen', 'centurylink'],
        email: 'abuse@level3.com',
        phone: '+1-877-453-8353',
        address: '1025 Eldorado Blvd, Broomfield, CO'
    },
    {
        name: 'Verizon Business',
        keywords: ['verizon', 'mci', 'uunet'],
        email: 'abuse@verizon.com',
        phone: '+1-800-444-1111',
        address: '22001 Loudoun County Pkwy, Ashburn, VA'
    },
    {
        name: 'AT&T Services',
        keywords: ['at&t', 'sbc', 'bellsouth'],
        email: 'abuse@att.net',
        phone: '+1-800-337-5373',
        address: '208 S. Akard St, Dallas, TX'
    },
    {
        name: 'T-Mobile USA',
        keywords: ['t-mobile', 'tmobile', 'sprint'],
        email: 'abuse@t-mobile.com',
        phone: '+1-877-746-0909',
        address: '12920 SE 38th St, Bellevue, WA'
    }
];

const UI = {
    input: document.getElementById('ipInput'),
    searchBtn: document.getElementById('searchBtn'),
    errorMsg: document.getElementById('errorMsg'),
    loading: document.getElementById('loadingState'),
    results: document.getElementById('resultsSection'),
    consensus: document.getElementById('consensusBadge'),
    aggCity: document.getElementById('aggCity'),
    aggRegion: document.getElementById('aggRegion'),
    aggCountry: document.getElementById('aggCountry'),
    aggIsp: document.getElementById('aggIsp'),
    aggCoords: document.getElementById('aggCoords'),
    aggCounty: document.getElementById('aggCounty'),

    // Contact Info
    contactSection: document.getElementById('contactSection'),
    abuseEmail: document.getElementById('abuseEmail'),
    abusePhone: document.getElementById('abusePhone'),
    abuseAddress: document.getElementById('abuseAddress'),

    source1: document.getElementById('source1Body'),
    source2: document.getElementById('source2Body'),
    source3: document.getElementById('source3Body'),

    // Toggles
    btnIP: document.getElementById('modeIP'),
    btnCarrier: document.getElementById('modeCarrier')
};

let currentMode = 'ip'; // 'ip' or 'carrier'
let map = null;
let marker = null;
let accuracyCircle = null;

document.addEventListener('DOMContentLoaded', () => {
    map = L.map('map').setView([39.8283, -98.5795], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
});

// Toggle Logic
window.switchMode = function (mode) {
    currentMode = mode;
    resetUI();
    UI.input.value = '';

    if (mode === 'ip') {
        UI.btnIP.classList.add('active');
        UI.btnCarrier.classList.remove('active');
        UI.input.placeholder = "Enter IP Address...";
    } else {
        UI.btnCarrier.classList.add('active');
        UI.btnIP.classList.remove('active');
        UI.input.placeholder = "Enter Carrier Name (e.g. Comcast)...";
    }
};

UI.searchBtn.addEventListener('click', handleSearch);
UI.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

async function handleSearch() {
    const term = UI.input.value.trim();
    if (!term) return;

    resetUI();
    showLoading(true);

    if (currentMode === 'ip') {
        if (!validateIP(term)) {
            showLoading(false);
            showError("Invalid IPv4 or IPv6 address format.");
            return;
        }
        await searchIP(term);
    } else {
        searchCarrier(term); // Synchronous lookup
        showLoading(false);
    }
}

// Carrier Search Logic
function searchCarrier(term) {
    const query = term.toLowerCase();

    // Find matching carriers by name or keyword
    const matches = CARRIER_DIRECTORY.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.keywords.some(k => k.includes(query))
    );

    if (matches.length === 0) {
        showError(`No verified contacts found for "${term}". Try "Google", "Comcast", or "Level3".`);
        return;
    }

    // Render results (using the existing contact section structure)
    // We'll hide the map/agg section and just show the contact card/list

    // For now, if multiple matches, just show the first one or create a list
    // Let's re-purpose the results section effectively

    UI.results.classList.remove('hidden');
    UI.consensus.classList.add('hidden'); // No consensus needed
    document.querySelector('.primary-result-card h2').textContent = "Carrier Directory Match";

    // Hide IP specific fields
    UI.aggCity.parentElement.style.display = 'none';
    UI.aggRegion.parentElement.style.display = 'none';
    UI.aggCountry.parentElement.style.display = 'none';
    UI.aggIsp.parentElement.style.display = 'none';
    UI.aggCounty.parentElement.style.display = 'none';
    document.querySelector('.map-container').style.display = 'none';
    document.querySelector('.sources-grid').style.display = 'none'; // Hide individual sources

    // Show the first match details in the Contact Section
    const match = matches[0];
    UI.contactSection.classList.remove('hidden');
    document.querySelector('#contactSection h3').textContent = match.name;
    UI.abuseEmail.textContent = match.email;
    UI.abusePhone.textContent = match.phone;
    UI.abuseAddress.textContent = match.address;

    // Show note if multiple matches
    if (matches.length > 1) {
        document.querySelector('.source-note').textContent = `Found ${matches.length} matches. Showing top result.`;
    } else {
        document.querySelector('.source-note').textContent = "Verified Internal Directory";
    }
}

async function searchIP(ip) {
    // Restore IP UI elements
    UI.consensus.classList.remove('hidden');
    document.querySelector('.primary-result-card h2').textContent = "Aggregated Location";
    UI.aggCity.parentElement.style.display = 'flex';
    UI.aggRegion.parentElement.style.display = 'flex';
    UI.aggCountry.parentElement.style.display = 'flex';
    UI.aggIsp.parentElement.style.display = 'flex';
    UI.aggCounty.parentElement.style.display = 'flex';
    document.querySelector('.map-container').style.display = 'block';
    document.querySelector('.sources-grid').style.display = 'grid';
    document.querySelector('#contactSection h3').textContent = "Carrier Contact (Exigent/Abuse)";
    document.querySelector('.source-note').textContent = "Source: Regional Internet Registry (RDAP)";

    try {
        const results = await Promise.allSettled([
            fetchSource1(ip),
            fetchSource2(ip),
            fetchSource3(ip),
            fetchRDAP(ip)
        ]);

        const data = {
            s1: results[0].status === 'fulfilled' ? results[0].value : null,
            s2: results[1].status === 'fulfilled' ? results[1].value : null,
            s3: results[2].status === 'fulfilled' ? results[2].value : null,
            rdap: results[3].status === 'fulfilled' ? results[3].value : null
        };

        const aggregation = aggregateResults(data);
        renderResults(aggregation, data);
        updateMap(aggregation.display);

    } catch (err) {
        showError("Critical error during search: " + err.message);
    } finally {
        showLoading(false);
    }
}

function updateMap(displayData) {
    if (!map) return;

    if (displayData && displayData.lat && displayData.lon) {
        map.invalidateSize();
        const lat = displayData.lat;
        const lon = displayData.lon;
        const zoom = 10;

        if (marker) map.removeLayer(marker);
        if (accuracyCircle) map.removeLayer(accuracyCircle);

        map.flyTo([lat, lon], zoom, { duration: 1.5 });

        marker = L.marker([lat, lon]).addTo(map)
            .bindPopup(`<b>${displayData.city}</b><br>${displayData.isp}`)
            .openPopup();

        accuracyCircle = L.circle([lat, lon], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.1,
            radius: 5000
        }).addTo(map);
    }
}

function validateIP(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipv4Regex.test(ip) || ip.includes(':');
}

function resetUI() {
    UI.errorMsg.classList.add('hidden');
    UI.results.classList.add('hidden');
    UI.contactSection.classList.add('hidden');
}

function showLoading(show) {
    if (show) {
        UI.loading.classList.remove('hidden');
    } else {
        UI.loading.classList.add('hidden');
    }
}

function showError(msg) {
    UI.errorMsg.textContent = msg;
    UI.errorMsg.classList.remove('hidden');
}

// JSONP Helper
function fetchJSONP(url, callbackParam = 'callback') {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonp_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error('JSONP timeout'));
        }, 8000);

        function cleanup() {
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
            clearTimeout(timeout);
        }

        window[callbackName] = (data) => {
            cleanup();
            resolve(data);
        };

        const script = document.createElement('script');
        const separator = url.includes('?') ? '&' : '?';
        script.src = `${url}${separator}${callbackParam}=${callbackName}`;
        script.onerror = () => {
            cleanup();
            reject(new Error('JSONP request failed'));
        };
        document.body.appendChild(script);
    });
}

// API Fetchers
async function fetchSource1(ip) {
    return fetchJSONP(`${CONFIG.apis.source1}${ip}/json`, 'callback');
}

async function fetchSource2(ip) {
    return fetchJSONP(`${CONFIG.apis.source2}${ip}?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as`, 'callback');
}

async function fetchSource3(ip) {
    return fetchJSONP(`${CONFIG.apis.source3}${ip}/jsonp`, 'callback');
}

async function fetchRDAP(ip) {
    try {
        const res = await fetch(`${CONFIG.apis.rdap}${ip}`);
        if (!res.ok) throw new Error('RDAP fetch failed');
        return await res.json();
    } catch (e) {
        console.warn('RDAP failed (likely CORS or rate limit):', e);
        return null;
    }
}

function extractContactInfo(rdapData) {
    if (!rdapData || !rdapData.entities) return null;
    let abuseInfo = { email: null, phone: null, address: null };

    function searchEntities(entities) {
        for (const entity of entities) {
            if (entity.roles && entity.roles.includes('abuse')) {
                parseVCard(entity.vcardArray, abuseInfo);
            }
            if (entity.entities) {
                searchEntities(entity.entities);
            }
        }
    }

    function parseVCard(vcardArray, targetObj) {
        if (!vcardArray || vcardArray.length < 2) return;
        const properties = vcardArray[1];

        for (const prop of properties) {
            const type = prop[0];
            const val = prop[3];

            if (type === 'email') targetObj.email = val;
            if (type === 'tel') targetObj.phone = val;
            if (type === 'adr') {
                targetObj.address = Array.isArray(val) ? val.filter(Boolean).join(', ') : val;
            }
        }
    }

    searchEntities(rdapData.entities);
    return (abuseInfo.email || abuseInfo.phone || abuseInfo.address) ? abuseInfo : null;
}

function aggregateResults(data) {
    const sources = [];

    if (data.s1) {
        const [lat, lon] = (data.s1.loc || '').split(',');
        sources.push({
            source: 'ipinfo.io',
            city: data.s1.city,
            region: data.s1.region,
            country: data.s1.country,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            isp: data.s1.org || '--',
            county: '--'
        });
    }

    if (data.s2 && data.s2.status !== 'fail') {
        sources.push({
            source: 'ip-api.com',
            city: data.s2.city,
            region: data.s2.regionName,
            country: data.s2.country,
            lat: data.s2.lat,
            lon: data.s2.lon,
            isp: data.s2.org || data.s2.isp || '--',
            county: data.s2.district || '--'
        });
    }

    if (data.s3 && !data.s3.error) {
        sources.push({
            source: 'ipapi.co',
            city: data.s3.city,
            region: data.s3.region,
            country: data.s3.country_name,
            lat: data.s3.latitude,
            lon: data.s3.longitude,
            isp: data.s3.org || '--',
            county: '--'
        });
    }

    const primary = sources[0] || {};
    const bestSourceForCounty = sources.find(s => s.county !== '--');
    if (bestSourceForCounty) primary.county = bestSourceForCounty.county;

    const contact = extractContactInfo(data.rdap);
    const cities = sources.map(s => s.city).filter(Boolean);
    const distinctCities = new Set(cities);
    const consensusHigh = distinctCities.size === 1 && sources.length > 1;

    return {
        display: primary,
        consensus: consensusHigh,
        sourceCount: sources.length,
        contact: contact,
        sources: sources
    };
}

function renderResults(agg, rawData) {
    UI.results.classList.remove('hidden');

    UI.consensus.className = 'consensus-badge ' + (agg.consensus ? 'consensus-high' : 'consensus-low');
    const badgeText = agg.consensus
        ? `High Consensus (${agg.sourceCount} Sources Match)`
        : `Low Consensus / Single Source (${agg.sourceCount} sources)`;
    UI.consensus.innerHTML = agg.consensus ? `✅ ${badgeText}` : `⚠️ ${badgeText}`;

    const d = agg.display;
    UI.aggCity.textContent = d.city || 'Unknown';
    UI.aggRegion.textContent = d.region || 'Unknown';
    UI.aggCountry.textContent = d.country || 'Unknown';
    UI.aggIsp.textContent = d.isp || 'Unknown';
    UI.aggCoords.textContent = (d.lat && d.lon) ? `${d.lat}, ${d.lon}` : 'Not available';
    UI.aggCounty.textContent = d.county ? d.county : 'Not available';

    if (agg.contact) {
        UI.contactSection.classList.remove('hidden');
        UI.abuseEmail.textContent = agg.contact.email || '--';
        UI.abusePhone.textContent = agg.contact.phone || '--';
        UI.abuseAddress.textContent = agg.contact.address || '--';
    } else {
        UI.contactSection.classList.add('hidden');
    }

    renderSourceCard(UI.source1, rawData.s1, 'ipinfo.io');
    renderSourceCard(UI.source2, rawData.s2, 'ip-api.com');
    renderSourceCard(UI.source3, rawData.s3, 'ipapi.co');
}

function renderSourceCard(el, data, title) {
    if (!data || data.status === 'fail' || data.error) {
        el.innerHTML = '<span style="color:var(--danger)">Failed to fetch/parse</span>';
        return;
    }
    let content = '';
    if (title.includes('ipinfo')) {
        content = `<p><strong>City:</strong> ${data.city}</p><p><strong>Org:</strong> ${data.org}</p>`;
    } else if (title.includes('ip-api')) {
        content = `<p><strong>City:</strong> ${data.city}</p><p><strong>District:</strong> ${data.district || '--'}</p><p><strong>ISP:</strong> ${data.isp}</p>`;
    } else if (title.includes('ipapi.co')) {
        content = `<p><strong>City:</strong> ${data.city}</p><p><strong>ISP:</strong> ${data.org}</p>`;
    }
    el.innerHTML = content;
}
