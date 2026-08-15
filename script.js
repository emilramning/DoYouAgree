const memes = [
    {
        id: "gigachad",
        name: "GigaChad",
        icon: "🗿",
        category: "Reaction",
        year: 2017,
        rating: 9.1,
        description: "GigaChad är ett internetmeme baserat på en extremt muskulös och idealiserad man. Figuren används ofta för att representera överdriven självsäkerhet, styrka och perfektion.",
        origin: "Internet / sociala medier"
    },

    {
        id: "rickroll",
        name: "Rickroll",
        icon: "🎵",
        category: "Internet",
        year: 2007,
        rating: 9.5,
        description: "Rickroll är ett klassiskt internetprank där någon luras att klicka på en länk som leder till Rick Astleys musikvideo till Never Gonna Give You Up.",
        origin: "4chan / Internet"
    },

    {
        id: "wojak",
        name: "Wojak",
        icon: "😐",
        category: "Reaction",
        year: 2010,
        rating: 8.8,
        description: "Wojak är en enkel tecknad figur som används för att uttrycka känslor, situationer och olika typer av internetrelaterad ångest.",
        origin: "4chan"
    },

    {
        id: "pepe",
        name: "Pepe the Frog",
        icon: "🐸",
        category: "Reaction",
        year: 2005,
        rating: 9.0,
        description: "Pepe the Frog skapades av Matt Furie och blev senare ett av internets mest kända memeformat.",
        origin: "Boy's Club / Internet"
    },

    {
        id: "doge",
        name: "Doge",
        icon: "🐕",
        category: "Animals",
        year: 2010,
        rating: 9.2,
        description: "Doge är ett meme baserat på en Shiba Inu, ofta tillsammans med färgglad text och medvetet felaktig grammatik.",
        origin: "Tumblr / Reddit"
    },

    {
        id: "stonks",
        name: "Stonks",
        icon: "📈",
        category: "Reaction",
        year: 2017,
        rating: 8.7,
        description: "Stonks används ofta när någon försöker framställa ett ekonomiskt eller logiskt tveksamt beslut som en genial investering.",
        origin: "Internet"
    },

    {
        id: "this-is-fine",
        name: "This Is Fine",
        icon: "🔥",
        category: "Reaction",
        year: 2013,
        rating: 9.3,
        description: "En hund sitter lugnt i ett rum som brinner runt honom och säger att allt är okej. Memet används när en situation uppenbarligen håller på att gå åt skogen.",
        origin: "Gunshow"
    },

    {
        id: "drake",
        name: "Drake Hotline Bling",
        icon: "🕺",
        category: "Reaction",
        year: 2015,
        rating: 9.0,
        description: "Två bilder från Drakes musikvideo används för att jämföra något man inte gillar med något man föredrar.",
        origin: "Hotline Bling"
    },

    {
        id: "trollface",
        name: "Trollface",
        icon: "😈",
        category: "Classic",
        year: 2008,
        rating: 9.1,
        description: "Trollface blev en symbol för trolling och internetpranks och är ett av de mest ikoniska tidiga internetmemesen.",
        origin: "DeviantArt / Rage Comics"
    },

    {
        id: "surprised-pikachu",
        name: "Surprised Pikachu",
        icon: "⚡",
        category: "Reaction",
        year: 2018,
        rating: 8.9,
        description: "Pikachus förvånade ansikte används när någon blir chockad över ett resultat som egentligen var ganska uppenbart.",
        origin: "Pokémon"
    },

    {
        id: "expanding-brain",
        name: "Expanding Brain",
        icon: "🧠",
        category: "Classic",
        year: 2017,
        rating: 8.6,
        description: "Ett format där idéerna blir allt mer absurda samtidigt som hjärnan påstås bli mer och mer upplyst.",
        origin: "Reddit / Internet"
    },

    {
        id: "among-us",
        name: "Among Us",
        icon: "ඞ",
        category: "Gaming",
        year: 2020,
        rating: 8.8,
        description: "Among Us-memes bygger ofta på spelets impostor-mekanik och ordet 'sus', som blev en enorm del av internetkulturen.",
        origin: "Among Us"
    },

    {
        id: "cheems",
        name: "Cheems",
        icon: "🐶",
        category: "Animals",
        year: 2019,
        rating: 8.9,
        description: "Cheems är en variant av Doge som ofta använder medvetet felstavade ord och referenser till cheeseburgare.",
        origin: "Twitter / Reddit"
    },

    {
        id: "nyan-cat",
        name: "Nyan Cat",
        icon: "🌈",
        category: "Classic",
        year: 2011,
        rating: 8.5,
        description: "En flygande katt med en pop-tart-kropp som lämnar ett regnbågsspår efter sig. Ett av de stora tidiga virala internetmemesen.",
        origin: "YouTube / Internet"
    },

    {
        id: "harlem-shake",
        name: "Harlem Shake",
        icon: "🕺",
        category: "Internet",
        year: 2013,
        rating: 8.3,
        description: "Ett viralt videoformat där en person börjar dansa ensam innan hela scenen plötsligt förvandlas till totalt kaos.",
        origin: "YouTube"
    }
];


const memeGrid = document.getElementById("memeGrid");
const popularGrid = document.getElementById("popularGrid");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const randomButton = document.getElementById("randomButton");
const memeContent = document.getElementById("memeContent");


function createMemeCard(meme) {

    return `
        <a class="meme-card" href="meme.html?id=${meme.id}">

            <div class="meme-icon">
                ${meme.icon}
            </div>

            <h3>${meme.name}</h3>

            <p>
                ${meme.category} · ${meme.year}
            </p>

            <div class="rating">
                ⭐ ${meme.rating.toFixed(1)} / 10
            </div>

        </a>
    `;
}


function renderMemes(list) {

    if (!memeGrid) return;

    if (list.length === 0) {

        memeGrid.innerHTML = `
            <div class="empty">
                Inga memes hittades 😭
            </div>
        `;

        if (resultCount) {
            resultCount.textContent = "0 memes";
        }

        return;
    }

    memeGrid.innerHTML = list
        .map(createMemeCard)
        .join("");

    if (resultCount) {
        resultCount.textContent =
            `${list.length} meme${list.length === 1 ? "" : "s"}`;
    }
}


function renderPopular() {

    if (!popularGrid) return;

    const popular = [...memes]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);

    popularGrid.innerHTML = popular
        .map(createMemeCard)
        .join("");
}


function loadMemePage() {

    if (!memeContent) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const meme = memes.find(item => item.id === id);

    if (!meme) {

        memeContent.innerHTML = `
            <div class="empty">
                <h2>Memet hittades inte 💀</h2>
                <p>Den här sidan verkar inte finnas.</p>
            </div>
        `;

        return;
    }

    document.title = `${meme.name} | MemeVault`;

    memeContent.innerHTML = `

        <article class="meme-detail">

            <div class="meme-icon">
                ${meme.icon}
            </div>

            <h1>${meme.name}</h1>

            <div class="meme-meta">
                ${meme.category} · ${meme.year}
            </div>

            <p class="meme-description">
                ${meme.description}
            </p>


            <div class="meme-info">

                <div class="info-item">
                    <div class="info-label">
                        Ursprung
                    </div>

                    <div class="info-value">
                        ${meme.origin}
                    </div>
                </div>


                <div class="info-item">
                    <div class="info-label">
                        År
                    </div>

                    <div class="info-value">
                        ${meme.year}
                    </div>
                </div>


                <div class="info-item">
                    <div class="info-label">
                        Community rating
                    </div>

                    <div class="info-value">
                        ⭐ ${meme.rating.toFixed(1)} / 10
                    </div>
                </div>

            </div>


            <div class="rating-box">

                <h2>
                    ⭐ Betygsätt memet
                </h2>

                <p class="rating-score">
                    Nuvarande betyg: ${meme.rating.toFixed(1)} / 10
                </p>

                <div class="rating-buttons">

                    ${Array.from({ length: 10 }, (_, i) => `
                        <button
                            class="rate-button"
                            onclick="rateMeme(${i + 1})"
                        >
                            ${i + 1}
                        </button>
                    `).join("")}

                </div>

            </div>

        </article>
    `;
}


function rateMeme(score) {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const meme = memes.find(item => item.id === id);

    if (!meme) return;

    localStorage.setItem(
        `rating-${meme.id}`,
        score
    );

    alert(`Du gav ${meme.name} ${score}/10 ⭐`);
}


if (searchInput) {

    searchInput.addEventListener("input", () => {

        const query = searchInput.value
            .toLowerCase()
            .trim();

        const filtered = memes.filter(meme =>

            meme.name.toLowerCase().includes(query) ||

            meme.category.toLowerCase().includes(query) ||

            meme.description.toLowerCase().includes(query)

        );

        renderMemes(filtered);
    });
}


if (randomButton) {

    randomButton.addEventListener("click", () => {

        const randomIndex =
            Math.floor(Math.random() * memes.length);

        const randomMeme = memes[randomIndex];

        window.location.href =
            `meme.html?id=${randomMeme.id}`;
    });
}


renderMemes(memes);
renderPopular();
loadMemePage();
