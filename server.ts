import express from 'express';
import loginRouter from './src/route/loginRoute';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.type('html').send(`<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Simple Login</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 3rem; }
        form { max-width: 320px; display: grid; gap: 0.75rem; }
        input { padding: 0.6rem; }
        button { padding: 0.7rem; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>Simple Login</h1>
      <form action="/login" method="post">
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </body>
  </html>`);
});

app.use('/', loginRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
