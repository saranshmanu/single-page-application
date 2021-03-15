const router = new Router({
  mode: 'history',
  page404: (path) => {
    const html = `Cannot GET ${path}`;
    $('#app').html(html);
  }
});

window.addEventListener('load', () => {
  const productTemplate = Handlebars.compile($('#product-template').html());
  const shopTemplate = Handlebars.compile($('#shop-template').html());
  const productCardTemplate = Handlebars.compile($('#product-card-template').html());

  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000
  });

  router.add('/product', async () => {
    try {
      const product = await api.get('/product' + window.location.search);
      let html = productTemplate(product.data);
      $('#app').html(html);
    } catch (err) {
      console.error(err);
    }
  });

  router.add('/', async () => {
    let html = shopTemplate();
    $('#app').html(html);
    try {
      const products = await api.get('/products');
      const categories = await api.get('/categories');
      $('#app').html(shopTemplate({ categories: categories.data }));
      $('#product-list').html(productCardTemplate({ products: products.data }));
      $('input:checkbox').on('click', async function() {
        const checked = $('.form-check-input:checkbox:checked')
          .map(function() {
            return this.value;
          })
          .get();
        var query = '?filter=';
        checked.map((filter) => {
          query += `${filter},`;
        });
        const filteredProducts = await api.get('/products' + query.slice(0, -1) );
        $('#product-list').html(productCardTemplate({ products: filteredProducts.data }));
      });
    } catch (err) {
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
