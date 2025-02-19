/***
 * Rate Limiter with Time Bucketing method with no 3rd party libs.
 * No DB & Redis, just in-memory.
 * 
 * See `:vanilla` in package.json script section
 */
import express from 'express';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Proxy handler (like nginx or another gateway)
app.set('trust proxy', (ip: string) => {
    if (ip === '127.0.0.1') return true; // Localhost
    if (ip.startsWith('172.') || ip.startsWith('10.') || ip.startsWith('192.168.')) {
        return true; // Trust Docker networks
    }
    return false;
});

/***
 * Тестовое начинается тут
 */

// Конфигурация лимитов (без .env, чтобы секономить время)
const X_MINUTES = 5 * 60 * 1000; // X минут (aka max attemt limit)
const Y_ATTEMPTS = 5; // Y неудачных попыток
const Z_BLOCK_TIME = 1 * 60 * 1000; // время блокировки Z минут

// Хранилище попыток логина, хранит данные пока приложение не перезапустится
const loginAttempts = new Map<string, { attempts: number[], blockedUntil: number | null }>();

// Middleware для ограничения попыток входа
const loginRateLimiterMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { username } = req.body;
    if (!username) {
        res.status(400).json({ error: 'Missing username' });
    }

    const now = Date.now();
    if (!loginAttempts.has(username)) {
        loginAttempts.set(username, { attempts: [], blockedUntil: null });
    }

    const userData = loginAttempts.get(username)!;

    // Проверяем блокировку
    if (userData.blockedUntil && now < userData.blockedUntil) {
        res.status(429).json({ error: `Too many failed attempts. Try again later.` });
    }

    // Удаляем старые попытки
    userData.attempts = userData.attempts.filter(timestamp => now - timestamp < X_MINUTES);

    // Сохраняем обновленные данные
    loginAttempts.set(username, userData);

    next();
};

// Эмуляция проверки логина (в реальном коде — запрос к БД)
const checkLogin = (username: string, password: string) => {
    return username === "admin" && password === "password123";
};

// Роут логина
app.post('/login', loginRateLimiterMiddleware, (req, res) => {
    const { username, password } = req.body;
    const now = Date.now();

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }

    const userData = loginAttempts.get(username)!;

    if (checkLogin(username, password)) {
        // Успешный логин → сбрасываем попытки
        loginAttempts.set(username, { attempts: [], blockedUntil: null });
        return res.json({ success: true, message: 'Login successful' });
    }

    // Логируем неудачную попытку
    userData.attempts.push(now);

    // Проверяем лимит попыток
    if (userData.attempts.length >= Y_ATTEMPTS) {
        userData.blockedUntil = now + Z_BLOCK_TIME;
        return res.status(429).json({ error: `Too many failed attempts. Try again in ${Z_BLOCK_TIME / 60000} minutes.` });
    }

    // Здесь ожидаются данные из checkLogin
    res.status(401).json({ error: 'Invalid username or password' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
