var UserController = function() {

  var express = require('express')
  var allowIf = require('../../')
  var Users = require("../models/usermodel.js")
  var passport = require('passport')
  var LocalStrategy = require('passport-local').Strategy

  // passport setup
  // passport session serializing.
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    Users.findById(id, function (err, user) {
      done(err, user)
    })
  })

  // using the local strategy within passport.
  passport.use(new LocalStrategy(function(username, password, done) {
    Users.findByUsername(username, function(err, user) {
      if (err) return done(err)
      if (!user) return done(null, false, { message: 'Unknown user ' + username })
      if (user.password === password) {
        return done(null,user)
      } else {
        return done(null,false, { message: 'Invalid password'})
      }
    })
  }))

  // Simple route middleware to ensure user is authenticated.
  this.ensureAuthenticated = function() {
    return function(req, res, next) {
      if (req.isAuthenticated()) return next()
      res.redirect('/login')
    }
  }

  this.authorization = function() {
    return function(req,res,next) {
      if (typeof req.user != 'undefined') {
        if (typeof req.allowif == 'undefined') req.allowif = {}
        Users.findById(req.user.id,function(err,user) {
          if (err) return next(err)
          req.allowif.can = user.can
        })
      }
      next()
    }
  }

  this.redirectToMyAccount = function() {
    return function(req,res,next) {
      if (typeof req.params.id != 'undefined' && typeof req.user != 'undefined') {
        if (req.user.id == req.params.id) {
          console.log("redirecting to /users/myaccount")
          return res.redirect("/users/myaccount")
        } else {
          console.log("allowing to pass through for /users/:id")
          next()
        }
      } else {
        next(err)
      }
    }
  }

  this.redirectToEditMyAccount = function() {
    return function(req,res,next) {
      if (typeof req.params.id != 'undefined' && typeof req.user != 'undefined') {
        if (req.user.id == req.params.id) {
          console.log("redirecting to /users/edit/myaccount")
          return res.redirect("/users/edit/myaccount")
        } else {
          console.log("allowing to pass through for /users/edit/:id")
          next()
        }
      } else {
        next(err)
      }
    }
  }

  // Routing for /users/* 
  this.router = express.Router()
  this.router.use(this.ensureAuthenticated())
  this.router.use(allowIf.canAuthority(this.authorization()))

  /* GET users listing. */
  this.router.get("/", allowIf.can("view other users"),function(req, res) {
    var response = res
    var curuser = req.user
    Users.findAll(function(err,users) {
      response.render("users/index.ejs", { curuser: curuser, users: users, title: "List of Users" })
    })
  })

  this.router.get("/myaccount", allowIf.can("view own account"),function(req,res) {
    res.render("users/user.ejs", { curuser: curuser, user: curuser, title: "View My Account" })    
  })

  this.router.get("/edit/myaccount", allowIf.can("edit own account"),function(req, res) {
    var curuser = req.user
    res.render("users/edit.ejs", { user: curuser, title: 'Edit my account' })
  })

  /* GET users/:id for specific user. */
  this.router.get("/:id", this.redirectToMyAccount(), allowIf.can("view other users"), function(req,res) {
    var response = res
    var curuser = req.user
    console.log("Within /users/" + req.params.id)
    Users.findById(req.params.id,function(err,user) {
      if (err) return next(err)
      response.render("users/user.ejs", { curuser: curuser, user: user, title: "View User" })
    })
  })

  /* GET users/edit/:id for specific user. */
  this.router.get("/edit/:id", this.redirectToEditMyAccount(),allowIf.can("edit other users"), function(req,res) {
    var response = res
    var curuser = req.user
    Users.findById(req.params.id,function(err,user) {
      if (err) return next(err)
      response.render("users/edit.ejs", { curuser: curuser, user: user, title: "Edit User" })
    })
  })

  this.router.post("/edit", allowIf.can("edit other users"), function(req,res) {
    var editeduser = {
      id : req.body.id,
      username : req.body.username,
      password : req.body.password,
      firstname : req.body.firstname,
      lastname : req.body.lastname
    }
    Users.editUser(editeduser,function(err,updated) {
      if (err) return next(err)
      if (updated) {
        return res.redirect("/users/" + editeduser.id)
      } else {
        err = new Error("Couldn't update the user.")
        err.status = 500
        next(err)
      }
    })
  })

}

module.exports = new UserController()
