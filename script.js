const seed = [

  {
    id: "gigachad",
    name: "GigaChad",
    ticker: "GIGA",
    emoji: "🗿",
    price: 142.37,
    base: 142.37,
    momentum: 47,
    vol: 0.018
  },

  {
    id: "pepe",
    name: "Pepe",
    ticker: "PEPE",
    emoji: "🐸",
    price: 97.21,
    base: 97.21,
    momentum: 31,
    vol: 0.022
  },

  {
    id: "doge",
    name: "Doge",
    ticker: "DOGE",
    emoji: "🐕",
    price: 81.53,
    base: 81.53,
    momentum: 18,
    vol: 0.015
  },

  {
    id: "wojak",
    name: "Wojak",
    ticker: "WOJAK",
    emoji: "😭",
    price: 54.18,
    base: 54.18,
    momentum: -24,
    vol: 0.028
  },

  {
    id: "trollface",
    name: "Trollface",
    ticker: "TROLL",
    emoji: "😈",
    price: 72.44,
    base: 72.44,
    momentum: 12,
    vol: 0.021
  },

  {
    id: "stonks",
    name: "Stonks",
    ticker: "STONK",
    emoji: "📈",
    price: 118.82,
    base: 118.82,
    momentum: 39,
    vol: 0.017
  },

  {
    id: "smurfcat",
    name: "Smurf Cat",
    ticker: "SMURF",
    emoji: "🔵",
    price: 31.06,
    base: 31.06,
    momentum: -31,
    vol: 0.034
  },

  {
    id: "gigabrain",
    name: "Galaxy Brain",
    ticker: "BRAIN",
    emoji: "🧠",
    price: 89.60,
    base: 89.60,
    momentum: 26,
    vol: 0.020
  },

  {
    id: "npc",
    name: "NPC",
    ticker: "NPC",
    emoji: "🤖",
    price: 44.73,
    base: 44.73,
    momentum: -9,
    vol: 0.025
  },

  {
    id: "capybara",
    name: "Capybara",
    ticker: "CAPY",
    emoji: "🦫",
    price: 66.35,
    base: 66.35,
    momentum: 22,
    vol: 0.019
  }

];


let market =
  JSON.parse(
    localStorage.getItem("memestock_market")
  ) ||

  seed.map(m => ({
    ...m,

    history: Array.from(
      { length: 30 },

      (_, i) =>
        m.price *
        (
          0.94 +
          i * 0.002 +
          Math.random() * 0.05
        )
    )
  }));


let portfolio =
  JSON.parse(
    localStorage.getItem("memestock_portfolio")
  ) ||

  {
    cash: 10000,
    holdings: {}
  };


let selected = null;


/* HELPERS */

function money(number) {

  return "$" +
    number.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

}


function percent(number) {

  return (
    number >= 0 ? "+" : ""
  ) +
  number.toFixed(1) +
  "%";

}


function save() {

  localStorage.setItem(
    "memestock_market",
    JSON.stringify(market)
  );

  localStorage.setItem(
    "memestock_portfolio",
    JSON.stringify(portfolio)
  );

}


/* PORTFOLIO */

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

      return total +
        (
          meme
            ? meme.price * quantity
            : 0
        );

    },

    0
  );

}


function totalValue() {

  return (
    portfolio.cash +
    holdingsValue()
  );

}


/* MARKET */

function renderMarket(filter = "") {

  const grid =
    document.getElementById(
      "marketGrid"
    );


  const memes =
    market.filter(meme => {

      const search =
        (
          meme.name +
          " " +
          meme.ticker
        )
        .toLowerCase();

      return search.includes(
        filter.toLowerCase()
      );

    });


  grid.innerHTML =
    memes.map(meme => {

      const change =
        (
          (meme.price - meme.base) /
          meme.base
        ) * 100;


      return `

        <article class="meme-card">

          <div class="meme-top">

            <div class="meme-emoji">
              ${meme.emoji}
            </div>


            <div>

              <div class="meme-name">
                ${meme.name}
              </div>

              <div class="ticker">
                ${meme.ticker}
              </div>

            </div>


            <div class="card-price">

              <strong>
                ${money(meme.price)}
              </strong>

              <span
                class="change ${
                  change >= 0
                    ? "up"
                    : "down"
                }">

                ${percent(change)}

              </span>

            </div>

          </div>


          <div class="card-bottom">

            <span>
              Momentum ${
                meme.momentum >= 0
                  ? "+"
                  : ""
              }${meme.momentum}
            </span>


            <button
              class="trade-btn"
              onclick="openTrade('${meme.id}')">

              Trade →

            </button>

          </div>

        </article>

      `;

    }).join("");

}


/* PORTFOLIO UI */

function renderPortfolio() {

  const holdings =
    holdingsValue();

  const total =
    totalValue();

  const pnl =
    total - 10000;


  document.getElementById(
    "headerCash"
  ).textContent =
    money(portfolio.cash);


  document.getElementById(
    "heroPortfolio"
  ).textContent =
    money(total);


  document.getElementById(
    "heroPnl"
  ).textContent =
    (pnl >= 0 ? "+" : "") +
    money(pnl) +
    " total";


  document.getElementById(
    "portfolioCash"
  ).textContent =
    money(portfolio.cash);


  document.getElementById(
    "portfolioHoldings"
  ).textContent =
    money(holdings);


  document.getElementById(
    "portfolioTotal"
  ).textContent =
    money(total);


  const rows =
    Object.entries(
      portfolio.holdings
    )

    .filter(
      ([, quantity]) =>
        quantity > 0
    )

    .map(
      ([id, quantity]) => {

        const meme =
          market.find(
            m => m.id === id
          );

        const value =
          quantity *
          meme.price;


        const change =
          (
            (meme.price - meme.base) /
            meme.base
          ) * 100;


        return `

          <div class="portfolio-row">

            <div>

              <b>
                ${meme.emoji}
                ${meme.name}
              </b>

              <div class="ticker">
                ${meme.ticker}
              </div>

            </div>


            <div>
              ${quantity} shares
            </div>


            <div>
              ${money(value)}
            </div>


            <div class="${
              change >= 0
                ? "up"
                : "down"
            }">

              ${percent(change)}

            </div>

          </div>

        `;

      }
    );


  document.getElementById(
    "portfolioList"
  ).innerHTML =

    rows.length

      ? rows.join("")

      : `

        <div class="empty">

          Your portfolio is empty.<br>

          Go buy some memes. 🗿

        </div>

      `;

}


/* CHART */

function drawChart(meme) {

  const canvas =
    document.getElementById(
      "priceChart"
    );

  const ctx =
    canvas.getContext("2d");


  const dpr =
    window.devicePixelRatio || 1;


  canvas.width =
    canvas.clientWidth * dpr;

  canvas.height =
    canvas.clientHeight * dpr;


  ctx.scale(dpr, dpr);


  const width =
    canvas.clientWidth;

  const height =
    canvas.clientHeight;


  const values =
    meme.history || [meme.price];


  const min =
    Math.min(...values);

  const max =
    Math.max(...values);


  const padding = 18;


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  /* GRID */

  ctx.strokeStyle =
    "#1d2735";

  ctx.lineWidth = 1;


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


    ctx.beginPath();

    ctx.moveTo(
      0,
      y
    );

    ctx.lineTo(
      width,
      y
    );

    ctx.stroke();

  }


  /* LINE */

  ctx.beginPath();


  values.forEach(
    (value, index) => {

      const x =
        index /
        (values.length - 1) *
        width;


      const y =
        height -
        padding -

        (
          (value - min) /
          (max - min || 1)
        ) *

        (
          height -
          padding * 2
        );


      if (index === 0) {

        ctx.moveTo(x, y);

      } else {

        ctx.lineTo(x, y);

      }

    }
  );


  ctx.strokeStyle =
    meme.price >= meme.base
      ? "#35d07f"
      : "#ff5c70";

  ctx.lineWidth = 3;

  ctx.stroke();

}


/* OPEN TRADE */

window.openTrade =
  function(id) {

    selected =
      market.find(
        meme => meme.id === id
      );


    document.getElementById(
      "modalEmoji"
    ).textContent =
      selected.emoji;


    document.getElementById(
      "modalTicker"
    ).textContent =
      selected.ticker;


    document.getElementById(
      "modalName"
    ).textContent =
      selected.name;


    document.getElementById(
      "tradeModal"
    ).classList.remove(
      "hidden"
    );


    updateModal();

  };


/* UPDATE MODAL */

function updateModal() {

  if (!selected)
    return;


  const meme =
    market.find(
      m => m.id === selected.id
    );


  selected = meme;


  document.getElementById(
    "modalPrice"
  ).textContent =
    money(meme.price);


  const change =
    (
      (meme.price - meme.base) /
      meme.base
    ) * 100;


  const changeElement =
    document.getElementById(
      "modalChange"
    );


  changeElement.textContent =
    percent(change);


  changeElement.className =
    change >= 0
      ? "up"
      : "down";


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
    "modalOwned"
  ).textContent =
    portfolio.holdings[
      meme.id
    ] || 0;


  drawChart(meme);

}


/* BUY / SELL */

function trade(type) {

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


  const cost =
    quantity *
    selected.price;


  const owned =
    portfolio.holdings[
      selected.id
    ] || 0;


  /* BUY */

  if (type === "buy") {

    if (
      cost >
      portfolio.cash
    ) {

      toast(
        "You're too broke for that 💀"
      );

      return;

    }


    portfolio.cash -= cost;


    portfolio.holdings[
      selected.id
    ] =
      owned + quantity;


    toast(
      `Bought ${quantity} ${selected.name} shares 📈`
    );

  }


  /* SELL */

  else {

    if (
      quantity >
      owned
    ) {

      toast(
        "You don't own enough shares 😭"
      );

      return;

    }


    portfolio.cash += cost;


    portfolio.holdings[
      selected.id
    ] =
      owned - quantity;


    toast(
      `Sold ${quantity} ${selected.name} shares 💰`
    );

  }


  save();

  renderMarket(
    document.getElementById(
      "searchInput"
    ).value
  );

  renderPortfolio();

  updateModal();

}


/* MARKET SIMULATION */

function updateMarket() {

  market.forEach(
    meme => {

      const momentumBias =
        meme.momentum /
        10000;


      const randomNoise =
        (
          Math.random() -
          0.5
        ) *
        meme.vol;


      const movement =
        momentumBias +
        randomNoise;


      meme.price =
        Math.max(
          0.01,
          meme.price *
          (1 + movement)
        );


      meme.history.push(
        meme.price
      );


      if (
        meme.history.length >
        50
      ) {

        meme.history.shift();

      }


      meme.momentum =
        Math.max(
          -100,

          Math.min(
            100,

            meme.momentum +
            (
              Math.random() -
              0.5
            ) * 4
          )
        );

    }
  );


  save();

  renderMarket(
    document.getElementById(
      "searchInput"
    ).value
  );

  renderPortfolio();

  updateModal();

}


/* TOAST */

function toast(message) {

  const element =
    document.getElementById(
      "toast"
    );


  element.textContent =
    message;


  element.classList.remove(
    "hidden"
  );


  clearTimeout(
    window.toastTimer
  );


  window.toastTimer =
    setTimeout(
      () => {

        element.classList.add(
          "hidden"
        );

      },

      2200
    );

}


/* NAVIGATION */

document
  .querySelectorAll(
    ".nav-btn"
  )
  .forEach(
    button => {

      button.onclick =
        () => {

          document
            .querySelectorAll(
              ".nav-btn"
            )
            .forEach(
              b =>
                b.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          document
            .getElementById(
              "marketView"
            )
            .classList.toggle(
              "hidden",
              button.dataset.view !==
              "market"
            );


          document
            .getElementById(
              "portfolioView"
            )
            .classList.toggle(
              "hidden",
              button.dataset.view !==
              "portfolio"
            );

        };

    }
  );


/* SEARCH */

document
  .getElementById(
    "searchInput"
  )
  .addEventListener(
    "input",
    event =>
      renderMarket(
        event.target.value
      )
  );


/* CLOSE MODAL */

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


/* BUTTONS */

document
  .getElementById(
    "buyBtn"
  )
  .onclick =
    () => trade("buy");


document
  .getElementById(
    "sellBtn"
  )
  .onclick =
    () => trade("sell");


/* RESIZE */

window.addEventListener(
  "resize",
  () => {

    if (selected)
      drawChart(selected);

  }
);


/* START */

renderMarket();

renderPortfolio();


/*
  Market updates every 30 seconds.
*/

setInterval(
  updateMarket,
  30000
);
