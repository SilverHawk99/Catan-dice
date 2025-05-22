
// Chart.js Datalabels Plugin registrieren
Chart.register(ChartDataLabels);

// Globale Effekte laden oder Standard setzen
let globalEffects = JSON.parse(localStorage.getItem("globalEffects")) || [
  "Wenn du leer ausgehst nimm dir einen belibigen Rohstoff.",
  "Lehmbrüche und Erzmienen produzieren keine Handelswahren mehr,nimm dir stattdessen zwei Rohstoffe.",
  "Forste und Weiden produzieren keine Handelswahren mehr,nimm dir stattdessen zwei Rohstoffe.",
  "Felder und Weiden produzieren keine Handelswahren mehr,nimm dir stattdessen zwei Rohstoffe.",
  "Der Spieler mit den wenigsten Siegpunkten darf Städte und Siedlungen einen Rohstoff günstiger Bauen.",
  "Statt einer Fortschrittskarte erhält man zwei, zählt nur für den aktiven Spieler.",
  "Lehmbrüche liefern keine Waren mehr!",
  "Erzmienen liefern keine Waren mehr!",
  "Forste liefern keine Waren mehr!",
  "Weiden liefern keine Waren mehr!",
  "Getreidefelder liefern keine Waren mehr!",
  "Küsten liefern keine Waren mehr!"
];
let totalRolls = 0;
let lastGlobalEffect = "";

function showGlobalEffect(effect) {
  document.getElementById("globalEffectBox").textContent = effect;
  document.getElementById("globalEffectBox").style.display = "block";
}

function toggleGlobalEdit() {
  const area = document.getElementById("globalEditArea");
  const input = document.getElementById("globalEffectInput");
  if (area.style.display === 'none') {
    input.value = globalEffects.join("\n");
    area.style.display = 'block';
  } else {
    area.style.display = 'none';
  }
}

function saveGlobalEffects() {
  const input = document.getElementById("globalEffectInput").value;
  globalEffects = input.split('\n').map(e => e.trim()).filter(e => e);
  localStorage.setItem("globalEffects", JSON.stringify(globalEffects));
  document.getElementById("globalEditArea").style.display = 'none';
}

const diceFaces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
const thirdDiceFaces = ['Vorrücken','Stehenbleiben'];
const fourthDiceColors = ['🔵','🟡','🟢','🟣','🔴','⚫'];
const fourthDiceNames = ['blau','gelb','grün','pink','rot','schwarz'];

const defaultEffects = [...]; // Effektliste wird aus Platzgründen ausgelassen
let effects = JSON.parse(localStorage.getItem("sevenEffects")) || defaultEffects;
let stats = JSON.parse(localStorage.getItem("diceStats")) || Array(11).fill(0);
let thirdDiceStats = JSON.parse(localStorage.getItem("thirdDiceStats")) || [0, 0];
let fourthDiceStats = JSON.parse(localStorage.getItem("fourthDiceStats")) || Array(6).fill(0);
let rollingDisabled = false;

const statsChart = new Chart(document.getElementById('statsChart'), {
  type: 'bar',
  data: {
    labels: Array.from({length: 11}, (_, i) => (i + 2).toString()),
    datasets: [{
      label: 'Häufigkeit der gewürfelten Summe',
      data: stats,
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  }
});

const thirdDiceChart = new Chart(document.getElementById('thirdDiceChart'), {
  type: 'pie',
  data: {
    labels: ['Vorrücken', 'Stehenbleiben'],
    datasets: [{
      label: 'Häufigkeit dritter Würfel',
      data: thirdDiceStats,
      backgroundColor: ['#2ecc71', '#e74c3c']
    }]
  },
  options: {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          return sum ? (value / sum * 100).toFixed(1) + '%' : '0%';
        },
        color: '#fff',
        font: { weight: 'bold', size: 14 }
      }
    }
  }
});

const fourthDiceChart = new Chart(document.getElementById('fourthDiceChart'), {
  type: 'pie',
  data: {
    labels: fourthDiceNames,
    datasets: [{
      label: 'Farbe vierter Würfel',
      data: fourthDiceStats,
      backgroundColor: ['#3498db', '#f1c40f', '#2ecc71', '#e84393', '#e74c3c', '#34495e']
    }]
  },
  options: {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          return sum ? (value / sum * 100).toFixed(1) + '%' : '0%';
        },
        color: '#fff',
        font: { weight: 'bold', size: 14 }
      }
    }
  }
});

function rollDice() {
  totalRolls++;
  if (totalRolls >= 7 && (totalRolls - 7) % 8 === 0) {
    lastGlobalEffect = globalEffects[Math.floor(Math.random() * globalEffects.length)];
    showGlobalEffect(lastGlobalEffect);
  } else if (lastGlobalEffect) {
    showGlobalEffect(lastGlobalEffect);
  }
  if (rollingDisabled) return;
  rollingDisabled = true;

  const number1 = Math.floor(Math.random() * 6) + 1;
  const number2 = Math.floor(Math.random() * 6) + 1;
  const third = Math.floor(Math.random() * 6);
  const fourth = Math.floor(Math.random() * 6);

  const thirdOutcome = third < 3 ? 'Vorrücken' : 'Stehenbleiben';
  const fourthColor = fourthDiceColors[fourth];
  const fourthText = fourthDiceNames[fourth];

  const sum = number1 + number2;

  document.getElementById('dice1').textContent = diceFaces[number1 - 1];
  document.getElementById('dice2').textContent = diceFaces[number2 - 1];
  document.getElementById('dice3').textContent = thirdOutcome === 'Vorrücken' ? '➡️' : '⛔️';
  document.getElementById('dice4').textContent = fourthColor;

  document.getElementById('result').textContent = `Gesamtergebnis: ${sum}`;
  document.getElementById('thirdResult').textContent = `Barbarenwürfel: ${thirdOutcome}`;
  document.getElementById('fourthResult').textContent = `Handelsgilde: ${fourthText}`;

  stats[sum - 2]++;
  thirdOutcome === 'Vorrücken' ? thirdDiceStats[0]++ : thirdDiceStats[1]++;
  fourthDiceStats[fourth]++;

  localStorage.setItem("diceStats", JSON.stringify(stats));
  localStorage.setItem("thirdDiceStats", JSON.stringify(thirdDiceStats));
  localStorage.setItem("fourthDiceStats", JSON.stringify(fourthDiceStats));

  statsChart.update();
  thirdDiceChart.update();
  fourthDiceChart.update();

  if (sum === 7) {
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    const [title, ...textParts] = randomEffect.split(":");
    const effectTitle = title?.trim() || "Ereignis";
    const effectText = textParts.join(":").trim();
    document.getElementById('effectTitle').textContent = effectTitle;
    document.getElementById('effectText').textContent = effectText;
    document.getElementById('effectBox').style.display = 'block';
  } else {
    rollingDisabled = false;
  }
}

function closeEffect() {
  document.getElementById('effectBox').style.display = 'none';
  rollingDisabled = false;
}

function toggleEdit() {
  const area = document.getElementById('editArea');
  const input = document.getElementById('effectInput');
  if (area.style.display === 'none') {
    input.value = effects.join("\n");
    area.style.display = 'block';
  } else {
    area.style.display = 'none';
  }
}

function saveEffects() {
  const input = document.getElementById('effectInput').value;
  effects = input.split('\n').map(e => e.trim()).filter(e => e);
  localStorage.setItem("sevenEffects", JSON.stringify(effects));
  document.getElementById('editArea').style.display = 'none';
}

function resetStats() {
  stats = Array(11).fill(0);
  thirdDiceStats = [0, 0];
  fourthDiceStats = Array(6).fill(0);
  localStorage.setItem("diceStats", JSON.stringify(stats));
  localStorage.setItem("thirdDiceStats", JSON.stringify(thirdDiceStats));
  localStorage.setItem("fourthDiceStats", JSON.stringify(fourthDiceStats));
  statsChart.data.datasets[0].data = stats;
  thirdDiceChart.data.datasets[0].data = thirdDiceStats;
  fourthDiceChart.data.datasets[0].data = fourthDiceStats;
  statsChart.update();
  thirdDiceChart.update();
  fourthDiceChart.update();
}

document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && ['u', 'c', 'x', 's'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});

function toggleStats() {
  const statsContainer = document.getElementById('statsContainer');
  statsContainer.style.display = statsContainer.style.display === 'none' ? 'flex' : 'none';
}
