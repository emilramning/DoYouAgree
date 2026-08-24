/* =========================
   QUESTIONS
========================= */

const questions = [

    {
        text:
            "It should be illegal to put pineapple on pizza.",
        category: "FOOD",
        agree: 68
    },

    {
        text:
            "Money can buy happiness.",
        category: "LIFE",
        agree: 54
    },

    {
        text:
            "Cereal is technically a soup.",
        category: "FOOD",
        agree: 31
    },

    {
        text:
            "School should start at 10 AM instead of 8 AM.",
        category: "SCHOOL",
        agree: 82
    },

    {
        text:
            "Cats are better pets than dogs.",
        category: "ANIMALS",
        agree: 43
    },

    {
        text:
            "Summer is better than winter.",
        category: "LIFESTYLE",
        agree: 76
    },

    {
        text:
            "Fries should always come with ketchup.",
        category: "FOOD",
        agree: 61
    },

    {
        text:
            "Social media has made the world worse.",
        category: "SOCIETY",
        agree: 57
    },

    {
        text:
            "You should never text someone back immediately.",
        category: "SOCIAL",
        agree: 29
    },

    {
        text:
            "Pizza is the best food ever created.",
        category: "FOOD",
        agree: 91
    },

    {
        text:
            "Money is more important than happiness.",
        category: "LIFE",
        agree: 34
    },

    {
        text:
            "Everyone should have to learn how to cook.",
        category: "LIFE",
        agree: 79
    },

    {
        text:
            "The weekend should be three days long.",
        category: "SCHOOL",
        agree: 94
    },

    {
        text:
            "Watching movies is better than watching TV shows.",
        category: "ENTERTAINMENT",
        agree: 46
    },

    {
        text:
            "Being famous would be worth losing your privacy.",
        category: "LIFE",
        agree: 27
    }

];


/* =========================
   VARIABLES
========================= */

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


/* =========================
   START GAME
========================= */

function startGame() {

    const startScreen =
        document.getElementById("startScreen");

    startScreen.classList.add("hide");

    setTimeout(() => {

        startScreen.style.display =
            "none";

    }, 600);
}


/* =========================
   LOAD QUESTION
========================= */

function loadQuestion() {

    const question =
        questions[currentQuestion];

    document.getElementById("question")
        .textContent =
        `"${question.text}"`;

    document.getElementById("category")
        .textContent =
        question.category;

    document.getElementById("counter")
        .textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


    /* Reset results */

    document.getElementById("results")
        .classList.add("hidden");

    document.getElementById("nextButton")
        .classList.add("hidden");


    /* Enable buttons */

    document.querySelector(".agree")
        .disabled = false;

    document.querySelector(".disagree")
        .disabled = false;


    /* Reset bar */

    document.getElementById("agreeBar")
        .style.width = "50%";
}


/* =========================
   VOTE
========================= */

function vote(type) {

    const question =
        questions[currentQuestion];

    const agreePercent =
        question.agree;

    const disagreePercent =
        100 - agreePercent;


    /* Save user stats */

    if (type === "agree") {

        totalAgree++;

    } else {

        totalDisagree++;

    }

    totalAnswered++;

    saveStats();


    /* Disable buttons */

    document.querySelector(".agree")
        .disabled = true;

    document.querySelector(".disagree")
        .disabled = true;


    /* Show percentages */

    document.getElementById("agreePercent")
        .textContent =
        agreePercent + "%";

    document.getElementById("disagreePercent")
        .textContent =
        disagreePercent + "%";


    /* Animate bar */

    setTimeout(() => {

        document.getElementById("agreeBar")
            .style.width =
            agreePercent + "%";

    }, 50);


    /* Message */

    let message;

    if (type === "agree") {

        if (agreePercent >= 50) {

            message =
                "You're with the majority! 😎";

        } else {

            message =
                "You're in the minority. Bold move. 😭";

        }

    } else {

        if (disagreePercent >= 50) {

            message =
                "You're with the majority! 😎";

        } else {

            message =
                "You're in the minority. Brave. 💀";

        }

    }


    document.getElementById("resultMessage")
        .textContent =
        message;


    /* Show results */

    document.getElementById("results")
        .classList.remove("hidden");

    document.getElementById("nextButton")
        .classList.remove("hidden");
}


/* =========================
   NEXT QUESTION
========================= */

function nextQuestion() {

    currentQuestion++;

    if (
        currentQuestion >=
        questions.length
    ) {

        currentQuestion = 0;

    }

    loadQuestion();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   SAVE STATS
========================= */

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


/* =========================
   STATS
========================= */

function showStats() {

    document.getElementById("totalAnswered")
        .textContent =
        totalAnswered;

    document.getElementById("totalAgree")
        .textContent =
        totalAgree;

    document.getElementById("totalDisagree")
        .textContent =
        totalDisagree;

    document.getElementById("statsModal")
        .classList.remove("hidden");
}


function closeStats() {

    document.getElementById("statsModal")
        .classList.add("hidden");
}


/* =========================
   LOAD FIRST QUESTION
========================= */

loadQuestion();
