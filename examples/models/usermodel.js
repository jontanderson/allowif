var Users = function(source) { 

  var users = source

  this.findById = function(id, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
      if (users[i].id == id) {
        return fn(null, users[i]);
      }
    }
    err = new Error("Couldn't find user matching id = " + id)
    err.status = 500
    return fn(err, null);
  }

  this.findByUsername = function(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
      if (users[i].username === username) {
        return fn(null, users[i]);
      }
    }
    err = new Error("Couldn't find user matching username = " + username)
    err.status = 500
    return fn(500, null);
  }

  this.findAll = function(fn) {
    return fn(null,users)
  }

  this.editUser = function(editeduser, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
      if (users[i].id == id) {
        users[i] = editeduser
        return fn(null,true)
      }
    }
    err = new Error("Couldn't update the user with id = " + editeduser.id)
    err.status = 500
    return fn(err,false)
  }

  this.deleteUser = function(deleteduser, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
      if (users[i].id == id) {
        index = i
      }
      i++
    }
    if (index != null) {
      users.splice(index)
      return fn(null,index)
    } else {
      err = new Error("Couldn't delete the user with id = " + deleteduser.id)
      err.status = 500
      return fn(err,null)
    }
  }

}

module.exports = new Users(require("./userdata.js"))