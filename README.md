# Process Monitor

![Process Monitor Dashboard](https://github.com/yourusername/process-monitor/raw/main/screenshots/dashboard.png)

A web-based application that provides real-time monitoring of system processes, CPU usage, memory usage, and other system statistics. Built with Flask, psutil, and Chart.js.

## 📊 Features

- **Real-time System Monitoring**: Track CPU and memory usage with live updates
- **Process Management**: View and filter running processes with detailed resource usage
- **Interactive Charts**: Visualize system performance metrics with dynamic Chart.js graphs
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Lightweight**: Minimal resource footprint while monitoring your system

## 🖥️ Screenshots

<div align="center">
  <img src="https://github.com/yourusername/process-monitor/raw/main/screenshots/cpu-memory.png" alt="CPU and Memory Charts" width="45%">
  <img src="https://github.com/yourusername/process-monitor/raw/main/screenshots/process-list.png" alt="Process List" width="45%">
</div>

## 🚀 Installation

### Prerequisites

- Python 3.7+
- pip (Python package manager)

### Setup

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/process-monitor.git
cd process-monitor
\`\`\`

2. Create a virtual environment:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

3. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

4. Run the application:
\`\`\`bash
python app.py
\`\`\`

5. Open in your browser:
\`\`\`
http://localhost:5000
\`\`\`

## 🛠️ Technology Stack

- **Backend**: Python, Flask, psutil
- **Frontend**: HTML, CSS, JavaScript
- **Data Visualization**: Chart.js
- **Data Fetching**: AJAX/Fetch API

## 📝 Usage

Once the application is running:

1. The dashboard will automatically display real-time CPU and memory usage
2. The process list shows currently running processes sorted by resource usage
3. Click the refresh button to manually update all metrics
4. Data automatically refreshes every 2 seconds

## 🔧 Configuration

You can modify the configuration in `config.py`:

```python
# Sample configuration
CONFIG = {
    'UPDATE_INTERVAL': 2000,  # Update interval in milliseconds
    'MAX_PROCESSES': 20,      # Maximum number of processes to display
    'CHART_HISTORY': 30,      # Number of data points to keep in charts
    'DEBUG': False            # Enable/disable debug mode
}
