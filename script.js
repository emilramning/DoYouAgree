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
    }

];


let currentQuestion = 0;

let totalAnswered =
    Number(localStorage.getItem("totalAnswered")) || 0;

let totalAgree =
    Number(localStorage.getItem("totalAgree")) || 0;

let totalDisagree =
    Number(localStorage.getItem("totalDisagree")) || 0;


/* =========================
   START
========================= */

document
    .getElementById("startButton")
    .addEventListener("click", startGame);


function startGame() {

    const startScreen =
        document.getElementById("startScreen");

    const app =
        document.getElementById("app");

    startScreen.classList.add("hide");

    setTimeout(() => {

        startScreen.style.display = "none";

        app.classList.add("active");

    }, 600);
}


/* =========================
   LOAD QUESTION
========================= */

function loadQuestion() {

    const q = questions[currentQuestion];

    document.getElementById("question")
        .textContent =
        `"${q.text}"`;

    document.getElementById("category")
        .textContent =
        q.category;

    document.getElementById("counter")
        .textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    document
        .getElementById("results")
        .classList.add("hidden");

    document
        .getElementById("nextButton")
        .classList.add("hidden");

    document
        .getElementById("agreeButton")
        .disabled = false;

    document
        .getElementById("disagreeButton")
        .disabled = false;

    document
        .getElementById("agreeBar")
        .style.width = "50%";
}


/* =========================
   VOTE
========================= */

document
    .getElementById("agreeButton")
    .addEventListener(
        "click",
        () => vote("agree")
    );

document
    .getElementById("disagreeButton")
    .addEventListener(
        "click",
        () => vote("disagree")
    );


function vote(type) {

    const q = questions[currentQuestion];

    const agreePercent = q.agree;

    const disagreePercent =
        100 - agreePercent;


    if (type === "agree") {
        totalAgree++;
    } else {
        totalDisagree++;
    }

    totalAnswered++;

    saveStats();


    document
        .getElementById("agreeButton")
        .disabled = true;

    document
        .getElementById("disagreeButton")
        .disabled = true;


    document
        .getElementById("agreePercent")
        .textContent =
        agreePercent + "%";

    document
        .getElementById("disagreePercent")
        .textContent =
        disagreePercent + "%";


    setTimeout(() => {

        document
            .getElementById("agreeBar")
            .style.width =
            agreePercent + "%";

    }, 50);


    const userAgreed =
        type === "agree";

    const majorityAgrees =
        agreePercent >= 50;


    document
        .getElementById("resultMessage")
        .textContent =
        userAgreed === majorityAgrees
            ? "You're with the majority! 😎"
            : "You're in the minority. Bold move. 😭";


    document
        .getElementById("results")
        .classList.remove("hidden");

    document
        .getElementById("nextButton")
        .classList.remove("hidden");
}


/* =========================
   NEXT QUESTION
========================= */

document
    .getElementById("nextButton")
    .addEventListener(
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


/* =========================
   STATS
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


document
    .getElementById("statsButton")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("totalAnswered")
                .textContent =
                totalAnswered;

            document
                .getElementById("totalAgree")
                .textContent =
                totalAgree;

            document
                .getElementById("totalDisagree")
                .textContent =
                totalDisagree;

            document
                .getElementById("statsModal")
                .classList.remove("hidden");
        }
    );


document
    .getElementById("closeStats")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("statsModal")
                .classList.add("hidden");
        }
    );


/* =========================
   START WITH APP HIDDEN
========================= */

loadQuestion();
