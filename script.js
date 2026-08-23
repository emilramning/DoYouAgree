// ============================
// BOOT
// ============================

let progress = 0;

const bootInterval = setInterval(() => {
    progress += 2;
    document.getElementById("loadingBar").style.width = progress + "%";

    if (progress >= 100) {
        clearInterval(bootInterval);

        setTimeout(() => {
            document.getElementById("bootScreen").style.display = "none";
            document.getElementById("desktop").style.display = "block";
        }, 500);
    }
}, 35);


// ============================
// CLOCK
// ============================

function updateClock() {
    const now = new Date();

    let hours = String(now.getHours()).padStart(2, "0");
    let minutes = String(now.getMinutes()).padStart(2, "0");

    document.getElementById("clock").textContent =
        `${hours}:${minutes}`;
}

setInterval(updateClock, 1000);
updateClock();


// ============================
// WINDOWS
// ============================

let zIndex = 10;

function openWindow(id) {
    const win = document.getElementById(id);

    win.style.display = "block";
    win.style.zIndex = ++zIndex;

    document.getElementById("startMenu").style.display = "none";

    addTaskbarButton(id);
}

function closeWindow(id) {
    document.getElementById(id).style.display = "none";

    const button = document.querySelector(
        `[data-window="${id}"]`
    );

    if (button) button.remove();
}

function minimizeWindow(id) {
    document.getElementById(id).style.display = "none";
}

function maximizeWindow(id) {
    const win = document.getElementById(id);

    if (win.dataset.maximized === "true") {
        win.style.left = win.dataset.left;
        win.style.top = win.dataset.top;
        win.style.width = win.dataset.width;
        win.style.height = win.dataset.height;

        win.dataset.maximized = "false";
    } else {
        win.dataset.left = win.style.left;
        win.dataset.top = win.style.top;
        win.dataset.width = win.style.width;
        win.dataset.height = win.style.height;

        win.style.left = "0";
        win.style.top = "0";
        win.style.width = "100%";
        win.style.height = "calc(100% - 30px)";

        win.dataset.maximized = "true";
    }
}

function addTaskbarButton(id) {

    if (document.querySelector(`[data-window="${id}"]`))
        return;

    const button = document.createElement("button");

    button.className = "taskbar-app";
    button.dataset.window = id;

    button.textContent =
        document.querySelector(`#${id} .titlebar span`).textContent;

    button.onclick = () => {
        const win = document.getElementById(id);

        if (win.style.display === "none") {
            win.style.display = "block";
        } else {
            win.style.display = "none";
        }
    };

    document.getElementById("taskbarApps").appendChild(button);
}


// ============================
// START MENU
// ============================

function toggleStartMenu() {

    const menu = document.getElementById("startMenu");

    menu.style.display =
        menu.style.display === "block"
            ? "none"
            : "flex";
}


// ============================
// CALCULATOR
// ============================

let calcExpression = "";

function calc(value) {
    calcExpression += value;
    document.getElementById("calcDisplay").value =
        calcExpression;
}

function calculate() {
    try {
        calcExpression = String(
            Function(`"use strict"; return (${calcExpression})`)()
        );

        document.getElementById("calcDisplay").value =
            calcExpression;

    } catch {
        document.getElementById("calcDisplay").value =
            "ERROR";

        calcExpression = "";
    }
}

function clearCalc() {
    calcExpression = "";
    document.getElementById("calcDisplay").value = "";
}


// ============================
// PAINT
// ============================

const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;

canvas.addEventListener("mousedown", () => {
    drawing = true;
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

function draw(e) {

    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();

    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    ctx.lineTo(
        e.clientX - rect.left,
        e.clientY - rect.top
    );

    ctx.stroke();
    ctx.beginPath();

    ctx.moveTo(
        e.clientX - rect.left,
        e.clientY - rect.top
    );
}

function clearCanvas() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function setTool(tool) {
    if (tool === "pen") {
        ctx.globalCompositeOperation = "source-over";
    }
}


// ============================
// INTERNET EXPLORER
// ============================

function fakeInternet() {

    document.getElementById("browserPage").innerHTML = `
        <h1>Internet Explorer</h1>
        <p>Welcome to the early Internet 🌐</p>

        <hr>

        <p>🚀 You've reached the World Wide Web!</p>

        <p>
            Connection speed: 56 Kbps
        </p>

        <p>
            <a href="#" onclick="alert('You found a secret website 👀')">
                Click here for a totally normal website
            </a>
        </p>

        <marquee>
            ⭐ WELCOME TO MY WEBSITE ⭐
        </marquee>
    `;
}


// ============================
// MINESWEEPER
// ============================

let mines = [];
let revealed = [];

function openMinesweeper() {
    openWindow("minesweeperWindow");
    newGame();
}

function newGame() {

    mines = [];
    revealed = [];

    const grid = document.getElementById("mineGrid");

    grid.innerHTML = "";

    for (let i = 0; i < 100; i++) {

        mines.push(Math.random() < 0.12);
        revealed.push(false);

        const cell = document.createElement("button");

        cell.className = "mine";

        cell.onclick = () => revealMine(i, cell);

        grid.appendChild(cell);
    }
}

function revealMine(index, cell) {

    if (revealed[index]) return;

    revealed[index] = true;

    if (mines[index]) {

        cell.textContent = "💣";

        setTimeout(() => {
            alert("💥 BOOM!\nYou hit a mine!");
            newGame();
        }, 50);

    } else {

        cell.textContent = " ";

        cell.classList.add("revealed");
    }
}


// ============================
// SHUTDOWN
// ============================

function shutdown() {

    if (
        confirm(
            "Are you sure you want to shut down Windows 98?"
        )
    ) {

        document.getElementById("desktop").style.display =
            "none";

        document.getElementById("bootScreen").style.display =
            "flex";

        document.querySelector(".bootText").textContent =
            "It is now safe to turn off your computer.";
    }
}


// ============================
// DRAG WINDOWS
// ============================

document.querySelectorAll(".window").forEach(win => {

    const titlebar = win.querySelector(".titlebar");

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titlebar.addEventListener("mousedown", e => {

        dragging = true;

        win.style.zIndex = ++zIndex;

        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
    });

    document.addEventListener("mousemove", e => {

        if (!dragging) return;

        win.style.left =
            (e.clientX - offsetX) + "px";

        win.style.top =
            (e.clientY - offsetY) + "px";
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
    });
});


// ============================
// INITIAL WINDOW POSITIONS
// ============================

document.querySelectorAll(".window").forEach((win, index) => {

    win.style.left =
        (150 + index * 20) + "px";

    win.style.top =
        (60 + index * 20) + "px";
});
