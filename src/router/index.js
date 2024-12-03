const adminController = require ('./account/admin');
const departmentController = require ('./department');
const doctorController = require ('./account/doctor');
const MadminController = require ('./account/madmin');
const orderController = require ('./order');
const patientController = require('./account/patient');
const positionController = require ('./position');
const siteController = require ('./site');


function route(app) {
    app.use('/admin', adminController);
    app.use('/department', departmentController);
    app.use('/doctor', doctorController);
    app.use('/madmin', MadminController),
    app.use('/order', orderController);
    app.use('/patient',patientController);
    app.use('/position', positionController);
    app.use('/', siteController);
}

module.exports = route;
