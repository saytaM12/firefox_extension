let artistLi = document.querySelectorAll(".tag-type-artist");

if (artistLi.length == 1) {
    let artistA = artistLi[0].querySelectorAll("a");

    artistA.forEach((a) => {
        if (a.innerText != '+' && a.innerText != '-' && a.innerText != '?')
            window.open(a.getAttribute('href'), "_self");
    });
}
