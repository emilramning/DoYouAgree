/*
  MEMESTOCK V2
  -------------------------
  Virtual meme stock market.

  The price engine reacts to:

  - Views
  - Likes
  - Shares
  - Favorites
  - Activity growth
  - Momentum
  - Volatility

  This version runs entirely in the browser.
*/


/* =========================
   MEME DATABASE
========================= */

const seed = [

  {
    id: "gigachad",
    name: "GigaChad",
    ticker: "GIGA",
    emoji: "🗿",
    price: 142.37,

    views: 84200,
    likes: 12400,
    shares: 5900,
    favorites: 2100,

    momentum: 72,
    volatility: 0.018
  },

  {
    id: "pepe",
    name: "Pepe",
    ticker: "PEPE",
    emoji: "🐸",
    price: 97.21,

    views: 71200,
    likes: 10300,
    shares: 4100,
    favorites: 1900,

    momentum: 54,
    volatility: 0.021
  },

  {
    id: "doge",
    name: "Doge",
    ticker: "DOGE",
    emoji: "🐕",
    price: 81.53,

    views: 65400,
    likes: 9100,
    shares: 3200,
    favorites: 1500,

    momentum: 32,
    volatility: 0.015
  },

  {
    id: "wojak",
    name: "Wojak",
    ticker: "WOJAK",
    emoji: "😭",
    price: 54.18,

    views: 28900,
    likes: 3600,
    shares: 900,
    favorites: 600,

    momentum: -25,
    volatility: 0.028
  },

  {
    id: "trollface",
    name: "Trollface",
    ticker: "TROLL",
    emoji: "😈",
    price: 72.44,

    views: 48100,
    likes: 6700,
    shares: 1800,
    favorites: 1100,

    momentum: 21,
    volatility: 0.021
  },

  {
    id: "stonks",
    name: "Stonks",
    ticker: "STONK",
    emoji: "📈",
    price: 118.82,

    views: 60200,
    likes: 8200,
    shares: 3400,
    favorites: 1700,

    momentum: 61,
    volatility: 0.017
  },

  {
    id: "smurfcat",
    name: "Smurf Cat",
    ticker: "SMURF",
    emoji: "🔵",
    price: 31.06,

    views: 11400,
    likes: 1200,
    shares: 220,
    favorites: 150,

    momentum: -52,
    volatility: 0.034
  },

  {
    id: "gigabrain",
    name: "Galaxy Brain",
    ticker: "BRAIN",
    emoji: "🧠",
    price: 89.60,

    views: 52400,
    likes: 7200,
    shares: 2500,
    favorites: 1300,

    momentum: 43,
    volatility: 0.020
  },

  {
    id: "npc",
    name: "NPC",
    ticker: "NPC",
    emoji: "🤖",
    price: 44.73,

    views: 24800,
    likes: 2900,
    shares: 700,
    favorites: 420,

    momentum: -7,
    volatility: 0.025
  },

  {
    id: "capybara",
    name: "Capybara",
    ticker: "CAPY",
    emoji: "🦫",
    price: 66.35,

    views: 45800,
    likes: 6400,
    shares: 2100,
    favorites: 1200,

    momentum: 38,
    volatility: 0.019
  }

];


/* =========================
   STATE
========================= */

let market =
  JSON.parse(
    localStorage.getItem(
      "memestock_market_v2"
    )
  );


if (!market) {

  market =
    seed.map(meme => ({

      ...meme,

      basePrice:
        meme.price,

      previousViews:
        meme.views,

      previousLikes:
        meme.likes,

      previousShares:
        meme.shares,

      previousFavorites:
        meme.favorites,

      history:
        createHistory(
          meme.price
        )

    }));

}


let portfolio =
  JSON.parse(
    localStorage.getItem(
      "memestock_portfolio_v2"
    )
  );


if (!portfolio) {

  portfolio = {

    cash: 10000,

    holdings: {}

  };

}


let selectedMeme = null;


/* =========================
   HELPERS
========================= */

function money(value) {

  return "$" +
    value.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

}


function percent(value) {

  return (
    value >= 0
      ? "+"
      : ""
  ) +
  value.toFixed(1) +
  "%";

}


function compactNumber(value) {

  if (value >= 1000000) {

    return (
      value / 1000000
    ).toFixed(1) + "M";

  }


  if (value >= 1000) {

    return (
      value / 1000
    ).toFixed(1) + "K";

  }


  return Math.round(value);

}


function save() {

  localStorage.setItem(
    "memestock_market_v2",
    JSON.stringify(market)
  );

  localStorage.setItem(
    "memestock_portfolio_v2",
    JSON.stringify(portfolio)
  );

}


function createHistory(price) {

  const history = [];

  let current = price * 0.9;


  for (
    let i = 0;
    i < 50;
    i++
  ) {

    current *=
      1 +
      (
        Math.random() -
        0.45
      ) * 0.02;


    history.push(current);

  }


  history.push(price);

  return history;

}


/* =========================
   ACTIVITY SCORE
========================= */

function calculateMomentum(meme) {

  /*
    Each activity type has a different
    importance.

    Shares are especially powerful because
    they represent virality.
  */


  const viewScore =
    Math.log10(
      meme.views + 1
    ) * 4;


  const likeRatio =
    meme.likes /
    Math.max(
      meme.views,
      1
    );


  const shareRatio =
    meme.shares /
    Math.max(
      meme.views,
      1
    );


  const favoriteRatio =
    meme.favorites /
    Math.max(
      meme.views,
      1
    );


  const engagementScore =
    likeRatio * 500 +
    shareRatio * 1200 +
    favoriteRatio * 700;


  /*
    Activity growth.
  */

  const viewGrowth =
    (
      meme.views -
      meme.previousViews
    ) /
    Math.max(
      meme.previousViews,
      1
    );


  const shareGrowth =
    (
      meme.shares -
      meme.previousShares
    ) /
    Math.max(
      meme.previousShares,
      1
    );


  const growthScore =
    viewGrowth * 120 +
    shareGrowth * 160;


  /*
    Final momentum.
  */

  let score =
    viewScore +
    engagementScore +
    growthScore;


  /*
    Normalize it.

    This keeps the score between
    -100 and +100.
  */

  score =
    Math.max(
      -100,
      Math.min(
        100,
        score - 45
      )
    );


  return score;

}


/* =========================
   PRICE ENGINE
========================= */

function updatePrices() {

  market.forEach(
    meme => {

      /*
        Recalculate popularity.
      */

      const newMomentum =
        calculateMomentum(
          meme
        );


      /*
        Smooth momentum so prices
        don't instantly flip.
      */

      meme.momentum =
        meme.momentum * 0.7 +
        newMomentum * 0.3;


      /*
        Momentum creates buying
        or selling pressure.
      */

      const momentumPressure =
        meme.momentum /
        6000;


      /*
        Natural market randomness.
      */

      const randomMovement =
        (
          Math.random() -
          0.5
        ) *
        meme.volatility;


      /*
        Final price movement.
      */

      const movement =
        momentumPressure +
        randomMovement;


      meme.price =
        Math.max(
          0.01,
          meme.price *
          (1 + movement)
        );


      /*
        Simulate natural activity.

        This is temporary until
        the website has real users.
      */

      const hype =
        Math.max(
          0,
          meme.momentum
        ) / 100;


      const decline =
        Math.max(
          0,
          -meme.momentum
        ) / 100;


      meme.views +=
        Math.round(
          Math.random() *
          (
            20 +
            hype * 120
          )
        );


      meme.likes +=
        Math.round(
          Math.random() *
          (
            2 +
            hype * 12
          )
        );


      meme.shares +=
        Math.round(
          Math.random() *
          (
            1 +
            hype * 7
          )
        );


      meme.favorites +=
        Math.round(
          Math.random() *
          (
            1 +
            hype * 4
          )
        );


      /*
        Occasionally create
        viral spikes.
      */

      if (
        Math.random() < 0.025
      ) {

        meme.views *=
          1.08;

        meme.shares *=
          1.12;

        meme.momentum =
          Math.min(
            100,
            meme.momentum + 12
          );

      }


      /*
        Store history.
      */

      meme.history.push(
        meme.price
      );


      if (
        meme.history.length > 80
      ) {

        meme.history.shift();

      }


      /*
        Update previous stats.
      */

      meme.previousViews =
        meme.views;

      meme.previousLikes =
        meme.likes;

      meme.previousShares =
        meme.shares;

      meme.previousFavorites =
        meme.favorites;

    }
  );


  save();

  renderEverything();

}


/* =========================
   PORTFOLIO
========================= */

function holdingsValue() {

  return Object.entries(
    portfolio.holdings
  )

  .reduce(
    (total, [id, quantity]) => {

      const meme =
        market.find(
          m => m.id === id
        );


      if (!meme)
        return total;


      return total +
        meme.price *
        quantity;

    },

    0
  );

}


function portfolioValue() {

  return (
    portfolio.cash +
    holdingsValue()
  );

}


/* =========================
   MARKET RENDER
========================= */

function renderMarket(
  search = ""
) {

  const container =
    document.getElementById(
      "marketGrid"
    );


  const filtered =
    market.filter(
      meme => {

        const text =
          (
            meme.name +
            " " +
            meme.ticker
          ).toLowerCase();


        return text.includes(
          search.toLowerCase()
        );

      }
    );


  /*
    Sort strongest momentum first.
  */

  filtered.sort(
    (a,b) =>
      b.momentum -
      a.momentum
  );


  let html = `

    <div class="meme-row table-head">

      <div>MEME</div>
      <div>PRICE</div>
      <div>24H</div>
      <div>ACTIVITY</div>
      <div></div>

    </div>

  `;


  filtered.forEach(
    meme => {

      const change =
        (
          meme.price -
          meme.basePrice
        ) /
        meme.basePrice *
        100;


      html += `

        <div class="meme-row">

          <div class="meme-info">

            <div class="meme-icon">
              ${meme.emoji}
            </div>

            <div>

              <div class="meme-name">
                ${meme.name}
              </div>

              <div class="symbol">
                ${meme.ticker}
              </div>

            </div>

          </div>


          <div class="price">

            ${money(meme.price)}

          </div>


          <div
            class="
              change
              ${
                change >= 0
                  ? "positive"
                  : "negative"
              }
            ">

            ${percent(change)}

          </div>


          <div class="metric">

            🔥 ${
              Math.round(
                meme.momentum
              )
            }

          </div>


          <div>

            <button
              class="trade"
              onclick="
                openTrade('${meme.id}')
              ">

              Trade

            </button>

          </div>

        </div>

      `;

    }
  );


  container.innerHTML =
    html;

}


/* =========================
   TICKER
========================= */

function renderTicker() {

  const container =
    document.getElementById(
      "tickerTrack"
    );


  container.innerHTML =
    market.map(
      meme => {

        const change =
          (
            meme.price -
            meme.basePrice
          ) /
          meme.basePrice *
          100;


        return `

          <div class="ticker-item">

            <strong>
              ${meme.ticker}
            </strong>

            <span
              class="
                ${
                  change >= 0
                    ? "positive"
                    : "negative"
                }
              ">

              ${money(meme.price)}
              ${percent(change)}

            </span>

          </div>

        `;

      }
    ).join("");

}


/* =========================
   MARKET OVERVIEW
========================= */

function renderOverview() {

  const totalMarketCap =
    market.reduce(
      (sum,meme) =>
        sum + meme.price,
      0
    );


  document.getElementById(
    "marketCap"
  ).textContent =
    money(
      totalMarketCap
    );


  const sorted =
    [...market].sort(
      (a,b) => {

        const aChange =
          (
            a.price -
            a.basePrice
          ) /
          a.basePrice;


        const bChange =
          (
            b.price -
            b.basePrice
          ) /
          b.basePrice;


        return (
          bChange -
          aChange
        );

      }
    );


  document.getElementById(
    "topGainer"
  ).textContent =
    sorted[0].name;


  document.getElementById(
    "topLoser"
  ).textContent =
    sorted[
      sorted.length - 1
    ].name;

}


/* =========================
   PORTFOLIO UI
========================= */

function renderPortfolio() {

  const holdings =
    holdingsValue();


  const total =
    portfolioValue();


  document.getElementById(
    "portfolioTotal"
  ).textContent =
    money(total);


  document.getElementById(
    "portfolioCash"
  ).textContent =
    money(portfolio.cash);


  document.getElementById(
    "portfolioHoldings"
  ).textContent =
    money(holdings);


  document.getElementById(
    "headerCash"
  ).textContent =
    money(portfolio.cash);


  document.getElementById(
    "heroValue"
  ).textContent =
    money(total);


  const pnl =
    total - 10000;


  const pnlElement =
    document.getElementById(
      "heroPnl"
    );


  pnlElement.textContent =
    (
      pnl >= 0
        ? "+"
        : ""
    ) +
    money(pnl);


  pnlElement.className =
    pnl >= 0
      ? "positive"
      : "negative";


  const container =
    document.getElementById(
      "portfolioList"
    );


  const positions =
    Object.entries(
      portfolio.holdings
    )
    .filter(
      ([,quantity]) =>
        quantity > 0
    );


  if (
    positions.length === 0
  ) {

    container.innerHTML = `

      <div class="empty">

        You don't own any memes yet. 🗿

        <br><br>

        Head over to the market
        and make your first trade.

      </div>

    `;

    return;

  }


  container.innerHTML =
    positions.map(
      ([id,quantity]) => {

        const meme =
          market.find(
            m => m.id === id
          );


        const value =
          meme.price *
          quantity;


        const change =
          (
            meme.price -
            meme.basePrice
          ) /
          meme.basePrice *
          100;


        return `

          <div class="portfolio-row">

            <div class="meme-info">

              <div class="meme-icon">
                ${meme.emoji}
              </div>

              <div>

                <div class="meme-name">
                  ${meme.name}
                </div>

                <div class="symbol">
                  ${meme.ticker}
                </div>

              </div>

            </div>


            <div>
              ${quantity} shares
            </div>


            <div>
              ${money(value)}
            </div>


            <div
              class="
                ${
                  change >= 0
                    ? "positive"
                    : "negative"
                }
              ">

              ${percent(change)}

            </div>

          </div>

        `;

      }
    ).join("");

}


/* =========================
   TRADE MODAL
========================= */

window.openTrade =
function(id) {

  selectedMeme =
    market.find(
      meme =>
        meme.id === id
    );


  document.getElementById(
    "tradeModal"
  ).classList.remove(
    "hidden"
  );


  updateModal();

};


function updateModal() {

  if (!selectedMeme)
    return;


  const meme =
    market.find(
      m =>
        m.id ===
        selectedMeme.id
    );


  selectedMeme =
    meme;


  document.getElementById(
    "modalEmoji"
  ).textContent =
    meme.emoji;


  document.getElementById(
    "modalTicker"
  ).textContent =
    meme.ticker;


  document.getElementById(
    "modalName"
  ).textContent =
    meme.name;


  document.getElementById(
    "modalPrice"
  ).textContent =
    money(meme.price);


  const change =
    (
      meme.price -
      meme.basePrice
    ) /
    meme.basePrice *
    100;


  const changeElement =
    document.getElementById(
      "modalChange"
    );


  changeElement.textContent =
    percent(change);


  changeElement.className =
    change >= 0
      ? "positive"
      : "negative";


  document.getElementById(
    "modalMomentum"
  ).textContent =
    (
      meme.momentum >= 0
        ? "+"
        : ""
    ) +
    Math.round(
      meme.momentum
    );


  document.getElementById(
    "modalViews"
  ).textContent =
    compactNumber(
      meme.views
    );


  document.getElementById(
    "modalLikes"
  ).textContent =
    compactNumber(
      meme.likes
    );


  document.getElementById(
    "modalShares"
  ).textContent =
    compactNumber(
      meme.shares
    );


  document.getElementById(
    "modalOwned"
  ).textContent =
    portfolio.holdings[
      meme.id
    ] || 0;


  drawChart(meme);

}


/* =========================
   CHART
========================= */

function drawChart(meme) {

  const canvas =
    document.getElementById(
      "priceChart"
    );


  const context =
    canvas.getContext("2d");


  const ratio =
    window.devicePixelRatio ||
    1;


  canvas.width =
    canvas.clientWidth *
    ratio;


  canvas.height =
    canvas.clientHeight *
    ratio;


  context.scale(
    ratio,
    ratio
  );


  const width =
    canvas.clientWidth;


  const height =
    canvas.clientHeight;


  const values =
    meme.history;


  const minimum =
    Math.min(...values);


  const maximum =
    Math.max(...values);


  const padding = 18;


  context.clearRect(
    0,
    0,
    width,
    height
  );


  /*
    Grid.
  */

  context.strokeStyle =
    "#18202c";

  context.lineWidth = 1;


  for (
    let i = 1;
    i < 4;
    i++
  ) {

    const y =
      padding +
      i *
      (
        height -
        padding * 2
      ) / 4;


    context.beginPath();

    context.moveTo(
      0,
      y
    );

    context.lineTo(
      width,
      y
    );

    context.stroke();

  }


  /*
    Price line.
  */

  context.beginPath();


  values.forEach(
    (value,index) => {

      const x =
        index /
        (
          values.length - 1
        ) *
        width;


      const y =
        height -
        padding -

        (
          (
            value -
            minimum
          ) /
          (
            maximum -
            minimum ||
            1
          )
        ) *

        (
          height -
          padding * 2
        );


      if (
        index === 0
      ) {

        context.moveTo(
          x,
          y
        );

      } else {

        context.lineTo(
          x,
          y
        );

      }

    }
  );


  context.strokeStyle =
    meme.price >=
    meme.basePrice
      ? "#35d07f"
      : "#ff5b6e";


  context.lineWidth = 2.5;

  context.stroke();

}


/* =========================
   TRADING
========================= */

function trade(type) {

  if (!selectedMeme)
    return;


  const quantity =
    Math.max(
      1,

      Math.floor(
        Number(
          document.getElementById(
            "shareInput"
          ).value
        ) || 1
      )
    );


  const meme =
    market.find(
      m =>
        m.id ===
        selectedMeme.id
    );


  const cost =
    meme.price *
    quantity;


  const owned =
    portfolio.holdings[
      meme.id
    ] || 0;


  /*
    BUY
  */

  if (
    type === "buy"
  ) {

    if (
      cost >
      portfolio.cash
    ) {

      showToast(
        "Not enough cash 💀"
      );

      return;

    }


    portfolio.cash -=
      cost;


    portfolio.holdings[
      meme.id
    ] =
      owned +
      quantity;


    /*
      Buying creates a tiny
      activity boost.
    */

    meme.shares +=
      quantity;


    meme.momentum =
      Math.min(
        100,
        meme.momentum +
        Math.min(
          5,
          quantity * 0.05
        )
      );


    showToast(
      `Bought ${quantity} ${meme.name} shares 📈`
    );

  }


  /*
    SELL
  */

  else {

    if (
      quantity >
      owned
    ) {

      showToast(
        "You don't own enough shares 😭"
      );

      return;

    }


    portfolio.cash +=
      cost;


    portfolio.holdings[
      meme.id
    ] =
      owned -
      quantity;


    showToast(
      `Sold ${quantity} ${meme.name} shares`
    );

  }


  save();

  renderEverything();

  updateModal();

}


/* =========================
   TOAST
========================= */

function showToast(
  message
) {

  const toast =
    document.getElementById(
      "toast"
    );


  toast.textContent =
    message;


  toast.classList.remove(
    "hidden"
  );


  clearTimeout(
    window.toastTimeout
  );


  window.toastTimeout =
    setTimeout(
      () => {

        toast.classList.add(
          "hidden"
        );

      },

      2200
    );

}


/* =========================
   NAVIGATION
========================= */

document
  .querySelectorAll(
    ".nav-link"
  )
  .forEach(
    button => {

      button.onclick =
        () => {

          document
            .querySelectorAll(
              ".nav-link"
            )
            .forEach(
              item =>
                item.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          document
            .getElementById(
              "marketPage"
            )
            .classList.toggle(
              "hidden",

              button.dataset.page !==
              "market"
            );


          document
            .getElementById(
              "portfolioPage"
            )
            .classList.toggle(
              "hidden",

              button.dataset.page !==
              "portfolio"
            );

        };

    }
  );


/* =========================
   SEARCH
========================= */

document
  .getElementById(
    "searchInput"
  )
  .addEventListener(
    "input",
    event => {

      renderMarket(
        event.target.value
      );

    }
  );


/* =========================
   MODAL CLOSE
========================= */

document
  .querySelectorAll(
    "[data-close]"
  )
  .forEach(
    element => {

      element.onclick =
        () => {

          document
            .getElementById(
              "tradeModal"
            )
            .classList.add(
              "hidden"
            );

        };

    }
  );


/* =========================
   TRADE BUTTONS
========================= */

document
  .getElementById(
    "buyBtn"
  )
  .onclick =
    () =>
      trade("buy");


document
  .getElementById(
    "sellBtn"
  )
  .onclick =
    () =>
      trade("sell");


/* =========================
   RESPONSIVE CHART
========================= */

window.addEventListener(
  "resize",
  () => {

    if (
      selectedMeme
    ) {

      drawChart(
        selectedMeme
      );

    }

  }
);


/* =========================
   RENDER EVERYTHING
========================= */

function renderEverything() {

  renderMarket(
    document.getElementById(
      "searchInput"
    ).value
  );

  renderTicker();

  renderOverview();

  renderPortfolio();

  updateModal();

}


/* =========================
   START
========================= */

renderEverything();


/*
  Update the market every
  30 seconds.
*/

setInterval(
  updatePrices,
  30000
);
