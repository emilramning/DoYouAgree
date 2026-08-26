/* =====================================
   SUPABASE
===================================== */

const SUPABASE_URL =
    "https://dfmkomjwpgbvxjudxlhi.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_hK8jFComIB90VipkRmFGZw_djxLU8jl";


const db =
    supabase.createClient(
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

const voteCount =
    document.getElementById("voteCount");

const resultMessage =
    document.getElementById("resultMessage");


/* =====================================
   START
===================================== */

startButton.addEventListener(
    "click",
    async () => {

        startScreen.style.opacity = "0";

        startScreen.style.transform =
            "scale(1.05)";


        setTimeout(() => {

            startScreen.style.display =
                "none";

            app.classList.add("active");

        }, 600);


        await initialize();

    }
);


/* =====================================
   INITIALIZE
===================================== */

async function initialize() {

    await checkUser();

    await loadQuestions();

}


/* =====================================
   AUTH CHECK
===================================== */

async function checkUser() {

    const {
        data
    } =
        await db.auth.getSession();


    user =
        data.session?.user || null;


    updateLoginButton();


    if (user) {

        await loadProfile();

    }


    db.auth.onAuthStateChange(
        async (_event, session) => {

            user =
                session?.user || null;

            updateLoginButton();


            if (user) {

                await loadProfile();

            }

        }
    );

}


/* =====================================
   LOGIN BUTTON
===================================== */

function updateLoginButton() {

    const button =
        document.getElementById(
            "loginButton"
        );


    if (user && profile) {

        button.textContent =
            `👤 ${profile.username}`;

    }

    else if (user) {

        button.textContent =
            "👤 Account";

    }

    else {

        button.textContent =
            "🔐 Login";

    }

}


/* =====================================
   LOAD PROFILE
===================================== */

async function loadProfile() {

    const {
        data,
        error
    } =
        await db
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();


    if (error) {

        console.error(error);

        return;

    }


    profile = data;


    updateLoginButton();

}


/* =====================================
   LOAD QUESTIONS
===================================== */

async function loadQuestions() {

    counter.textContent =
        "Loading questions...";


    const {
        data,
        error
    } =
        await db
            .from("questions")
            .select("id, question, category");


    if (error) {

        console.error(error);

        question.textContent =
            "Couldn't load questions 😭";

        return;

    }


    questions = data;


    if (!questions.length) {

        question.textContent =
            "No questions found.";

        return;

    }


    loadRandomQuestion();

}


/* =====================================
   RANDOM QUESTION
===================================== */

function loadRandomQuestion() {

    if (!questions.length)
        return;


    const random =
        Math.floor(
            Math.random() *
            questions.length
        );


    currentQuestion =
        questions[random];


    question.textContent =
        `"${currentQuestion.question}"`;


    category.textContent =
        currentQuestion.category;


    counter.textContent =
        "What do you think?";


    results.classList.add(
        "hidden"
    );


    nextButton.classList.add(
        "hidden"
    );


    agreeButton.disabled = false;

    disagreeButton.disabled = false;

}


/* =====================================
   VOTE
===================================== */

agreeButton.addEventListener(
    "click",
    () => vote("agree")
);


disagreeButton.addEventListener(
    "click",
    () => vote("disagree")
);


async function vote(type) {

    if (!currentQuestion)
        return;


    agreeButton.disabled = true;

    disagreeButton.disabled = true;


    const {
        error
    } =
        await db.rpc(
            "submit_vote",
            {
                p_question_id:
                    currentQuestion.id,

                p_vote:
                    type
            }
        );


    if (error) {

        console.error(error);

        resultMessage.textContent =
            "Couldn't save your vote 😭";

        results.classList.remove(
            "hidden"
        );

        agreeButton.disabled = false;

        disagreeButton.disabled = false;

        return;

    }


    await showResults(type);

}


/* =====================================
   REAL RESULTS
===================================== */

async function showResults(userVote) {

    const {
        data,
        error
    } =
        await db
            .from("votes")
            .select("vote")
            .eq(
                "question_id",
                currentQuestion.id
            );


    if (error) {

        console.error(error);

        return;

    }


    const total =
        data.length;


    const agrees =
        data.filter(
            vote =>
                vote.vote === "agree"
        ).length;


    const disagrees =
        total - agrees;


    const agreePercentage =
        total === 0
            ? 0
            : Math.round(
                (agrees / total) * 100
            );


    const disagreePercentage =
        100 - agreePercentage;


    agreePercent.textContent =
        `${agreePercentage}%`;


    disagreePercent.textContent =
        `${disagreePercentage}%`;


    agreeBar.style.width =
        `${agreePercentage}%`;


    voteCount.textContent =
        `${total} ${total === 1 ? "vote" : "votes"}`;


    const majority =
        agreePercentage >= 50;


    if (
        (userVote === "agree") ===
        majority
    ) {

        resultMessage.textContent =
            "You're with the majority! 😎";

    }

    else {

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
   NEXT
===================================== */

nextButton.addEventListener(
    "click",
    loadRandomQuestion
);


/* =====================================
   GOOGLE LOGIN
===================================== */

const loginButton =
    document.getElementById(
        "loginButton"
    );


const loginModal =
    document.getElementById(
        "loginModal"
    );


const closeLogin =
    document.getElementById(
        "closeLogin"
    );


const googleButton =
    document.getElementById(
        "googleButton"
    );


loginButton.addEventListener(
    "click",
    async () => {

        if (user) {

            openUserModal();

        }

        else {

            loginModal.classList.remove(
                "hidden"
            );

        }

    }
);


closeLogin.addEventListener(
    "click",
    () => {

        loginModal.classList.add(
            "hidden"
        );

    }
);


googleButton.addEventListener(
    "click",
    async () => {

        const {
            error
        } =
            await db.auth.signInWithOAuth({
                provider: "google",

                options: {

                    redirectTo:
                        "https://emilramning.github.io/DoYouAgree/"

                }

            });


        if (error) {

            console.error(error);

        }

    }
);


/* =====================================
   USERNAME
===================================== */

const usernameModal =
    document.getElementById(
        "usernameModal"
    );


const usernameInput =
    document.getElementById(
        "usernameInput"
    );


const usernameButton =
    document.getElementById(
        "usernameButton"
    );


const usernameError =
    document.getElementById(
        "usernameError"
    );


async function askForUsername() {

    usernameModal.classList.remove(
        "hidden"
    );

}


usernameButton.addEventListener(
    "click",
    async () => {

        const username =
            usernameInput.value.trim();


        if (
            username.length < 3
        ) {

            usernameError.textContent =
                "Username must be at least 3 characters.";

            return;

        }


        if (
            !/^[a-zA-Z0-9_]+$/.test(
                username
            )
        ) {

            usernameError.textContent =
                "Use only letters, numbers and _.";

            return;

        }


        const {
            data,
            error
        } =
            await db
                .from("profiles")
                .insert({

                    id: user.id,

                    username:

                        username

                })
                .select()
                .single();


        if (error) {

            console.error(error);

            if (
                error.code ===
                "23505"
            ) {

                usernameError.textContent =
                    "That username is already taken.";

            }

            else {

                usernameError.textContent =
                    "Something went wrong.";

            }

            return;

        }


        profile = data;


        usernameModal.classList.add(
            "hidden"
        );


        updateLoginButton();

    }
);


/* =====================================
   LEADERBOARD
===================================== */

const leaderboardButton =
    document.getElementById(
        "leaderboardButton"
    );


const leaderboardModal =
    document.getElementById(
        "leaderboardModal"
    );


const closeLeaderboard =
    document.getElementById(
        "closeLeaderboard"
    );


const leaderboardList =
    document.getElementById(
        "leaderboardList"
    );


leaderboardButton.addEventListener(
    "click",
    async () => {

        leaderboardModal.classList.remove(
            "hidden"
        );


        await loadLeaderboard();

    }
);


closeLeaderboard.addEventListener(
    "click",
    () => {

        leaderboardModal.classList.add(
            "hidden"
        );

    }
);


async function loadLeaderboard() {

    leaderboardList.textContent =
        "Loading...";


    const {
        data,
        error
    } =
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

        console.error(error);

        leaderboardList.textContent =
            "Couldn't load leaderboard.";

        return;

    }


    leaderboardList.innerHTML = "";


    if (!data.length) {

        leaderboardList.textContent =
            "No players yet. Be the first! 👀";

        return;

    }


    data.forEach(
        (player, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "leaderboardItem";


            let medal =
                `${index + 1}`;


            if (index === 0)
                medal = "🥇";

            if (index === 1)
                medal = "🥈";

            if (index === 2)
                medal = "🥉";


            item.innerHTML = `

                <span class="rank">
                    ${medal}
                </span>

                <span class="player">
                    ${escapeHtml(
                        player.username
                    )}
                </span>

                <span class="score">
                    ${player.questions_answered}
                </span>

            `;


            leaderboardList.appendChild(
                item
            );

        }
    );

}


/* =====================================
   USER MODAL
===================================== */

const userModal =
    document.getElementById(
        "userModal"
    );


const closeUser =
    document.getElementById(
        "closeUser"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


function openUserModal() {

    if (!profile)
        return;


    document.getElementById(
        "userName"
    ).textContent =
        profile.username;


    document.getElementById(
        "userQuestions"
    ).textContent =
        profile.questions_answered;


    userModal.classList.remove(
        "hidden"
    );

}


closeUser.addEventListener(
    "click",
    () => {

        userModal.classList.add(
            "hidden"
        );

    }
);


logoutButton.addEventListener(
    "click",
    async () => {

        await db.auth.signOut();

        user = null;

        profile = null;


        userModal.classList.add(
            "hidden"
        );


        updateLoginButton();

    }
);


/* =====================================
   ESCAPE HTML
===================================== */

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent = text;

    return div.innerHTML;

}
