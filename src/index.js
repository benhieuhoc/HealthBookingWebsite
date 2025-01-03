// Khai báo express
const express = require('express');
const app = express();
// Khai báo body-parser
const bodyParser = require('body-parser');
// Khai báo cors
const cors = require('cors');
// Khai báo morgan
const morgan = require('morgan');
// Khai báo router điều hướng
const router = require ('./router/index');
// Khai báo path
const path = require('path');
// Khai báo db
const db = require ('./config/db');
// Khai báo connect-mongo để hỗ trợ khai báo db cho session
const ConnectMongo = require ('connect-mongo');
const { mongo } = require('mongoose');

// Tạo chức năng tự động xóa lịch khám
const moment = require('moment');
const Doctor = require('./app/models/Doctor')

//Kết nối db
db.connect();
// Triển khai morgan
app.use(morgan('combined'));

//Cho phép client truy cập vaog folder "public"
app.use(express.static(path.join(__dirname, 'public')));

// cài đặt cors
const allowedOrigins = [
    'https://khambenh.webkhactu.top/',
    'http://localhost:3000', // Local development
    'https://frontend-react-kham-benh.vercel.app', // Production
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.options('*', cors());

// Config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Triển khai middleware 
app.use(express.urlencoded({ extended: true }));
// app.use(AuthenticatedMiddleware);

// Triển khai router
router(app);

setInterval(async () => {
    try {
        const doctors = await Doctor.find();
  
        for (const doctor of doctors) {
            doctor.thoiGianKham = doctor.thoiGianKham.filter(slot => moment(slot.date).isSameOrAfter(moment(), 'day'));
            await doctor.save();
        }
        console.log('Đã tự động xóa các lịch trình cũ thành công!');
    } catch (error) {
        console.error('Có lỗi xảy ra khi xóa lịch trình cũ:', error);
    }
  }, 1000 * 60 * 60); // 1 giờ

// Triển khai express
app.listen(3001);
