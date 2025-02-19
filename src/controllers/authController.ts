import { Request, Response } from 'express';

// Пример данных пользователей (вместо базы данных)
const users = [
    { username: 'admin', password: 'password' },
    { username: 'user1', password: 'password' },
];

export const login = (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Если пользователь найден, сбрасываем счетчик неудачных попыток
        // @ts-ignore (sory for this)
        req.brute.reset(() => {
            res.status(200).json({ success: true, message: 'Login successful' });
        });
    } else {
        // Если пользователь не найден, увеличиваем счетчик неудачных попыток
        res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
};