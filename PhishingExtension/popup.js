function updateUI(data) {
  const circle = document.getElementById("statusCircle");
  const statusText = document.getElementById("statusText");
  const statusMessage = document.getElementById("statusMessage");
  const riskBadge = document.getElementById("riskBadge");
  const scoreText = document.getElementById("scoreText");
  const progressBar = document.getElementById("progressBar");
  const urlBox = document.getElementById("urlBox");

  if (!circle || !statusText || !statusMessage || !riskBadge || !scoreText || !progressBar || !urlBox) {
    console.error("Popup HTML is missing one or more required elements.");
    return;
  }

  const url = data.activeUrl || "No URL detected";
  const classification = data.classification || "unknown";
  const probability = parseFloat(data.probability);

  urlBox.textContent = url;

  if (classification === "unknown" || isNaN(probability)) {
    circle.className = "circle grey";
    statusText.textContent = "Checking website...";
    statusMessage.textContent = "Please wait while the page is analysed.";
    riskBadge.className = "badge neutral";
    riskBadge.textContent = "Unknown";
    scoreText.textContent = "--%";
    progressBar.style.width = "0%";
    progressBar.style.background = "#9ca3af";
    return;
  }

  const percent = Math.round(probability * 100);
  scoreText.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;

  if (classification === "phish") {
    circle.className = "circle red";
    statusText.textContent = "Potential phishing";
    statusMessage.textContent = "This page shows strong warning signs. Avoid signing in or entering payment details.";
    riskBadge.className = "badge phish";
    riskBadge.textContent = "High risk";
    progressBar.style.background = "#ef4444";
  } else if (classification === "suspicious") {
    circle.className = "circle yellow";
    statusText.textContent = "Suspicious website";
    statusMessage.textContent = "This page shows some unusual link patterns. Be cautious before entering sensitive information.";
    riskBadge.className = "badge suspicious";
    riskBadge.textContent = "Medium risk";
    progressBar.style.background = "#facc15";
  } else if (classification === "legit") {
    circle.className = "circle green";
    statusText.textContent = "Website appears safe";
    statusMessage.textContent = "No major phishing indicators were detected on this page.";
    riskBadge.className = "badge safe";
    riskBadge.textContent = "Low risk";
    progressBar.style.background = "#22c55e";
  } else {
    circle.className = "circle grey";
    statusText.textContent = "Unknown result";
    statusMessage.textContent = "The system could not determine a clear risk level.";
    riskBadge.className = "badge neutral";
    riskBadge.textContent = "Unknown";
    progressBar.style.background = "#9ca3af";
  }
}

function waitForData() {
  let attempts = 0;

  const interval = setInterval(() => {
    chrome.storage.local.get(["classification", "probability", "activeUrl"], (data) => {
      if (data.classification && data.probability !== undefined) {
        clearInterval(interval);
        updateUI(data);
      }

      attempts++;
      if (attempts > 10) {
        clearInterval(interval);
        updateUI(data);
      }
    });
  }, 100);
}

waitForData();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    chrome.storage.local.get(["classification", "probability", "activeUrl"], updateUI);
  }
});