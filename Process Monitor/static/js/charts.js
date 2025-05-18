// Initialize charts
let cpuChart, memoryChart;
let cpuData = [];
let memoryData = [];
let timeLabels = [];

// Chart colors
const getChartColors = () => {
    const isDark = document.documentElement.classList.contains('dark');
    
    return {
        cpu: {
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: isDark 
                ? 'rgba(79, 70, 229, 0.2)' 
                : 'rgba(79, 70, 229, 0.1)',
            pointBackgroundColor: 'rgb(79, 70, 229)',
            gridColor: isDark ? '#374151' : '#e5e7eb',
            textColor: isDark ? '#9ca3af' : '#6b7280'
        },
        memory: {
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: isDark 
                ? 'rgba(16, 185, 129, 0.2)' 
                : 'rgba(16, 185, 129, 0.1)',
            pointBackgroundColor: 'rgb(16, 185, 129)',
            gridColor: isDark ? '#374151' : '#e5e7eb',
            textColor: isDark ? '#9ca3af' : '#6b7280'
        }
    };
};

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    
    // Update charts when theme changes
    document.getElementById('theme-toggle').addEventListener('click', () => {
        setTimeout(() => {
            updateChartColors();
        }, 100);
    });
});

function initCharts() {
    const colors = getChartColors();
    
    // CPU Chart
    const cpuCtx = document.getElementById('cpu-chart').getContext('2d');
    cpuChart = new Chart(cpuCtx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'CPU Usage %',
                data: cpuData,
                borderColor: colors.cpu.borderColor,
                backgroundColor: colors.cpu.backgroundColor,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: colors.cpu.pointBackgroundColor,
                pointHoverBackgroundColor: colors.cpu.pointBackgroundColor,
                pointBorderColor: '#fff',
                pointHoverBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
            }]
        },
        options: getChartOptions('CPU Usage', colors.cpu)
    });

    // Memory Chart
    const memoryCtx = document.getElementById('memory-chart').getContext('2d');
    memoryChart = new Chart(memoryCtx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Memory Usage %',
                data: memoryData,
                borderColor: colors.memory.borderColor,
                backgroundColor: colors.memory.backgroundColor,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: colors.memory.pointBackgroundColor,
                pointHoverBackgroundColor: colors.memory.pointBackgroundColor,
                pointBorderColor: '#fff',
                pointHoverBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
            }]
        },
        options: getChartOptions('Memory Usage', colors.memory)
    });
}

function getChartOptions(title, colors) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: colors.gridColor,
                    borderColor: colors.gridColor,
                    tickColor: colors.gridColor
                },
                ticks: {
                    color: colors.textColor,
                    font: {
                        size: 12
                    },
                    callback: function(value) {
                        return value + '%';
                    }
                },
                title: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: colors.textColor,
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 6,
                    font: {
                        size: 12
                    }
                },
                title: {
                    display: false
                }
            }
        },
        animation: {
            duration: 750,
            easing: 'easeOutQuart'
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                padding: 12,
                cornerRadius: 6,
                displayColors: false,
                callbacks: {
                    title: function(context) {
                        return 'Time: ' + context[0].label;
                    },
                    label: function(context) {
                        const value = context.parsed.y;
                        let status = 'Normal';
                        
                        if (value > 80) {
                            status = 'Very High';
                        } else if (value > 50) {
                            status = 'High';
                        }
                        
                        return `${context.dataset.label}: ${value.toFixed(1)}% (${status})`;
                    }
                }
            }
        }
    };
}

function updateChartColors() {
    const colors = getChartColors();
    
    // Update CPU chart colors
    cpuChart.data.datasets[0].borderColor = colors.cpu.borderColor;
    cpuChart.data.datasets[0].backgroundColor = colors.cpu.backgroundColor;
    cpuChart.data.datasets[0].pointBackgroundColor = colors.cpu.pointBackgroundColor;
    cpuChart.data.datasets[0].pointHoverBackgroundColor = colors.cpu.pointBackgroundColor;
    
    cpuChart.options.scales.y.grid.color = colors.cpu.gridColor;
    cpuChart.options.scales.y.grid.borderColor = colors.cpu.gridColor;
    cpuChart.options.scales.y.grid.tickColor = colors.cpu.gridColor;
    cpuChart.options.scales.y.ticks.color = colors.cpu.textColor;
    cpuChart.options.scales.y.title.color = colors.cpu.textColor;
    cpuChart.options.scales.x.ticks.color = colors.cpu.textColor;
    cpuChart.options.scales.x.title.color = colors.cpu.textColor;
    
    // Update Memory chart colors
    memoryChart.data.datasets[0].borderColor = colors.memory.borderColor;
    memoryChart.data.datasets[0].backgroundColor = colors.memory.backgroundColor;
    memoryChart.data.datasets[0].pointBackgroundColor = colors.memory.pointBackgroundColor;
    memoryChart.data.datasets[0].pointHoverBackgroundColor = colors.memory.pointBackgroundColor;
    
    memoryChart.options.scales.y.grid.color = colors.memory.gridColor;
    memoryChart.options.scales.y.grid.borderColor = colors.memory.gridColor;
    memoryChart.options.scales.y.grid.tickColor = colors.memory.gridColor;
    memoryChart.options.scales.y.ticks.color = colors.memory.textColor;
    memoryChart.options.scales.y.title.color = colors.memory.textColor;
    memoryChart.options.scales.x.ticks.color = colors.memory.textColor;
    memoryChart.options.scales.x.title.color = colors.memory.textColor;
    
    // Update charts
    cpuChart.update();
    memoryChart.update();
}

function updateCharts(metrics) {
    // Get current time for label
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    // Update data arrays
    timeLabels.push(timeString);
    cpuData.push(parseFloat(metrics.cpu.percent));
    memoryData.push(parseFloat(metrics.memory.percent));
    
    // Keep only the last N data points
    if (timeLabels.length > CONFIG.CHART_HISTORY) {
        timeLabels.shift();
        cpuData.shift();
        memoryData.shift();
    }
    
    // Update charts
    cpuChart.data.labels = timeLabels;
    cpuChart.data.datasets[0].data = cpuData;
    cpuChart.update('none'); // Use 'none' to disable animation for frequent updates
    
    memoryChart.data.labels = timeLabels;
    memoryChart.data.datasets[0].data = memoryData;
    memoryChart.update('none');
}