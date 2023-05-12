speed = 10000;
(
    function() {

        let quiz_data;
        let uuid;
        
        function unfulfilled() {
            alert("critical error, I wont work");
        }

        function return_quizName(string) {
            fetch("https://kahoot.it/rest/kahoots/?query=" + string + "&limit=5").then(response => (response)).then(res => res.json()).then(state_detected,unfulfilled);
        }

        function getUuid(uuid,callback) {
            fetch("https://kahoot.it/rest/kahoots/" + String(uuid)).then((promise_response) => promise_response.json()).then(callback,unfulfilled);
        }

        function state_detected(promiseData = "", booleen=false) {
            if (!booleen) {
                if (!promiseData) {
                    var kahoot_game_name = String(window.prompt("What is the game name:"));
                    return_quizName(kahoot_game_name);
                }
                if (promiseData) {
                    quiz_data = promiseData.entities;
                    state_detected(0,1);
                }
            } else {
                quiz_data.forEach(element => {
                    if (!uuid) {
                        dialogue = window.prompt("Y/N, Is the quiz name " + element.card.title);
                        dialogue == "Y" && (() => {
                            uuid = element.card.uuid;
                            getUuid(uuid,got_uuid);
                        })();
                    }
                });
            };
        };

        function url_change_event(url) {
            var event_url_pathname = url.detail;
            if ( path_names.indexOf(event_url_pathname) > 1 ) {
                let storage_object = JSON.parse(localStorage.getItem("kahoot-game_session"));
                storage = storage_object;
                quiz_data ? state_detected("",true ) : state_detected();
            } else {
                return;
            };

            if ( path_names.indexOf(event_url_pathname) == 5 && storage != false ) {
                var question_start_event = new CustomEvent("QuestionStart", {"detail" : storage.questionNumber});
                window.dispatchEvent(question_start_event);
            }
        }

        let storage;

        var url_change_event_listener = window.addEventListener("urlChange", url_change_event);

        let url_pathname = (() => {
            return location.pathname;
        })();

        var mutation_observer = new MutationObserver(detect_url_change);

        function detect_url_change() {
            var evt;
            //location.pathname !== url_pathname && console.log(location.pathname + "  DEBUG");  // Debug Not Necessary
            location.pathname !== url_pathname && (url_pathname = location.pathname, evt = (() => { let eventObj = new CustomEvent("urlChange", {"detail" : String(url_pathname)}); return eventObj; })() , window.dispatchEvent(evt));
        };

        mutation_observer.observe(document, {
            subtree: !0,
            childList: !0
        });




        var path_names = [
            "/",
            "/join",
            "/instructions",
            "/start",
            "/getready",
            "/gameblock",
            "/answer/sent",
            "/answer/result",
            "/ranking",
            "/wait-for-join"
        ];


        let quiz,answers,questions;

        function got_uuid(data) {
            quiz = data;
            questions = quiz.questions;
            var array = new Array();
            questions.forEach(question => {
                if (question) {
                    let choices = question.choices;
                    var array_of_correct_choices = [];
                    if (choices) {
                        Array.from(choices).forEach((choice) => {
                            if (choice.correct) {
                                var position = choices.indexOf(choice);
                                array_of_correct_choices.push(position);
                            }
                        }); 
                    };
                    array.push(array_of_correct_choices);
                }
            })
            answers = array;
        }



        window.addEventListener("urlChange",handle_url);

        function handle_url(e) {
            if (e.detail == "/gameblock" && answers) {
                var question_index = storage.questionNumber;
                var type = questions[question_index].type;
                if (type == "quiz") {
                    var answers_buttons = [];
                    answers[question_index].forEach((answer) => {
                        answers_buttons.push(document.querySelector("[data-functional-selector='answer-" + String(answer) + "']"));
                    });
                    answer_question(answers_buttons,type);
                };

                if (type == "open_ended") {
                    var answers_buttons = [];
                    answers[question_index].forEach((answer) => {
                        answers_buttons.push(answer);
                    });
                    answer_question(answers_buttons,type);
                };

                if (type == "jumble") {
                    var answers_buttons = [];
                    questions[question_index].choices.forEach((answer) => {
                        answers_buttons.push(answer.answer);
                    });
                    answer_question(answers_buttons,type);
                };

            }
        }

        document.addEventListener("keyup",keypress_handler);

        

        function keypress_handler(event) {
            let key = event.key;
            console.log(key);
        } 

        function answer_question(quiz_answers,type) {
            var question_index = storage.questionNumber;
            quiz_answers = quiz_answers;

            type == "quiz" && (() => {
                quiz_answers.forEach((answer_button) => {
                    answer_button.animate([
                        // key frames
                        { transform: 'rotate(0pdeg)' },
                        { transform: 'rotate(359deg)' }
                      ], {
                        // sync options
                        duration: 10000,
                        iterations: Infinity
                      });
                });
            })();

            type == "jumble" && (() => {
                let innerTexts = [];
                document.querySelector("[data-functional-selector='question-choice-text-0']").innerText;
                let colors = ["red", "orange", "lime", "blue"];
                for (let buttons = 0; buttons < quiz_answers.length; buttons++) {
                    innerTexts.push(document.querySelector("[data-functional-selector='question-choice-text-" + buttons + "']").innerText);
                };
                questions[question_index].choices.forEach((item) => {
                    for (let reps = 0; reps < innerTexts.length; reps++) {
                        var card = document.querySelector("[data-functional-selector='draggable-jumble-card-" + reps + "']");
                        if (card.innerText == item.answer) {
                            var index = Number(questions[question_index].choices.indexOf(item));
                            card.style.border = "5px solid " + colors[index]; 
                        }
                    }
                });
            })();

            type == "open_ended" && (() => {
                var text = questions[question_index].choices[quiz_answers[0]].answer;
                navigator.clipboard.writeText(text);
                document.querySelector("[data-functional-selector='text-answer-submit']").click();
            })();

        }

        

    }
)()