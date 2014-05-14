var MainController = function() {

  var express = require('express')
  var Users = require('../models/usermodel.js')
  var passport = require('passport')

  this.router = express.Router()

  /* GET home page. */
  this.router.get('/', function(req, res) {
    curuser = null
    if (req.isAuthenticated()) curuser = req.user
    res.render('index', { title: 'AllowIf Example', curuser: curuser })
  })

  this.router.get("/login", function(req,res) {
    curuser = null
    if (req.isAuthenticated()) curuser = req.user
    res.render("login.ejs", { title: 'Login', curuser: curuser })
  })

  this.router.post("/login", function(req,res,next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err)
      if (!user) {
        req.session.messages =  [info.message]
        return res.redirect('/login')
      }
      req.logIn(user, function(err) {
        if (err) return next(err)
        return res.redirect('/')
      })
    })(req, res, next)
  })

  this.router.get("/logout",function(req,res) {
    req.logout()
    res.redirect('/')
  })
}

module.exports = new MainController()
