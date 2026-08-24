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
        text: "You should never text someone back immediately.",
        category: "SOCIAL",
        agree: 29
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


function loadQuestion() {

    const q = questions[currentQuestion];

    document.getElementById("question").textContent =
        `"${q.text}"`;

    document.getElementById("category").textContent =
        q.category;

    document.getElementById("counter").textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    document.getElementById("results")
        .classList.add("hidden");

    document.getElementById("nextButton")
        .classList.add("hidden");

    document.querySelector(".agree").disabled = false;
    document.querySelector(".disagree").disabled = false;
}


function vote(type) {

    const q = questions[currentQuestion];

    let agreePercent = q.agree;

    if (type === "agree") {
        totalAgree++;
    } else {
        totalDisagree++;
    }

    totalAnswered++;

    saveStats();

    document.querySelector(".agree").disabled = true;
    document.querySelector(".disagree").disabled = true;

    document.getElementById("agreePercent").textContent =
        agreePercent + "%";

    document.getElementById("disagreePercent").textContent =
        (100 - agreePercent) + "%";

    document.getElementById("agreeBar").style.width =
        agreePercent + "%";

    const message =
        type === "agree"
            ? "You agree with the majority! 👀"
            : "You're going against the majority. Bold move. 😭";

    document.getElementById("resultMessage").textContent =
        message;

    document.getElementById("results")
        .classList.remove("hidden");

    document.getElementById("nextButton")
        .classList.remove("hidden");
}


function nextQuestion() {

    currentQuestion++;

    if (currentQuestion >= questions.length) {
        currentQuestion = 0;
    }

    loadQuestion();
}


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


function showStats() {

    document.getElementById("totalAnswered").textContent =
        totalAnswered;

    document.getElementById("totalAgree").textContent =
        totalAgree;

    document.getElementById("totalDisagree").textContent =
        totalDisagree;

    document.getElementById("statsModal")
        .classList.remove("hidden");
}


function closeStats() {

    document.getElementById("statsModal")
        .classList.add("hidden");
}


loadQuestion();
