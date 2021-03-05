'use strict';

(function () {
    function init() {
        var router = new Router([
            new Route('shop', 'shop.html', true),            
            new Route('product', 'product.html')
        ]);
    }
    init();
}());
