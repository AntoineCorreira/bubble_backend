var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const uid2 = require('uid2');
const User = require('../models/users')

/* Création de la route pour Login-up */
router.post('/signup', (req, res) =>{

  // verifie si un utilisateur n a pas deja été enregistrer
  User.findOne({ email : req.body.email }).then(data => {
    if (data) {
      return res.json({ result: false, message: 'Email already exists' });
    }
    if(data === null){
      //creation de la constante pour le hashage du mot de passe avec le module bcrypt
      const hash = bcrypt.hashSync(req.body.password, 10);
 // creation du nouveau utilisateur 
      const newUser = new User({
        email : req.body.email,
        password : hash,
        token : uid2(32),
      });
    //sauvegarde de l utilisateur dans la base de donnée 
    newUser.save().then(newUser=>{
      res.json({ result: true, token: newUser.token})
    })
    }
  })
})

//création de la route pour ce connecter
router.post('/signin', (req, res) => {

  User.findOne({ email: req.body.email }).then(data => {
    // bcrypt compare le mot de passe haché avec celui recu et si c est bon, il envoie le token.
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});


// création de la route pour ajouté des données utilisateur ( a utilisé pour les screens coordonnée et ma famille)
 router.post('/addData',(req,res)=>{
  // On recherche un utilisateur grace au token
  User.updateOne({ token : req.body.token},
    { //$set opérateur mongoose remplace la valeur d'un champ par la valeur spécifiée.
      $set :{
        civility: req.body.civility,
        name: req.body.name,
        firstname: req.body.firstname,
        address: req.body.address,
        city: req.body.city,
        zip: req.body.zip,
        phone: req.body.phone,
        type: req.body.type,
      }
    }
  )
  // utilisation d un findOne pour afficher toutes les données utilisateur si token existe.
  .then(()=>{
    User.findOne({token : req.body.token})
    .then(dataUser=>{
      if(dataUser){
        res.json({ result: true, dataBdd : dataUser })
      }else{
        res.json({ result: false, message : 'token no exists' })
      }
    })
 })
 })


module.exports = router;
