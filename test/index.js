var request = require('supertest')
var express = require('express')
var allowIf = require('../')
var Lisa = {
      name : "Lisa",
      can : [ "view own account", "view other users"
              , "edit other users" ],
      isa : [ "worker", "manager" ]
    }
var Bob = {
      name : "Bob",
      can : [ "view own account" ],
      isa : [ "worker" ]
    }
var app

var LisaCan = function() {
  return function(req,res,next) {
    if (typeof req.allowif == 'undefined') req.allowif = {}
    req.allowif.can = Lisa.can
    next()
  }  
}

var BobCan = function() {
  return function(req,res,next) {
    if (typeof req.allowif == 'undefined') req.allowif = {}
    req.allowif.can = Bob.can
    next()
  }
}

var LisaIsa = function() {
  return function(req,res,next) {
    if (typeof req.allowif == 'undefined') req.allowif = {}
    req.allowif.isa = Lisa.isa
    next()
  }    
}

var BobIsa = function() {
  return function(req,res,next) {
    if (typeof req.allowif == 'undefined') req.allowif = {}
    req.allowif.isa = Bob.isa
    next()
  }    
}


describe("allowIf", function() {

  describe("GET /users with 'can' authorization", function(done) {
    beforeEach(function(done) {
      app = express()
      done()
    })
    it("allows access if can 'view other users'", function(done) {
      app.use(allowIf.canAuthority(LisaCan()))
      app.get('/users'
        , allowIf.can('view other users')
        , function(req, res) {
            res.send(200, 'access granted')
      }) // end app.get
      request(app)
      .get('/users')
      .expect(200)
      .end(function(err,res) {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
    })
    it("allows access if can both 'view other users' or 'administer users'", function(done) {
      app.use(allowIf.canAuthority(LisaCan()))
      app.get('/users'
        , allowIf.can(['administer users','view other users'])
        , function(req, res) {
            res.send(200, 'access granted')
      })
      request(app)
      .get('/users')
      .expect(200)
      .end(function(err,res) {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
    })
    it("does not allow access if cannot 'view other users'", function(done) {
      app.use(allowIf.canAuthority(BobCan()))
      app.get('/users'
        , allowIf.can('view other users')
        , function(req, res) {
            res.send(200, 'access granted')
      })
      request(app)
      .get('/users')
      .expect(401)
      .end(function(err,res) {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
    })
  })
  describe("GET /users with 'isa' authorization", function(done) {
    beforeEach(function(done) {
      app = express()
      done()
    })
    it("allows access if is a 'manager'", function(done) {
      app.use(allowIf.isaAuthority(LisaIsa()))
      app.get('/users'
        , allowIf.isa('manager')
        , function(req, res) {
            res.send(200,'access granted')
      })
      request(app)
      .get('/users')
      .expect(200)
      .end(function(err,res) {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
    })
    it("does not allow access if is not a 'manager'", function(done) {
      app.use(allowIf.isaAuthority(BobIsa()))
      app.get('/users'
        , allowIf.isa('manager')
        , function(req, res) {
            res.send(200,'access granted')
      })
      request(app)
      .get('/users')
      .expect(401)
      .end(function(err,res) {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
    })
  })
  describe("GET /users/edit/:id with 'can' authorization",function(done) {
    beforeEach(function(done) {
      app = express()
      done()
    })
    it("allows access if can 'view other users', " 
      + "and 'edit other users'", function(done) {
      app.use(allowIf.canAuthority(LisaCan()))
      app.get('/users/edit/:id'
        , allowIf.can('view other users')
        , allowIf.can('edit other users') 
        , function(req, res) {
            res.send(200, 'access granted')
      }) // end app.get
      request(app)
      .get('/users/edit/3')
      .expect(200)
      .end(function(err,res) {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
    })    
    it("does not allow access if cannot both 'view other users', "
      + "and 'edit other users'", function(done) {
      app.use(allowIf.canAuthority(BobCan()))
      app.get('/users/edit'
        , allowIf.can('view other users')
        , allowIf.can('edit other users') 
        , function(req, res) {
            res.send(200, 'access granted')
      }) // end app.get
      request(app)
      .get('/users/edit')
      .expect(401)
      .end(function(err,res) {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
    })    
  })
  describe("GET /users/edit/:id with 'isa' authorization",function(done) {
    beforeEach(function(done) {
      app = express()
      done()
    })
    it("allows access if is a 'manager', " 
      + "and 'worker'", function(done) {
      app.use(allowIf.isaAuthority(LisaIsa()))
      app.get('/users/edit'
        , allowIf.isa('manager')
        , allowIf.isa('worker') 
        , function(req, res) {
            res.send(200, 'access granted')
      }) // end app.get
      request(app)
      .get('/users/edit')
      .expect(200)
      .end(function(err,res) {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
    })    
    it("does not allow access if is not both a 'manager', "
      + "and 'worker'", function(done) {
      app.use(allowIf.isaAuthority(BobIsa()))
      app.get('/users/edit'
        , allowIf.isa('manager')
        , allowIf.isa('worker') 
        , function(req, res) {
            res.send(200, 'access granted')
      }) // end app.get
      request(app)
      .get('/users/edit')
      .expect(401)
      .end(function(err,res) {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
    })    
  })

  describe("GET /users/delete/:id "
    + "with 'isa' and 'can' authorization",function(done) {
    beforeEach(function(done) {
      app = express()
      done()
    })
    it("allows access if is a 'manager', "
      + "and can 'delete user account'", function(done) {
      app.use(allowIf.isaAuthority(LisaIsa()))
      app.use(allowIf.canAuthority(LisaCan()))
      app.get('/users/delete/:id'
        , allowIf.isa('manager')
        , allowIf.can('delete user account') 
        , function(req, res) {
            res.send(200, 'access granted')
      }) // end app.get
      request(app)
      .get('/users/delete/3')
      .expect(200)
      .end(function(err,res) {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
    })    
  })

})