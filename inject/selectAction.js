let text = prompt("\
s - (first) add to search bar\n\
    u - '-censored'\n\
    s - 'sort:score'\n\
a - open artists\n\
i - open original images\n\
d - download open images\n\
s - (not first) switch to previous tab\n\
p - prepare for images\n\
c - clear saved pages from memory", "p");
browser.runtime.sendMessage(text);
