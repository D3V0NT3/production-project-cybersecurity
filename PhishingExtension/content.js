console.log("content.js loaded");

function showBanner(classification, probability) {
  const old = document.getElementById("mlWarning");
  if (old) old.remove();

  let bg = "#4CAF50";
  let fg = "white";
  let title = "✅ Website Appears Safe";
  let message = "No major phishing indicators were detected.";

  if (classification === "suspicious") {
    bg = "#FFC107";
    fg = "black";
    title = "⚠ Suspicious Website";
    message = "Some suspicious lexical URL features were detected.";
  } else if (classification === "phish") {
    bg = "#F44336";
    fg = "white";
    title = "🚨 Potential Phishing Detected";
    message = "Strong phishing indicators were detected.";
  } else if (classification === "legit") {
    bg = "#4CAF50";
    fg = "white";
    title = "✅ Website Appears Safe";
    message = "No major phishing indicators were detected.";
  } else {
    bg = "#9E9E9E";
    fg = "white";
    title = "ℹ Unknown Status";
    message = "The system could not determine a risk level.";
  }

  const banner = document.createElement("div");
  banner.id = "mlWarning";
  banner.innerHTML = `
    <div style="font-weight:bold;">${title}</div>
    <div style="font-size:14px;">Classification: <b>${classification.toUpperCase()}</b></div>
    <div style="font-size:12px; opacity:0.95;">Probability: ${probability}</div>
    <div style="font-size:12px; margin-top:4px;">${message}</div>
    <button id="closeBannerBtn" style="margin-top:10px;padding:6px 10px;border:none;border-radius:6px;cursor:pointer;">
      Dismiss
    </button>
  `;

  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";
  banner.style.width = "100%";
  banner.style.padding = "14px";
  banner.style.background = bg;
  banner.style.color = fg;
  banner.style.textAlign = "center";
  banner.style.fontFamily = "Arial, sans-serif";
  banner.style.zIndex = "2147483647";
  banner.style.boxShadow = "0 2px 8px rgba(0,0,0,0.25)";

  document.documentElement.prepend(banner);

  document.getElementById("closeBannerBtn").addEventListener("click", () => {
    banner.remove();
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  console.log("message received:", msg);

  if (msg.type !== "ML_RESULT") return;

  showBanner(msg.classification, msg.probability);
});

chrome.storage.local.get(["classification", "probability"], (data) => {
  console.log("storage fallback:", data);

  if (data.classification) {
    showBanner(data.classification, data.probability);
  }
});