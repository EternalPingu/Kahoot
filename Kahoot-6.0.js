"use strict";

function loadJquery(callback) {
    var funct_start = window.performance.now();
    var script_tag = document.createElement("script");
    script_tag.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js";
    script_tag.addEventListener("load",callback);
    document.body.appendChild(script_tag);
    var func_end = window.performance.now();
    var time = func_end - funct_start;
    console.log("✅ JQuery Script Loaded ✅");
    console.log("Took " + String(time) + "ms to load");
}

function loadJqueryCss(callback) {
    var funct_start = window.performance.now();
    let jqueryUI = document.createElement("link");
    jqueryUI.rel = "stylesheet";
    jqueryUI.href = "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css";
    jqueryUI.integrity = "sha512-ELV+xyi8IhEApPS/pSj66+Jiw+sOT1Mqkzlh8ExXihe4zfqbWkxPRi8wptXIO9g73FSlhmquFlUOuMSoXz5IRw==";
    jqueryUI.crossOrigin = "anonymous";
    jqueryUI.referrerPolicy = "no-referrer";
    jqueryUI.addEventListener("load",callback);
    document.head.appendChild(jqueryUI);
    var funct_end = window.performance.now()
    var time = funct_end - funct_start;
    console.log("\n\n✅ JQuery CSS Loaded ✅");
    console.log("Took " + String(time) + "ms to load");
}

function loadJqueryUi(callback) {
    var funct_start = window.performance.now();
    let jqueryUiScript = document.createElement("script");
    jqueryUiScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
    jqueryUiScript.integrity = "sha512-57oZ/vW8ANMjR/KQ6Be9v/+/h6bq9/l3f0Oc7vn6qMqyhvPd1cvKBRWWpzu0QoneImqr2SkmO4MSqU+RpHom3Q==";
    jqueryUiScript.crossOrigin = "anonymous";
    jqueryUiScript.referrerPolicy = "no-referrer";
    jqueryUiScript.addEventListener("load",callback);
    document.head.appendChild(jqueryUiScript);
    var funct_end = window.performance.now()
    var time = funct_end - funct_start;
    console.log("\n\n✅ JQuery UI Loaded ✅");
    console.log("Took " + String(time) + "ms to load");
}

function loadScripts() {
    return new Promise((resolve,reject) => {
        function callback3(event) {resolve()};
        function callback2(event) {loadJqueryUi(callback3)};
        function callback1(event) {loadJqueryCss(callback2)};   
        loadJquery(callback1);
    });
}

const Kahoot = {
    Search : {
        searchName : async (str,callback) => {
            let search = String(str);
            let result = await fetch(`https://kahoot.it/rest/kahoots/?query=${search}&limit=1`);
            let json = await result.json();
            await callback(json);
        },
        searchUuid : async(uuid,callback) => {
            let search = uuid;
            let result = await fetch(`https://kahoot.it/rest/kahoots/${search}`);
            let json = await result.json();
            await callback(json);
        }
    }
}

const data = (quiz) => {
    
}

(() => {

    let lastUrl = location.href;
    window.dispatchEvent("urlChange");
    new MutationObserver((
        function() {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                if (urlChanging == 0) {
                    window.dispatchEvent(new Event("urlChange"));
                }
            }
        }
    )).observe(document, {
        subtree: !0,
        childList: !0
    });

    function handleChange() {
        if (location.href == "https://kahoot.it") {
            var submit = document.querySelector("[data-functional-selector='join-game-pin']");
            submit.addEventListener("click",handleQuizPin);
            
            function handleQuizPin() {
                var pin = document.querySelector("[data-functional-selector='game-pin-input']");
                var sessionStorageObject = JSON.parse(sessionstorage.getItem("kahoot-hack"));
                sessionStorageObject.pin = pin.value;
                sessionStorage.setItem("kahoot-hack",sessionStorageObject);
                submit.removeEventListener("click",handleQuizPin)
            };
            return;
        }

        if (location.href == "https://kahoot.it/join") {
            document.querySelector("[data-functional-selector='username-input']").maxLength = "-1";
            var submit = document.querySelector("[data-functional-selector='join-button-username']");
            submit.addEventListener("click",handleUsername);
            function handleUsername() {
                var username = document.querySelector("[data-functional-selector='username-input']");
                var sessionStorageObject = JSON.parse(sessionstorage.getItem("kahoot-hack"));
                sessionStorageObject.username = username.value;
                sessionStorage.setItem("kahoot-hack",sessionStorageObject);
                submit.removeEventListener("click",handleUsername);
            }
        }
    }

    window.addEventListener("urlChange",handleChange);

})()
