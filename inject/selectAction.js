function main() {
    let def = 'o';

    let url = window.location.href;
    if (url.includes("https://img3.gelbooru.com/images/") ||
        url.includes("https://wimg.rule34.xxx//images/") ||
        url.includes("https://lolibooru.moe/image/") ||
        url.includes("https://files.yande.re/")) {
        def = 'd';
    }

    let artists = [];
    let artistLi = document.querySelectorAll(".tag-type-artist");

    if (!(artistLi.length == 0)) {
        artistLi.forEach((li) => {
            li.querySelectorAll("a").forEach((a) => {
                if (a.innerText != '+' && a.innerText != '–' && a.innerText != '?')
                    artists.push(a.innerText.replaceAll(' ', '_'))
            });
        });

        if (url.includes("gelbooru.com")) {
            artists.forEach((artist) => {
                if (document.getElementById("tags-search").value.includes(artist))
                    def = 'l';
            });
        }
        else if (url.includes("rule34.xxx") || url.includes("lolibooru.moe") || url.includes("yande.re")) {
            artists.forEach((artist) => {
                if (document.getElementById("tags").value.includes(artist))
                    def = 'l';
            });
        }
    }

    let text = prompt("\
s - (first) add to search bar\n\
    u - '-censored'\n\
    s - 'sort:score'\n\
d - download open images\n\
o - open correct things in correct tabs\n\
l - open and prepare all images on this tab\n\
y - reload all errors\n\
u - remove duplicate tabs\n\
c - open artist on all boards\n\
k - sort tabs by number of artist renditions", def);
    browser.runtime.sendMessage({ type: "action", text: text });
}

main();
