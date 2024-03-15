async function getCurrentTab() {
    let [tab] = await browser.tabs.query({
        active: true,
        lastFocusedWindow: true
    });

    return tab;
    //}).then((tabs) => {return tabs[0]});
}

async function getAllTabs() {
    let tabs = await browser.tabs.query({});
    return tabs.filter((tab) => (tab.url.includes("gelbooru") || tab.url.includes("rule34") || tab.url.includes("lolibooru") || tab.url.includes("yande.re")));
}

function injectJS(tab, file) {
    browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["inject/" + file]
    });
}

async function injectCurrJS(file) {
    injectJS(await getCurrentTab(), file);
}

async function workOnTabs() {
    getAllTabs().then((tabs) => {
        tabs.forEach((tab) => {
            injectJS(tab, "openImage.js");
        });
    });
}

async function downloadAll() {
    getAllTabs().then((tabs) => {
        let file;
        let url;
        let download = false;

        tabs.forEach((tab) => {
            url = tab.url;
            if (tab.url.includes("https://img3.gelbooru.com/images/")) {
                download = true;
                file = "culture/" + url.substring(url.lastIndexOf('/') + 1);
            }
            else if (tab.url.includes("https://wimg.rule34.xxx//images/")) {
                download = true;
                file = "culture/" + url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'));
            }
            else if (tab.url.includes("https://lolibooru.moe/image/")) {
                download = true;
                file = url.substring(28);
                file = file.substring(0, file.indexOf('/'));
                file += url.substring(url.lastIndexOf('.'));
                file = "culture/" + file;
            }
            else if (tab.url.includes("https://files.yande.re/")) {
                download = true;
                file = url.substring(23);
                file = file.substring(file.indexOf('/') + 1);
                file = file.substring(0, file.indexOf('/'));
                file += url.substring(url.lastIndexOf('.'));
                file = "culture/" + file;
            }
            if (download) {
                browser.downloads.download({
                    url: url,
                    filename: file
                });
                browser.tabs.remove(tab.id);
            }
            download = false;
            return;
        });
    });
}

function search(string) {
    getCurrentTab().then((tab) => {
        browser.scripting.executeScript({
            target: { tabId: tab.id },
            args: [string],
            func: (string) => {
                let modifiers = new Set([""]);
                modifiers.clear();


                let url = window.location.href;

                if (string.includes('u')) {
                    modifiers.add("-censored");
                }

                if (string.includes('s')) {
                    if (url.includes("gelbooru.com") || url.includes("rule34.xxx")) {
                        modifiers.add("sort:score");
                    }
                    if (url.includes("yande.re") || url.includes("lolibooru.moe")) {
                        modifiers.add("order:Ascore");
                    }
                }

                let textBox = document.getElementById("tags-search");
                modifiers.forEach((modifier) => { textBox.value = textBox.value + ' ' + modifier });
                textBox.nextElementSibling.click()
            }
        });
    });
}

function tabError(tab) {
    if (tab.url.includes("gelbooru")) {
    }
    else if (tab.url.includes("rule34")) {
    }
    else if (tab.url.includes("lolibooru")) {
    }
    else if (tab.url.includes("yande.re")) {
        if (tab.title == "301 Moved Permanently") {
            return true;
        }
    }
    return false;
}

function reloadErrors() {
    let interval = setInterval(() => {
        getAllTabs().then((tabs) => {
            let errorTabs = [];

            for (let i = 0; i < tabs.length; i++) {
                if (tabError(tabs[i])) {
                    errorTabs.push(tabs[i]);
                }
            }
            if (errorTabs.length == 0) {
                clearInterval(interval);
                return;
            }
            for (let i = 0; i < errorTabs.length; i++) {
                if (errorTabs[i].status == "complete") {
                    browser.tabs.reload(errorTabs[i].id);
                }
            }
        });
    }, 2000);
}

function removeDuplicates() {
    getAllTabs().then((allTabs) => {
        let tabCount = {};

        allTabs.forEach((tab) => {
            if (!tabCount[tab.url]) {
                tabCount[tab.url] = 1;
            } else {
                browser.tabs.remove(tab.id);
            }
        });
    });
}

function openArtistOnAllBoards() {
}

let renditions = []
let sorting = false;
async function sortBySize() {
    sorting = true;
    let tabCount = 0;
    browser.tabs.query({}).then((tabs) => {
        tabCount = tabs.length;
    });
    getAllTabs().then((tabs) => {
        tabs.forEach((tab) => {
            injectJS(tab, "getArtistRenditions.js");
        });
    });

    setTimeout(() => {
        const sortedTabs = renditions.sort((a, b) => { return b.count - a.count });
        const tabIds = sortedTabs.map((tabWithCount) => parseInt(tabWithCount.tabId));

        for (const tabId of tabIds) {
            console.log(tabCount);
            console.log("Moving tab", tabId, "to index", tabCount - tabIds.indexOf(tabId) - 1);
            browser.tabs.move(tabId, { index: tabCount });
        }
    }, 300);
}


browser.runtime.onMessage.addListener((m, sender) => {
    if (m.type == "action" && m.text != null) {
        let processed = ''
        for (let i = 0; i < m.text.length; i += 1) {
            if (processed.includes(m.text[i]))
                continue;
            processed += m.text[i];
            switch (m.text[i]) {
                case 's':
                    search(m.text.substring(i + 1));
                    break;

                case 'o':
                    workOnTabs();
                    break;

                case 'd':
                    downloadAll();
                    break;

                case 'l':
                    injectCurrJS("openAll.js");
                    break;

                case 'y':
                    reloadErrors();
                    break;

                case 'u':
                    removeDuplicates();
                    break;

                case 'c':
                    openArtistOnAllBoards();
                    break;

                case 'k':
                    sortBySize();
                    break;
            }
        }
    }

    if (m.type == "renditions" && m.count != null) {
        const tabId = sender.tab.id;
        const count = m.count;
        renditions.push({ tabId: tabId, count: count });
    }
});

browser.commands.onCommand.addListener((command) => {

    switch (command) {
        case "master-shortcut":
            injectCurrJS("selectAction.js");
            break;

        case "close-tab":
            getCurrentTab().then((tab) => {
                browser.tabs.remove(tab.id);
            });
            break;
    }
});
