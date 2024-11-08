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


// Triển khai morgan
app.use(morgan('combined'));

//Cho phép client truy cập vaog folder "public"
app.use(express.static(path.join(__dirname, 'public')));

// Triển khai handlebars
app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', './src/resources/views');

// Triển khai router
router(app);

// Triển khai express
app.listen(3000);
