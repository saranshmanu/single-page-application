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

  router.add('/product', async () => {
    let html = productTemplate();
    el.html(html);
  });

  router.add('/', async () => {
    let html = shopTemplate();
    el.html(html);
  });

  router.navigateTo(window.location.pathname);

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
