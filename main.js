let currency = "try";
let amounts = {
    // matic: 0,
    // link: 0,
    // eth: 0,
    // dot: 0,
    // algo: 0,
    // ada: 0,
    // hbar: 0,
    // btc: 0,
    // xmr: 0,
};

// function update() {
//     chrome.storage.sync.set(
//         { cookie: JSON.stringify(amounts) + currency },
//         function () {
//             getData();
//             console.log();
//         }
//     );
// }

let oldSum = -1;
// let change = true;
chrome.browserAction.onClicked.addListener(function (tab) {
    console.log("abc");
    getData();
});
$(".options-button").click(function () {
    chrome.runtime.openOptionsPage();
});
function getData() {
    let promises = [];
    let sum = 0;
    let prices = [];
    chrome.storage.sync.get("cookie", function (result) {
        if (result.cookie != undefined) {
            try {
                amounts = JSON.parse(
                    result.cookie.slice(0, result.cookie.length - 3)
                );
                currency = result.cookie.slice(result.cookie.length - 3);
            } catch (error) {
                chrome.storage.sync.set({ cookie: "{}usd" });
            }
        }
        Object.keys(amounts).forEach((key) => {
            promises.push(
                $.getJSON(
                    "https://api.cryptonator.com/api/ticker/" +
                        key +
                        "-" +
                        currency,
                    function (data) {
                        if (amounts[key] > 0) {
                            prices.push([
                                key,
                                amounts[key] * data.ticker.price,
                            ]);
                        }
                    }
                )
            );
        });
        let out = "";

        Promise.all(promises).then(() => {
            prices.sort((a, b) => b[1] - a[1]);

            for (let i = 0; i < prices.length; i++) {
                out +=
                    "<b>" +
                    prices[i][0].toUpperCase() +
                    ":</b> " +
                    Math.round(prices[i][1] * 100) / 100 +
                    "<br>";

                sum += prices[i][1];
            }
            change = false;
            if ($(".prices")[0]) {
                $(".prices")[0].innerHTML = "";
            }
            $(".prices").append(
                out + "<br><b>SUM:</b> " + Math.round(sum * 100) / 100
            );
            chrome.browserAction.setBadgeText({
                text: Math.round(sum).toString(),
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: "#0f0933",
            });
            chrome.browserAction.setBadgeTextColor({ color: "#3cf281" });
        });
    });
}
getData();
setInterval(() => {
    getData();
}, 60000);
