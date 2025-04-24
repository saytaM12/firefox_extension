function openSlowly(imageLinks) {
  let i = 0;
  const interval = window.setInterval(
    (imageLinks) => {
      const win = window.open(imageLinks[imageLinks.length - 1 - i]); //, "_blank");
      win.blur();
      window.focus();
      if (++i >= imageLinks.length) {
        window.clearInterval(interval);
        setTimeout(() => {
          browser.runtime.sendMessage({ type: "action", text: "o" });
        }, 2000);
      }
    },
    100,
    imageLinks,
  );
}

function main() {
  let url = window.location.href;
  if (
    !(
      (url.includes("gelbooru.com") && !url.includes("s=view")) ||
      (url.includes("rule34.xxx") && !url.includes("s=view")) ||
      (url.includes("lolibooru.moe") && !url.includes("show")) ||
      (url.includes("yande.re") && !url.includes("show"))
    )
  ) {
    return 0;
  }

  const imageLinks = [];

  if (url.includes("gelbooru.com")) {
    document
      .querySelector(".thumbnail-container")
      .querySelectorAll("a")
      .forEach((image) => {
        imageLinks.push(image.getAttribute("href"));
      });
  }

  if (url.includes("rule34.xxx")) {
    document
      .querySelector(".image-list")
      .querySelectorAll("a")
      .forEach((image) => {
        imageLinks.push(image.getAttribute("href"));
      });
  }

  if (url.includes("lolibooru.moe") || url.includes("yande.re")) {
    document.querySelectorAll(".directlink").forEach((image) => {
      imageLinks.push(image.getAttribute("href"));
    });
  }

  openSlowly(imageLinks);
}

main();
