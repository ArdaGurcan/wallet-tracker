let amounts = {};
let currency = "";

$(".send").click(function () {
    update();
});

chrome.storage.sync.get("cookie", function (result) {
    console.log(result);
    if (result.cookie != undefined) {
        try {
            // Protected-block
            amounts = JSON.parse(
                result.cookie.slice(0, result.cookie.length - 3)
            );
            try {
                // Else-block
                currency = result.cookie.slice(result.cookie.length - 3);
            } catch (e) {
                // Else-handler-block
            }
        } catch (e) {
            // Handler-block
            chrome.storage.sync.set({ cookie: "{}usd" });
            currency = "usd";
        } finally {
            // Final-block
        }
        for (const [key, value] of Object.entries(amounts)) {
            if (value == 0) {
                delete amounts[key];
            }
        }
        $("#balance")[0].value = JSON.stringify(amounts)
            .replaceAll(/{|}|"| /g, "")
            .replaceAll()
            .replaceAll(":", ": ")
            .replaceAll(",", "\n");
        $("#currency")[0].value = currency;
    }
});
let cookie = "";

function update() {
    cookie = (
        '{"' +
        $("#balance")[0]
            .value.toLowerCase()
            .replaceAll("\n", ',"')
            .replaceAll(":", '":')
            .replaceAll(" ", "") +
        "}" +
        $("#currency")[0].value.toLowerCase()
    ).replaceAll("\\", "");
    chrome.storage.sync.set({ cookie: cookie }, function () {
        console.log(cookie);
    });
    chrome.storage.sync.get("cookie", function (result) {
        console.log(result);
    });
}
