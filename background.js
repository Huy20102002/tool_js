chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    try {
        switch (request.action) {
            case "getAppendage":
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    chrome.tabs.sendMessage(sender.tab.id, {action: request.callback}, function (request) {
                    });
                });
                break;
            case "createCart":
                httpAsync("GET", "/create_cart?sid=" + request.sid + "&uid=" + request.uid + "&data=" + encodeURIComponent(request.data), function (responseText) {
                    const jsonResponse = JSON.parse(responseText);
                    if (jsonResponse["accept"] === false) {
                        chrome.tabs.sendMessage(sender.tab.id, {
                            action: "orderError",
                            message: jsonResponse["reason"]
                        }, function (request) {
                        });
                    } else {
                        chrome.tabs.sendMessage(sender.tab.id, {action: "orderSuccess"}, function (request) {
                        });
                    }
                });
                break;
        }
    } catch (e) {
        console.log(e)
    }
});
