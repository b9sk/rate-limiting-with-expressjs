/***
 * 'express-rate-limit' не подходит, будет использован express-brute
 */

import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());

// Конфигурация лимитов (без .env, чтобы секономить время)
const X_MINUTES = 5 * 60 * 1000; // X минут (aka max attemt limit)
const Y_ATTEMPTS = 5; // Y неудачных попыток
const Z_BLOCK_TIME = 1 * 60 * 1000; // время блокировки Z минут

// Настройка ограничения попыток входа
const loginLimiter = rateLimit({
  windowMs: X_MINUTES, // 5 минутное окно
  max: Y_ATTEMPTS, // Максимум 5 попыток за окно
  message: 'Превышено количество попыток входа. Попробуйте позже.',
  keyGenerator: (req: Request): string => {
    // Используем комбинацию имени пользователя и IP-адреса в качестве ключа
    const username = req.body.username || 'unknown_user';
    const userIP = req.ip || 'unknown_ip';
    return `${username}-${userIP}`;
  },
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    res.status(options.statusCode).json({ error: options.message });
  },
});

// Маршрут для обработки входа
app.post('/login', loginLimiter, (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Проверка наличия имени пользователя и пароля
  if (!username || !password) {
    return res.status(400).json({ error: 'Отсутствует имя пользователя или пароль' });
  }

  // Здесь должна быть ваша логика аутентификации
  const isAuthenticated = authenticateUser(username, password);

  if (isAuthenticated) {
    // При успешной аутентификации сбрасываем счетчик попыток
    // @ts-ignore (sorry for this)
    req.rateLimit?.resetKey(`${username}-${req.ip}`);
    return res.json({ message: 'Успешный вход' });
  } else {
    return res.status(401).json({ error: 'Неверные учетные данные' });
  }
});

// Функция для эмуляции аутентификации пользователя
function authenticateUser(username: string, password: string): boolean {
  // Замените эту функцию на реальную проверку пользователя
  const validUsername = 'user1';
  const validPassword = 'password123';
  return username === validUsername && password === validPassword;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
