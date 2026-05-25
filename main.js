/**
 * Local-Only JavaScript - Civil Registration System
 * Uses localStorage for all data persistence
 */

// --- Local Database Initialization ---
function initLocalDB() {
    const DATA_VERSION = '3.2';
    const currentVersion = localStorage.getItem('crs_data_version');

    if (currentVersion !== DATA_VERSION) {
        localStorage.removeItem('crs_users');
        if (!localStorage.getItem('crs_births')) {
            localStorage.removeItem('crs_births');
            localStorage.removeItem('crs_deaths');
        }
        localStorage.setItem('crs_data_version', DATA_VERSION);
    }

    const defaultUsers = [
        { id: 1, username: 'admin', password: 'admin123', email: 'admin@civilreg.gov', full_name: 'System Administrator', role: 'admin', profile_pic: null, created_at: new Date().toISOString() },
        { id: 2, username: 'ismacil', password: 'isma123', email: 'ismacil@civilreg.gov', full_name: 'Ismail Ahmed', role: 'staff', profile_pic: null, created_at: new Date().toISOString() },
        { id: 3, username: 'qadar', password: 'leo123', email: 'qadar@civilreg.gov', full_name: 'Qadar Mohamed', role: 'staff', profile_pic: null, created_at: new Date().toISOString() },
        { id: 4, username: 'munasar', password: 'madax123', email: 'munasar@civilreg.gov', full_name: 'Munasar Ali', role: 'staff', profile_pic: null, created_at: new Date().toISOString() }
    ];

    if (!localStorage.getItem('crs_users')) {
        localStorage.setItem('crs_users', JSON.stringify(defaultUsers));
    } else {
        ensureLocalUsers(defaultUsers);
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

function ensureLocalUsers(defaultUsers) {
    let users = JSON.parse(localStorage.getItem('crs_users') || '[]');
    defaultUsers.forEach(def => {
        const idx = users.findIndex(u => u.username === def.username);
        if (idx === -1) {
            users.push({ ...def, id: users.length ? Math.max(...users.map(u => u.id)) + 1 : def.id });
        } else {
            const pic = users[idx].profile_pic;
            users[idx] = { ...users[idx], password: def.password, full_name: def.full_name, email: def.email, role: def.role };
            if (pic) users[idx].profile_pic = pic;
        }
    });
    localStorage.setItem('crs_users', JSON.stringify(users));
}

initLocalDB();

function shouldShowInstallGate() {
    const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.navigator.standalone === true;
    if (standalone) return false;
    if (localStorage.getItem('crs_install_seen') === '1') return false;
    if (window.location.pathname.includes('install.html')) return false;
    return true;
}

/** Reload logged-in user from crs_users so profile_pic survives refresh */
function syncCurrentUserFromDb() {
    const raw = localStorage.getItem('crs_current_user');
    if (!raw) return null;
    let cur;
    try {
        cur = JSON.parse(raw);
    } catch (e) {
        return null;
    }
    const users = JSON.parse(localStorage.getItem('crs_users') || '[]');
    const fresh = users.find(
        (u) => Number(u.id) === Number(cur.id) || u.username === cur.username
    );
    if (fresh) {
        localStorage.setItem('crs_current_user', JSON.stringify(fresh));
        window.currentUser = fresh;
        return fresh;
    }
    window.currentUser = cur;
    return cur;
}

/** Save profile fields to crs_users + crs_current_user (localStorage) */
function persistUserProfile(userId, updates) {
    const id = Number(userId);
    let users = JSON.parse(localStorage.getItem('crs_users') || '[]');
    users = users.map((u) => (Number(u.id) === id ? { ...u, ...updates } : u));
    localStorage.setItem('crs_users', JSON.stringify(users));
    const updated = users.find((u) => Number(u.id) === id);
    const cur = JSON.parse(localStorage.getItem('crs_current_user') || 'null');
    if (updated && cur && Number(cur.id) === id) {
        localStorage.setItem('crs_current_user', JSON.stringify(updated));
        window.currentUser = updated;
    }
    return updated;
}

// --- Auth Utilities ---
async function checkAuth() {
    if (shouldShowInstallGate()) {
        window.location.replace('install.html');
        return null;
    }

    const userData = localStorage.getItem('crs_current_user');

    if (!userData) {
        window.location.href = 'index.html';
        return null;
    }

    try {
        const user = syncCurrentUserFromDb() || JSON.parse(userData);

        document.querySelectorAll('#userName').forEach((el) => {
            el.textContent = user.full_name;
        });
        document.querySelectorAll('#userRole').forEach((el) => {
            el.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        });
        applyAvatarToPage(user.profile_pic, user.full_name);
        ensureHeaderProfileAccess(user);
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
                        const fresh = users.find((u) => Number(u.id) === Number(user.id)) || user;
                        localStorage.setItem('crs_current_user', JSON.stringify(fresh));
                        resolve({ success: true, user: fresh, token: 'local-token' });
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
                    const updated = persistUserProfile(data.id, data);
                    resolve({
                        success: true,
                        message: 'User updated',
                        profile_pic: updated?.profile_pic ?? data.profile_pic,
                        user: updated
                    });
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

/** Local profile image — saved in browser (no Cloudinary preset required). */
async function uploadProfileImageToCloudinary(file) {
    if (!file || !file.type.startsWith('image/')) {
        throw new Error('Please choose an image file');
    }
    if (file.size > 3 * 1024 * 1024) {
        throw new Error('Image must be under 3MB');
    }
    return compressImageToDataUrl(file, 400, 0.82);
}

function compressImageToDataUrl(file, maxSize, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Could not read image'));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('Invalid image'));
            img.onload = () => {
                let w = img.width;
                let h = img.height;
                if (w > h && w > maxSize) {
                    h = (h * maxSize) / w;
                    w = maxSize;
                } else if (h > maxSize) {
                    w = (w * maxSize) / h;
                    h = maxSize;
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
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
        { id: 'install', href: 'install.html', icon: 'fa-download', label: 'Install App' },
        { id: 'users', href: 'users.html', icon: 'fa-users', label: 'Users', adminOnly: true }
    ];
    const isAdmin = window.currentUser && window.currentUser.role === 'admin';
    nav.innerHTML = items.filter(i => !i.adminOnly || isAdmin).map(i =>
        `<a href="${i.href}" class="menu-item${activePage === i.id ? ' active' : ''} flex items-center space-x-3 px-4 py-3 rounded-lg relative z-10">
        <i class="fas ${i.icon} text-lg w-6 shrink-0"></i><span class="menu-text">${i.label}</span></a>`
    ).join('') + `<button type="button" id="sidebarLogoutBtn" class="menu-item w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg mt-6 bg-red-600 bg-opacity-20 hover:bg-opacity-30 relative z-10">
        <i class="fas fa-sign-out-alt text-lg w-6 shrink-0"></i><span class="menu-text">Logout</span></button>`;

    const logoutBtn = document.getElementById('sidebarLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    if (!nav.dataset.bound) {
        nav.dataset.bound = '1';
        nav.addEventListener('click', (e) => {
            if (e.target.closest('a[href]') && isMobileViewport()) {
                closeMobileSidebarGlobal();
            }
        });
    }

    ensureHeaderProfileAccess(window.currentUser);
}

/** Profile & Settings — header on every page (not only sidebar) */
function ensureHeaderProfileAccess(user) {
    if (!user) return;

    document.querySelectorAll('header button').forEach((btn) => {
        if (!btn.querySelector('#userAvatar')) return;
        const link = document.createElement('a');
        link.href = 'profile.html';
        link.className = 'flex items-center space-x-3 shrink-0 header-profile-link';
        link.title = 'Profile & Settings';
        link.innerHTML = btn.innerHTML;
        btn.replaceWith(link);
    });

    document.querySelectorAll('#userAvatar').forEach((img) => {
        if (img.closest('a[href="profile.html"]')) return;
        const wrap = document.createElement('a');
        wrap.href = 'profile.html';
        wrap.className = 'flex items-center shrink-0 header-profile-link';
        wrap.title = 'Profile & Settings';
        img.parentNode.insertBefore(wrap, img);
        wrap.appendChild(img);
    });

    document.querySelectorAll('header').forEach((header) => {
        const row =
            header.querySelector('.flex.items-center.justify-between') ||
            header.querySelector('.flex');
        if (!row) return;

        if (!row.querySelector('[data-profile-settings]') && !header.querySelector('a[href="profile.html"]')) {
            const settingsLink = document.createElement('a');
            settingsLink.href = 'profile.html';
            settingsLink.setAttribute('data-profile-settings', '1');
            settingsLink.className =
                'header-profile-settings hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 shrink-0';
            settingsLink.title = 'Profile & Settings';
            settingsLink.innerHTML =
                '<i class="fas fa-user-cog"></i><span>Profile</span>';
            const slot = row.querySelector('.header-profile-slot') || row.lastElementChild;
            if (slot && slot.classList.contains('header-profile-slot')) {
                slot.insertBefore(settingsLink, slot.firstChild);
            } else {
                row.appendChild(settingsLink);
            }
        }

        if (!header.querySelector('#userAvatar')) {
            let slot = row.querySelector('.header-profile-slot');
            if (!slot) {
                slot = document.createElement('div');
                slot.className =
                    'header-profile-slot flex items-center gap-2 sm:gap-3 ml-auto shrink-0';
                row.appendChild(slot);
            }
            if (!slot.querySelector('#userAvatar')) {
                const block = document.createElement('a');
                block.href = 'profile.html';
                block.className = 'flex items-center gap-2 header-profile-link';
                block.title = 'Profile & Settings';
                block.innerHTML = `<img id="userAvatar" alt="" class="w-10 h-10 rounded-full border-2 border-indigo-100 shadow object-cover bg-gray-100">
                    <span class="hidden md:block text-left">
                        <span id="userName" class="block text-sm font-semibold text-gray-800 truncate"></span>
                        <span id="userRole" class="block text-xs text-gray-500 capitalize"></span>
                    </span>`;
                slot.appendChild(block);
                const nameEl = block.querySelector('#userName');
                const roleEl = block.querySelector('#userRole');
                if (nameEl) nameEl.textContent = user.full_name;
                if (roleEl) roleEl.textContent = user.role;
            }
        }
    });

    applyAvatarToPage(user.profile_pic, user.full_name);
    ensureProfileFab(user);
}

function ensureProfileFab(user) {
    if (document.body.dataset.page === 'profile') return;
    let fab = document.getElementById('profileFab');
    if (!fab) {
        fab = document.createElement('a');
        fab.id = 'profileFab';
        fab.href = 'profile.html';
        fab.className = 'profile-fab';
        fab.title = 'Profile & Settings';
        fab.innerHTML = '<i class="fas fa-user-cog"></i>';
        document.body.appendChild(fab);
    }
    if (user.profile_pic) {
        fab.style.backgroundImage = `url(${user.profile_pic})`;
        fab.style.backgroundSize = 'cover';
        fab.classList.add('profile-fab-has-photo');
    } else {
        fab.style.backgroundImage = '';
        fab.classList.remove('profile-fab-has-photo');
    }
}

let closeMobileSidebarGlobal = () => {};

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
    closeMobileSidebarGlobal = closeMobileSidebar;

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
    if (typeof window.CRS_PWA !== 'undefined') {
        window.CRS_PWA.initPwaInstallBanner();
    }
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
window.persistUserProfile = persistUserProfile;
window.syncCurrentUserFromDb = syncCurrentUserFromDb;
window.ensureHeaderProfileAccess = ensureHeaderProfileAccess;
window.applyAvatarToPage = applyAvatarToPage;
window.renderSidebarNav = renderSidebarNav;
window.openBirthCertificate = openBirthCertificate;
window.openDeathCertificate = openDeathCertificate;
