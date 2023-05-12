const Kahoot = {
    search : {
        searchName : async function(arg1 = '', callback) {
            arg1 == '' && (() => {
                throw new Error('Argument Invalid: Empty String');
            })()
            
            typeof callback != 'function' && (() => {
                throw new Error('Argument Invalid: Must Be Of Type \"Function\"');
            })();
    
            let search = await fetch("https://kahoot.it/rest/kahoots/?query=" + arg1 + "&limit=1");
            let json = await search.json();
            let quiz = await json.entities[0].card;
    
            if (!quiz.title.toLowerCase().includes(arg1.toLowerCase())) {
                let errorEvent = new Event("searchFailed");
                window.dispatchEvent(errorEvent);
                throw new Error('Quiz Not Found');
            };
    
            callback(quiz);
        },

        searchData : async function(arg1, callback) {
            arg1 == '' && (() => {
                throw new Error('Argument Invalid: Empty String');
            })();

            typeof callback != 'function' && (() => {
                throw new Error('Argument Invalid: Must Be Of Type \"Function\"');
            })();

            let search = await fetch("https://kahoot.it/rest/kahoots/" + arg1);
            let json = await search.json();
            let quiz = await json;

            if (!quiz) {
                let errorEvent = new Event("searchDataFailed");
                window.dispatchEvent(errorEvent);
                throw new Error('Quiz Not Found');
            }
        }
    },

    storage : {
        get : function() {
            return JSON.parse(localStorage.getItem("kahoot-session_storage"));
        },

        set : function(arg1) {
            try {
                localStorage.setItem("kahoot-session_storage",JSON.stringify(arg1));
                return "success";
            } catch(error) {
                return "fail";
            };
        }
    },

    answer : {
        clickAnswer : function(number,type) {
            if (type != "quiz" && type != "survey") {
                return "Type Doesnt Apply";
            };

            document.querySelector("[data-functional-selector='question-choice-text-" + String(number) + "']").parentElement.click();
        },
        changeTarget : function(number,newNumber,type) {
            if (type != "quiz" && type != "survey") {
                return "Type Doesnt Apply";
            };
            let originalTarget = document.querySelector("[data-functional-selector='question-choice-text-" + String(number) + "']").parentElement;
            let newTarget = document.querySelector("[data-functional-selector='question-choice-text-" + String(newNumber) + "']").parentElement;
            originalTarget.addEventListener("mousedown",function() {
                newTarget.click();
            });
        },
        highlight : function(color,number,type) {
            if (type != "quiz" && type != "survey") {
                return "Type Doesnt Apply";
            };
            document.querySelector("[data-functional-selector='question-choice-text-" + String(number) + "']").parentElement.style.border = "5px solid " + String(color);
        },
        
    },

    pageAssets : {
        quiz : {
            score : document.querySelector("[data-functional-selector='bottom-bar-score']"),
            countdown : document.querySelector("[data-functional-selector='question-countdown']"),
            title : document.querySelector("[data-functional-selector='block-title']"),
            questionIndex : document.querySelector("[data-functional-selector='question-index-counter']"),
            nickname : document.querySelector("[data-functional-selector='nickname']")
        }
    }
}