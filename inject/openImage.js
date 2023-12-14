function main() {
    let url = window.location.href;
    if (!((url.includes("gelbooru.com") && url.includes("s=view")) ||
        (url.includes("rule34.xxx") && url.includes("s=view")) ||
        (url.includes("lolibooru.moe") && url.includes("show")) ||
        (url.includes("yande.re") && url.includes("show")))) {
        return 0;
    }

    let searchText;
    let artists = [];
    let openImage = false;

    let artistLi = document.querySelectorAll(".tag-type-artist");

    if (artistLi.length == 0) {
        openImage = true;
    }
    else {
        artistLi.forEach((li) => {
            li.querySelectorAll("a").forEach((a) => {
                if (a.innerText != '+' && a.innerText != '–' && a.innerText != '?')
                    artists.push(a)
            });
        });

        if (url.includes("gelbooru.com")) {
            artists.forEach((artist) => {
                let text = artist.innerText.replaceAll(' ', '_');
                if (document.getElementById("tags-search").value.includes(text))
                    openImage = true;
            });
        }
        else if (url.includes("rule34.xxx") || url.includes("lolibooru.moe") || url.includes("yande.re")) {
            artists.forEach((artist) => {
                let text = artist.innerText.replaceAll(' ', '_');
                if (document.getElementById("tags").value.includes(text))
                    openImage = true;
            });
        }


        if (!openImage) {
            for (let i = 0; i < artists.length - 1; i++) {
                window.open(artists[i].getAttribute("href"), "_blank");
            }
            window.open(artists[artists.length - 1].getAttribute("href"), "_self");
            return;
        }
    }


    if (url.includes("gelbooru.com") || url.includes("rule34.xxx")) {
        searchText = "Original image";
    }
    else if (url.includes("lolibooru.moe") || url.includes("yande.re")) {
        searchText = "Download larger version";
    }

    let aTags = document.querySelectorAll("a");
    let found;

    for (let i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent.includes(searchText)) {
            found = aTags[i];
            break;
        }
    }

    let link = found.getAttribute("href");

    window.open(link, "_self");
}

main();
