import re
import math
import pandas as pd
from urllib.parse import urlparse
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib

def shannon_entropy(text: str) -> float:
    if not text:
        return 0.0
    probs = [text.count(c) / len(text) for c in set(text)]
    return -sum(p * math.log2(p) for p in probs)

def has_ip(url: str) -> int:
    return 1 if re.search(r'(\d{1,3}\.){3}\d{1,3}', url) else 0

def keyword_count(url):
    keywords = [
        "login", "verify", "secure", "update", "account", "paypal",
        "bank", "signin", "password", "confirm", "wallet", "reset",
        "alert", "billing", "suspended", "unlock"
    ]
    url_lower = url.lower()
    return sum(1 for kw in keywords if kw in url_lower)

def extract_features(url: str) -> dict:
    parsed = urlparse(url)
    domain = parsed.netloc

    return {
        "url_length": len(url),
        "dot_count": url.count("."),
        "digit_count": sum(c.isdigit() for c in url),
        "special_char_count": sum(c in "-_@?=&%" for c in url),
        "has_at": 1 if "@" in url else 0,
        "has_https": 1 if parsed.scheme == "https" else 0,
        "has_ip": has_ip(url),
        "keyword_count": keyword_count(url),
        "hyphen_count": url.count("-"),
        "subdomain_count": max(0, domain.count(".") - 1),
        "entropy": shannon_entropy(url),
    }

df = pd.read_csv("training_urls.csv")  # columns: url,label
X = pd.DataFrame(df["url"].apply(extract_features).tolist())
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, preds))
print(confusion_matrix(y_test, preds))
print(classification_report(y_test, preds))

joblib.dump(model, "rf_phishing_model.pkl")
print("Saved rf_phishing_model.pkl")