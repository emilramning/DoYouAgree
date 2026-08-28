const SUPABASE_URL =
    "https://dfmkomjwpgbvxjudxlhi.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_hK8jFComIB90VipkRmFGZw_djxLU8jl";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =====================================
   STATE
===================================== */

let questions = [];
let currentQuestion = null;
let user = null;
let profile = null;


/* =====================================
   ELEMENTS
===================================== */

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const app = document.getElementById("app");

const question = document.getElementById("question");
const category = document.getElementById("category");
const counter = document.getElementById("counter");

const agreeButton = document.getElementById("agreeButton");
const disagreeButton = document.getElementById("disagreeButton");

const results = document.getElementById("results");
const nextButton = document.getElementById("nextButton");

const agreePercent = document.getElementById("agreePercent");
const disagreePercent = document.getElementById("disagreePercent");
const agreeBar = document.getElementById("agreeBar");

const voteCount = document.getElementById("voteCount");
const resultMessage = document.getElementById("resultMessage");


/* =====================================
   START SCREEN
===================================== */

startButton.addEventListener("click", async () => {

    startScreen.style.opacity = "0";
    startScreen.style.transform = "scale(1.05)";

    setTimeout(() => {
        startScreen.style.display = "none";
        app.classList.add("active");
    }, 600);

    await initialize();
});


/* =====================================
   INITIALIZE
===================================== */

async function initialize() {
    await checkUser();
    await loadQuestions();
}


/* =====================================
   AUTH
===================================== */

async function checkUser() {

    const { data } = await db.auth.getSession();

    user = data.session?.user || null;

    updateLoginButton();

    if (user) {
        await loadProfile();
    }

    db.auth.onAuthStateChange(async (_event, session) => {

        user = session?.user || null;

        updateLoginButton();

        if (user) {
            await loadProfile();
        }
    });
}


/* =====================================
   PROFILE
===================================== */

async function loadProfile() {

    if (!user) return;

    const { data, error } = await db
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (error) {
        console.error("Profile error:", error);
        return;
    }

    profile = data;

    updateLoginButton();

    if (!profile) {

        setTimeout(() => {
            askForUsername();
        }, 500);

    }
}


/* =====================================
   LOGIN BUTTON
===================================== */

function updateLoginButton() {

    const button = document.getElementById("loginButton");

    if (!button) return;

    if (user && profile) {

        button.textContent = `👤 ${profile.username}`;

    } else if (user) {

        button.textContent = "👤 Account";

    } else {

        button.textContent = "🔐 Login";

    }
}


/* =====================================
   QUESTIONS
===================================== */

async function loadQuestions() {

    counter.textContent = "Loading questions...";

    const { data, error } = await db
        .from("questions")
        .select("id, question, category");

    if (error) {

        console.error("Questions error:", error);

        question.textContent =
            "Couldn't load questions 😭";

        return;
    }

    questions = data || [];

    if (!questions.length) {

        question.textContent =
            "No questions found.";

        return;
    }

    loadRandomQuestion();
}


function loadRandomQuestion() {

    if (!questions.length) return;

    const random =
        Math.floor(Math.random() * questions.length);

    currentQuestion = questions[random];

    question.textContent =
        `"${currentQuestion.question}"`;

    category.textContent =
        currentQuestion.category || "";

    counter.textContent =
        "What do you think?";

    results.classList.add("hidden");
    nextButton.classList.add("hidden");

    agreeButton.disabled = false;
    disagreeButton.disabled = false;
}


/* =====================================
   VOTING
===================================== */

agreeButton.addEventListener("click", () => {
    submitVote("agree");
});

disagreeButton.addEventListener("click", () => {
    submitVote("disagree");
});


async function submitVote(type) {

    if (!currentQuestion) return;

    agreeButton.disabled = true;
    disagreeButton.disabled = true;

    const { error } = await db.rpc(
        "submit_vote",
        {
            p_question_id: currentQuestion.id,
            p_vote: type
        }
    );

    if (error) {

        console.error("Vote error:", error);

        resultMessage.textContent =
            "Couldn't save your vote 😭";

        results.classList.remove("hidden");

        agreeButton.disabled = false;
        disagreeButton.disabled = false;

        return;
    }


    /* Update user's question count */

    if (user) {
        await loadProfile();
    }


    /* Load REAL votes from Supabase */

    await showResults(type);
}


/* =====================================
   RESULTS
===================================== */

async function showResults(userVote) {

    if (!currentQuestion) return;

    console.log(
        "Loading votes for question:",
        currentQuestion.id
    );


    const { data, error } = await db
        .from("votes")
        .select("vote")
        .eq(
            "question_id",
            currentQuestion.id
        );


    if (error) {

        console.error(
            "Could not load votes:",
            error
        );

        resultMessage.textContent =
            "Couldn't load the results 😭";

        results.classList.remove("hidden");

        return;
    }


    console.log(
        "Votes returned from Supabase:",
        data
    );


    const votes = data || [];

    const total = votes.length;

    const agrees = votes.filter(
        vote => vote.vote === "agree"
    ).length;

    const disagrees = votes.filter(
        vote => vote.vote === "disagree"
    ).length;


    let agreePercentage = 0;
    let disagreePercentage = 0;


    if (total > 0) {

        agreePercentage =
            Math.round((agrees / total) * 100);

        disagreePercentage =
            Math.round((disagrees / total) * 100);

    }


    agreePercent.textContent =
        `${agreePercentage}%`;

    disagreePercent.textContent =
        `${disagreePercentage}%`;


    agreeBar.style.width =
        `${agreePercentage}%`;


    voteCount.textContent =
        `${total} ${total === 1 ? "vote" : "votes"}`;


    /* Result message */

    if (total === 1) {

        resultMessage.textContent =
            "You're the first person to vote! 👀";

    } else {

        const majorityIsAgree =
            agreePercentage >= 50;

        const userIsWithMajority =
            (userVote === "agree") === majorityIsAgree;


        if (userIsWithMajority) {

            resultMessage.textContent =
                "You're with the majority! 😎";

        } else {

            resultMessage.textContent =
                "You're in the minority. Bold move. 😭";

        }
    }


    results.classList.remove("hidden");

    nextButton.classList.remove("hidden");
}


/* =====================================
   NEXT QUESTION
===================================== */

nextButton.addEventListener(
    "click",
    loadRandomQuestion
);


/* =====================================
   GOOGLE LOGIN
===================================== */

const loginButton =
    document.getElementById("loginButton");

const loginModal =
    document.getElementById("loginModal");

const closeLogin =
    document.getElementById("closeLogin");

const googleButton =
    document.getElementById("googleButton");


loginButton.addEventListener("click", () => {

    if (user && profile) {

        openUserModal();

    } else {

        loginModal.classList.remove("hidden");

    }
});


closeLogin.addEventListener("click", () => {

    loginModal.classList.add("hidden");

});


googleButton.addEventListener(
    "click",
    async () => {

        const { error } =
            await db.auth.signInWithOAuth({

                provider: "google",

                options: {

                    redirectTo:
                        "https://emilramning.github.io/DoYouAgree/"

                }

            });


        if (error) {
            console.error("Google login error:", error);
        }

    }
);


/* =====================================
   USERNAME
===================================== */

const usernameModal =
    document.getElementById("usernameModal");

const usernameInput =
    document.getElementById("usernameInput");

const usernameButton =
    document.getElementById("usernameButton");

const usernameError =
    document.getElementById("usernameError");


function askForUsername() {

    usernameModal.classList.remove("hidden");

    setTimeout(() => {
        usernameInput.focus();
    }, 100);
}


usernameButton.addEventListener(
    "click",
    createUsername
);


usernameInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            createUsername();
        }

    }
);


async function createUsername() {

    const username =
        usernameInput.value.trim();

    usernameError.textContent = "";


    if (username.length < 3) {

        usernameError.textContent =
            "At least 3 characters 😭";

        return;
    }


    if (username.length > 20) {

        usernameError.textContent =
            "Maximum 20 characters.";

        return;
    }


    if (!/^[a-zA-Z0-9_]+$/.test(username)) {

        usernameError.textContent =
            "Only letters, numbers and _.";

        return;
    }


    usernameButton.disabled = true;


    const { data, error } = await db
        .from("profiles")
        .insert({
            id: user.id,
            username: username
        })
        .select()
        .single();


    usernameButton.disabled = false;


    if (error) {

        console.error(
            "Username error:",
            error
        );


        if (error.code === "23505") {

            usernameError.textContent =
                "That username is already taken 😭";

        } else {

            usernameError.textContent =
                "Something went wrong.";

        }

        return;
    }


    profile = data;

    usernameInput.value = "";

    usernameModal.classList.add("hidden");

    updateLoginButton();


    if (
        typeof leaderboardModal !== "undefined" &&
        !leaderboardModal.classList.contains("hidden")
    ) {

        await loadLeaderboard();

    }
}


/* =====================================
   LEADERBOARD
===================================== */

const leaderboardButton =
    document.getElementById("leaderboardButton");

const leaderboardModal =
    document.getElementById("leaderboardModal");

const closeLeaderboard =
    document.getElementById("closeLeaderboard");

const leaderboardList =
    document.getElementById("leaderboardList");


leaderboardButton.addEventListener(
    "click",
    async () => {

        leaderboardModal.classList.remove("hidden");

        await loadLeaderboard();

    }
);


closeLeaderboard.addEventListener(
    "click",
    () => {

        leaderboardModal.classList.add("hidden");

    }
);


async function loadLeaderboard() {

    leaderboardList.textContent =
        "Loading...";


    const { data, error } =
        await db
            .from("profiles")
            .select(
                "username, questions_answered"
            )
            .order(
                "questions_answered",
                {
                    ascending: false
                }
            )
            .limit(50);


    if (error) {

        console.error(
            "Leaderboard error:",
            error
        );

        leaderboardList.textContent =
            "Couldn't load leaderboard.";

        return;
    }


    leaderboardList.innerHTML = "";


    if (!data || !data.length) {

        leaderboardList.textContent =
            "No players yet. Be the first! 👀";

        return;
    }


    data.forEach(
        (player, index) => {

            const item =
                document.createElement("div");

            item.className =
                "leaderboardItem";


            let rank = index + 1;

            if (index === 0) rank = "🥇";
            if (index === 1) rank = "🥈";
            if (index === 2) rank = "🥉";


            item.innerHTML = `

                <span class="rank">
                    ${rank}
                </span>

                <span class="player">
                    ${escapeHtml(player.username)}
                </span>

                <span class="score">
                    ${player.questions_answered}
                </span>

            `;


            leaderboardList.appendChild(item);

        }
    );
}


/* =====================================
   USER PROFILE
===================================== */

const userModal =
    document.getElementById("userModal");

const closeUser =
    document.getElementById("closeUser");

const logoutButton =
    document.getElementById("logoutButton");


function openUserModal() {

    if (!profile) return;


    document.getElementById("userName").textContent =
        profile.username;


    document.getElementById("userQuestions").textContent =
        profile.questions_answered;


    userModal.classList.remove("hidden");
}


closeUser.addEventListener(
    "click",
    () => {

        userModal.classList.add("hidden");

    }
);


logoutButton.addEventListener(
    "click",
    async () => {

        await db.auth.signOut();

        user = null;
        profile = null;

        userModal.classList.add("hidden");

        updateLoginButton();

    }
);


/* =====================================
   ESCAPE HTML
===================================== */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}
