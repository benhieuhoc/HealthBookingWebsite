const siteController = require ('./site');

function route(app) {
    app.use('/', siteController);
}

module.exports = route;
