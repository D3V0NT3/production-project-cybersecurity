import re
import math
import joblib
import pandas as pd
from urllib.parse import urlparse
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = joblib.load("rf_phishing_model.pkl")

# Optional trusted-domain override to reduce obvious false positives
TRUSTED_DOMAINS = {
    "bbc.co.uk",
    "www.bbc.co.uk",
    "google.com",
    "www.google.com",
    "amazon.co.uk",
    "www.amazon.co.uk",
    "github.com",
    "www.github.com",
    "wikipedia.org",
    "www.wikipedia.org"
}

def shannon_entropy(text):
    if not text:
        return 0.0
    probs = [text.count(c) / len(text) for c in set(text)]
    return -sum(p * math.log2(p) for p in probs)

def has_ip(url):
    return 1 if re.search(r'(\d{1,3}\.){3}\d{1,3}', url) else 0

def keyword_flag(url):
    return 1 if re.search(r'login|verify|secure|update|account|paypal', url.lower()) else 0

def extract_features(url):
    parsed = urlparse(url)

    return {
        "url_length": len(url),
        "dot_count": url.count("."),
        "digit_count": sum(c.isdigit() for c in url),
        "special_char_count": sum(c in "-_@?=&%" for c in url),
        "has_at": 1 if "@" in url else 0,
        "has_https": 1 if parsed.scheme == "https" else 0,
        "has_ip": has_ip(url),
        "keyword_flag": keyword_flag(url),
        "entropy": shannon_entropy(url),
    }

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    domain = urlparse(url).netloc.replace("www.", "")

    # Optional whitelist logic for demo stability / false-positive reduction
    if domain in {d.replace("www.", "") for d in TRUSTED_DOMAINS}:
        return jsonify({
            "classification": "legit",
            "probability": 0.03
        })

    features = extract_features(url)
    feature_df = pd.DataFrame([features])

    prob = float(model.predict_proba(feature_df)[0][1])

    # 3-level traffic-light classification
    if prob >= 0.70:
        classification = "phish"
    elif prob >= 0.40:
        classification = "suspicious"
    else:
        classification = "legit"

    return jsonify({
        "classification": classification,
        "probability": round(prob, 4)
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)