var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var expressMongoDb = require('express-mongo-db');
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var db = require('./db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var libraryRouter = require("./routes/library");
var apiRouter = require("./routes/api");

var app = express();

// Use mongodb middleware
// app.use(expressMongoDb('mongodb://localhost:27017/irimee'));
// req.db has the Db object
// db.connect('mongodb://localhost:27017/irimee', function(err){
//   if (err) 
//   {
//     console.log('Unable to connect to Mongo.')
//     process.exit(1)
//   } 
//   else 
//   {
//     console.log("connected to mongodb server");
//   }
// })

db.getDatabaseHandle(function(database){
  console.log("Connected to database");
});




// Use sessions
app.use(session({
  secret: "my irimee mongo where i am not using Mongoose.!!",
  store: new MongoStore({
    url: "mongodb://localhost:27017/irimee"
  }),
  resave: true,
  saveUninitialized: false
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/library", libraryRouter);
app.use("/api", apiRouter);

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
  res.render('error');
});

module.exports = app;
