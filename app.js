const express = require('express');
const app = express();

const PORT = process.env.port || 8081;

app.use(require('connect-history-api-fallback')());
app.use('/static', express.static('dist/static'));

app.get('/*', (req, res) => {
  return res.sendFile(`${__dirname}/dist/index.html`);
});

app.listen(PORT);

console.log(`server on! port: ${PORT}`);
