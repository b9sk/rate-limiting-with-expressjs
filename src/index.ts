
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/login', (req, res) => {
    // Handle login logic here
    res.send('Login endpoint');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

console.log('hello world');
