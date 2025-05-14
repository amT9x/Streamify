import express from 'express';
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

app.get('/api/auth/singup', (req, res) => {
    res.send('Sign Up!');
})

app.get('/api/auth/login', (req, res) => {
    res.send('Login!');
})

app.get('/api/auth/logout', (req, res) => {
    res.send('Log Out!');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});