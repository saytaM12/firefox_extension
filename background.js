async function getCurrentTab() {
    let [tab] = await browser.tabs.query({
        active: true,
        lastFocusedWindow: true
    });
    return tab;
}

async function getAllTabs() {
    return browser.tabs.query({});
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

async function switchToPrevTab() {
    getCurrentTab().then((curr_tab) => {
        getAllTabs().then((all_tabs) => {
            let last_id
            for (let i = 1; i < all_tabs.length; i += 1) {
                if (all_tabs[i].id == curr_tab.id) {
                    browser.tabs.update(last_id, { active: true });
                    return;
                }
                last_id = all_tabs[i].id;
            }
        });
    });
}

function workOnTabs() {
    getAllTabs().then((tabs) => {
        tabs.forEach((tab) => {
            injectJS(tab, "openImage.js");
        });
    });
}

async function downloadAll() {
    let tabs = await getAllTabs();
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
}

async function openImages() {
    let bytes = await browser.storage.sync.getBytesInUse();
    if (bytes == 0) {
        getCurrentTab().then((tab) => {
            injectJS(tab, "openImage.js");
        });

        switchToPrevTab();
        return;
    }

    let storage = await browser.storage.sync.get("local");
    let tabs = await getAllTabs();
    let new_tabs = [];

    tabs.forEach((tab) => {
        if (!storage.local.includes(tab.id)) {
            new_tabs.push(tab);
        }
    });

    browser.tabs.update(new_tabs[0].id, { active: true });

    new_tabs.forEach((tab) => {
        injectJS(tab, "openImage.js");
    });
    browser.storage.sync.clear();
}


async function search(string) {
    injectCurrJS("addToSearch.js");
    browser.runtime.onMessage.addListener((m) => {
        browser.runtime.sendMessage({
            string: string,
        });
    });
}

function prepare() {
    browser.storage.sync.getBytesInUse().then((bytes) => {
        if (bytes != 0)
            return;
    });

    let first_tabs_ids = [];

    getAllTabs().then((f_tabs) => {
        f_tabs.forEach((tab) => {
            first_tabs_ids.push(tab.id);
        });

        browser.storage.sync.set({ local: first_tabs_ids });
    });
}

browser.runtime.onMessage.addListener((m) => {
    let done = ''
    for (let i = 0; i < m.length; i += 1) {
        if (done.includes(m[i]))
            continue;
        done += m[i];
        switch (m[i]) {
            case 's':
                if (i == 0)
                    search(m.substring(1));
                else
                    switchToPrevTab();
                break;

            case 'o':
                workOnTabs();
                break;

            case 'd':
                downloadAll();
                break;
        }
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
