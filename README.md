## Synopsis

Authorization is needed in most websites to control access to sensitive information.  AllowIf provides a light-weight, flexible Express.js middleware solution that controls access based on roles, activities, or both.

## Installation

```bash
$ npm install allowif
```

## Usage

In the Express configuration, specify the **can** and/or **isa** Authorities.  These should be functions that assign a list of valid authorization strings
to the `req` object (`req.allowif.can` or `req.allowif.isa`).  Usually the permissions are based on a user that has been authenticated.  For example, AllowIf works very well if added to the middleware stack after modules such as [Passport](https://www.npmjs.org/package/passport "Passport - NPM package").  See the [examples](http://github.com/jontanderson/allowyif "GitHub Repository for AllowIf") in GitHub.

**NOTE: You do not need to use both the can and isa Authorities.**

*Either can work independently or can be combined to handle more complex permission conditions*

```js
var allowIf = require('allowif')
var express = require('express')
var express-session = require('express-session')
var passport = require('passport')

app = express()
app.use(passport.initialize())
app.use(passport.session())

// using the can Authority
app.use(allowIf.canAuthority(function() {
  return function(req,res,next) {
    if (typeof req.user != 'undefined') {
      if (typeof req.allowif == 'undefined') req.allowif = {}
      Users.findById(req.user.id,function(err,user) {
        if (err) return next(err)
        req.allowif.can = user.can
      })
    }
    next()
  })
})

// using the isa Authority
app.use(allowIf.isaAuthority(function(req,res,next) {
  return function(req,res,next) {
    if (typeof req.user != 'undefined') {
      if (typeof req.allowif == 'undefined') req.allowif = {}
      Users.findById(req.user.id,function(err,user) {
        if (err) return next(err)
        req.allowif.isa = user.isa
      })
    }
    next()
  })
})
```

In specifying an Express route, use the following syntax:

```js
app.get("/users"
      , allowIf.isa("user")
      , UserController.list)

app.get("/users/edit/:userid"
      , allowIf.isa("administrator")
      , UserController.edit)

```

See the examples and test folders for more usage tips [here](http://github.com/jontanderson/allowif "GitHub Repository for AllowIf").

## Contributors

Feel free to contribute to the project through GitHub.

## License

This code is licensed through the MIT license agreement.  See **LICENSE** file for more information.
