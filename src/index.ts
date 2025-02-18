import express from 'express';
import { UserService } from './services/UserService';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

app.set('trust proxy', (ip: string) => {
    if (ip === '127.0.0.1' || ip === '::1') return true // Localhost
    if (ip.startsWith('172.') || ip.startsWith('10.') || ip.startsWith('192.168.')) {
        return true // Trust Docker networks
    }
    return false
})

// Check if the server is running
app.get('/login', (req, res) => {
    res.send('200');
});

// Handles login
app.post('/login', (req, res) => {

    const {
        body,
        headers,
    } = req;

    const { username, password } = body;

    // validate username and password are not empty
    if (!username || !password) {
        res.status(400).send({
            error: 'Missing username or password'
        });
    }

    // const user = new UserService
    const ip = req.ip // for debuging

    res.send({
        body, headers, ip
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

