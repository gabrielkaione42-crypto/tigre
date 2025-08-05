const express = require('express');
const app = express();

app.use(express.static('.'));
app.use(express.json());

let balance = 100.0;

const prizes = {
  '🐯🐯🐯': 10,
  '7️⃣7️⃣7️⃣': 5,
  '💎💎💎': 3,
  '🍒🍒🍒': 2,
};

app.post('/spin', (req, res) => {
  const { bet } = req.body;

  if (bet > balance) {
    return res.status(400).json({ error: 'Saldo insuficiente' });
  }

  const symbols = [
    randomSymbol(),
    randomSymbol(),
    randomSymbol()
  ];

  const combo = symbols.join('');
  let multiplier = 0;

  for (const [key, value] of Object.entries(prizes)) {
    if (combo === key) {
      multiplier = value;
      break;
    }
  }

  const win = bet * multiplier;
  balance = balance - bet + win;

  res.json({
    symbols,
    win,
    newBalance: balance,
    combo
  });
});

function randomSymbol() {
  const symbols = ['🍒', '🍋', '🍊', '🍇', '7️⃣', '💎', '🐯'];
  return symbols[Math.floor(Math.random() * symbols.length)];
}

app.listen(3000, () => {
  console.log('🎮 Tigrinho Casino rodando em http://localhost:3000');
});
