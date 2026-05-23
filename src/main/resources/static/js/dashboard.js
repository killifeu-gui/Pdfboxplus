// Dashboard JavaScript
const API_BASE = '/api';
const PDF_API = '/api/pdf';

// Load components
document.addEventListener('DOMContentLoaded', function() {
    loadComponents();
    initializeDashboard();
    checkAuthentication();
});

function loadComponents() {
    // Load sidebar
    fetch('/components/sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebarContainer').innerHTML = html;
            initializeSidebar();
        });
    
    // Load navbar
    fetch('/components/navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbarContainer').innerHTML = html;
            initializeNavbar();
        });
}

function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            document.getElementById('mainContent').classList.toggle('expanded');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Set active page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href')?.includes(currentPage)) {
            item.classList.add('active');
        }
    });
}

function initializeNavbar() {
    const themeToggle = document.getElementById('themeToggle');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Load user info
    loadUserInfo();
    
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // User dropdown - redirect to profile
    if (userDropdown) {
        userDropdown.addEventListener('click', (e) => {
            if (!e.target.closest('#logoutBtn')) {
                window.location.href = '/profile/index.html';
            }
        });
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            logout();
        });
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function loadUserInfo() {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userInitials = localStorage.getItem('userInitials');
    
    if (userName) {
        const welcomeName = document.getElementById('welcomeUserName');
        if (welcomeName) welcomeName.textContent = userName;
        
        const navbarName = document.getElementById('userName');
        if (navbarName) navbarName.textContent = userName;
    }
    
    if (userEmail) {
        const navbarEmail = document.getElementById('userEmail');
        if (navbarEmail) navbarEmail.textContent = userEmail;
    }
    
    if (userInitials) {
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) userAvatar.textContent = userInitials;
    }
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
}

function initializeDashboard() {
    // Load statistics
    loadStatistics();
    
    // Load recent files
    loadRecentFiles();
}

function loadStatistics() {
    // Simulated statistics - in production, this would come from the API
    const stats = {
        totalFiles: Math.floor(Math.random() * 50) + 10,
        uploadedFiles: Math.floor(Math.random() * 30) + 5,
        mergedFiles: Math.floor(Math.random() * 20) + 3,
        splitFiles: Math.floor(Math.random() * 15) + 2
    };
    
    document.getElementById('totalFiles').textContent = stats.totalFiles;
    document.getElementById('uploadedFiles').textContent = stats.uploadedFiles;
    document.getElementById('mergedFiles').textContent = stats.mergedFiles;
    document.getElementById('splitFiles').textContent = stats.splitFiles;
}

function loadRecentFiles() {
    // Simulated recent files - in production, this would come from the API
    const recentFiles = [
        { name: 'document.pdf', action: 'Uploadé', time: 'il y a 2 heures' },
        { name: 'rapport_merged.pdf', action: 'Fusionné', time: 'il y a 5 heures' },
        { name: 'presentation_split.pdf', action: 'Divisé', time: 'il y a 1 jour' }
    ];
    
    const filesList = document.getElementById('recentFilesList');
    if (filesList) {
        filesList.innerHTML = recentFiles.map(file => `
            <div class="file-item">
                <div class="file-icon">📄</div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-meta">${file.action} ${file.time}</div>
                </div>
                <div class="file-actions">
                    <button class="file-action-btn" onclick="downloadFile('${file.name}')">⬇️</button>
                    <button class="file-action-btn" onclick="deleteFile('${file.name}')">🗑️</button>
                </div>
            </div>
        `).join('');
    }
}

function downloadFile(filename) {
    // In production, this would call the download API
    showNotification('Téléchargement de ' + filename, 'info');
}

function deleteFile(filename) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ' + filename + ' ?')) {
        // In production, this would call the delete API
        showNotification(filename + ' supprimé', 'success');
        loadRecentFiles();
    }
}

function checkAuthentication() {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;
    
    // Public routes that don't require authentication
    const publicRoutes = ['/auth/login.html', '/auth/register.html', '/auth/forgot-password.html', '/index.html'];
    
    if (!token && !publicRoutes.some(route => currentPath.includes(route))) {
        window.location.href = '/auth/login.html';
    }
    
    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (token && publicRoutes.some(route => currentPath.includes(route))) {
        window.location.href = '/dashboard/index.html';
    }
}

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userInitials');
        
        window.location.href = '/auth/login.html';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
