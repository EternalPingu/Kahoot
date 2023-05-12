!async function() {
    answer = function() {};
    const e = new Event("inject");
    async function t() {
        var e = prompt("enter name");
        await fetch("https://kahoot.it/rest/kahoots/?query=" + e + "&limit=1").then((e => e.json())).then((e => e.entities[0].card.uuid)).then((e => function(e) {
            quiz(e)
        }(e)))
    }
    window.dispatchEvent(e), (() => {
        let e = "";
        new MutationObserver((function(t) {
            location.href !== e && (e = location.href, window.dispatchEvent(new Event("urlchange")))
        })).observe(document, {
            subtree: !0,
            childList: !0
        })
    })(), window.addEventListener("urlchange", (function() {
        var e = location.href,
            t = e.slice(e.indexOf("kahoot.it/") + 10, e.length),
            o = "join" == t ? "PinEnter" : "instructions" == t ? "QuizJoin" : "start" == t ? "QuizStart" : "getready" == t ? "BeforeQuestion" : "gameblock" == t ? "QuestionStart" : "answer/result" == t ? "AfterQuestion" : "answer/sent" == t ? "QuestionAnswer" : 1,
            n = "QuizJoin" == o ? {
                PlayerName: JSON.parse(localStorage.getItem("kahoot-game_session")).playerName,
                QuizPin: JSON.parse(localStorage.getItem("kahoot-game_session")).pin
            } : "BeforeQuestion" == o ? {
                QuestionText: document.querySelector("[data-functional-selector='question-block-title']").children[0].children[0]
            } : "QuestionStart" == o && {
                Answer1: {
                    button: document.querySelector("[data-functional-selector='answer-0']"),
                    text: document.querySelector("[data-functional-selector='question-choice-text-0']")
                },
                Answer2: {
                    button: document.querySelector("[data-functional-selector='answer-1']"),
                    text: document.querySelector("[data-functional-selector='question-choice-text-1']")
                },
                Answer3: {
                    button: document.querySelector("[data-functional-selector='answer-2']"),
                    text: document.querySelector("[data-functional-selector='question-choice-text-2']")
                },
                Answer4: {
                    button: document.querySelector("[data-functional-selector='answer-3']"),
                    text: document.querySelector("[data-functional-selector='question-choice-text-3']")
                }
            };
        window.dispatchEvent(new CustomEvent(o, {
            detail: n
        })), console.log("event:" + o + "\ndata :", n)
    })), window.addEventListener("keyup", (function(e) {
        "ArrowLeft" == e.key ? window.dispatchEvent(new Event("PreviousMode")) : "ArrowRight" != e.key || window.dispatchEvent(new Event("NextMode"))
    })), window.addEventListener("QuizStart", (function() {
        t()
    })), console.clear(), console.log("%c✅ Tools Loaded! ✅", "color: green; font-weight: 700; font-size: 1.25rem;")
}();
class Quiz {
    constructor(e, t, o, n, a, i, r, s) {
        this.skill = s, this.range = r, this.points = i, this.data = e, this.questions = t, this.answers = o, this.current_question = n, this.mode = a
    }
}
async function quiz(url) {
    const data = await fetch("https://kahoot.it/rest/kahoots/" + url).then((e => e.json())),
        questions = await data.questions,
        answers = new Array;

    function answer() {
        kahoot.current_question = JSON.parse(localStorage.getItem("kahoot-game_session")).questionNumber;
        var e, t = kahoot.mode,
            o = new Array;
        console.log(o), kahoot.answers[kahoot.current_question].correct.forEach((e => {
            console.log("arrIt=" + e), console.log(kahoot.answers[kahoot]), o.push(document.querySelector("[data-functional-selector='answer-" + e + "']"))
        })), "auto" == t ? (e = o, console.log(e), e.forEach((e => {
            e.click()
        }))) : "outline" == t ? function(e) {
            console.log(e), e.forEach((e => {
                e.style.border = "3px solid lime"
            }))
        }(o) : "hide" == t ? function(e) {
            console.log(e);
            var t = e[0].parentElement;
            Array.from(t.children).forEach((t => {
                t.addEventListener("mousedown", (function() {
                    var t = e;
                    t.forEach((e => {
                        e.click(), t.shift()
                    }))
                }))
            }))
        }(o) : "del" == t ? function(e) {
            console.log(e);
            var t = e[0].parentElement,
                o = e,
                n = new Array;
            Array.from(t.children).forEach((e => {
                1 == o.includes(e) || n.push(e)
            })), n.forEach((e => {
                e.remove()
            }))
        }(o) : "exact" == t ? function(e) {
            var t = kahoot.points,
                o = kahoot.questions[kahoot.current_question],
                n = o.pointsMultiplier,
                a = o.time / 1e3;
            setTimeout((function() {
                e.forEach((e => {
                    e.click()
                }))
            }), 2 * (1 - t / (1e3 * n)) * a * 1e3 + 30)
        }(o) : "rand" == t ? function(e) {
            var t = kahoot.points - Math.floor(Math.random() * kahoot.range),
                o = kahoot.questions[kahoot.current_question],
                n = o.pointsMultiplier,
                a = o.time / 1e3;
            setTimeout((function() {
                e.forEach((e => {
                    e.click()
                }))
            }), 2 * (1 - t / (1e3 * n)) * a * 1e3 + 30)
        }(o) : function(e) {
            var t = [12500, 6450, 3e3, 1750][kahoot.skill];
            setTimeout((function() {
                e.forEach((e => {
                    e.click()
                }))
            }), t + 30)
        }(o)
    }

    function checkname(e) {
        console.log(e.detail.PlayerName)
    }
    questions.forEach((e => {
        var t = {
            correct: new Array,
            type: "unset"
        };
        e.choices.forEach((o => {
            1 != o.correct || t.correct.push(e.choices.indexOf(o))
        })), t.type = e.type, answers.push(t)
    })), modes = ["auto", "outline", "hide", "del", "exact", "random", "skill"], kahoot = new Quiz(data, questions, answers, 0, "auto", 1e3, 200, 1), window.addEventListener("QuestionStart", answer), window.addEventListener("QuizJoin", checkname), window.addEventListener("NextMode", nextMode), window.addEventListener("PreviousMode", prevMode);
    var modes = ["auto", "outline", "hide", "del", "exact", "rand", "skill"];

    function nextMode() {
        var e = kahoot.mode,
            t = modes[modes.indexOf(e) + 1];
        t || (t = "auto"), kahoot.mode = t, console.log("New Mode : " + kahoot.mode)
    }

    function prevMode() {
        var e = kahoot.mode,
            t = modes[modes.indexOf(e) - 1];
        t || (t = "skill"), kahoot.mode = t, console.log("New Mode : " + kahoot.mode)
    }
    kahoot.mode = "auto"
}