let balance = 100.0;

function updateBalance() {
  document.getElementById('balance').textContent = balance.toFixed(2);
}

const symbols = ['🍒', '🍋', '🍊', '🍇', '7️⃣', '💎', '🐯'];

async function spin() {
  const betInput = document.getElementById('bet');
  const bet = parseFloat(betInput.value);
  const resultEl = document.getElementById('result');

  if (isNaN(bet) || bet <= 0) {
    resultEl.textContent = "Aposta inválida!";
    resultEl.style.color = "yellow";
    return;
  }

  if (bet > balance) {
    resultEl.textContent = "Saldo insuficiente!";
    resultEl.style.color = "red";
    return;
  }

  balance -= bet;
  updateBalance();

  const button = document.querySelector('button');
  button.disabled = true;

  let spins = 0;
  const totalSpins = 20;
  const interval = setInterval(() => {
    document.getElementById('reel1').textContent = randomSymbol();
    document.getElementById('reel2').textContent = randomSymbol();
    document.getElementById('reel3').textContent = randomSymbol();
    spins++;
    if (spins >= totalSpins) {
      clearInterval(interval);
      checkWin(bet);
      button.disabled = false;
    }
  }, 100);
}

function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

async function checkWin(bet) {
  const resultEl = document.getElementById('result');
  try {
    const response = await fetch('/spin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bet, balance })
    });

    const data = await response.json();

    if (data.win > 0) {
      resultEl.textContent = `🎉 Você ganhou ${data.win.toFixed(2)}!`;
      resultEl.style.color = "#0f0";
    } else {
      resultEl.textContent = "❌ Perdeu! Tente novamente.";
      resultEl.style.color = "#f00";
    }

    balance = data.newBalance;
    updateBalance();

    document.getElementById('reel1').textContent = data.symbols[0];
    document.getElementById('reel2').textContent = data.symbols[1];
    document.getElementById('reel3').textContent = data.symbols[2];

  } catch (err) {
    console.error(err);
    resultEl.textContent = "Erro de conexão.";
    resultEl.style.color = "orange";
  }
}

updateBalance();
