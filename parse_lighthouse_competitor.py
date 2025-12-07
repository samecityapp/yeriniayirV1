import json
import sys

try:
    with open('lighthouse-report-competitor.json', 'r') as f:
        data = json.load(f)

    categories = data.get('categories', {})
    
    print("LIGHTHOUSE SCORES (COMPETITOR - kucukoteller.com.tr):")
    for key, value in categories.items():
        score = value.get('score')
        if score is not None:
            print(f"{value.get('title')}: {int(score * 100)}")
            
    print("\nKEY METRICS (COMPETITOR):")
    audits = data.get('audits', {})
    metrics = [
        'first-contentful-paint',
        'largest-contentful-paint',
        'total-blocking-time',
        'cumulative-layout-shift',
        'speed-index'
    ]
    
    for metric in metrics:
        audit = audits.get(metric, {})
        display_value = audit.get('displayValue')
        print(f"{audit.get('title')}: {display_value}")

except Exception as e:
    print(f"Error parsing report: {e}")
