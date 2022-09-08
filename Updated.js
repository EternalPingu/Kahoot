function loadHttpModule() {
    return fetch("https://raw.githubusercontent.com/atacoiguess/http/main/http.js").then((data) => data.text()).then((code) => eval(code));
}

(function(){

    //get custom made https get functions then execute script
    loadHttpModule().then(()=>{

        //storing quiz url & function to search for the url
        quizSearch = {
            quizUrl : "https://kahoot.it/rest/kahoots/?query=" + String(prompt("Kahoot Quiz Name: ")) + "&limit=1",
            search : function(response) {
                return response.entities[0].card.uuid;
            }
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
            function switchMode() {
                if (mode == 0) {
                    mode = 1;
                    console.log("The mode has been changed to highlight");
                } else if (mode == 1) {
                    mode = 2;
                    console.log("The mode has been changed to hidden");
                } else if (mode == 2) {
                    mode = 3;
                    console.log("The mode has been changed to remove");
                } else if (mode == 3) {
                    mode = 0;
                    console.log("The mode has been changed to auto");
                };
            };
            try {
                console.log("The mode is auto, press the enter key to change modes");
            } catch {};
            function modeChanger(e) {
                var event = e;
                if (event.code == "Enter") {
                    switchMode();
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
                    console.log(modeText());
                    if(location.href.includes("gameblock")) {
                        answer();
                    }
                }
            });
            const config = {subtree: true, childList: true};
            observer.observe(document, config);
            document.body.addEventListener("keydown",modeChanger)
        }

        //search for quiz's actual data using a unique string or uuid but first wait for the quiz to start to it doesnt break
        function quizData(uuid) {
            var quizId = uuid;
            http.get("https://kahoot.it/rest/kahoots/" + quizId).then(promise_data => promise_data).then(kahoot_data => main(kahoot_data));
        }

        //send a http get request to the url with the quizzes name and handle the response data to get the uuid then use the uuid to get the actual quiz data
        http.get(quizSearch.quizUrl,quizSearch.search).then((data) => quizSearch.search(data)).then((uuid) => quizData(uuid));
    })
})()
