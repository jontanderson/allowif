var express = require('express')
var ejsengine = require('ejs-locals')
var path = require('path')
var favicon = require('static-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require ('express-session')
var passport = require('passport')
var MainController = require('./controllers/maincontroller.js')
var UserController = require('./controllers/usercontroller.js')
var allowIf = require('../')
var Users = require('./models/usermodel.js')
var app = express()

// view engine setup
app.engine('ejs', ejsengine)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(favicon())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cookieParser())
app.use(session({ secret: "allowif example", cookie: { maxAge: 3600000 } }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/',MainController.router)
app.use('/users',UserController.router)

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        if (err.status == 401) {
            res.render('401', { title: "Access Denied", url: req.originalUrl })
        } else {
            res.status(err.status || 500)
            res.render('error', {
                message: err.message,
                error: err
            })
        }
    })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    if (err.status == 401) {
        res.render('401', { url: req.originalUrl })
    } else {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: {}
        })
    }
})


module.exports = app
