const express = require('express');
const morgan = require('morgan');
const build = require('./app/build');
const products = require('./app/data/products.json');

const app = express();
const port = 3000;

// Configure Logger
app.use(morgan('tiny'));

// Set public folder as root
app.use(express.static('public'));

app.get('/api/products', function(req, res) {
  res.send(products);
});

app.get('/api/product', function(req, res) {
  const uuid = req.query.id;
  var response = {};
  products.map((product) => {
    if (product.id.toString() === uuid) {
      response = product;
    }
  });
  res.send(response);
});

// Provide access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Redirect all traffic to index.html
app.use((_, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(port, () => {
  build();
  console.log('listening on %d', port);
});
