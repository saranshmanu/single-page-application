const router = new Router({
  mode: 'history',
  page404: (path) => {
    const html = `Cannot GET ${path}`;
    el.html(html);
  }
});

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
});

window.addEventListener('load', () => {
  const el = $('#app');
  const productTemplate = Handlebars.compile($('#product-template').html());
  const shopTemplate = Handlebars.compile($('#shop-template').html());

  Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for (var i = 0; i < n; ++i) accum += block.fn(i);
    return accum;
  });

  Handlebars.registerHelper('ifEquals', function(a, b, options) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  router.add('/product', async () => {
    try {
      const product = await api.get('/product' + window.location.search);
      let html = productTemplate(product.data);
      el.html(html);
    } catch(err) {
      console.error(err);
    }
  });

  router.add('/', async () => {
    let html = shopTemplate();
    el.html(html);
    try {
      const products = await api.get('/products');
      let html = shopTemplate({products: products.data});
      el.html(html);
    } catch(err) {
      console.error(err);
    }
  });

  router.navigateTo(window.location.pathname + window.location.search);

  function navigate(event) {
    event.preventDefault();
    const target = $(event.target);
    const href = target.attr('href');
    const path = href.substr(href.lastIndexOf('/'));
    router.navigateTo(path);
  }

  $('button').on('click', (event) => {
    navigate(event);
  });
});
