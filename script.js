const memes = [

    {
        id: "gigachad",
        name: "GigaChad",
        icon: "🗿",
        category: "Reaction",
        year: 2017,
        rating: 9.1,
        description: "Det överdrivet muskulösa internetfenomenet som blev en symbol för extrem självsäkerhet."
    },

    {
        id: "rickroll",
        name: "Rickroll",
        icon: "🎵",
        category: "Internet",
        year: 2007,
        rating: 9.5,
        description: "Internetets klassiska bait där en oskyldig länk leder till Rick Astleys Never Gonna Give You Up."
    },

    {
        id: "wojak",
        name: "Wojak",
        icon: "😐",
        category: "Reaction",
        year: 2010,
        rating: 8.8,
        description: "En enkel tecknad figur som används för att uttrycka olika känslor och situationer."
    },

    {
        id: "pepe",
        name: "Pepe the Frog",
        icon: "🐸",
        category: "Reaction",
        year: 2005,
        rating: 9.0,
        description: "Grodan från serietidningen Boy's Club som utvecklades till ett av internets mest kända memeformat."
    },

    {
        id: "doge",
        name: "Doge",
        icon: "🐕",
        category: "Animals",
        year: 2010,
        rating: 9.2,
        description: "En Shiba Inu tillsammans med färgglad text och medvetet dålig grammatik."
    },

    {
        id: "stonks",
        name: "Stonks",
        icon: "📈",
        category: "Reaction",
        year: 2017,
        rating: 8.7,
        description: "En meme som används när något ekonomiskt eller logiskt tveksamt presenteras som en fantastisk investering."
    },

    {
        id: "this-is-fine",
        name: "This Is Fine",
        icon: "🔥",
        category: "Reaction",
        year: 2013,
        rating: 9.3,
        description: "Hunden som sitter lugnt i ett rum som brinner runt honom. Används när allt uppenbarligen går åt skogen."
    },

    {
        id: "drake",
        name: "Drake Hotline Bling",
        icon: "🕺",
        category: "Reaction",
        year: 2015,
        rating: 9.0,
        description: "Två bilder från Drakes musikvideo som används för att jämföra något man ogillar med något man föredrar."
    },

    {
        id: "trollface",
        name: "Trollface",
        icon: "😈",
        category: "Classic",
        year: 2008,
        rating: 9.1,
        description: "Det klassiska ansiktet som länge varit en symbol för trolling och internetpranks."
    },

    {
        id: "surprised-pikachu",
        name: "Surprised Pikachu",
        icon: "⚡",
        category: "Reaction",
        year: 2018,
        rating: 8.9,
        description: "Pikachus förvånade ansikte används när någon blir chockad av ett resultat som egentligen var ganska uppenbart."
    },

    {
        id: "expanding-brain",
        name: "Expanding Brain",
        icon: "🧠",
        category: "Classic",
        year: 2017,
        rating: 8.6,
        description: "En serie bilder där idéerna blir allt mer absurda ju mer 'upplyst' personen påstås vara."
    },

    {
        id: "among-us",
        name: "Among Us",
        icon: "ඞ",
        category: "Gaming",
        year: 2020,
        rating: 8.8,
        description: "Memes baserade på det sociala deduktionsspelet Among Us och dess ikoniska sus-kultur."
    },

    {
        id: "cheems",
        name: "Cheems",
        icon: "🐶",
        category: "Animals",
        year: 2019,
        rating: 8.9,
        description: "En variant av Shiba Inu-memet Doge, ofta med medvetet felstavade ord och extra mycket 'cheems'."
    },

    {
        id: "nyan-cat",
        name: "Nyan Cat",
        icon: "🌈",
        category: "Classic",
        year: 2011,
        rating: 8.5,
        description: "Den flygande pop-tarten med katt som blev ett av de stora tidiga virala internetmemesen."
    },

    {
        id: "harlem-shake",
        name: "Harlem Shake",
        icon: "🕺",
        category: "Internet",
        year: 2013,
        rating: 8.3,
        description: "Ett viralt videoformat där en person dansar ensam innan scenen plötsligt exploderar i kaos."
    }

];


const memeGrid = document.getElementById("memeGrid");
const popularGrid = document.getElementById("popularGrid");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const randomButton = document.getElementById("randomButton");


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

    if (list.length === 0) {

        memeGrid.innerHTML = `
            <div class="empty">
                Inga memes hittades 😭
            </div>
        `;

        resultCount.textContent = "0 memes";
        return;
    }

    memeGrid.innerHTML = list
        .map(createMemeCard)
        .join("");

    resultCount.textContent =
        `${list.length} meme${list.length === 1 ? "" : "s"}`;
}


function renderPopular() {

    const popular = [...memes]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);

    popularGrid.innerHTML = popular
        .map(createMemeCard)
        .join("");
}


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


randomButton.addEventListener("click", () => {

    const randomIndex =
        Math.floor(Math.random() * memes.length);

    const randomMeme = memes[randomIndex];

    window.location.href =
        `meme.html?id=${randomMeme.id}`;
});


renderMemes(memes);
renderPopular();
