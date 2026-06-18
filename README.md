# SpotAPhish: Phishing Website Detection Using Machine Learning

## Project Overview

SpotAPhish is a final-year cybersecurity production project that detects phishing websites using machine learning. The system analyses URL-based features and classifies websites as **Legitimate**, **Suspicious**, or **Phishing**.

The project is implemented as a browser-based security tool using a **Chrome extension** for the user interface and a **Flask API** backend for machine learning prediction. The system gives users real-time feedback through a simple traffic-light warning system and probability score.

## Aim

The aim of this project is to design, develop, and evaluate a real-time phishing detection system that can help users identify potentially malicious websites while browsing.

## Key Features

* Real-time phishing website detection
* Chrome extension interface
* Flask API backend
* Random Forest machine learning classifier
* URL-based lexical feature extraction
* Probability score for website risk
* Traffic-light warning system:

  * Green = Legitimate
  * Yellow = Suspicious
  * Red = Phishing
* Warning banner for risky websites
* Popup interface showing classification results

## Technologies Used

* Python
* Flask
* Scikit-learn
* Pandas
* JavaScript
* Chrome Web Extensions API
* HTML/CSS
* Machine Learning
* Random Forest Classification

## How It Works

The system works by sending the current website URL from the Chrome extension to the Flask API. The API extracts key URL features and passes them into the trained Random Forest model. The model then returns a classification and probability score, which is displayed to the user through the extension popup and warning banner.

```text
User Browser
    ↓
Chrome Extension
    ↓
Background Script
    ↓
Flask API
    ↓
Feature Extraction
    ↓
Random Forest Model
    ↓
Prediction Result
    ↓
Popup UI / Warning Banner
```

## URL Features Analysed

The model uses lexical URL-based features, including:

* URL length
* Digit count
* Special character count
* Suspicious keyword presence
* HTTPS usage
* URL entropy

These features were selected because they can be extracted quickly without analysing webpage content, helping the system remain lightweight and suitable for real-time browsing.

## Model Selection

A Random Forest classifier was selected because it provides a strong balance between accuracy, robustness, and efficiency. Compared with more resource-intensive deep learning approaches, Random Forest is more suitable for a lightweight browser-based deployment.

## Evaluation Summary

The system achieved strong phishing detection performance, with a focus on identifying malicious websites while maintaining real-time responsiveness. The project prioritised recall for phishing detection because missing a phishing website can lead to serious security consequences such as credential theft or financial loss.

The evaluation also identified limitations, including false positives for legitimate websites with long or complex URLs and dependency on the Flask API being available.

## Installation and Usage

### 1. Run the Flask API

Install the required Python packages:

```bash
pip install flask scikit-learn pandas numpy joblib
```

Start the backend server:

```bash
python app.py
```

### 2. Load the Chrome Extension

1. Open Google Chrome.
2. Go to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `extension/` folder.
6. Visit a website and open the extension popup to view the result.

## Project Limitations

* The model only analyses URL-based features and does not inspect webpage content.
* Some legitimate websites with complex URLs may be flagged as suspicious.
* The Chrome extension depends on the Flask API being available.
* The model should be retrained regularly using updated phishing datasets.

## Future Improvements

Possible improvements include:

* Adding webpage content-based analysis
* Combining machine learning with blacklist checks
* Supporting Firefox and Microsoft Edge
* Improving false positive handling
* Retraining the model with larger and more recent phishing datasets
* Adding offline prediction support

## Skills Demonstrated

* Cybersecurity analysis
* Phishing detection
* Machine learning model development
* Feature engineering
* Flask API development
* Chrome extension development
* JavaScript frontend integration
* Testing and evaluation
* Technical documentation
* Secure system design

## Academic Note

This repository is a portfolio version of my final-year Production Project for BSc Cyber Security. Some academic materials, private information, university-provided documents, and sensitive details may be excluded to comply with academic integrity and confidentiality requirements.

## Author

Devonte Williams
BSc Cyber Security
Leeds Beckett University
::: 
