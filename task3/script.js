const state = {
discoveries: [
{ name: "Proxima B", type: "Habitable", coords: "XP-9920" }
]
};
const routes = {
discover: `
<div class="col-md-6 glass-panel">
<h2 class="mb-4">New Discovery</h2>
<div class="mb-3">
<label class="form-label">Planet Name</label>
<input type="text" id="pName" class="form-control bg-dark text-white border-secondary" placeholder="e.g. Kepler-186f">
</div>
<div class="mb-3">
<label class="form-label">Sector Coordinates</label>
<input type="text" id="pCoord" class="form-control bg-dark text-white border-secondary" placeholder="Format: XX-0000">
<div id="coordStatus" class="coord-indicator"></div>
<small id="coordHint" class="text-secondary">Must follow Galaxy Format (2 Letters - 4 Digits)</small>
</div>
<div class="mb-4">
<label class="form-label">Planet Type</label>
<select id="pType" class="form-select bg-dark text-white border-secondary">
<option value="Ice">Ice Giant</option>
<option value="Gas">Gas Giant</option>
<option value="Habitable">Habitable Zone</option>
</select>
</div>
<button id="logBtn" class="btn btn-space w-100" disabled>Log to Mainframe</button>
</div>
`,
archive: `
<div class="col-md-8 glass-panel">
<h2 class="mb-4">Galaxy Archive</h2>
<div id="archiveList"></div>
</div>
`
};
function render() {
const hash = window.location.hash.replace('#', '') || 'discover';
const container = document.getElementById('view-container');
container.innerHTML = routes[hash];
document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
document.getElementById(`link-${hash}`)?.classList.add('active');
if (hash === 'discover') attachDiscoveryLogic();
if (hash === 'archive') renderArchive();
}
function attachDiscoveryLogic() {
const coordInput = document.getElementById('pCoord');
const indicator = document.getElementById('coordStatus');
const logBtn = document.getElementById('logBtn');
const typeSelect = document.getElementById('pType');
typeSelect.addEventListener('change', (e) => {
const colors = { Ice: '#00d4ff', Gas: '#ffaa00', Habitable: '#2ecc71' };
document.documentElement.style.setProperty('--accent-color', colors[e.target.value]);
});
coordInput.addEventListener('input', (e) => {
const val = e.target.value;
const regex = /^[A-Z]{2}-\d{4}$/;
if (regex.test(val)) {
indicator.style.width = "100%";
indicator.style.background = "var(--accent-color)";
logBtn.disabled = false;
} else {
indicator.style.width = "40%";
indicator.style.background = "#ff4d4d";
logBtn.disabled = true;
}
});
logBtn.addEventListener('click', () => {
const newDiscovery = {
name: document.getElementById('pName').value,
coords: coordInput.value,
type: typeSelect.value
};
state.discoveries.unshift(newDiscovery);
window.location.hash = 'archive';
});
}
function renderArchive() {
const list = document.getElementById('archiveList');
list.innerHTML = state.discoveries.map((d, index) => `
<div class="discovery-entry" style="animation-delay: ${index * 0.1}s">
<strong>${d.name}</strong> — Sector: ${d.coords} 
<span class="badge bg-outline-info" style="border: 1px solid var(--accent-color)">${d.type}</span>
</div>
`).join('');
}
window.addEventListener('hashchange', render);
window.addEventListener('load', render);