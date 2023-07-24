let port = browser.runtime.connect();
console.log(port)
/*

browser.runtime.onMessage.addListener((message) => {
    */
port.onMessage.addListener((message) => {
    console.log(message)
    let string = message.string;
    let args = '';

    if (string.includes('u')) {
        args += ' -censored';
    }
    if (string.includes('s')) {
        args += ' sort:score';
    }

    if (window.location.href.includes("gelbooru")) {
        document.getElementById("tags-search").value += args;
    }
    else if (window.location.href.includes("lolibooru") ||
        window.location.href.includes("rule34")) {
        document.getElementById("tags").value += args;
    }

    //document.getElementsByClassName("searchList")[0].click();
});

    /*
browser.runtime.sendMessage({
    message: 'hi',
});
    */
