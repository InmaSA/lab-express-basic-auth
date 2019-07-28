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


// login

router.get("/login", (req, res, next) => res.render("login"))

router.post("/login", (req, res, next) => {

  const { user, password } = req.body

  if (user === "" || password === "") {
    res.render("login", { errorMessage: "Rellena todo." });
    return;
  }

  User.findOne({ user })
  .then(us => {
    if (!us) {
      res.render("login", { errorMessage: "El usuario no existe." })
      return
    }
    if (bcrypt.compareSync(password, us.password)) { // compara la password que ha metido con la que existe hasheada en la DB
      req.session.currentUser = us    // Guarda el usuario en la sesión actual
      res.redirect("/") 


    } else {
      res.render("login", { errorMessage: "Contraseña incorrecta" })
    }
    })
  .catch(error => next(error))

})

// Cerrar sesión
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => res.redirect("/login"))
})

// Middleware personalizado para identificar usuarios logueados
// Todas las rutas inferiores serán privadas
router.use((req, res, next) => {
  req.session.currentUser ? next() : res.render("login", { errorMessage: "Inicia sesión para acceder al area privada" });
})

router.get("/private", (req, res, next) => res.render("private"))




module.exports = router;