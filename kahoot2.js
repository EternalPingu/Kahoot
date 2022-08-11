function loadHttpModule() {
    return fetch("https://raw.githubusercontent.com/atacoiguess/http/main/http.js").then((data) => data.text()).then((code) => eval(code));
}

(function(){
    loadHttpModule().then(()=>{
        var quizUrl = "https://kahoot.it/rest/kahoots/?query=" + String(prompt("Kahoot Quiz Name: ")) + "&limit=1";
        function quizSearch(response) {
            return response.entities[0].card.uuid;
        };
        function main(data) {
            const quiz = data;
            console.log(quiz);
            const questions = quiz.questions;
            function questionNumber() {
                return JSON.parse(localStorage.getItem("kahoot-game_session")).questionNumber;
            }
            mode = 0;
            modeText = function() {
                if (mode == 0) return "Auto";
                if (mode == 1) return "Highlight";
                if (mode == 2) return "Hidden";
                if (mode == 3) return "Remove";
            }
            function swithMode() {
                if (mode == 0) {
                    mode = 1;
                    html.gSel("data-functional-selector","question-type-heading-classicTitle").innerText = "Highlight";
                } else if (mode == 1) {
                    mode = 2;
                    html.gSel("data-functional-selector","question-type-heading-classicTitle").innerText = "Hidden";
                } else if (mode == 2) {
                    mode = 3;
                    html.gSel("data-functional-selector","question-type-heading-classicTitle").innerText = "Remove";
                } else if (mode == 3) {
                    mode = 0;
                    html.gSel("data-functional-selector","question-type-heading-classicTitle").innerText = "Auto";
                };
            };
            try {
                html.gSel("data-functional-selector","question-type-heading-classicTitle").innerText = "Auto";
            } catch {};
            function modeChanger(e) {
                var event = e;
                if (event.code == "Enter") {
                    swithMode();
                }
            }
            function answer() {
                var question_choices = questions[questionNumber()].choices;
                qu = question_choices
                for (let choices = 0; choices < question_choices.length; choices++) {
                    if (question_choices[choices].correct == true) {
                        if (mode == 0) {
                            html.gSel("data-functional-selector","answer-" + String(choices)).click();
                        } else if (mode == 1) {
                            html.gSel("data-functional-selector","answer-" + String(choices)).style.border = "7px solid chartreuse";
                        } else if (mode == 2) {
                            document.body.addEventListener("mousedown",function(e) {
                                if (mode == 2) {
                                    if (e.target != html.gSel("data-functional-selector","answer-" + String(choices))) {
                                        html.gSel("data-functional-selector","answer-" + String(choices)).click();
                                    };
                                };
                            });
                        } else if (mode == 3) {
                            for (let i = 0; i < 4; i++) {
                                var toDelete =[];
                                try {
                                    if (i != choices) {
                                        toDelete.push(html.gSel("data-functional-selector","answer-" + String(i)));
                                    }
                                    html.gSel("data-functional-selector","answer-" + String(choices))
                                    console.log(toDelete)
                                    toDelete.forEach(element => {
                                        element.remove();
                                    });
                                } catch(err) {console.log(err)};
                            };
                        };
                    };
                };
            };
            let previousUrl = '';
            const observer = new MutationObserver(function(mutations) {
                if (location.href !== previousUrl) {
                    previousUrl = location.href;
                    html.gSel("data-functional-selector","question-type-heading-classicTitle").innerText = modeText();
                    if(location.href.includes("gameblock")) {
                        answer();
                    }
                }
            });
            const config = {subtree: true, childList: true};
            observer.observe(document, config);
            document.body.addEventListener("keydown",modeChanger)
        }
        function quizData(uuid) {
            var quizId = uuid;
            http.get("https://kahoot.it/rest/kahoots/" + quizId).then(promise_data => promise_data).then(kahoot_data => main(kahoot_data));
        }
        http.get(quizUrl,quizSearch).then((data) => quizSearch(data)).then((uuid) => quizData(uuid));
    })
})()