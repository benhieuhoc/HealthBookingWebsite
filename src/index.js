// Khai báo express
const express = require('express');
const app = express();
// Khai báo morgan
const morgan = require('morgan');
// Khai báo handlebars
const handlebars = require ('express-handlebars');
// Khai báo router điều hướng
const router = require ('./router/index');
// Khai báo path
const path = require('path');
// Khai báo db
const db = require ('./config/db');

//Kết nối db
db.connect();
// Triển khai morgan
app.use(morgan('combined'));

//Cho phép client truy cập vaog folder "public"
app.use(express.static(path.join(__dirname, 'public')));

// Triển khai handlebars
app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', './src/resources/views');

// Triển khai middleware để phân tích dưc liệu URL-encoded
app.use(express.urlencoded({ extended: true }));

// Triển khai router
router(app);

// Triển khai express
app.listen(3000);
