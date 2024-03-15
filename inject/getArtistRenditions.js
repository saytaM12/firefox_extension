let renditions = 0;
let artists = document.getElementsByClassName('tag-type-artist')
if (artists.length == 0) {

    let win = window.open(document.getElementsByClassName("thumbnail-preview")[0].
        querySelector('a').
        getAttribute("href"), "_blank");

    let inArtists = win.document.getElementsByClassName('tag-type-artist');
    if (inArtists.length == 1) {
        renditions = inArtists[0].querySelectorAll('span')[win.document.getElementsByClassName('tag-type-artist')[0].querySelectorAll('span').length - 1].innerHTML;
    }
    win.close();
}

else if (artists.length == 1) {
    renditions = document.getElementsByClassName('tag-type-artist')[0].querySelectorAll('span')[document.getElementsByClassName('tag-type-artist')[0].querySelectorAll('span').length - 1].innerHTML;
}

else {
    for (let i = 0; i < artists.length - 1; i++) {
        if (document.getElementById("tags-search").includes(artists[i])) {
            renditions = document.getElementsByClassName('tag-type-artist')[i].querySelectorAll('span')[document.getElementsByClassName('tag-type-artist')[0].querySelectorAll('span').length - 1].innerHTML;
        }
    }
}

browser.runtime.sendMessage({ type: "renditions", count: renditions });
