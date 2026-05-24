/**
 * Local-Only JavaScript - Civil Registration System
 * Uses localStorage for all data persistence
 */

// --- Local Database Initialization ---
function initLocalDB() {
    const DATA_VERSION = '3.1'; // admin123 credentials + responsive updates
    const currentVersion = localStorage.getItem('crs_data_version');

    if (currentVersion !== DATA_VERSION) {
        localStorage.removeItem('crs_users');
        localStorage.removeItem('crs_births');
        localStorage.removeItem('crs_deaths');
        localStorage.setItem('crs_data_version', DATA_VERSION);
    }

    if (!localStorage.getItem('crs_users')) {
        const initialUsers = [
            { id: 1, username: 'admin', password: 'admin123', email: 'admin@example.com', full_name: 'System Administrator', role: 'admin', profile_pic: null, created_at: new Date().toISOString() },
            { id: 2, username: 'ismacil', password: 'admin123', email: 'ismacil@example.com', full_name: 'Ismail Ahmed', role: 'staff', profile_pic: null, created_at: new Date().toISOString() }
        ];
        localStorage.setItem('crs_users', JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem('crs_births')) {
        const births = [];
        const firstNames = ['Maxamed', 'Axmed', 'Cali', 'Xasan', 'Faarax', 'Cumar', 'Ibraahim', 'Cabdi', 'Warsame', 'Ismaaciil', 'Hibo', 'Zahra', 'Leyla', 'Xaliimo', 'Maryan', 'Sahra', 'Deeqa', 'Aamina', 'Safiya', 'Khadra'];
        const midNames = ['Jaamac', 'Barre', 'Garaad', 'Salaad', 'Guuleed', 'Warsame', 'Faarax', 'Xasan', 'Maxamed', 'Cali'];
        const lastNames = ['Rooble', 'Geedi', 'Sharmarke', 'Culusow', 'Warfaa', 'Qalaf', 'Muuse', 'Seeraar', 'Keynaan', 'Ducaale'];

        for (let i = 1; i <= 90; i++) {
            const m = Math.floor(Math.random() * 12) + 1;
            const y = 2023 + Math.floor(Math.random() * 2);
            const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
            const mname = midNames[Math.floor(Math.random() * midNames.length)];
            const lname = lastNames[Math.floor(Math.random() * lastNames.length)];

            births.push({
                id: i,
                full_name: `${fname} ${mname} ${lname}`,
                date_of_birth: `${y}-${String(m).padStart(2, '0')}-15`,
                gender: i % 2 === 0 ? 'Male' : 'Female',
                father_name: `${midNames[Math.floor(Math.random() * midNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                mother_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                place_of_birth: 'Hargeisa',
                registered_by: 1, created_at: new Date(`${y}-${String(m).padStart(2, '0')}-15`).toISOString()
            });
        }
        localStorage.setItem('crs_births', JSON.stringify(births));
    }

    if (!localStorage.getItem('crs_deaths')) {
        const deaths = [];
        const dFirstNames = ['Marxuum', 'Sheikh', 'Xaaji', 'Mudane', 'Nabadoon'];
        const dNames = ['Maxamed', 'Axmed', 'Cali', 'Xasan', 'Faarax', 'Cumar', 'Ibraahim', 'Cabdi'];
        const dLastNames = ['Garaad', 'Salaad', 'Guuleed', 'Warsame', 'Rooble', 'Geedi'];

        for (let i = 1; i <= 30; i++) {
            const m = Math.floor(Math.random() * 12) + 1;
            const y = 2023 + Math.floor(Math.random() * 2);
            const title = dFirstNames[Math.floor(Math.random() * dFirstNames.length)];
            const name = dNames[Math.floor(Math.random() * dNames.length)];
            const mid = dLastNames[Math.floor(Math.random() * dLastNames.length)];
            const last = dLastNames[(i + 2) % dLastNames.length];

            deaths.push({
                id: i,
                full_name: `${title} ${name} ${mid} ${last}`,
                date_of_death: `${y}-${String(m).padStart(2, '0')}-10`,
                age_at_death: 40 + Math.floor(Math.random() * 50),
                gender: i % 2 === 0 ? 'Male' : 'Female',
                place_of_death: 'Hargeisa',
                cause_of_death: i % 5 === 0 ? 'Illness' : 'Natural',
                registered_by: 1, created_at: new Date(`${y}-${String(m).padStart(2, '0')}-10`).toISOString()
            });
        }
        localStorage.setItem('crs_deaths', JSON.stringify(deaths));
    }
}

initLocalDB();

// --- Auth Utilities ---
async function checkAuth() {
    const userData = localStorage.getItem('crs_current_user');

    if (!userData) {
        window.location.href = 'index.html';
        return null;
    }

    try {
        const user = JSON.parse(userData);
        window.currentUser = user;

        if (document.getElementById('userName')) {
            document.getElementById('userName').textContent = user.full_name;
        }
        if (document.getElementById('userRole')) {
            document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        }
        applyAvatarToPage(user.profile_pic, user.full_name);
        updateUIBasedOnRole(user);

        const activePage = document.body.dataset.page;
        if (activePage) renderSidebarNav(activePage);

        return user;
    } catch (error) {
        localStorage.removeItem('crs_current_user');
        window.location.href = 'index.html';
        return null;
    }
}

function updateUIBasedOnRole(user) {
    if (user.role !== 'admin') {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            if (item.getAttribute('href') === 'users.html') {
                item.style.display = 'none';
            }
        });
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => el.classList.add('hidden'));
    }
}

async function logout() {
    localStorage.removeItem('crs_current_user');
    window.location.href = 'index.html';
}

// --- API Simulation ---
async function apiRequest(url, method = 'GET', data = null) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const urlObj = new URL(url, window.location.origin);
            const path = urlObj.pathname.split('/').pop().replace('.php', '');
            const action = urlObj.searchParams.get('action');
            const id = urlObj.searchParams.get('id');

            // Handle Authentication
            if (path === 'auth' || url.includes('/auth')) {
                if (method === 'POST') {
                    const users = JSON.parse(localStorage.getItem('crs_users'));
                    const user = users.find(u => u.username === data.username && u.password === data.password);
                    if (user) {
                        localStorage.setItem('crs_current_user', JSON.stringify(user));
                        resolve({ success: true, user: user, token: 'local-token' });
                    } else {
                        resolve({ success: false, message: 'Invalid username or password' });
                    }
                }
                return;
            }

            // --- PROTECTED ROUTES ---
            const currentUser = JSON.parse(localStorage.getItem('crs_current_user'));
            if (!currentUser) return resolve({ success: false, message: 'Unauthorized' });

            // Dashboard
            if (path === 'dashboard') {
                const births = JSON.parse(localStorage.getItem('crs_births'));
                const deaths = JSON.parse(localStorage.getItem('crs_deaths'));

                // Helper to generate statistics
                const getStats = (data, dateField) => {
                    const monthly = new Array(12).fill(0).map((_, i) => ({ month: i + 1, count: 0 }));
                    const yearly = [];
                    const currentYear = new Date().getFullYear();

                    data.forEach(item => {
                        const date = new Date(item[dateField]);
                        if (date.getFullYear() === currentYear) {
                            monthly[date.getMonth()].count++;
                        }
                        const year = date.getFullYear();
                        let yearItem = yearly.find(y => y.year === year);
                        if (!yearItem) {
                            yearItem = { year, count: 0 };
                            yearly.push(yearItem);
                        }
                        yearItem.count++;
                    });

                    // Ensure at least 5 years are shown
                    for (let i = 0; i < 5; i++) {
                        const year = currentYear - i;
                        if (!yearly.find(y => y.year === year)) {
                            yearly.push({ year, count: 0 });
                        }
                    }

                    return { monthly, yearly: yearly.sort((a, b) => a.year - b.year) };
                };

                resolve({
                    success: true,
                    data: {
                        totalBirths: births.length,
                        totalDeaths: deaths.length,
                        birthStats: getStats(births, 'date_of_birth'),
                        deathStats: getStats(deaths, 'date_of_death')
                    }
                });
                return;
            }


            // Births
            if (path === 'birth') {
                let births = JSON.parse(localStorage.getItem('crs_births'));
                const users = JSON.parse(localStorage.getItem('crs_users'));
                if (action === 'list') {
                    const data = births.map(b => ({
                        ...b,
                        registered_by_username: users.find(u => u.id == b.registered_by)?.username || 'System'
                    }));
                    resolve({ success: true, data });
                } else if (action === 'get') {
                    resolve({ success: true, data: births.find(b => b.id == id) });
                } else if (action === 'register') {
                    const newBirth = { ...data, id: Date.now(), created_at: new Date().toISOString(), registered_by: currentUser.id };
                    births.push(newBirth);
                    localStorage.setItem('crs_births', JSON.stringify(births));
                    resolve({ success: true, message: 'Registered successfully' });
                } else if (action === 'update') {
                    births = births.map(b => b.id == data.id ? { ...b, ...data } : b);
                    localStorage.setItem('crs_births', JSON.stringify(births));
                    resolve({ success: true, message: 'Updated successfully' });
                } else if (action === 'delete') {
                    births = births.filter(b => b.id != id);
                    localStorage.setItem('crs_births', JSON.stringify(births));
                    resolve({ success: true, message: 'Deleted successfully' });
                }
                return;
            }

            // Deaths
            if (path === 'death') {
                let deaths = JSON.parse(localStorage.getItem('crs_deaths'));
                const users = JSON.parse(localStorage.getItem('crs_users'));
                if (action === 'list') {
                    const data = deaths.map(d => ({
                        ...d,
                        registered_by_username: users.find(u => u.id == d.registered_by)?.username || 'System'
                    }));
                    resolve({ success: true, data });
                } else if (action === 'get') {
                    resolve({ success: true, data: deaths.find(d => d.id == id) });
                } else if (action === 'register') {
                    const newDeath = { ...data, id: Date.now(), created_at: new Date().toISOString(), registered_by: currentUser.id };
                    deaths.push(newDeath);
                    localStorage.setItem('crs_deaths', JSON.stringify(deaths));
                    resolve({ success: true, message: 'Registered successfully' });
                } else if (action === 'update') {
                    deaths = deaths.map(d => d.id == data.id ? { ...d, ...data } : d);
                    localStorage.setItem('crs_deaths', JSON.stringify(deaths));
                    resolve({ success: true, message: 'Updated successfully' });
                } else if (action === 'delete') {
                    deaths = deaths.filter(d => d.id != id);
                    localStorage.setItem('crs_deaths', JSON.stringify(deaths));
                    resolve({ success: true, message: 'Deleted successfully' });
                }
                return;
            }

            // Users
            if (path === 'users') {
                let users = JSON.parse(localStorage.getItem('crs_users'));
                if (action === 'list') {
                    resolve({ success: true, data: users });
                } else if (action === 'get') {
                    resolve({ success: true, data: users.find(u => u.id == id) });
                } else if (action === 'create') {
                    const newUser = { ...data, id: Date.now(), created_at: new Date().toISOString() };
                    users.push(newUser);
                    localStorage.setItem('crs_users', JSON.stringify(users));
                    resolve({ success: true, message: 'User created' });
                } else if (action === 'update') {
                    users = users.map(u => u.id == data.id ? { ...u, ...data } : u);
                    localStorage.setItem('crs_users', JSON.stringify(users));
                    if (currentUser.id == data.id) {
                        const updated = users.find(u => u.id == data.id);
                        localStorage.setItem('crs_current_user', JSON.stringify(updated));
                        window.currentUser = updated;
                    }
                    resolve({ success: true, message: 'User updated', profile_pic: data.profile_pic });
                } else if (action === 'delete') {
                    users = users.filter(u => u.id != id);
                    localStorage.setItem('crs_users', JSON.stringify(users));
                    resolve({ success: true, message: 'User deleted' });
                }
                return;
            }

            resolve({ success: false, message: 'Local API endpoint not found' });
        }, 300);
    });
}

// --- Common UI Logic ---
function isMobileViewport() {
    return window.innerWidth < 768;
}

const CRS_CLOUDINARY = { cloudName: 'duzuguldp', uploadPreset: 'crs_profiles' };

async function uploadProfileImageToCloudinary(file) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CRS_CLOUDINARY.uploadPreset);
    fd.append('folder', 'crs_profiles');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CRS_CLOUDINARY.cloudName}/image/upload`, {
        method: 'POST',
        body: fd
    });
    const data = await res.json();
    if (!data.secure_url) {
        throw new Error(data.error?.message || 'Cloudinary upload failed. Create unsigned preset "crs_profiles" in Cloudinary dashboard.');
    }
    return data.secure_url;
}

function applyAvatarToPage(url, fullName) {
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=667eea&color=fff`;
    const src = url || fallback;
    document.querySelectorAll('#userAvatar, #profileImagePreview, #profilePic').forEach(el => {
        if (el) {
            el.src = src;
            el.classList.add('object-cover');
        }
    });
}

function renderSidebarNav(activePage) {
    const nav = document.querySelector('#sidebar nav');
    if (!nav) return;
    const items = [
        { id: 'dashboard', href: 'dashboard.html', icon: 'fa-chart-line', label: 'Dashboard' },
        { id: 'birth-registration', href: 'birth-registration.html', icon: 'fa-baby', label: 'Birth Registration' },
        { id: 'death-registration', href: 'death-registration.html', icon: 'fa-book-dead', label: 'Death Registration' },
        { id: 'birth-records', href: 'birth-records.html', icon: 'fa-file-alt', label: 'Birth Reports' },
        { id: 'death-records', href: 'death-records.html', icon: 'fa-file-medical', label: 'Death Reports' },
        { id: 'reports', href: 'reports.html', icon: 'fa-chart-pie', label: 'Reports' },
        { id: 'users', href: 'users.html', icon: 'fa-users', label: 'Users', adminOnly: true }
    ];
    const isAdmin = window.currentUser && window.currentUser.role === 'admin';
    nav.innerHTML = items.filter(i => !i.adminOnly || isAdmin).map(i =>
        `<a href="${i.href}" class="menu-item${activePage === i.id ? ' active' : ''} flex items-center space-x-3 px-4 py-3 rounded-lg">
        <i class="fas ${i.icon} text-lg w-6"></i><span class="menu-text">${i.label}</span></a>`
    ).join('') + `<a href="#" onclick="logout();return false;" class="menu-item flex items-center space-x-3 px-4 py-3 rounded-lg mt-8 bg-red-600 bg-opacity-20 hover:bg-opacity-30">
        <i class="fas fa-sign-out-alt text-lg w-6"></i><span class="menu-text">Logout</span></a>`;
}

function openBirthCertificate(id) {
    window.open(`certificate-birth.html?id=${encodeURIComponent(id)}`, '_blank');
}
function openDeathCertificate(id) {
    window.open(`certificate-death.html?id=${encodeURIComponent(id)}`, '_blank');
}

function initResponsiveSidebar() {
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    if (!sidebar || !mainContent) return;

    let overlay = document.getElementById('sidebarOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sidebarOverlay';
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    function closeMobileSidebar() {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }

    function openMobileSidebar() {
        sidebar.classList.add('mobile-open');
        sidebar.classList.remove('collapsed');
        overlay.classList.add('active');
        document.body.classList.add('sidebar-open');
    }

    function applyDesktopMargins() {
        if (sidebar.classList.contains('collapsed')) {
            mainContent.classList.remove('ml-64');
            mainContent.classList.add('ml-20');
        } else {
            mainContent.classList.remove('ml-20');
            mainContent.classList.add('ml-64');
        }
    }

    function syncLayout() {
        if (isMobileViewport()) {
            closeMobileSidebar();
            sidebar.classList.add('collapsed');
            mainContent.classList.remove('ml-64', 'ml-20');
            mainContent.classList.add('ml-0');
        } else {
            closeMobileSidebar();
            sidebar.classList.remove('mobile-open');
            mainContent.classList.remove('ml-0');
            applyDesktopMargins();
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (isMobileViewport()) {
                if (sidebar.classList.contains('mobile-open')) closeMobileSidebar();
                else openMobileSidebar();
                return;
            }
            sidebar.classList.toggle('collapsed');
            applyDesktopMargins();
        });
    }

    overlay.addEventListener('click', closeMobileSidebar);
    sidebar.querySelectorAll('nav a[href]:not([href="#"])').forEach(link => {
        link.addEventListener('click', () => {
            if (isMobileViewport()) closeMobileSidebar();
        });
    });

    window.addEventListener('resize', syncLayout);
    syncLayout();
}

/** Add data-label attributes for mobile card-style tables */
function applyResponsiveTableLabels(tableId, labels) {
    const table = document.getElementById(tableId) || document.querySelector(tableId);
    if (!table) return;
    table.classList.add('responsive-table');
    table.querySelectorAll('tbody tr').forEach(row => {
        row.querySelectorAll('td').forEach((cell, i) => {
            if (labels[i]) cell.setAttribute('data-label', labels[i]);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initResponsiveSidebar();
});

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`;
    notification.innerHTML = `<div class="flex items-center space-x-3"><i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} text-xl"></i><span>${message}</span></div>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function formatDate(dateString) { return new Date(dateString).toLocaleDateString(); }
function validateForm(formId) {
    const form = document.getElementById(formId);
    let isValid = true;
    form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) { input.classList.add('border-red-500'); isValid = false; }
        else input.classList.remove('border-red-500');
    });
    return isValid;
}
function showLoading(id) { const el = document.getElementById(id); if (el) el.innerHTML = '<div class="loading-spinner"></div>'; }
function hideLoading(id) { const el = document.getElementById(id); if (el) el.innerHTML = ''; }
function confirmAction(msg) { return confirm(msg); }

window.checkAuth = checkAuth;
window.logout = logout;
window.showNotification = showNotification;
window.formatDate = formatDate;
window.validateForm = validateForm;
window.apiRequest = apiRequest;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.confirmAction = confirmAction;
window.applyResponsiveTableLabels = applyResponsiveTableLabels;
window.uploadProfileImageToCloudinary = uploadProfileImageToCloudinary;
window.applyAvatarToPage = applyAvatarToPage;
window.renderSidebarNav = renderSidebarNav;
window.openBirthCertificate = openBirthCertificate;
window.openDeathCertificate = openDeathCertificate;
