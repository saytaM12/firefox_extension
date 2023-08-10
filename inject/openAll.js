let images = document.querySelectorAll(".thumb");

images.forEach((image) => {
    let link = image.getAttribute("href");
    window.open(link)
});
