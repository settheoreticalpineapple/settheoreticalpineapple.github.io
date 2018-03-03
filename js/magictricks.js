/* * * * * * * * * * * * *
 * © 2018 Joni Puljujärvi
 */

var ready = (function() {
    var t = !1;
    return function(e) {
        var n = function() {
            if(!t) return t=!0, e()
        }, o = function() {
            if(!t) {
                try {
                    document.documentElement.doScroll("left");
                } catch(t) {
                    return void setTimeout(o,1);
                }
                return n();
            }
        };
        if ("complete" === document.readyState) return n();
        if (document.addEventListener) document.addEventListener("DOMContentLoaded",n,!1),
            window.addEventListener("load",n,!1);
        else if(document.attachEvent) {
            document.attachEvent("onreadystatechange",n), window.attachEvent("onload",n);
            var d = !1;
            try {
                d = null == window.frameElement
            } catch(t) {}
            if(document.documentElement.doScroll&&d) return o();
        }
    };
})();
        
function toggleMinipage(id, open) {
    var fn = null;
    if (open) {
        fn = (function(event) {
            event.preventDefault();
            var el = document.getElementById(id);
            el.classList.add("active");
            setTimeout(function(){
                el.classList.add("visible");
            }, 10);
            if (!el.hasBeenVisited) {
                el.hasBeenVisited = true;
                loadLazy(el);
            }
        });
    } else {
        fn = (function(event) {
            event.preventDefault();
            document.getElementById(id).classList.remove("visible");
            setTimeout(function(){
                document.getElementById(id).classList.remove("active");
            }, 500);
        });
    }
    return fn;
}

function loadLazy(el) { // loads all images and iframes who are descendants of el
    var iframes = document.getElementsByTagName("iframe");
    var images = document.getElementsByTagName("img");
    for (var i = 0; i < Math.max(iframes.length, images.length); i++) {
        if (i < iframes.length && el.contains(iframes[i]) && iframes[i].dataset.src !== undefined) {
            loadElement(iframes[i]);
        } else if (i < images.length && el.contains(images[i]) && images[i].dataset.src !== undefined) {
            loadElement(images[i]);
        }
    }
}

function loadElement(el) { // loads the element el
    el.src = el.dataset.src;
    el.removeAttribute("data-src");
    el.classList.remove("not-loaded");
}

function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
}



/* After DOM is loaded */
ready(function() {
    var main = document.getElementsByTagName("main")[0];
    
    // Email stuffs
    (function(){
        var address = (function(s) {
            return s.replace(/[a-zA-Z]/g, function (c) {
                return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
            });
        })("%77%62%61%76%2R%63%68%79%77%68%77%6R%65%69%76%40%75%72%79%66%76%61%78%76%2R%73%76");
        var link = document.getElementById("email");
        address = (function(s) {
            return s.replace(/[a-zA-Z]/g, function (c) {
                return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
            })})(decodeURIComponent(address));
        link.setAttribute("href", "mailto:" + address);
        link.appendChild(document.createTextNode(address));
    })();
    
    
    // Year
    (function(){
        document.getElementById("year").innerHTML = (new Date()).getFullYear();
    })();


    // Round links
    (function(){
        document.getElementById("writings-link").onclick = toggleMinipage("writings", true);
        document.getElementById("music-link").onclick = toggleMinipage("music", true);
        document.getElementById("art-link").onclick = toggleMinipage("art", true);
        document.getElementById("websites-link").onclick = toggleMinipage("websites", true);
        document.getElementById("faq-link").onclick = toggleMinipage("faq", true);
        var minipages = document.querySelectorAll("main ~ article");
        for (var i = 0; i < minipages.length; i++) {
            minipages[i].hasBeenVisited = false;
            var a = document.createElement("a");
            a.classList.add("back-link");
            a.appendChild(document.createTextNode("Back"));
            a.setAttribute("href", "#");
            minipages[i].appendChild(a);
            a.onclick = toggleMinipage(minipages[i].id, false);
        }
    })();


    // Figure imgs
    (function(){
        var imgs = document.querySelectorAll("figure img");
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].addEventListener("click", function() {
                if (!document.getElementById("imgview")) {
                    var imgview = document.createElement("div");
                    imgview.id = "imgview";
                    imgview.appendChild(document.createElement("img"));
                    var dismiss = document.createElement("a");
                    dismiss.appendChild(document.createTextNode("⊗"));
                    imgview.appendChild(dismiss);
                    document.body.appendChild(imgview);
                    imgview.onclick = function(){
                        this.classList.remove("active");
                        setTimeout(function(imgview){
                            imgview.classList.remove("visible");
                        }, 250, this);
                    };
                }

                var imgview = document.getElementById("imgview");
                var img = imgview.firstElementChild;
                if (this.hasAttribute("data-zoom-in-url")) {
                    img.setAttribute("src", this.dataset.zoomInUrl);
                } else {
                    img.setAttribute("src", this.getAttribute("src"));
                }
                img.setAttribute("alt", this.getAttribute("alt"));
                imgview.classList.add("visible");
                setTimeout(function(imgview, img){
                    if (img.complete) {
                        img.style.marginTop = Math.round((window.innerHeight - img.clientHeight)/2) + "px";
                    } else {
                        interval = setInterval(function(img){
                            if (img.complete) {
                                img.style.marginTop = Math.round((window.innerHeight - img.clientHeight)/2) + "px";
                                clearInterval(interval);
                            }
                        }, 10, img);
                    }
                    imgview.classList.add("active");
                }, 10, imgview, img);
            });
        }

        imgs = document.querySelectorAll("#websites figure img");
        for (var i = 0; i < imgs.length; i++) {
            var src;
            if (imgs[i].hasAttribute("data-src")) {
                src = imgs[i].dataset.src;
            } else {
                src = imgs[i].getAttribute("src");
            }
            if (src.indexOf("small") !== -1) {
                src = src.split("small");
                src = src[0] + src[1];
            }
            imgs[i].dataset.zoomInUrl = src;
        }
    })();


    /* Portrait mode lazy loading */
    var portrait = screen.height > screen.width;
    if (portrait || screen.width <= 1024) window.addEventListener("scroll", function(event) {
        var lazyElements = document.querySelectorAll("[data-src]");
        for (var i = 0; i < lazyElements.length; i++) {
            if (isScrolledIntoView(lazyElements[i])) {
                loadElement(lazyElements[i]);
            }
        }
    });


    /*
        // Changing "tabs"
        (function(){
            var boxes = document.getElementsByClassName("box");
            for (var i = 0; i < boxes.length; i++) {
                boxes[i].onclick = function() {changeTab(this)};
            }
            var arrows = document.getElementsByClassName("arrow");
            for (var i = 0; i < arrows.length; i++) {
                arrows[i].onclick = function() {
                    if (this.classList.contains("left")) {
                        changeTab(this.parentElement.querySelector(".middle").previousElementSibling);
                    } else if (this.classList.contains("right")) {
                        changeTab(this.parentElement.querySelector(".middle").nextElementSibling);
                    }
                }
            }
        })();
    */


});

/*
function changeTab(who) {
    var left = who.parentElement.children[0],
        middle = who.parentElement.children[1],
        right = who.parentElement.children[2];
    var active = who.parentElement.querySelector(".middle");
    var arrowLeft = who.parentElement.querySelector(".arrow.left"),
        arrowRight = who.parentElement.querySelector(".arrow.right");

    if (active === middle) {
        if (who === left) {
            right.classList.add("distant");
            middle.classList.remove("middle");
            middle.classList.add("right");
            left.classList.remove("left");
            left.classList.add("middle");
            arrowLeft.classList.add("disabled");
        } else if (who === right) {
            left.classList.add("distant");
            middle.classList.remove("middle");
            middle.classList.add("left");
            right.classList.remove("right");
            right.classList.add("middle");
            arrowRight.classList.add("disabled");
        }
    } else {
        if (active === left && who === middle) {
            left.classList.remove("middle");
            left.classList.add("left");
            middle.classList.remove("right");
            middle.classList.add("middle");
            right.classList.remove("distant");
            arrowLeft.classList.remove("disabled");
        } else if (active === right && who === middle) {
            right.classList.remove("middle");
            right.classList.add("right");
            middle.classList.remove("left");
            middle.classList.add("middle");
            left.classList.remove("distant");
            arrowRight.classList.remove("disabled");
        }
    }
}
*/
