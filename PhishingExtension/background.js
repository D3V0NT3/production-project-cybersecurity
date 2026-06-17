chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: tab.url })
    })
      .then(response => response.json())
      .then(data => {
        chrome.storage.local.set({
          activeUrl: tab.url,
          classification: data.classification,
          probability: data.probability
        });

        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, {
            type: "ML_RESULT",
            classification: data.classification,
            probability: data.probability
          }).catch(err => console.log("sendMessage error:", err));
        }, 300);
      })
      .catch(err => console.log("API error:", err));
  }
});