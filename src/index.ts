// src/index.ts
import express from 'express';
import bruteforce from './middleware/bruteForce';
import { login } from './controllers/authController';

const app = express();
const port = 3000;

app.use(express.json());

// Применяем middleware для ограничения попыток входа по IP
app.post('/login', bruteforce.prevent, login);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});