var AllowIf = function() {
  
  this.canAuthority = function(authorization) {
    return authorization
  }

  this.isaAuthority = function(authorization) {
    return authorization
  }

  this.can = function(actions) {
    return function(req,res,next) {
      _allowed = false
      if (typeof req.allowif.can != 'undefined') {
        if (!Array.isArray(actions)) {
          actions = [ actions ]
        }
        // OR operations; break if one of the actions matches
        // can authorization list
        i = 0
        while (i < actions.length && !_allowed) {
          if (req.allowif.can.indexOf(actions[i]) != -1) {
            _allowed = true
          }           
          i++
        }
      }
      if (_allowed) {
        next()
      } else {
        err = new Error("Unauthorized")
        err.status = 401 // 401 is the http status code for Unauthorized
        next(err)
      }
    }
  }

  this.isa = function(roles) {
    return function(req,res,next) {
      _allowed = false
      if (typeof req.allowif.isa != 'undefined') {
        if (!Array.isArray(roles)) {
          roles = [ roles ]
        }
        // OR operations; break if one of the roles matches
        // isa authorization list
        i = 0
        while (i < roles.length && !_allowed) {
          if (req.allowif.isa.indexOf(roles[i]) != -1) {
            _allowed = true
          }           
          i++
        }
      }
      if (_allowed) {
        next()
      } else {
        err = new Error("Unauthorized")
        err.status = 401 // 401 is the http status code for Unauthorized
        next(err)
      }
    }
  }
}

module.exports = new AllowIf()