from flask import Flask, jsonify, render_template
import psutil
import time
import json
from config import CONFIG

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', config=CONFIG)

@app.route('/api/system-metrics')
def system_metrics():
    # Get CPU info
    cpu_percent = psutil.cpu_percent(interval=0.5)
    cpu_count = psutil.cpu_count()
    
    # Get memory info
    memory = psutil.virtual_memory()
    memory_total_gb = memory.total / (1024 ** 3)
    memory_used_gb = memory.used / (1024 ** 3)
    
    # Get process info
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'status']):
        try:
            process_info = proc.info
            process_info['cpu_percent'] = proc.cpu_percent(interval=0.1)
            process_info['memory_percent'] = proc.memory_percent()
            processes.append(process_info)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    
    # Sort processes by CPU usage (descending)
    processes = sorted(processes, key=lambda x: x['cpu_percent'], reverse=True)[:CONFIG['MAX_PROCESSES']]
    
    return jsonify({
        'cpu': {
            'percent': f"{cpu_percent:.2f}",
            'cores': cpu_count
        },
        'memory': {
            'percent': f"{memory.percent:.2f}",
            'total': f"{memory_total_gb:.2f}GB",
            'used': f"{memory_used_gb:.2f}GB"
        },
        'processes': processes,
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    })

if __name__ == '__main__':
    app.run(debug=CONFIG['DEBUG'])