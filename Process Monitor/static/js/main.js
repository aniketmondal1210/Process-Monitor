// DOM elements
const refreshBtn = document.getElementById('refresh-btn');
const cpuInfo = document.getElementById('cpu-info');
const memoryInfo = document.getElementById('memory-info');
const processCount = document.getElementById('process-count');
const processTbody = document.getElementById('process-tbody');
const lastUpdateTime = document.getElementById('last-update-time');
const themeToggle = document.getElementById('theme-toggle');
const sidebarToggle = document.getElementById('sidebar-toggle');
const processSearch = document.getElementById('process-search');
const helpModal = document.getElementById('help-modal');
const closeHelp = document.getElementById('close-help');
const gotItBtn = document.getElementById('got-it');
const dontShowAgain = document.getElementById('dont-show-again');
const showHelp = document.getElementById('show-help');

// State
let isLoading = false;
let intervalId = null;
let allProcesses = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch
    fetchMetrics();
    
    // Set up auto-refresh
    intervalId = setInterval(fetchMetrics, CONFIG.UPDATE_INTERVAL);
    
    // Manual refresh button
    refreshBtn.addEventListener('click', () => {
        if (!isLoading) {
            fetchMetrics();
        }
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Process search
    processSearch.addEventListener('input', filterProcesses);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
    
    // Check for saved sidebar preference
    const sidebarState = localStorage.getItem('sidebar');
    if (sidebarState === 'collapsed' || window.innerWidth < 1024) {
        document.body.classList.add('sidebar-collapsed');
    }
    
    // Help modal
    showHelp.addEventListener('click', showHelpModal);
    closeHelp.addEventListener('click', hideHelpModal);
    gotItBtn.addEventListener('click', hideHelpModal);
    
    // Check if we should show the help modal
    const helpShown = localStorage.getItem('helpShown');
    if (!helpShown) {
        showHelpModal();
    }
});

// Show help modal
function showHelpModal() {
    helpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Hide help modal
function hideHelpModal() {
    helpModal.classList.remove('active');
    document.body.style.overflow = '';
    
    if (dontShowAgain.checked) {
        localStorage.setItem('helpShown', 'true');
    }
}

// Toggle theme
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update chart colors
    setTimeout(() => {
        updateChartColors();
    }, 100);
}

// Toggle sidebar
function toggleSidebar() {
    const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebar', isCollapsed ? 'collapsed' : 'expanded');
}

// Fetch metrics from API
async function fetchMetrics() {
    try {
        setLoading(true);
        
        const response = await fetch('/api/system-metrics');
        if (!response.ok) {
            throw new Error(`Error fetching metrics: ${response.status}`);
        }
        
        const data = await response.json();
        updateUI(data);
        updateCharts(data);
        
        // Update last update time
        const now = new Date();
        lastUpdateTime.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

// Update UI with metrics data
function updateUI(metrics) {
    // Update CPU info with color coding
    const cpuPercent = parseFloat(metrics.cpu.percent);
    cpuInfo.textContent = `${cpuPercent.toFixed(1)}%`;
    cpuInfo.className = 'summary-value';
    
    // Add color class based on CPU usage
    if (cpuPercent > 80) {
        cpuInfo.classList.add('text-danger');
    } else if (cpuPercent > 50) {
        cpuInfo.classList.add('text-warning');
    }
    
    // Update Memory info with color coding
    const memoryPercent = parseFloat(metrics.memory.percent);
    memoryInfo.textContent = `${memoryPercent.toFixed(1)}%`;
    memoryInfo.className = 'summary-value';
    
    // Add color class based on memory usage
    if (memoryPercent > 80) {
        memoryInfo.classList.add('text-danger');
    } else if (memoryPercent > 50) {
        memoryInfo.classList.add('text-warning');
    }
    
    // Update Process count
    processCount.textContent = `${metrics.processes.length}`;
    
    // Store all processes
    allProcesses = metrics.processes;
    
    // Apply any active filter
    if (processSearch.value.trim()) {
        filterProcesses();
    } else {
        // Update Process table
        updateProcessTable(metrics.processes);
    }
}

// Filter processes based on search input
function filterProcesses() {
    const searchTerm = processSearch.value.trim().toLowerCase();
    
    if (!searchTerm) {
        updateProcessTable(allProcesses);
        return;
    }
    
    const filteredProcesses = allProcesses.filter(process => {
        return process.name.toLowerCase().includes(searchTerm) || 
               process.pid.toString().includes(searchTerm);
    });
    
    updateProcessTable(filteredProcesses);
}

// Update process table
function updateProcessTable(processes) {
    processTbody.innerHTML = '';
    
    if (processes.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 6;
        cell.className = 'text-center py-4 text-muted-foreground';
        cell.textContent = 'No programs found matching your search';
        row.appendChild(cell);
        processTbody.appendChild(row);
        return;
    }
    
    processes.forEach(process => {
        const row = document.createElement('tr');
        row.className = 'fade-in';
        
        // PID
        const pidCell = document.createElement('td');
        pidCell.textContent = process.pid;
        row.appendChild(pidCell);
        
        // Name
        const nameCell = document.createElement('td');
        nameCell.textContent = process.name;
        nameCell.style.fontWeight = '500';
        row.appendChild(nameCell);
        
        // CPU %
        const cpuCell = document.createElement('td');
        const cpuValue = process.cpu_percent.toFixed(2);
        cpuCell.textContent = cpuValue + '%';
        
        // Add visual indicator for high CPU usage
        if (process.cpu_percent > 10) {
            cpuCell.style.color = 'var(--danger-color)';
            cpuCell.style.fontWeight = '500';
            cpuCell.title = 'High CPU usage - this program is using a lot of your computer\'s processing power';
        } else if (process.cpu_percent > 5) {
            cpuCell.style.color = 'var(--warning-color)';
            cpuCell.title = 'Moderate CPU usage';
        } else {
            cpuCell.title = 'Low CPU usage';
        }
        
        row.appendChild(cpuCell);
        
        // Memory %
        const memoryCell = document.createElement('td');
        const memoryValue = process.memory_percent.toFixed(2);
        memoryCell.textContent = memoryValue + '%';
        
        // Add visual indicator for high memory usage
        if (process.memory_percent > 5) {
            memoryCell.style.color = 'var(--danger-color)';
            memoryCell.style.fontWeight = '500';
            memoryCell.title = 'High memory usage - this program is using a lot of your computer\'s memory';
        } else if (process.memory_percent > 2) {
            memoryCell.style.color = 'var(--warning-color)';
            memoryCell.title = 'Moderate memory usage';
        } else {
            memoryCell.title = 'Low memory usage';
        }
        
        row.appendChild(memoryCell);
        
        // Status
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.textContent = process.status;
        statusBadge.className = `status-badge status-${process.status.toLowerCase()}`;
        
        // Add status explanation
        if (process.status.toLowerCase() === 'running') {
            statusBadge.title = 'This program is currently active and using system resources';
        } else if (process.status.toLowerCase() === 'sleeping') {
            statusBadge.title = 'This program is waiting for something and not actively using CPU';
        } else if (process.status.toLowerCase() === 'stopped') {
            statusBadge.title = 'This program has been paused';
        }
        
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);
        
        // Actions
        const actionsCell = document.createElement('td');
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'process-actions';
        
        // Info button
        const infoBtn = document.createElement('button');
        infoBtn.className = 'process-action-btn';
        infoBtn.title = 'View more details about this program';
        infoBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        `;
        actionsDiv.appendChild(infoBtn);
        
        // Terminate button
        const terminateBtn = document.createElement('button');
        terminateBtn.className = 'process-action-btn terminate';
        terminateBtn.title = 'Stop this program (advanced users only)';
        terminateBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
        `;
        actionsDiv.appendChild(terminateBtn);
        
        actionsCell.appendChild(actionsDiv);
        row.appendChild(actionsCell);
        
        processTbody.appendChild(row);
    });
}

// Set loading state
function setLoading(loading) {
    isLoading = loading;
    
    if (loading) {
        refreshBtn.querySelector('.refresh-icon').classList.add('spin');
        refreshBtn.disabled = true;
    } else {
        refreshBtn.querySelector('.refresh-icon').classList.remove('spin');
        refreshBtn.disabled = false;
    }
}

// Show error message
function showError(message) {
    // Create a toast notification
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <div class="error-toast-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        </div>
        <div class="error-toast-content">
            <div class="error-toast-title">Something went wrong</div>
            <div class="error-toast-message">${message}</div>
        </div>
        <button class="error-toast-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // Close button functionality
    const closeBtn = toast.querySelector('.error-toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(toast)) {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});