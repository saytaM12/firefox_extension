let renditions = 0;
const artists = document.getElementsByClassName("tag-type-artist");
if (artists.length == 0) {
  console.log("not yet");
  renditions = 999999;
  // let win = window.open(document.getElementsByClassName("thumbnail-preview")[0].querySelector('a').getAttribute("href"), "_blank")
  //
  // let inArtists;
  // setTimeot(() => {
  //     inArtists = win.document.getElementsByClassName('tag-type-artist');
  // }, 200);
  // if (inArtists.length == 1) {
  //     renditions = inArtists[0].querySelectorAll('span')[win.document.getElementsByClassName('tag-type-artist')[0].querySelectorAll('span').length - 1].innerHTML;
  //     console.log(renditions);
  // }
  // win.close();
} else if (artists.length == 1) {
  renditions =
    artists[0].querySelectorAll("span")[
      artists[0].querySelectorAll("span").length - 1
    ].innerHTML;
} else {
  renditions = 999999;
  for (let i = 0; i < artists.length; i++) {
    if (document.getElementById("tags-search").value.includes(artists[i])) {
      renditions =
        artists[i].querySelectorAll("span")[
          artists[0].querySelectorAll("span").length - 1
        ].innerHTML;
      break;
    }
  }
}

browser.runtime.sendMessage({ type: "renditions", count: renditions });
