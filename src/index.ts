import express from 'express';
import { UserService } from './services/UserService';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Check if the server is running
app.get('/login', (req, res) => {
    res.send('200');
});

// Handles login
app.post('/login', (req, res) => {
    const user = new UserService
    res.send(req.body);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

console.log('hello world');
