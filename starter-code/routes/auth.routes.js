const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const User = require('../models/user.model')






// Registro 
router.get("/signup", (req, res, next) => res.render("signup"))

router.post("/signup", (req, res, next) => {

   const { user, password } = req.body

  // Validaciones: campos vacíos
  if (user === "" || password === "") {
    res.render("signup", { errorMessage: "Rellena todo" })
    return  // En caso de no pasar la validación, abandona la función sin crear el usuario ni el hash
  }


  // Validaciones: usuario duplicado
  User.findOne({ user })
    .then(us => {
      console.log(us)
      if (us) {
        res.render("signup", { errorMessage: "El usuario ya existe, elige otro" });
        return;
      } else {
        newUser()
      }
    })
    .catch(err => console.log('ERRORR:', err))

    function newUser() {
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({ user, password: hashPass })
        .then(() => res.redirect('/'))
        .catch(err => console.log('ERRORR:', err))

    }
})

module.exports = router;