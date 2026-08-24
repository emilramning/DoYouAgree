const SUPABASE_URL =
    "https://dfmkomjwpgbvxjudxlhi.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_hK8jFComIB90VipkRmFGZw_djxLU8jl";


/* =====================================
   SUPABASE
===================================== */

const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =====================================
   VARIABLES
===================================== */

let questions = [];

let currentQuestion = null;

let totalAnswered =
    Number(localStorage.getItem("totalAnswered")) || 0;

let totalAgree =
    Number(localStorage.getItem("totalAgree")) || 0;

let totalDisagree =
    Number(localStorage.getItem("totalDisagree")) || 0;


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
   START
===================================== */

startButton.addEventListener(
    "click",
    async function () {

        startScreen.style.opacity = "0";
        startScreen.style.transform = "scale(1.05)";

        setTimeout(() => {

            startScreen.style.display = "none";

            app.classList.add("active");

        }, 600);

        await loadQuestions();

    }
);


/* =====================================
   LOAD QUESTIONS FROM SUPABASE
===================================== */

async function loadQuestions() {

    counter.textContent = "Loading questions...";

    try {

        const { data, error } =
            await db
                .from("questions")
                .select("*");

        if (error) {
            throw error;
        }

        questions = data;

        if (!questions.length) {

            counter.textContent =
                "No questions found.";

            return;

        }

        loadRandomQuestion();

    } catch (error) {

        console.error(error);

        counter.textContent =
            "Couldn't load questions 😭";

        question.textContent =
            "Something went wrong connecting to the database.";

    }

}


/* =====================================
   RANDOM QUESTION
===================================== */

function loadRandomQuestion() {

    if (!questions.length) return;


    const randomIndex =
        Math.floor(
            Math.random() * questions.length
        );


    currentQuestion =
        questions[randomIndex];


    question.textContent =
        `"${currentQuestion.question}"`;


    category.textContent =
        currentQuestion.category;


    counter.textContent =
        "What do you think?";


    /* Reset */

    results.classList.add("hidden");

    nextButton.classList.add("hidden");

    agreeButton.disabled = false;

    disagreeButton.disabled = false;

    agreeBar.style.width = "50%";

}


/* =====================================
   VOTE
===================================== */

agreeButton.addEventListener(
    "click",
    () => submitVote("agree")
);


disagreeButton.addEventListener(
    "click",
    () => submitVote("disagree")
);


async function submitVote(vote) {

    if (!currentQuestion) return;


    /* Prevent double clicking */

    agreeButton.disabled = true;

    disagreeButton.disabled = true;


    try {

        const { error } =
            await db.rpc(
                "submit_vote",
                {
                    p_question_id:
                        currentQuestion.id,

                    p_vote:
                        vote
                }
            );


        if (error) {
            throw error;
        }


        /* Save local stats */

        totalAnswered++;


        if (vote === "agree") {

            totalAgree++;

        } else {

            totalDisagree++;

        }


        saveStats();


        /* Get REAL percentages */

        await showRealResults(vote);


    } catch (error) {

        console.error(error);

        resultMessage.textContent =
            "Couldn't save your vote 😭";

        results.classList.remove(
            "hidden"
        );

        agreeButton.disabled = false;

        disagreeButton.disabled = false;

    }

}


/* =====================================
   GET REAL RESULTS
===================================== */

async function showRealResults(userVote) {

    const { data, error } =
        await db
            .from("votes")
            .select("vote")
            .eq(
                "question_id",
                currentQuestion.id
            );


    if (error) {

        throw error;

    }


    const total =
        data.length;


    if (total === 0) return;


    const agreeVotes =
        data.filter(
            v => v.vote === "agree"
        ).length;


    const disagreeVotes =
        total - agreeVotes;


    const agreePercentage =
        Math.round(
            (agreeVotes / total) * 100
        );


    const disagreePercentage =
        100 - agreePercentage;


    /* Display */

    agreePercent.textContent =
        agreePercentage + "%";


    disagreePercent.textContent =
        disagreePercentage + "%";


    setTimeout(() => {

        agreeBar.style.width =
            agreePercentage + "%";

    }, 50);


    /* Message */

    const majorityAgrees =
        agreePercentage >= 50;


    const userAgrees =
        userVote === "agree";


    if (
        userAgrees === majorityAgrees
    ) {

        resultMessage.textContent =
            "You're with the majority! 😎";

    } else {

        resultMessage.textContent =
            "You're in the minority. Bold move. 😭";

    }


    results.classList.remove(
        "hidden"
    );


    nextButton.classList.remove(
        "hidden"
    );

}


/* =====================================
   NEXT QUESTION
===================================== */

nextButton.addEventListener(
    "click",
    loadRandomQuestion
);


/* =====================================
   LOCAL STATS
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
   STATS MODAL
===================================== */

const statsButton =
    document.getElementById("statsButton");

const statsModal =
    document.getElementById("statsModal");

const closeStats =
    document.getElementById("closeStats");


statsButton.addEventListener(
    "click",
    function () {

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
    function () {

        statsModal.classList.add(
            "hidden"
        );

    }
);
