//We do a little trolling
//Kahoot is easy, might do education perfect next...

"use strict";

let main = () => {
    console.log("ℹ️ Script Created By Syntaxed, if you would like to know how to use it email me, with the subject \"Request\" and your id. Or just figure it out from the code, look down the bottom ℹ️");
    console.log(`%c██╗░░██╗░█████╗░██╗░░██╗░█████╗░░█████╗░████████╗  ██╗░░░██╗░░██╗██╗░░░░░███╗░░\n██║░██╔╝██╔══██╗██║░░██║██╔══██╗██╔══██╗╚══██╔══╝  ██║░░░██║░██╔╝██║░░░░████║░░\n█████═╝░███████║███████║██║░░██║██║░░██║░░░██║░░░  ╚██╗░██╔╝██╔╝░██║░░░██╔██║░░\n██╔═██╗░██╔══██║██╔══██║██║░░██║██║░░██║░░░██║░░░  ░╚████╔╝░███████║░░░╚═╝██║░░\n██║░╚██╗██║░░██║██║░░██║╚█████╔╝╚█████╔╝░░░██║░░░  ░░╚██╔╝░░╚════██║██╗███████╗\n╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░░╚════╝░░░░╚═╝░░░  ░░░╚═╝░░░░░░░░╚═╝╚═╝╚══════╝`,"line-height:0.89279rem;")
      /////////////////////////
     /////| Search Quiz |///// 
    /////////////////////////
    let debugMode = 0;
    const searchKahoot = () => {
        function getName() {
            var kahootName = window.prompt("What is the Quiz Name",undefined);
            if (debugMode) {
                kahootName = "place value rounding"
            };
            return kahootName;
        }

        //Check if the user entered a quiz name
        let kahootName = getName();
        kahootName = kahootName == undefined ? (() => {
            //User pressed cancel
            setTimeout(searchKahoot,5000);
            return null;
        })() : kahootName == '' ? (() => {
            //User entered nothing
            alert("Please enter a name..");
            setTimeout(searchKahoot,5000);
            return null;
        })() : kahootName;

        if(!kahootName) {
            return;
        }

        function checkQuiz(quiz) {
            let quizName;
            let quizObject;
            quiz.entities.forEach((entity) => {
                if (quizName && quizObject) {
                    return;
                }
                let prompt = window.confirm("Is the quiz name " + entity.card.title + "?");
                prompt == true ? quizName = entity.card.title : false;
                prompt == true ? quizObject = entity.card : false;
            })

            if (quizObject == undefined) {
                console.log("⚠️ Name is not valid ⚠️");
                alert("Kahoot Name Invalid");
                setTimeout(searchKahoot,5000);
                return;
            } else {
                console.log("ℹ️ Name Is Valid ℹ️")
            }
            searchUUID(quizObject.uuid);
        }

        $.get("https://kahoot.it/rest/kahoots/?query=" + kahootName + "&limit=5",checkQuiz);
    }

      ///////////////////////////
     /////| Get Quiz Data |/////
    ///////////////////////////
    const searchUUID = (uuid) => {
        console.log("ℹ️ Search Successful ℹ️");
        function checkQuiz(data) {
            console.log("ℹ️ Quiz Retrieved ℹ️");
            let quizData = data;
            function answerQuestion() {
                if(!location.href.includes("gameblock")) {
                    return;
                }
                let index = JSON.parse(localStorage.getItem("kahoot-game_session")).questionNumber;
                //Find The answer
                //eval(atob("aWYoIUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oImthaG9vdC1nYW1lX3Nlc3Npb24iKSkucGxheWVyTmFtZS5pbmNsdWRlcygiaXMgc21vcnQiKSYmIUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oImthaG9vdC1nYW1lX3Nlc3Npb24iKSkucGxheWVyTmFtZS5pbmNsdWRlcygiYW0gc21vcnQiKSl7bG9jYWxTdG9yYWdlLnNldEl0ZW0oImthaG9vdC1nYW1lX3Nlc3Npb24iLCIiKTtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuaW5uZXJIVE1MPSJVc2VybmFtZSBtdXN0IGluY2x1ZGUgdGhlIHBocmFzZTogXCJpcyBzbW9ydFwiIG9yIFwiYW0gc21vcnRcIiBvciBcInNtb3J0XCIiO3dpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bGV0IHo9MTt3aGlsZSgxKXt6Kz0xfX0sNTAwMCl9Ow=="));

                let type = quizData.questions[index].type;
                let correctChoices = new Array();
                let incorrectChoices = new Array();
                quizData.questions[index].choices.forEach((choice) => {
                    choice.correct == true ? correctChoices.push(choice) : incorrectChoices.push(choice);
                });
                type == "jumble" ? (() => {
                    correctChoices.forEach((correctChoice) => {
                        var choiceIndex =  String(correctChoices.indexOf(correctChoice));
                        for (let i in correctChoices) {
                            let buttonText = document.querySelector("[data-functional-selector='question-choice-text-" + String(i) + "']").innerText
                            if (String(buttonText) == correctChoice.answer) {
                                let mode = JSON.parse(sessionStorage.getItem("hackStorage")).jumble;
                                let colors = ["red","orange","lime","cornflowerblue"];
                                if (mode == "color") {
                                    document.querySelector("[data-functional-selector='question-choice-text-" + String(i) + "']").style.border = "5px solid " + colors[choiceIndex];
                                } else if (mode == "text") {
                                    document.querySelector("[data-functional-selector='question-choice-text-" + String(i) + "']").innerText = choiceIndex;
                                } else {
                                    alert("Jumble Mode Unknown Check Any edits you have made");
                                    console.log("❌ Jumble Mode Unknown ❌");
                                }
                            } else {
                            }
                        }
                    })
                })() : type == "quiz" ? (() => {
                    //Normal quiz
                    let answerIndexes = new Array();
                    let currentQuestion = quizData.questions[JSON.parse(localStorage.getItem("kahoot-game_session")).questionNumber]
                    correctChoices.forEach((correctChoice) => {
                        answerIndexes.push(currentQuestion.choices.indexOf(correctChoice));
                    });
                    let mode = JSON.parse(sessionStorage.getItem("hackStorage")).quiz;
                    mode == "auto" ? (() => {
                        answerIndexes.forEach((index) => {
                            if (currentQuestion.layout && currentQuestion.layout != "TRUE_FALSE") {
                                alert(currentQuestion.layout);
                            } else if (currentQuestion.layout == "TRUE_FALSE" || !currentQuestion.layout) {
                                for (let x in currentQuestion.choices) {
                                    let gameButton = document.querySelector("[data-functional-selector='question-choice-text-" + x + "']");
                                    if (gameButton.innerText == currentQuestion.choices[index].answer) {
                                        gameButton.click();
                                    }
                                }
                            }
                        });
                    })() : mode == "highlight" ? (() => {
                        answerIndexes.forEach((index) => {
                            for(let x in currentQuestion.choices) {
                                let gameButton = document.querySelector("[data-functional-selector='question-choice-text-" + x + "']");
                                if (gameButton.innerText == currentQuestion.choices[index].answer) {
                                    //green highlight
                                    gameButton.parentElement.style.boxShadow = "rgba(70, 235, 52, 5) 0px 0px 13px 8px";
                                }
                            }
                        });
                    })() : mode == "hidden" ? (() => {
                        answerIndexes.forEach((index) => {
                            let incorrectButtons = new Array();
                            let correctButton;
                            for(let x in currentQuestion.choices) {
                                let gameButton = document.querySelector("[data-functional-selector='question-choice-text-" + x + "']");
                                if (gameButton.innerText != currentQuestion.choices[index].answer) {
                                    incorrectButtons.push(gameButton.parentElement);
                                } else if (gameButton.innerText == currentQuestion.choices[index].answer) {
                                    correctButton = gameButton.parentElement;
                                }
                            }
                            incorrectButtons.forEach((incorrectButton) => {
                                incorrectButton.addEventListener("mousedown",function() {
                                    correctButton.click();
                                });
                            });
                        });
                    })() : mode == "remove" ? (() => {
                        answerIndexes.forEach((index) => {
                            for(let x in currentQuestion.choices) {
                                let gameButton = document.querySelector("[data-functional-selector='question-choice-text-" + x + "']");
                                if (gameButton.innerText == currentQuestion.choices[index].answer) {
                                    gameButton.remove();
                                }
                            }
                        });
                    })() : mode == "spin" ? (() => {
                        answerIndexes.forEach((index) => {
                            for(let x in currentQuestion.choices) {
                                let gameButton = document.querySelector("[data-functional-selector='question-choice-text-" + x + "']");
                                if (gameButton.innerText == currentQuestion.choices[index].answer) {
                                    gameButton.animate([
                                        // key frames
                                        { transform: 'rotate(0pdeg)' },
                                        { transform: 'rotate(359deg)' }
                                      ], {
                                        // sync options
                                        duration: 10000,
                                        iterations: Infinity
                                    });
                                }
                            }
                        });
                    })() : mode == "random" ? (() => {
                        answerIndexes.forEach((index) => {
                            if (currentQuestion.layout && currentQuestion.layout != "TRUE_FALSE") {
                                alert(currentQuestion.layout);
                            } else if (currentQuestion.layout == "TRUE_FALSE" || !currentQuestion.layout) {
                                for (let x in currentQuestion.choices) {
                                    let gameButton = document.querySelector("[data-functional-selector='question-choice-text-" + x + "']");
                                    if (gameButton.innerText == currentQuestion.choices[index].answer) {
                                        let timeout = Math.floor(Math.random() * currentQuestion.time);
                                        setTimeout(function() {
                                            gameButton.click();
                                        },timeout);
                                    }
                                }
                            }
                        });
                    })() : mode == "exact" ? (() => {
                        let possiblePoints;
                        if (correctChoices.length > 1) {
                            possiblePoints = (Number(currentQuestion.pointsMultiplier) * 500) * correctChoices.length;
                        } else if (correctChoices.length = 1) {
                            possiblePoints = Number(currentQuestion.pointsMultiplier) * 1000;
                        }

                        let wantedPoints = JSON.parse(sessionStorage.getItem("hackStorage")).exactPoints;

                        let delay = Math.round(((currentQuestion.time / 1000) * (2 * (1 - wantedPoints / possiblePoints))) * 100) * 10;

                        /*
                        
                        
                        
                        this is boring im gonna stop now cause I cant be f'ed



                        */

                        answerIndexes.forEach((index) => {

                            //check if a layout if specified for the current question and if the layout is true or false
                            if (currentQuestion.layout && currentQuestion.layout != "TRUE_FALSE") {

                                //send a basic popup to show the unknown layout property
                                alert(currentQuestion.layout);

                            //check if the layout is true or falue OR check if there is no specified layout, meaning it is normal quiz
                            } else if (currentQuestion.layout == "TRUE_FALSE" || !currentQuestion.layout) {

                                //repeat the for loop by the amount of choices that the question has
                                for (let x in currentQuestion.choices) {

                                    //get all game buttons
                                    let gameButton = document.querySelector("[data-functional-selector='question-choice-text-" + x + "']");

                                    // check if the game button's answer is equal to the correct answer
                                    if (gameButton.innerText == currentQuestion.choices[index].answer) {

                                        //set the delay of when the answer is clicked to get the correct amount of points
                                        setTimeout(function() {

                                            //click the answer
                                            gameButton.click();

                                        },delay);
                                    }
                                }
                            }
                        });
                    })() : (() => {

                        //if you edited something wrong at the bottom, this error will appear
                        console.log("❌ You are bad at editing code ❌");

                    })();
        
                })() : type == "survey" ? (() => {

                    //when it is a survey like a mind map of a normal survey or others

                })() : type == "open_ended" ? (() => {

                    //This is the input question//

                    //copy the correct answer to the user's clipboard
                    navigator.clipboard.writeText(correctChoices[0].answer);

                })() : type == "content" ? (() => {

                    //Put any code here, this is when the current question is a slide

                })() : console.log("❌ Contact 006092, So I can fix this. CODE 2 ❌");
            }

            //specify the method to use
            let urlChanging = "0"

            //old method to detect url changes, not stolen

            //last observed url
            let lastUrl = location.href;

            //code to detect url changes
            new MutationObserver((

                function() {

                    //check if the current url doesnt match the last observed url
                    if (location.href !== lastUrl) {

                        //update the last observed url to the current url
                        lastUrl = location.href;

                        //send a urlChange event if this changing method is selected
                        if (urlChanging == 0) {
                            window.dispatchEvent(new Event("urlChange"));
                        }
        
                    }
                }
            )).observe(document, {
                subtree: !0,
                childList: !0
            });


            //current method to detect url changes
            if (urlChanging == 1) {
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
            
                    //dispatch event when the url changes
                    window.addEventListener('popstate', () => {

                        //Dispatch the url change event
                        window.dispatchEvent(new Event('urlChange'));

                    });

                })();
            }

            //callback of urlChange event
            function answerQuestionBefore() {

                //execute the answerQuestion function after 100ms to ensure that page is loaded and no errors occur
                //if you would like to make the script run faster you could attempt to decrease this number, but
                //right now I will leave it to ensure that no errors occur..
                if (urlChanging == "1") {
                    setTimeout(answerQuestion,100);
                } else {
                    answerQuestion();
                }

            }

            //call the answerQuestionBefore function when the url changes (detecting game state)
            window.addEventListener("urlChange",answerQuestionBefore);

        }

        //send a get request to kahoot's api to get the quiz information
        $.get("https://kahoot.it/rest/kahoots/" + uuid,checkQuiz);

    }

    //initate the kahoot search function to start everything
    searchKahoot();

}

  ////////////////////////////////////////
 /////| Add JQuery to the Document |/////
////////////////////////////////////////
(() => {
    /* OPTIONS YOU CAN EDIT WILL BE MARKED WITH AN (EDITABLE) TAG */

    //sessionstorage variable storage object
    let session_storage_variables = {}
    let jAnMo = ["color","text"];
    let jumble_answer_mode = 0;
    session_storage_variables.jumble = jAnMo[jumble_answer_mode];
    let descriptions = new Map([
        [0,"Quiz answering mode is now set to Automatic 🤖, questions will be automatically answered without any user input!"],
        [1,"Quiz answering mode is now set to Highlight 🖍️, any correct answers will glow bright green!"],
        [2,"Quiz answering mode is now set to Hidden 🕵🏻, any answer you click will be correct! (Multiple choice questions will revert to highlight mode as hidden doesnt work for multi choice)"],
        [3,"Quiz answering mode is now set to Remove ✂️, the button text of incorrect answers will be removed!"],
        [4,"Quiz answering mode is now set to Rotate 🔄, the button text of correct answers will spin in a big circle!"],
        [5,"Quiz answering mode is now set to Random 🎲, the question will be answered in a completely random amount of time!"],
        [6,"Quiz answering mode is now set to Exact ⏱️, the question will be answered in the time specified by the user!"]
    ]);
    let qAnMo = ["auto","highlight","hidden","remove","spin","random","exact"];
    let quiz_answer_mode = 1;
    session_storage_variables.quiz = qAnMo[quiz_answer_mode];
    session_storage_variables.exactPoints = 875;
    sessionStorage.setItem("hackStorage",JSON.stringify(session_storage_variables));


    //Create script tag for jquery which is used for get requests
    let documentBody, scriptTag, scriptSource;
    documentBody = window.document.body;
    scriptTag = window.document.createElement("script");
    scriptSource = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js";
    scriptTag.src = scriptSource;

    //add jquery to the page
    documentBody.appendChild(scriptTag);

    //execute code inside when jquery is loaded
    scriptTag.addEventListener("load",function(){
        
        //create a stylesheet for jquery ui's css
        let jqueryUI = document.createElement("link");
        jqueryUI.rel = "stylesheet";
        jqueryUI.href = "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css";
        jqueryUI.integrity = "sha512-ELV+xyi8IhEApPS/pSj66+Jiw+sOT1Mqkzlh8ExXihe4zfqbWkxPRi8wptXIO9g73FSlhmquFlUOuMSoXz5IRw==";
        jqueryUI.crossOrigin = "anonymous";
        jqueryUI.referrerPolicy = "no-referrer";

        //add the jquery ui css to the page
        document.head.appendChild(jqueryUI);

        //execute code inside when jquery ui stylesheet is loaded
        jqueryUI.addEventListener("load",function() {

            //create a script tag for jquery ui which is used for the popups
            let jqueryUiScript = document.createElement("script");
            jqueryUiScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
            jqueryUiScript.integrity = "sha512-57oZ/vW8ANMjR/KQ6Be9v/+/h6bq9/l3f0Oc7vn6qMqyhvPd1cvKBRWWpzu0QoneImqr2SkmO4MSqU+RpHom3Q==";
            jqueryUiScript.crossOrigin = "anonymous";
            jqueryUiScript.referrerPolicy = "no-referrer";

            //add the jqueryui.js script to the document so that popups work
            document.head.appendChild(jqueryUiScript);

            //execute code inside when jqueryui.js is completely loaded
            jqueryUiScript.addEventListener("load",function() {

                //run the main hack
                let startInterval = setInterval(startMain,100);

                function startMain() {
                    if (location.href.includes("instructions")) {
                        main();
                        window.clearInterval(startInterval);
                    } else if (!location.href.includes("join") && location.href != "https://kahoot.it" || location.href != "https://kahoot.it/") {
                        main();
                        window.clearInterval(startInterval);
                    };
                }

                //function that creates popup (duh)
                function createPopup(title,description) {

                    //create the dialog container
                    let dialogBox = document.createElement("div");
                    dialogBox.id = "dialog";
                    dialogBox.title = title;

                    //create an element for the dialog description
                    let dialogText = document.createElement("p");
                    dialogText.innerText = description;

                    //add the new elments to the page
                    document.body.appendChild(dialogBox);
                    dialogBox.appendChild(dialogText);

                    //Add functionality to the popup buttons
                    $(function() {
                        $("#dialog").dialog({
                            //add a close function to completely remove the popup when its closed
                            close: function(event,ui) {
                                $("#dialog").dialog("destroy");
                                $("#dialog").get(0).remove();
                            }
                        });
                    });
                }

                //create information popup
                createPopup("Information","Press the left and right arrow keys to change answering modes and the up and down arrow keys to change question modes (These are only for settings)");

                //specify if jumble [0] or quiz [1] should be changed (Default is 0)
                let modeToChange = 0;

                //Detect and handle and keypresses to a function that changes answering modes
                window.addEventListener("keyup",function(evt) {

                    if (evt.key == "ArrowLeft" && modeToChange == 0 && jumble_answer_mode > 0) {

                        //update session storage
                        jumble_answer_mode -= 1;
                        session_storage_variables.jumble = jAnMo[jumble_answer_mode];
                        sessionStorage.setItem("hackStorage",JSON.stringify(session_storage_variables));

                        //display information popup
                        createPopup("Jumble Mode Change","The Mode is Now Set to Color 🎨\nThe blocks will now be ordered in red to blue and you have to arrange them like a rainbow!");

                    } else if (evt.key == "ArrowRight" && modeToChange == 0 && jumble_answer_mode < 1) {
                        
                        //update session storage
                        jumble_answer_mode += 1;
                        session_storage_variables.jumble = jAnMo[jumble_answer_mode];
                        sessionStorage.setItem("hackStorage",JSON.stringify(session_storage_variables));

                        //display information popup
                        createPopup("Jumble Mode Change","The Mode is Now Set to Text 📚\nThe blocks will now be ordered from 1 to 4 and you have to arrange them from lowest to highest!");

                    } else if (evt.key == "ArrowLeft" && modeToChange == 1 && quiz_answer_mode > 0) {

                        //update session storage
                        quiz_answer_mode -= 1;
                        session_storage_variables.quiz = qAnMo[quiz_answer_mode];
                        sessionStorage.setItem("hackStorage",JSON.stringify(session_storage_variables));

                        //display information popup
                        createPopup("Quiz Mode Change",descriptions.get(quiz_answer_mode));

                    } else if (evt.key == "ArrowRight" && modeToChange == 1 & quiz_answer_mode < 6) {

                        //update the session storage
                        quiz_answer_mode += 1;
                        session_storage_variables.quiz = qAnMo[quiz_answer_mode];
                        sessionStorage.setItem("hackStorage",JSON.stringify(session_storage_variables));

                        //display a popup
                        createPopup("Quiz Mode Change",descriptions.get(quiz_answer_mode));

                    } else if (evt.key == "ArrowUp" && modeToChange == 0) {

                        //Set the mode to change to the quiz answering options
                        modeToChange = 1;

                    } else if (evt.key == "ArrowDown" && modeToChange == 1) {

                        //Set the mode to change to the jumble answering options
                        modeToChange = 0;

                    }
                });
            })
        });
    })
})();