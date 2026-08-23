const routes = {
    signup: `
        <h2>Create Account</h2>
        <form id="regForm">
        <input type="text" id="username" placeholder="Username" required>
        <input type="password" id="password" placeholder="Password" required>
        <div class="strength-meter"><div id="strengthBar" class="strength-bar"></div></div>
        <p id="strengthText" style="font-size: 0.8rem;"></p>
        <button type="submit" id="submitBtn" disabled>Register</button>
        </form>
    `,
    dashboard: `
        <h2>Dashboard</h2>
        <p>Welcome back! User activity:</p>
        <ul id="activityList"></ul>
        <button onclick="addActivity()">Add Random Log</button>
    `
};
const navigate = () => {
    const hash = window.location.hash.replace('#', '') || 'signup';
    const app = document.getElementById('app');
    app.innerHTML = routes[hash];
    if (hash === 'signup') initValidation();
    if (hash === 'dashboard') initDashboard();
};
window.addEventListener('hashchange', navigate);
window.addEventListener('load', navigate);
function initValidation() {
   const passInput = document.getElementById('password');
   const bar = document.getElementById('strengthBar');
    const text = document.getElementById('strengthText');
    const btn = document.getElementById('submitBtn');
    passInput.addEventListener('input', (e) => {
        const val = e.target.value;
        let score = 0;
        if (val.length > 6) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        bar.className = 'strength-bar'; 
        if (score <= 1) {
            bar.classList.add('weak');
            text.innerText = "Too weak!";
            btn.disabled = true;
        } else if (score === 2 || score === 3) {
            bar.classList.add('medium');
            text.innerText = "Getting there...";
            btn.disabled = false;
        } else {
            bar.classList.add('strong');
            text.innerText = "Strong password!";
            btn.disabled = false;
        }
    });
}
function initDashboard() {
    const list = document.getElementById('activityList');
    const activities = ['Logged in', 'Updated Profile', 'Viewed Settings'];
    list.innerHTML = activities.map(act => `<li>${act} at ${new Date().toLocaleTimeString()}</li>`).join('');
}
function addActivity() {
    const list = document.getElementById('activityList');
    const li = document.createElement('li');
    li.textContent = `New interaction at ${new Date().toLocaleTimeString()}`;
    li.style.color = '#3498db';
    list.prepend(li); 
}