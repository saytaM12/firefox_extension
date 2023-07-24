let url = window.location.href;
let searchText;
let artistName;
let correctTab = false;

let artistLi = document.querySelectorAll(".tag-type-artist");

if (artistLi.length == 1) {
    let artistA = artistLi[0].querySelectorAll("a");

    artistA.forEach((a) => {
        if (a.innerText != '+' && a.innerText != '-' && a.innerText != '?')
            artistName = a.innerText;
    });
}
else if (artistLi.length == 0){
    correctTab = true;
}

// missing yande.re
if (url.includes("gelbooru")) {
    if (document.getElementById("tags-search").value.includes(artistName))
        correctTab = true;
    searchText = "Original image";
}
else if (url.includes("rule34")) {
    if (document.getElementById("tags").value.includes(artistName))
        correctTab = true;
    searchText = "Original image";
}
else if (url.includes("lolibooru")) {
    if (document.getElementById("tags").value.includes(artistName))
        correctTab = true;
    searchText = "Download larger version";
}

if (correctTab) {
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
