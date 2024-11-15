// Khai báo express
const express = require('express');
const app = express();
// Khai báo morgan
const morgan = require('morgan');
// Khai báo handlebars
const handlebars = require ('express-handlebars');
// Khai báo express-session
const session = require ('express-session')
// Khai báo router điều hướng
const router = require ('./router/index');
// Khai báo path
const path = require('path');
// Khai báo db
const db = require ('./config/db');
// Khai báo connect-mongo để hỗ trợ khai báo db cho session
const ConnectMongo = require ('connect-mongo');
const { mongo } = require('mongoose');
// khai báo middleware
const AuthenticatedMiddleware = require('./app/middlewares/AuthenticatedMiddleware')

//Kết nối db
db.connect();
// Triển khai morgan
app.use(morgan('combined'));

//Cho phép client truy cập vaog folder "public"
app.use(express.static(path.join(__dirname, 'public')));

// Triển khai handlebars
app.engine(
    '.hbs', 
    handlebars.engine({
        extname: '.hbs',
        helpers: require ('./app/middlewares/HelperHandlebar'),
    }),
);
app.set('view engine', 'hbs');
app.set('views', './src/resources/views');

// Khởi tạo express-session
app.use(session({
    secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: ConnectMongo.create({mongoUrl: 'mongodb://localhost:27017/HealthBookingWebsite_dev'})
}));

// Triển khai middleware 
app.use(express.urlencoded({ extended: true }));
app.use(AuthenticatedMiddleware);

// Triển khai router
router(app);

// Triển khai express
app.listen(3000);
