/* =====================================
   QUESTIONS
===================================== */

const questions = [

    {
        text: "It should be illegal to put pineapple on pizza.",
        category: "FOOD",
        agree: 68
    },

    {
        text: "Money can buy happiness.",
        category: "LIFE",
        agree: 54
    },

    {
        text: "Cereal is technically a soup.",
        category: "FOOD",
        agree: 31
    },

    {
        text: "School should start at 10 AM instead of 8 AM.",
        category: "SCHOOL",
        agree: 82
    },

    {
        text: "Cats are better pets than dogs.",
        category: "ANIMALS",
        agree: 43
    },

    {
        text: "Summer is better than winter.",
        category: "LIFESTYLE",
        agree: 76
    },

    {
        text: "Fries should always come with ketchup.",
        category: "FOOD",
        agree: 61
    },

    {
        text: "Social media has made the world worse.",
        category: "SOCIETY",
        agree: 57
    },

    {
        text: "The weekend should be three days long.",
        category: "LIFE",
        agree: 94
    },

    {
        text: "Pizza is the best food ever created.",
        category: "FOOD",
        agree: 91
    },

    {
        text: "Everyone should learn how to cook.",
        category: "LIFE",
        agree: 79
    },

    {
        text: "Being famous would be worth losing your privacy.",
        category: "LIFE",
        agree: 27
    }

];


/* =====================================
   VARIABLES
===================================== */

let currentQuestion = 0;

let totalAnswered =
    Number(
        localStorage.getItem("totalAnswered")
    ) || 0;

let totalAgree =
    Number(
        localStorage.getItem("totalAgree")
    ) || 0;

let totalDisagree =
    Number(
        localStorage.getItem("totalDisagree")
    ) || 0;


/* =====================================
   ELEMENTS
===================================== */

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");

const app =
    document.getElementById("app");

const question =
    document.getElementById("question");

const category =
    document.getElementById("category");

const counter =
    document.getElementById("counter");

const agreeButton =
    document.getElementById("agreeButton");

const disagreeButton =
    document.getElementById("disagreeButton");

const results =
    document.getElementById("results");

const nextButton =
    document.getElementById("nextButton");

const agreePercent =
    document.getElementById("agreePercent");

const disagreePercent =
    document.getElementById("disagreePercent");

const agreeBar =
    document.getElementById("agreeBar");

const resultMessage =
    document.getElementById("resultMessage");


/* =====================================
   START SCREEN
===================================== */

startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    startScreen.style.opacity = "0";

    startScreen.style.transform =
        "scale(1.05)";

    setTimeout(function() {

        startScreen.style.display =
            "none";

        app.classList.add("active");

    }, 600);

}


/* =====================================
   LOAD QUESTION
===================================== */

function loadQuestion() {

    const q =
        questions[currentQuestion];


    question.textContent =
        `"${q.text}"`;


    category.textContent =
        q.category;


    counter.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


    results.classList.add("hidden");

    nextButton.classList.add("hidden");


    agreeButton.disabled = false;

    disagreeButton.disabled = false;


    agreeBar.style.width = "50%";

}


/* =====================================
   VOTING
===================================== */

agreeButton.addEventListener(
    "click",
    function() {

        vote("agree");

    }
);


disagreeButton.addEventListener(
    "click",
    function() {

        vote("disagree");

    }
);


function vote(type) {

    const q =
        questions[currentQuestion];


    const agree =
        q.agree;


    const disagree =
        100 - agree;


    if (type === "agree") {

        totalAgree++;

    } else {

        totalDisagree++;

    }


    totalAnswered++;


    saveStats();


    agreeButton.disabled = true;

    disagreeButton.disabled = true;


    agreePercent.textContent =
        agree + "%";


    disagreePercent.textContent =
        disagree + "%";


    setTimeout(function() {

        agreeBar.style.width =
            agree + "%";

    }, 50);


    const userAgrees =
        type === "agree";


    const majorityAgrees =
        agree >= 50;


    if (
        userAgrees ===
        majorityAgrees
    ) {

        resultMessage.textContent =
            "You're with the majority! 😎";

    } else {

        resultMessage.textContent =
            "You're in the minority. Bold move. 😭";

    }


    results.classList.remove("hidden");

    nextButton.classList.remove("hidden");

}


/* =====================================
   NEXT QUESTION
===================================== */

nextButton.addEventListener(
    "click",
    nextQuestion
);


function nextQuestion() {

    currentQuestion++;


    if (
        currentQuestion >=
        questions.length
    ) {

        currentQuestion = 0;

    }


    loadQuestion();

}


/* =====================================
   SAVE STATS
===================================== */

function saveStats() {

    localStorage.setItem(
        "totalAnswered",
        totalAnswered
    );

    localStorage.setItem(
        "totalAgree",
        totalAgree
    );

    localStorage.setItem(
        "totalDisagree",
        totalDisagree
    );

}


/* =====================================
   STATS
===================================== */

const statsButton =
    document.getElementById("statsButton");

const statsModal =
    document.getElementById("statsModal");

const closeStats =
    document.getElementById("closeStats");


statsButton.addEventListener(
    "click",
    function() {

        document.getElementById(
            "totalAnswered"
        ).textContent =
            totalAnswered;


        document.getElementById(
            "totalAgree"
        ).textContent =
            totalAgree;


        document.getElementById(
            "totalDisagree"
        ).textContent =
            totalDisagree;


        statsModal.classList.remove(
            "hidden"
        );

    }
);


closeStats.addEventListener(
    "click",
    function() {

        statsModal.classList.add(
            "hidden"
        );

    }
);


/* =====================================
   INITIALIZE
===================================== */

loadQuestion();
