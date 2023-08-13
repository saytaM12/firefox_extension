function main() { 
    let def = 'o';

    let url = window.location.href;
    if (url.includes("https://img3.gelbooru.com/images/") ||
        url.includes("https://wimg.rule34.xxx//images/") ||
        url.includes("https://lolibooru.moe/image/") ||
        url.includes("https://files.yande.re/")) {
        def = 'd';
    }

    let text = prompt("\
s - (first) add to search bar\n\
    u - '-censored'\n\
    s - 'sort:score'\n\
d - download open images\n\
s - (not first) switch to previous tab\n\
o - open correct things in correct tabs\n\
l - open and prepare all images on this tab\n", def);
    browser.runtime.sendMessage(text);
}

main();
