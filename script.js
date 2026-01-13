const CONFIG = {
    apis: {
        source1: 'https://ipinfo.io/',
        source2: 'http://ip-api.com/json/', // Back to ip-api, HTTP needed for free tier
        source3: 'https://ipapi.co/jsonp/', // ipapi.co supports JSONP on HTTPS
        rdap: 'https://rdap.arin.net/registry/ip/'
    }
};

const CARRIER_DIRECTORY = [
    {
        name: 'Google LLC',
        keywords: ['google', 'gmail', 'youtube'],
        email: 'network-abuse@google.com',
        phone: '+1-650-253-0000',
        address: '1600 Amphitheatre Parkway, Mountain View, CA'
    },
    {
        name: 'Comcast / Xfinity',
        keywords: ['comcast', 'xfinity', 'nbc'],
        email: 'abuse@comcast.net',
        phone: '+1-888-565-4329 (LE Support)',
        address: '1800 Bishops Gate Blvd, Mount Laurel, NJ'
    },
    {
        name: 'Charter / Spectrum',
        keywords: ['charter', 'spectrum', 'time warner'],
        email: 'leroc@charter.com',
        phone: '833-277-7762 (Exigent)',
        address: '400 Washington Blvd, Stamford, CT 06902'
    },
    {
        name: 'Cox Communications',
        keywords: ['cox', 'cox cable'],
        email: 'SubpoenaResponse@cox.com',
        phone: '678-645-4853 (Nat. Security)',
        address: '6205-B Peachtree Dunwoody Rd, Atlanta, GA'
    },
    {
        name: 'Altice / Optimum (via Yaana)',
        keywords: ['altice', 'optimum', 'suddenlink', 'cablevision'],
        email: 'emergency@netd-ttp.com',
        phone: '800-291-2491 (Exigent 24/7)',
        address: '1525 McCarthy Blvd, Milpitas, CA (Yaana Tech)'
    },
    {
        name: 'Frontier Communications',
        keywords: ['frontier', 'frontiernet'],
        email: 'LawEnforcement@frontier.com',
        phone: '1-866-351-8483 (Emergency)',
        address: 'P.O. Box 1003, Everett, WA 98201'
    },
    {
        name: 'Lumen / Level 3 / CenturyLink',
        keywords: ['level3', 'level 3', 'lumen', 'centurylink', 'qwest'],
        email: 'abuse@level3.com',
        phone: '+1-877-453-8353',
        address: '1025 Eldorado Blvd, Broomfield, CO'
    },
    {
        name: 'Windstream (Kinetic)',
        keywords: ['windstream', 'kinetic'],
        email: 'LEA@windstream.com',
        phone: '501-748-7364 (Exigent)',
        address: '4005 Rodney Parham Rd, Little Rock, AR'
    },
    {
        name: 'Mediacom',
        keywords: ['mediacom'],
        email: 'nocupdate@mediacomcc.com',
        phone: '1-800-308-6715 (Exigent)',
        address: '1 Mediacom Way, Mediacom Park, NY 10918'
    },
    {
        name: 'Verizon / MCI',
        keywords: ['verizon', 'mci', 'uunet', 'fios'],
        email: 'abuse@verizon.com',
        phone: '+1-800-444-1111 (Security)',
        address: '180 Washington Valley Rd, Bedminster, NJ'
    },
    {
        name: 'AT&T Services',
        keywords: ['at&t', 'sbc', 'bellsouth', 'u-verse'],
        email: 'abuse@att.net',
        phone: '+1-800-337-5373',
        address: '208 S. Akard St, Dallas, TX'
    },
    {
        name: 'T-Mobile USA',
        keywords: ['t-mobile', 'tmobile', 'sprint', 'metro'],
        email: 'abuse@t-mobile.com',
        phone: '+1-973-292-8911 (Exigent)',
        address: '12920 SE 38th St, Bellevue, WA'
    },
    {
        name: 'Starlink / SpaceX',
        keywords: ['starlink', 'spacex'],
        email: 'privacy@spacex.com (General)',
        phone: 'Portal Only (See Terms)',
        address: '1 Rocket Rd, Hawthorne, CA'
    },
    // --- VOIP / APPS ---
    {
        name: 'TextNow',
        keywords: ['textnow', 'text now'],
        email: 'lawenforcement@textnow.com',
        phone: 'Portal Only (EMERGENCY DISCLOSURE)',
        address: '420 Wes Graham Way, Waterloo, ON, Canada'
    },
    {
        name: 'WhatsApp (Meta)',
        keywords: ['whatsapp', 'whats app', 'meta'],
        email: 'records@facebook.com (Emergency)',
        phone: 'Portal: facebook.com/records',
        address: '1 Hacker Way, Menlo Park, CA'
    },
    {
        name: 'Snapchat',
        keywords: ['snapchat', 'snap'],
        email: 'lawenforcement@snapchat.com',
        phone: '310-684-3062 (Exigent)',
        address: '2772 Donald Douglas Loop N, Santa Monica, CA'
    },
    {
        name: 'Instagram (Meta)',
        keywords: ['instagram', 'ig', 'meta'],
        email: 'lawenforcement@instagram.com',
        phone: 'Portal: facebook.com/records',
        address: '1 Hacker Way, Menlo Park, CA'
    },
    {
        name: 'Pinger / TextFree / Sideline',
        keywords: ['pinger', 'textfree', 'sideline', 'text free'],
        email: 'legal@pinger.com',
        phone: 'Portal / Email Only (No Exigent Phone)',
        address: '97 South 2nd St, San Jose, CA'
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

    // External Links
    externalLinks: document.getElementById('externalLinks'),
    linkDNS: document.getElementById('linkDNS'),
    linkVT: document.getElementById('linkVT'),
    linkShodan: document.getElementById('linkShodan'),
    linkAbuse: document.getElementById('linkAbuse'),

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

let currentMode = 'ip';
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
        searchCarrier(term);
        showLoading(false);
    }
}

function searchCarrier(term) {
    const query = term.toLowerCase();

    const matches = CARRIER_DIRECTORY.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.keywords.some(k => k.includes(query))
    );

    if (matches.length === 0) {
        showError(`No verified contacts found for "${term}". Try "Google", "Comcast", or "TextNow".`);
        return;
    }

    UI.results.classList.remove('hidden');
    UI.consensus.classList.add('hidden');
    UI.externalLinks.classList.add('hidden'); // Hide external links for carrier search only
    document.querySelector('.primary-result-card h2').textContent = "Carrier Directory Match";

    UI.aggCity.parentElement.style.display = 'none';
    UI.aggRegion.parentElement.style.display = 'none';
    UI.aggCountry.parentElement.style.display = 'none';
    UI.aggIsp.parentElement.style.display = 'none';
    UI.aggCounty.parentElement.style.display = 'none';
    document.querySelector('.map-container').style.display = 'none';
    document.querySelector('.sources-grid').style.display = 'none';

    const match = matches[0];
    UI.contactSection.classList.remove('hidden');
    document.querySelector('#contactSection h3').textContent = match.name;
    UI.abuseEmail.textContent = match.email;
    UI.abusePhone.textContent = match.phone;
    UI.abuseAddress.textContent = match.address;

    if (matches.length > 1) {
        document.querySelector('.source-note').textContent = `Found ${matches.length} matches. Showing top result.`;
    } else {
        document.querySelector('.source-note').textContent = "Verified Internal Directory";
    }
}

async function searchIP(ip) {
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

    // Update External Links
    UI.externalLinks.classList.remove('hidden');
    UI.linkDNS.href = `https://dnschecker.org/ip-location.php?ip=${ip}`;
    UI.linkVT.href = `https://www.virustotal.com/gui/ip-address/${ip}`;
    UI.linkShodan.href = `https://www.shodan.io/host/${ip}`;
    UI.linkAbuse.href = `https://www.abuseipdb.com/check/${ip}`;

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
    UI.externalLinks.classList.add('hidden');
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
function fetchJSONP(url, callbackParam = 'callback', ipForIpapi = null) {
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
        let src = url;

        // Special handling for ipapi.co structure: https://ipapi.co/{ip}/jsonp/
        if (url.includes('ipapi.co') && ipForIpapi) {
            src = `https://ipapi.co/${ipForIpapi}/jsonp/`;
        }

        const separator = src.includes('?') ? '&' : '?';
        script.src = `${src}${separator}${callbackParam}=${callbackName}`;

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
    // ip-api.com (HTTP, JSONP)
    // Note: This relies on the browser allowing mixed content or running from file://
    return fetchJSONP(`${CONFIG.apis.source2}${ip}?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as`, 'callback');
}

async function fetchSource3(ip) {
    // ipapi.co (HTTPS, JSONP)
    // endpoint: https://ipapi.co/{ip}/jsonp/
    return fetchJSONP(`${CONFIG.apis.source3}`, 'callback', ip);
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

    if (data.s2 && data.s2.success !== false) { // ipwhois.app
        sources.push({
            source: 'ipwhois.app',
            city: data.s2.city,
            region: data.s2.region,
            country: data.s2.country,
            lat: parseFloat(data.s2.latitude),
            lon: parseFloat(data.s2.longitude),
            isp: data.s2.isp || data.s2.org || '--',
            county: '--'
        });
    }

    if (data.s3 && data.s3.geoplugin_status === 200) { // geoplugin.net
        sources.push({
            source: 'geoplugin.net',
            city: data.s3.geoplugin_city,
            region: data.s3.geoplugin_region,
            country: data.s3.geoplugin_countryName,
            lat: parseFloat(data.s3.geoplugin_latitude),
            lon: parseFloat(data.s3.geoplugin_longitude),
            isp: '--', // geoplugin free doesn't provide ISP
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
    if (!data || data.status === 'fail' || data.error || data.success === false) {
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
