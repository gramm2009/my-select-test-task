const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());

const generateOptions = () => {
  const options = [];
  for (let i = 1; i <= 1000; i++) {
    options.push({
      name: i.toString(),
      value: i.toString()
    });
  }
  return options;
};

app.get('/options/for/select', (request, response) => {
  try {
    const random = Math.random();
    if (random < 0.15) {
      response.json([]);
    } else if (random < 0.30) {
      response.json(null);
    } else {
      response.json(generateOptions());
    }
  } catch (error) {
    response.status(500).json({ error: 'Server error' });
  }
});

app.post('/selected/option', (request, response) => {
  try {
    const { value } = request.body;
    
    if (!value) {
      return response.status(400).json({ error: 'Value is required' });
    }
    
    // Иногда симулируем ошибку
    if (Math.random() < 0.25) {
      throw new Error('Simulated server error');
    }
    
    response.json({
      message: `Выбранная опция ${value} успешно принята.`
    });
  } catch (error) {
    response.status(500).json({ error: error.message || 'Server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`Принимает запросы с http://localhost:3000`);
});