const express = require('express');
const morgan = require('morgan');
const build = require('./app/build');
const products = require('./app/data/products.json');
const categories = require('./app/data/categories.json');

const app = express();
const port = 3000;

// Configure Logger
app.use(morgan('tiny'));

// Set public folder as root
app.use(express.static('public'));

app.get('/api/products', function(req, res) {
  if(!req.query.filter) return res.send(products);
  const filters = req.query.filter.toString().split(',');
  const filteredProducts = products.filter((product) => {
    return filters.some(filter => product.filter.includes(filter));
  });
  res.send(filteredProducts);
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

app.get('/api/categories', function(req, res) {
  res.send(categories);
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
