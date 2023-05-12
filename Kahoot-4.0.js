//Quiz Question class
class Question {
    constructor() {

    }
}


//Save all variables
let script = {};

//Specify the default callback functions
const search_callback = handle_response
const search_handler_callback = search_data;
const quiz_data_handler_callback = quiz_data_handler;
const debug_mode = 1;

// Search for the uuid
function search(name) {
    function failure() {
        console.error("kahoot search api didnt return a valid response. Please Try again");
        var confirm_prompt = window.confirm("An Error has occured. Would you like to refresh the page?");
        confirm_prompt == true ? location.reload() : 1;
    }
    const search_term = name;
    const callback = search_callback;
    fetch("https://kahoot.it/rest/kahoots/?query=" + search_term + "&limit=1").then((promiseResponse) => promiseResponse.json()).then(callback, failure);
    return 200;
}

//Search for the quiz
function handle_response(search_result) {

    //Ensure response is valid
    const check = typeof search_result != "object" ? (() => {
        console.error("The returned response for the search is not an object");
        var confirm_prompt = window.confirm("An Error has occured. Would you like to refresh the page?");
        confirm_prompt == true ? location.reload() : 1;
        return "fail";
    })() : "success";

    //if it's invalid then terminate the function
    if (check == "fail") {
        return;
    }

    //log information
    console.log("ℹ️ Search Performed Successfully ℹ️");

    //log debug object if debug mode is enabled
    if (debug_mode) {
        console.log(search_result);
    }

    //assign important variables
    const search_response = search_result.entities[0].card;
    const uuid = search_response.uuid;

    //save variable incase its needed later
    script.search_response = search_response;
    script.uuid = uuid;

    //call the next function using global var
    search_handler_callback(uuid);

}

//function that searches for the uuid
function search_data(id) {

    const uuid = id;

    //check if uuid is valid
    typeof uuid == "string" ? uuid.length != 36 ? (() => {
        console.error("The provided uuid is of incorrect length, it should be 36 characters");
        confirm_prompt == true ? location.reload() : 1;
        return "fail";
    })() : "success" : (() => {
        console.error("The provided uuid is not a string!");
        confirm_prompt == true ? location.reload() : 1;
        return "fail";
    })();

    //Log information
    console.log("ℹ️ Quiz UUID has been obtained ℹ️");

    //log developer info if debug is enabled
    if (debug_mode) {
        console.log(uuid);
    };

    //perform this function if the fetch function fails
    function failure() {
        console.error("The search data function returned an invalid response");
        var confirm_prompt = window.confirm("An Error has occured. Would you like to refresh the page?");
        confirm_prompt == true ? location.reload() : 1;
    }

    //fetch the quiz data and call the callback function
    fetch("https://kahoot.it/rest/kahoots/" + uuid).then((promise_response) => promise_response.json()).then(quiz_data_handler_callback, failure);
    return 200;
}

//handle the quiz's data
function quiz_data_handler(data_obj) {

    //log info
    console.log("ℹ️ Quiz Data Has Been Obtained ℹ️")

    //log dev info
    if (debug_mode) {
        console.log(data_obj);
    }

    //define the quiz data variable
    const quiz = data_obj;

    //save the variable for later
    script.quizData = quiz;

    //define classes
    const questions = [];

    //add data to the array of questions;
    quiz.questions.forEach((question) => {
        let type = question.type;
        const answers_object = type == "quiz" ? (() => {
            let correct_choices = new Array();
            let incorrect_choices = new Array();
            question.choices.forEach((choice) => {
                choice.correct == true ? correct_choices.push(choice) : incorrect_choices.push(choice);
            });

            if (correct_choices > 1) {
                type = "multi_choice";
            };

            //add the index of the correct choice to the choice object
            correct_choices.forEach((correct_choice) => {
                let index1 = correct_choices[correct_choices.indexOf(correct_choice)];
                let index2 = question.choices.indexOf(correct_choice);
                index1.index = index2;
                index1.gameblock = function () {
                    return document.querySelector("[data-functional-selector='answer-" + String(index2) + "']");
                };
            });

            //add the index of the incorrect choice to the choice object
            incorrect_choices.forEach((incorrect_choice) => {
                let index1 = incorrect_choices[incorrect_choices.indexOf(incorrect_choice)];
                let index2 = question.choices.indexOf(incorrect_choice);
                index1.index = index2;
                index1.gameblock = function () {
                    return document.querySelector("[data-functional-selector='answer-" + String(index2) + "']");
                };
            });

            //Object Variable containing response information
            let response_obj = {};
            response_obj.correct_choices = correct_choices;
            response_obj.incorrect_choices = incorrect_choices;

            return response_obj;

        })() : type == "open_ended" ? (() => {
            return "Open_Ended";
        })() : type == "jumble" ? (() => {
            return "Jumble";
        })() : type;
        console.log(answers_object);
        questions.push(answers_object);
        return;
    })
}

//initiate the function REPLACE THE STRING WITH A PROMPT LATER
search("place value rounding");