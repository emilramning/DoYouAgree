/* ==========================================
   MEMESTOCK V3
   Frontend demo market
========================================== */


/* ==========================================
   MEMES

   These use remote images for now.
   Later we can replace these with your
   own meme image files.
========================================== */

const memes = [

  {
    id: "gigachad",
    name: "GigaChad",
    ticker: "GIGA",
    image:
      "https://i.imgflip.com/30b1gx.jpg",
    price: 142.37,
    basePrice: 142.37,
    momentum: 92,
    views: 84200,
    likes: 12400,
    shares: 5900,
    history: []
  },

  {
    id: "pepe",
    name: "Pepe",
    ticker: "PEPE",
    image:
      "https://i.imgflip.com/1o00in.jpg",
    price: 97.21,
    basePrice: 97.21,
    momentum: 81,
    views: 71200,
    likes: 10300,
    shares: 4100,
    history: []
  },

  {
    id: "doge",
    name: "Doge",
    ticker: "DOGE",
    image:
      "https://i.imgflip.com/4t0m5.jpg",
    price: 81.53,
    basePrice: 81.53,
    momentum: 63,
    views: 65400,
    likes: 9100,
    shares: 3200,
    history: []
  },

  {
    id: "stonks",
    name: "Stonks",
    ticker: "STONK",
    image:
      "https://i.imgflip.com/1jwhww.jpg",
    price: 118.82,
    basePrice: 118.82,
    momentum: 74,
    views: 60200,
    likes: 8200,
    shares: 3400,
    history: []
  },

  {
    id: "wojak",
    name: "Wojak",
    ticker: "WOJAK",
    image:
      "https://i.imgflip.com/1ur9b0.jpg",
    price: 54.18,
    basePrice: 54.18,
    momentum: 42,
    views: 28900,
    likes: 3600,
    shares: 900,
    history: []
  },

  {
    id: "trollface",
    name: "Trollface",
    ticker: "TROLL",
    image:
      "https://i.imgflip.com/1bij.jpg",
    price: 72.44,
    basePrice: 72.44,
    momentum: 57,
    views: 48100,
    likes: 6700,
    shares: 1800,
    history: []
  },

  {
    id: "brain",
    name: "Galaxy Brain",
    ticker: "BRAIN",
    image:
      "https://i.imgflip.com/1jynl9.jpg",
    price: 89.60,
    basePrice: 89.60,
    momentum: 69,
    views: 52400,
    likes: 7200,
    shares: 2500,
    history: []
  },

  {
    id: "smurf",
    name: "Smurf Cat",
    ticker: "SMURF",
    image:
      "https://i.imgflip.com/1wz1x.jpg",
    price: 31.06,
    basePrice: 31.06,
    momentum: 24,
    views: 11400,
    likes: 1200,
    shares: 220,
    history: []
  }

];


/* ==========================================
   CHART HISTORY
========================================== */

memes.forEach(meme => {

  let value =
    meme.price * 0.92;

  for(let i = 0; i < 60; i++) {

    value *=
      1 +
      (Math.random() - .47) *
      .025;

    meme.history.push(value);

  }

  meme.history.push(meme.price);

});


/* ==========================================
   PORTFOLIO
========================================== */

let portfolio =
  JSON.parse(
    localStorage.getItem(
      "memestock_v3_portfolio"
    )
  );


if(!portfolio) {

  portfolio = {

    cash: 10000,

    holdings: {}

  };

}


function savePortfolio() {

  localStorage.setItem(
    "memestock_v3_portfolio",
    JSON.stringify(portfolio)
  );

}


/* ==========================================
   HELPERS
========================================== */

function money(number) {

  return "$" +
    Number(number).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

}


function compact(number) {

  if(number >= 1000000)
    return (
      number / 1000000
    ).toFixed(1) + "M";

  if(number >= 1000)
    return (
      number / 1000
    ).toFixed(1) + "K";

  return Math.round(number);

}


function change(meme) {

  return (
    (meme.price -
      meme.basePrice) /
    meme.basePrice
  ) * 100;

}


function signedPercent(number) {

  return (
    number >= 0
      ? "+"
      : ""
  ) +
  number.toFixed(1) +
  "%";

}


function portfolioValue() {

  let value =
    portfolio.cash;

  Object.entries(
    portfolio.holdings
  ).forEach(
    ([id, quantity]) => {

      const meme =
        memes.find(
          m => m.id === id
        );

      if(meme) {

        value +=
          meme.price *
          quantity;

      }

    }
  );

  return value;

}


function investedValue() {

  return Object.entries(
    portfolio.holdings
  ).reduce(
    (total,[id,quantity]) => {

      const meme =
        memes.find(
          m => m.id === id
        );

      if(!meme)
        return total;

      return total +
        meme.price *
        quantity;

    },
    0
  );

}


/* ==========================================
   TRENDING
========================================== */

function renderTrending() {

  const sorted =
    [...memes].sort(
      (a,b) =>
        b.momentum -
        a.momentum
    );


  const top =
    sorted.slice(0,4);


  document.getElementById(
    "trendingGrid"
  ).innerHTML =
    top.map(
      (meme,index) =>
        trendingCard(
          meme,
          index + 1
        )
    ).join("");


  document.getElementById(
    "largeTrendingGrid"
  ).innerHTML =
    sorted.map(
      (meme,index) =>
        trendingCard(
          meme,
          index + 1
        )
    ).join("");

}


function trendingCard(
  meme,
  rank
) {

  const pct =
    change(meme);


  return `

    <article
      class="trending-card"
      onclick="openAsset('${meme.id}')">

      <div class="card-rank">
        #${rank} TRENDING
      </div>

      <div class="card-image">

        <img
          src="${meme.image}"
          alt="${meme.name}"
          loading="lazy"
        >

      </div>

      <div class="card-name">
        ${meme.name}
      </div>

      <div class="card-ticker">
        ${meme.ticker}
      </div>

      <div class="card-bottom">

        <div class="card-price">
          ${money(meme.price)}
        </div>

        <div
          class="
            card-change
            ${pct >= 0
              ? "positive"
              : "negative"}
          ">

          ${signedPercent(pct)}

        </div>

      </div>

    </article>

  `;

}


/* ==========================================
   MARKET
========================================== */

function renderMarket(
  search = ""
) {

  const filtered =
    memes.filter(
      meme => {

        const query =
          search.toLowerCase();

        return (
          meme.name
            .toLowerCase()
            .includes(query)
          ||
          meme.ticker
            .toLowerCase()
            .includes(query)
        );

      }
    );


  document.getElementById(
    "marketList"
  ).innerHTML =
    filtered.map(
      marketRow
    ).join("");

}


function marketRow(meme) {

  const pct =
    change(meme);


  const momentum =
    Math.round(
      meme.momentum
    );


  return `

    <div class="market-row">

      <div class="asset">

        <div class="asset-image">

          <img
            src="${meme.image}"
            alt="${meme.name}"
            loading="lazy"
          >

        </div>

        <div>

          <div class="asset-name">
            ${meme.name}
          </div>

          <div class="asset-ticker">
            ${meme.ticker}
          </div>

        </div>

      </div>


      <div class="row-price">

        ${money(meme.price)}

      </div>


      <div
        class="
          row-change
          ${pct >= 0
            ? "positive"
            : "negative"}
        ">

        ${signedPercent(pct)}

      </div>


      <div class="momentum">

        <span class="momentum-number">
          ${momentum}
        </span>

        <div class="momentum-track">

          <div
            class="momentum-fill"
            style="
              width:${momentum}%;
            ">
          </div>

        </div>

      </div>


      <button
        class="trade-small"
        onclick="
          openAsset('${meme.id}')
        ">

        TRADE

      </button>

    </div>

  `;

}


/* ==========================================
   TICKER
========================================== */

function renderTicker() {

  const top =
    [...memes]
      .sort(
        (a,b) =>
          b.momentum -
          a.momentum
      )
      .slice(0,5);


  document.getElementById(
    "marketTicker"
  ).innerHTML =
    top.map(
      meme => {

        const pct =
          change(meme);


        return `

          <div class="ticker-item">

            <strong>
              ${meme.ticker}
            </strong>

            <span
              class="
                ${
                  pct >= 0
                    ? "positive"
                    : "negative"
                }
              ">

              ${money(meme.price)}
              ${signedPercent(pct)}

            </span>

          </div>

        `;

      }
    ).join("");

}


/* ==========================================
   PORTFOLIO UI
========================================== */

function renderPortfolio() {

  const total =
    portfolioValue();


  const invested =
    investedValue();


  const pnl =
    total - 10000;


  document.getElementById(
    "topCash"
  ).textContent =
    money(
      portfolio.cash
    );


  document.getElementById(
    "portfolioValue"
  ).textContent =
    money(total);


  document.getElementById(
    "portfolioPnl"
  ).textContent =
    (
      pnl >= 0
        ? "+"
        : ""
    ) +
    money(pnl);


  document.getElementById(
    "portfolioTotal"
  ).textContent =
    money(total);


  document.getElementById(
    "portfolioCash"
  ).textContent =
    money(
      portfolio.cash
    );


  document.getElementById(
    "portfolioInvested"
  ).textContent =
    money(invested);


  document.getElementById(
    "portfolioTotalPnl"
  ).textContent =
    (
      pnl >= 0
        ? "+"
        : ""
    ) +
    money(pnl);


  const positions =
    Object.entries(
      portfolio.holdings
    ).filter(
      ([,quantity]) =>
        quantity > 0
    );


  const container =
    document.getElementById(
      "holdingsList"
    );


  if(!positions.length) {

    container.innerHTML = `

      <div class="empty-state">

        <div style="font-size:28px;margin-bottom:10px;">
          📊
        </div>

        Your portfolio is empty.

        <br>

        Start trading some memes.

      </div>

    `;

    return;

  }


  container.innerHTML =
    positions.map(
      ([id,quantity]) => {

        const meme =
          memes.find(
            m => m.id === id
          );


        if(!meme)
          return "";


        const value =
          meme.price *
          quantity;


        const pct =
          change(meme);


        return `

          <div class="holding-row">

            <div class="asset">

              <div class="asset-image">

                <img
                  src="${meme.image}"
                  alt="${meme.name}"
                >

              </div>

              <div>

                <div class="asset-name">
                  ${meme.name}
                </div>

                <div class="asset-ticker">
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
                  pct >= 0
                    ? "positive"
                    : "negative"
                }
              ">

              ${signedPercent(pct)}

            </div>

          </div>

        `;

      }
    ).join("");

}


/* ==========================================
   MODAL
========================================== */

let selectedMeme = null;


window.openAsset =
function(id) {

  selectedMeme =
    memes.find(
      meme =>
        meme.id === id
    );


  if(!selectedMeme)
    return;


  document.getElementById(
    "assetModal"
  ).classList.remove(
    "hidden"
  );


  updateModal();

};


function updateModal() {

  const meme =
    selectedMeme;


  if(!meme)
    return;


  document.getElementById(
    "modalImage"
  ).innerHTML = `

    <img
      src="${meme.image}"
      alt="${meme.name}"
    >

  `;


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


  const pct =
    change(meme);


  const changeEl =
    document.getElementById(
      "modalChange"
    );


  changeEl.textContent =
    signedPercent(pct);


  changeEl.className =
    pct >= 0
      ? "positive"
      : "negative";


  const momentum =
    Math.round(
      meme.momentum
    );


  document.getElementById(
    "modalMomentum"
  ).textContent =
    momentum;


  document.getElementById(
    "modalMomentumBar"
  ).style.width =
    momentum + "%";


  document.getElementById(
    "modalViews"
  ).textContent =
    compact(
      meme.views
    );


  document.getElementById(
    "modalLikes"
  ).textContent =
    compact(
      meme.likes
    );


  document.getElementById(
    "modalShares"
  ).textContent =
    compact(
      meme.shares
    );


  const owned =
    portfolio.holdings[
      meme.id
    ] || 0;


  document.getElementById(
    "ownedShares"
  ).textContent =
    owned;


  updateEstimatedTotal();

  drawChart();

}


function updateEstimatedTotal() {

  if(!selectedMeme)
    return;


  const quantity =
    Math.max(
      1,
      Number(
        document.getElementById(
          "quantityInput"
        ).value
      ) || 1
    );


  document.getElementById(
    "estimatedTotal"
  ).textContent =
    money(
      selectedMeme.price *
      quantity
    );

}


/* ==========================================
   CHART
========================================== */

function drawChart() {

  if(!selectedMeme)
    return;


  const canvas =
    document.getElementById(
      "priceChart"
    );


  const rect =
    canvas.getBoundingClientRect();


  const ratio =
    window.devicePixelRatio ||
    1;


  canvas.width =
    rect.width *
    ratio;


  canvas.height =
    rect.height *
    ratio;


  const ctx =
    canvas.getContext(
      "2d"
    );


  ctx.scale(
    ratio,
    ratio
  );


  const width =
    rect.width;


  const height =
    rect.height;


  const values =
    selectedMeme.history;


  const min =
    Math.min(...values);


  const max =
    Math.max(...values);


  const padding = 12;


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  /* grid */

  ctx.strokeStyle =
    "#161d27";

  ctx.lineWidth = 1;


  for(let i=1;i<5;i++) {

    const y =
      i *
      height /
      5;


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


  /* line */

  ctx.beginPath();


  values.forEach(
    (value,index) => {

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


      if(index === 0)
        ctx.moveTo(x,y);
      else
        ctx.lineTo(x,y);

    }
  );


  const rising =
    selectedMeme.price >=
    selectedMeme.basePrice;


  ctx.strokeStyle =
    rising
      ? "#31d47c"
      : "#ff5d70";


  ctx.lineWidth = 2;

  ctx.stroke();


  /* gradient fill */

  ctx.lineTo(
    width,
    height
  );

  ctx.lineTo(
    0,
    height
  );

  ctx.closePath();


  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      height
    );


  gradient.addColorStop(
    0,
    rising
      ? "rgba(49,212,124,.12)"
      : "rgba(255,93,112,.12)"
  );


  gradient.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );


  ctx.fillStyle =
    gradient;

  ctx.fill();

}


/* ==========================================
   BUY / SELL
========================================== */

function trade(
  side
) {

  if(!selectedMeme)
    return;


  const quantity =
    Math.max(
      1,
      Math.floor(
        Number(
          document.getElementById(
            "quantityInput"
          ).value
        ) || 1
      )
    );


  const cost =
    selectedMeme.price *
    quantity;


  const owned =
    portfolio.holdings[
      selectedMeme.id
    ] || 0;


  if(side === "buy") {

    if(
      cost >
      portfolio.cash
    ) {

      showToast(
        "Not enough cash."
      );

      return;

    }


    portfolio.cash -=
      cost;


    portfolio.holdings[
      selectedMeme.id
    ] =
      owned +
      quantity;


    /*
      Temporary local market effect.

      This will later be replaced by
      the shared server-side market.
    */

    selectedMeme.momentum =
      Math.min(
        100,
        selectedMeme.momentum +
        quantity * .08
      );


    selectedMeme.shares +=
      quantity;


    showToast(
      `Bought ${quantity} ${selectedMeme.ticker} 📈`
    );

  }


  else {

    if(
      quantity >
      owned
    ) {

      showToast(
        "You don't own enough shares."
      );

      return;

    }


    portfolio.cash +=
      cost;


    portfolio.holdings[
      selectedMeme.id
    ] =
      owned -
      quantity;


    showToast(
      `Sold ${quantity} ${selectedMeme.ticker}`
    );

  }


  savePortfolio();

  renderAll();

  updateModal();

}


/* ==========================================
   MARKET SIMULATION

   Temporary until Supabase.
========================================== */

function marketTick() {

  memes.forEach(
    meme => {

      const pressure =
        (
          meme.momentum -
          50
        ) / 7000;


      const randomness =
        (
          Math.random() -
          .5
        ) * .012;


      meme.price =
        Math.max(
          .01,
          meme.price *
          (
            1 +
            pressure +
            randomness
          )
        );


      meme.history.push(
        meme.price
      );


      if(
        meme.history.length >
        60
      ) {

        meme.history.shift();

      }


      /* activity */

      const hype =
        Math.max(
          0,
          meme.momentum
        ) / 100;


      meme.views +=
        Math.round(
          Math.random() *
          (
            15 +
            hype * 100
          )
        );


      meme.likes +=
        Math.round(
          Math.random() *
          (
            2 +
            hype * 10
          )
        );


      meme.shares +=
        Math.round(
          Math.random() *
          (
            1 +
            hype * 6
          )
        );


      /*
        Small momentum movement.
      */

      meme.momentum +=
        (
          Math.random() -
          .5
        ) * 2;


      meme.momentum =
        Math.max(
          5,
          Math.min(
            100,
            meme.momentum
          )
        );

    }
  );


  renderAll();

  if(selectedMeme)
    updateModal();

}


/* ==========================================
   NAVIGATION
========================================== */

function showPage(
  page
) {

  document
    .querySelectorAll(
      ".page"
    )
    .forEach(
      section => {

        section.classList.add(
          "hidden"
        );

      }
    );


  document
    .getElementById(
      page + "Page"
    )
    .classList.remove(
      "hidden"
    );


  document
    .querySelectorAll(
      ".nav-item"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.page ===
          page
        );

      }
    );

}


document
  .querySelectorAll(
    ".nav-item"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () =>
          showPage(
            button.dataset.page
          )
      );

    }
  );


document
  .querySelectorAll(
    "[data-page-target]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () =>
          showPage(
            button.dataset.pageTarget
          )
      );

    }
  );


/* ==========================================
   SEARCH
========================================== */

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


/* ==========================================
   QUANTITY
========================================== */

document
  .getElementById(
    "minusBtn"
  )
  .onclick =
    () => {

      const input =
        document.getElementById(
          "quantityInput"
        );


      input.value =
        Math.max(
          1,
          Number(input.value) - 1
        );


      updateEstimatedTotal();

    };


document
  .getElementById(
    "plusBtn"
  )
  .onclick =
    () => {

      const input =
        document.getElementById(
          "quantityInput"
        );


      input.value =
        Number(input.value) + 1;


      updateEstimatedTotal();

    };


document
  .getElementById(
    "quantityInput"
  )
  .addEventListener(
    "input",
    updateEstimatedTotal
  );


/* ==========================================
   CLOSE MODAL
========================================== */

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
              "assetModal"
            )
            .classList.add(
              "hidden"
            );

        };

    }
  );


/* ==========================================
   BUTTONS
========================================== */

document
  .getElementById(
    "buyButton"
  )
  .onclick =
    () =>
      trade("buy");


document
  .getElementById(
    "sellButton"
  )
  .onclick =
    () =>
      trade("sell");


/* ==========================================
   TOAST
========================================== */

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
    window.toastTimer
  );


  window.toastTimer =
    setTimeout(
      () => {

        toast.classList.add(
          "hidden"
        );

      },
      2200
    );

}


/* ==========================================
   RENDER
========================================== */

function renderAll() {

  renderTrending();

  renderMarket(
    document.getElementById(
      "searchInput"
    ).value
  );

  renderTicker();

  renderPortfolio();

}


/* ==========================================
   START
========================================== */

renderAll();


/*
  Simulate market movement every
  20 seconds.
*/

setInterval(
  marketTick,
  20000
);


/*
  Redraw chart when resizing.
*/

window.addEventListener(
  "resize",
  () => {

    if(selectedMeme)
      drawChart();

  }
);
