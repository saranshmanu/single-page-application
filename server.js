const express = require('express');
const morgan = require('morgan');
const build = require('./app/build');

const app = express();
const port = 3000;

// Set public folder as root
app.use(express.static('public'));

// Configure Logger
app.use(morgan('tiny'));

// Provide access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Redirect all traffic to index.html
app.use((_, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => {
  build();
  console.log('listening on %d', port);
});
