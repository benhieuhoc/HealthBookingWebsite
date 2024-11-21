const siteController = require ('./site');
const orderController = require ('./order');
const adminController = require ('./admin');
const adminAuthen = require('../app/middlewares/admin')


function route(app) {
    app.use('/order', orderController);
    app.use('/admin',adminAuthen, adminController);
    app.use('/', siteController);
}

module.exports = route;
