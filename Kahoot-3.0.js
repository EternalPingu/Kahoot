  /////////////////////////////
 ///// Keypress Listener /////
/////////////////////////////

document.addEventListener("keydown",handle_keypress);

const modes = new Map([
    [1,"Automatic"],
    [2,"Highlight"],
    [3,"Hidden"],
    [4,"Remove"],
    [5,"Spin"],
    [6,"None"],
    [7,"Random"]
]);

function handle_keypress(keypress_event) {
    console.log(keypress_event);
}

(() => {
    let oldPushState = history.pushState;
    history.pushState = function pushState() {
        let ret = oldPushState.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('urlChange'));
        return ret;
    };

    let oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
        let ret = oldReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('urlChange'));
        return ret;
    };

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('urlChange'));
    });
})();

const states = new Map([
    [0,"https://kahoot.it"],
    [1,"https://kahoot.it/join"],
    [2,"https://kahoot.it/instructions"],
    [3,"https://kahoot.it/start"],
    [4,"https://kahoot.it/getready"],
    [5,"https://kahoot.it/gameblock"],
    [6,"https://kahoot.it/answer/sent"],
    [7,"https://kahoot.it/answer/result"],
    [8,"https://kahoot.it/podium"],
    [9,"https://kahoot.it/wait-for-next-question"]
]);
    
const events = new Map([
    ["https://kahoot.it","QuizPin"],
    ["https://kahoot.it/join","QuizNickname"],
    ["https://kahoot.it/instructions","QuizBeforeStart"],
    ["https://kahoot.it/start","QuizStart"],
    ["https://kahoot.it/getready","QuizBeforeQuestion"],
    ["https://kahoot.it/gameblock","QuizQuestionStart"],
    ["https://kahoot.it/answer/sent","QuizQuestionAnswer"],
    ["https://kahoot.it/answer/result","QuizAnswerRecieved"],
    ["https://kahoot.it/podium","QuizEnded"],
    ["https://kahoot.it/wait-for-next-question","QuizJoinWait"]
]);

window.addEventListener("urlChange",function() {
    let url = location.href;
    let eventName = events.get(url);
    let event = new Event(eventName);
    console.log(eventName);
    window.dispatchEvent(event);
});

class Quiz {
    constructor(quiz_details) {
        this.object = quiz_details;
        this.audience = quiz_details.audience;
        this.compatibilityLevel = quiz_details.compatibilityLevel;
        this.cover = quiz_details.cover;
        this.coverMetadata = quiz_details.coverMetadata;
        this.created = quiz_details.created;
        this.creator = quiz_details.creator;
        this.creator_primary_usage = quiz_details.creator_primary_usage;
        this.creator_username = quiz_details.creator_username;
        this.description = quiz_details.description;
        this.difficulty = quiz_details.difficulty;
        this.folderId = quiz_details.folderId;
        this.inventoryItemIds = quiz_details.inventoryItemIds;
        this.isValid = quiz_details.isValid;
        this.language = quiz_details.language;
        this.languageInfo = quiz_details.languageInfo;
        this.lobby_music = quiz_details.lobby_music;
        this.metadata = quiz_details.metadata;
        this.modified = quiz_details.modified;
        this.playAsGuest = quiz_details.playAsGuest;
        this.questions = quiz_details.questions;
        this.quizType = quiz_details.quizType;
        this.resources = quiz_details.resources;
        this.slug = quiz_details.slug;
        this.themeId = quiz_details.themeId;
        this.title = quiz_details.title;
        this.type = quiz_details.type;
        this.uuid = quiz_details.uuid;
        this.visibility = quiz_details.visibility;
    }
}

class Question {
    constructor(question) {
        this.choices = question.choices;
        this.image = question.image;
        this.imageMetadata = question.imageMetadata;
        this.languageInfo = question.languageInfo;
        this.layout = question.layout;
        this.media = question.media;
        this.points = question.points;
        this.pointsMultiplier = question.pointsMultiplier;
        this.question = question.question;
        this.questionFormat = question.questionFormat;
        this.resources = question.resources;
        this.time = question.time;
        this.type = question.type;
        this.video = question.video;
        this.player = {};
    }
}

class Answer_button extends Question {
    constructor(question) {
        super(question);
        this.answers = (() => {
            const correct_choices = new Array();
            if (this.choices) {
                this.choices.forEach((choice) => {
                    if(choice.correct) {
                        let index = this.choices.indexOf(choice);
                        let answer_button = "document.querySelector(\"[data-functional-selector='answer-\" +" + index.toString() + "+ \"']\")";
                        choice.button = answer_button;
                        correct_choices.push(choice);
                    }
                });
            }
            return correct_choices;
        })();
    }
}

function search_rejected(response) {
    console.error("Promise rejected, request not found..");
    console.info(response);
}

function kahoot_search(str,callback,callback2) {
    const searchString = String(str);
    const callbackFunction = callback;
    const callbackArgs = {};
    fetch("https://kahoot.it/rest/kahoots/?query=" + searchString + "&limit=1").then((response) => response.json()).then((json) => (() => {
        callbackArgs.promise_response = json;
        callbackArgs.search_string = searchString;
        callbackArgs.callback = callback2;
        return callbackArgs;
    })()).then(callbackFunction,search_rejected);
}

function uuid_search(promise) {
    const promise_response = promise.promise_response.entities[0].card;
    const search_title = promise.search_string;
    const quiz_uuid = promise_response.uuid;
    const callback = promise.callback;
    String(search_title).toLocaleLowerCase() == String(promise_response.title).toLocaleLowerCase() ? (() => {
        console.info("Quiz Recieved");
    })() : (() => {
        console.error("Titles do not match");
        return;
    })();

    fetch("https://kahoot.it/rest/kahoots/" + quiz_uuid).then((response) => response.json()).then(callback,search_rejected);
}

function handle_quiz_data(quiz_json) {
    const quiz = new Quiz(quiz_json);
    console.log(quiz);
    const questions = new Array();
    quiz.questions.forEach((question) => {
        let new_questionObject = new Question(question);
        questions.push(new_questionObject);
    });
    console.log(questions);
    const answers = new Array();
    questions.forEach((question) => {
        let new_answerObject = new Answer_button(question);
        answers.push(new_answerObject);
    });
    console.log(answers);
    // Add Event Listeners //
    window.addEventListener("QuizQuestionStart",quizQuestionStart);


    // Event Functions //
    function quizQuestionStart() {
        let questionIndex = JSON.parse(localStorage.getItem("kahoot-game_session")).questionNumber;
        answers[questionIndex].answers.forEach((answer) => {
            questions[questionIndex].type == "quiz" ? (() => {
                setTimeout(submit_answer(answer),1);
                submit_answer(String(answer.button));
            })() : questions[questionIndex].type == "open_ended" ? (() => {

            })() : questions[questionIndex].type == "jumble" ? (() => {

            })() : (() => {
                //DO whatever
            })
        })
    }

    function submit_answer(answer) {

    }
}

kahoot_search(window.prompt("Enter a quiz name:"),uuid_search,handle_quiz_data)