module.exports = [
  { "id": 1, 
    "firstname": "Norm", 
    "lastname": "Normal", 
    "username": "nnormal",
    "password": "psswd1", 
    "can": [ "view own account", "edit own account",
           "view other users" ]
  },
  { "id": 2,
    "firstname": "Bob",
    "lastname": "Theboss",
    "username": "btheboss",
    "password": "psswd2",
    "can": [ "view own account", "edit own account",
           "view other users", "edit other users" ]
  }
]