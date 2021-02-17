const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const config = require('./config');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const cors = require('cors');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// middlewares
app.use(cors({
    origin: '*',
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const url = config.mongoURI;
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// connect to the database
connect.then(() => {
  console.log('Connected to database: GridApp');
}, (err) => console.log(err));

/* 
    GridFs Configuration
*/
const storage = new GridFsStorage({
    url: config.mongoURI,
    file: (req, file) => {
            const fileInfo = {
                filename: file.originalname,
                bucketName: 'uploads'
            };
        return fileInfo;
    }
});
const upload = multer({ storage });

// Express Router
const docRouter = require('./routes/docRouter');
app.use('/', docRouter(upload));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{
      status: err.status,
      stack: err.stack,
      message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log('Listening on Port: '+PORT);
})
