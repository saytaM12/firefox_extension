let text = prompt("\
s - (first) add to search bar\n\
    u - '-censored'\n\
    s - 'sort:score'\n\
d - download open images\n\
s - (not first) switch to previous tab\n\
o - open correct things in correct tabs\n", "o");
browser.runtime.sendMessage(text);
