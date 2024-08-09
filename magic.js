(function (callback) {
    if (document.readyState === "complete") callback();
    else document.addEventListener("readystatechange", () => {
        if (document.readyState === "complete") callback();
    });
})(() => {

    document.querySelectorAll("main > header > nav > a").forEach((el) => {
        el.onclick = function(event) {
            event.preventDefault();
            document.querySelector(el.getAttribute("href")).scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        };
    });

    document.getElementById("name-pronunciation-button").onclick = function(event) {
        event.preventDefault();
        document.getElementById("name-pronunciation").play();
    };

});
