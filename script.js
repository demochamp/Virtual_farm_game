let coins = 0;
let seeds = 3;
const growTime = 3000;
const plotStates = new WeakMap();

const crops = {
  carrot: "https://i.imgur.com/GQ6Wgzn.png",
  tomato: "https://i.imgur.com/H5D1f9u.png",
  corn: "https://i.imgur.com/5HkDTPg.png"
};

// Weather system
const weatherEffects = {
  sunny: { growthMultiplier: 1.2 },
  rainy: { growthMultiplier: 1.5 },
  drought: { growthMultiplier: 0.8 }
};

let currentWeather = 'sunny'; // Default weather

function applyWeatherEffects() {
  const multiplier = weatherEffects[currentWeather].growthMultiplier;
  return growTime / multiplier; // Adjusted grow time
}

function changeWeather() {
  const weatherTypes = Object.keys(weatherEffects);
  currentWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  // Optional: Update UI to reflect current weather
}

// Call changeWeather every 10 seconds
setInterval(changeWeather, 10000);

function updateUI() {
  document.getElementById("coins").innerText = coins;
  document.getElementById("seeds").innerText = seeds;
}

function buySeeds() {
  if (coins >= 5) {
    seeds++;
    coins -= 5;
    updateUI();
  } else {
    alert("Not enough coins!");
  }
}

function handlePlotClick(plot) {
  let state = plotStates.get(plot) || { planted: false, grown: false };
  const text = plot.querySelector(".plantText");
  const img = plot.querySelector(".plant-img");
  const cropType = document.getElementById("cropSelect").value;

  if (!state.planted) {
    if (seeds <= 0) {
      alert("No seeds! Buy more.");
      return;
    }

    seeds--;
    state.planted = true;
    state.crop = cropType;
    plot.classList.add("growing");
    text.innerText = "Growing...";
    document.getElementById("plantSound").play();

    const growDuration = applyWeatherEffects(); // Weather-adjusted grow time

    setTimeout(() => {
      state.grown = true;
      plot.classList.remove("growing");
      plot.classList.add("ready");
      text.innerText = "Click to harvest!";
      img.src = crops[cropType];
      img.style.display = "block";
      plotStates.set(plot, state);
    }, growDuration);

    plotStates.set(plot, state);
    updateUI();
  } else if (state.grown) {
    document.getElementById("harvestSound").play();
    coins += 10;
    seeds += 1;

    plot.classList.remove("ready");
    img.src = "";
    img.style.display = "none";
    text.innerText = "Click to plant 🌱";
    plotStates.set(plot, { planted: false, grown: false });
    updateUI();
  } else {
    alert("Crop is still growing!");
  }
}

updateUI();
