const adminController = require ('./admin');
const doctorController = require ('./doctor');
const siteController = require ('./site');
const MadminController = require ('./madmin');
const orderController = require ('./order');
const adminAuthen = require('../app/middlewares/admin')


function route(app) {
    app.use('/admin',adminAuthen, adminController);
    app.use('/doctor', doctorController);
    app.use('/madmin', MadminController),
    app.use('/order', orderController);
    app.use('/', siteController);
}

module.exports = route;
