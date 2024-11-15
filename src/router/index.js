const siteController = require ('./site');
const orderController = require ('./order');


function route(app) {
    app.use('/order', orderController);
    app.use('/', siteController);
}

module.exports = route;
