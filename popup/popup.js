async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await browser.tabs.query(queryOptions);
    return tab;
}

async function executeScript() {
    var tab = await getCurrentTab();
    browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["pogramming_inject/prog_inject.js"]
    });
}


async function main() {

    let tab = await getCurrentTab();
    let url = tab.url;

    browser.tabs.create({url: url});

}

//main();

var alert_button = document.getElementById("alert_button");
alert_button.addEventListener(
"click", () => alert("hello, extensions."), false);


var img_button = document.getElementById("img_url_button");
img_button.addEventListener(
"click", () => executeScript(), false);
