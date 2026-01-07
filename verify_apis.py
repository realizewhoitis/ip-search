import requests
import json

def check_api(name, url):
    try:
        print(f"Checking {name}...")
        r = requests.get(url, timeout=5)
        print(f"Status: {r.status_code}")
        try:
            data = r.json()
            print(f"Keys: {list(data.keys())}")
            if name == 'dbip':
                print(f"City: {data.get('city')}")
            if name == 'freeipapi':
                print(f"City: {data.get('cityName')}")
        except:
            print("Failed to parse JSON")
            print(r.text[:100])
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 20)

check_api("freeipapi", "https://freeipapi.com/api/json/8.8.8.8")
check_api("dbip", "https://api.db-ip.com/v2/free/8.8.8.8")
check_api("ipinfo", "https://ipinfo.io/8.8.8.8/json")
