function main() {
    let url = window.location.href;
    if (!((url.includes("gelbooru.com") && !url.includes("s=view")) ||
        (url.includes("rule34.xxx") && !url.includes("s=view")) ||
        (url.includes("lolibooru.moe") && !url.includes("show")) ||
        (url.includes("yande.re") && !url.includes("show")))) {
        return 0;
    }


    if (url.includes("gelbooru.com")) {
        let imageLinks = []
        document.querySelector(".thumbnail-container")
                .querySelectorAll("a")
                .forEach((image) => {
                    imageLinks.push(image.getAttribute("href"));
                });

        for (let i = 0; i < imageLinks.length - 1; i++) {
            window.open(imageLinks[i].getAttribute("href"), "_blank");
        }
        window.open(imageLinks[-1].getAttribute("href"), "_self");
    }

    if (url.includes("rule34.xxx")) {
        let imageLinks = []
        document.querySelector(".image-list")
                .querySelectorAll("a")
                .forEach((image) => {
                    imageLinks.push(image.getAttribute("href"));
                });

        for (let i = 0; i < imageLinks.length - 1; i++) {
            window.open(imageLinks[i].getAttribute("href"), "_blank");
        }
        window.open(imageLinks[-1].getAttrribute("href"), "_self");
    }

    if (url.includes("lolibooru.moe") || url.includes("yande.re")) {
        let imageLinks = []
        document.querySelectorAll(".directlink")
                .forEach((image) => {
                    imageLinks.push(image.getAttribute("href"));
                });

        for (let i = 0; i < imageLinks.length - 1; i++) {
            window.open(imageLinks[i].getAttribute("href"), "_blank");
        }
        window.open(imageLinks[-1].getAttribute("href"), "_self");
    }
}

main();
