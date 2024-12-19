var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const uid2 = require('uid2');
const User = require('../models/users')

/* Création de la route pour Login-up */
router.post('/signup', (req, res) =>{
  if ( !req.body.email || !req.body.password){
    res.json({ result: false, message: 'Not complette infos'})
  }

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
  User.findOne({ email: req.body.email }).then(user => {
    // Vérifie si l'utilisateur existe et si le mot de passe est correct
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      // Renvoie toutes les informations de l'utilisateur connecté
      res.json({
          result: true,
          token: user.token,
          email: user.email,
          civility: user.civility,
          name: user.name,
          firstname: user.firstname,
          address: user.address,
          city: user.city,
          zip: user.zip,
          phone: user.phone,
          type: user.type,
          children: user.children,
          _id : user._id
      });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  }).catch(err => {
    res.status(500).json({ result: false, error: err.message });
  });
});


// création de la route pour ajouté des données utilisateur ( a utilisé pour les screens coordonnée et ma famille)
 router.post('/addData',(req,res)=>{
   // condition qui verifie que tout les champs sont bien remplit
  if ( !req.body.name || !req.body.firstname || !req.body.address || !req.body.city || !req.body.zip || !req.body.phone || !req.body.token ){
    res.json({ result: false, message: 'Not complette infos'})
  }else{
      // On ajoute des informations grace au token de l utilisateur
      User.findOneAndUpdate(
        { token: req.body.token },
        {
          $set: {
            civility: req.body.civility,
            name: req.body.name,
            firstname: req.body.firstname,
            address: req.body.address,
            city: req.body.city,
            zip: req.body.zip,
            phone: req.body.phone,
            type: req.body.type,
          },
        },
        { new: true } // Renvoie l'utilisateur mis à jour
      )
        .then((dataUser) => {
          if (dataUser) {
            res.json({ result: true, dataBdd: dataUser });
          } else {
            res.json({ result: false, message: 'User not found' });
          }
        })
        .catch((error) => {
          res.status(500).json({ result: false, message: 'Update error', error });
        });
  }
 })
 //creation de la route pour ajouté un enfant

 router.post('/addChild', (req,res)=>{
 
  // condition qui verifie que tout les champs sont bien remplit
  if (!req.body.firstnamechild || !req.body.namechild || !req.body.birthdate || !req.body.token){
   res.json({ result: false, message: 'Not complette infos'})
  }else{
    User.updateOne({ token : req.body.token},
      {  // $push operateur mongoose pour push un nouveau enfant dans le tableau du sous document
         $push: { children: { firstnamechild: req.body.firstnamechild, namechild: req.body.namechild, birthdate: req.body.birthdate } }, 
         type: req.body.type 
      },
    )
    .then(() => {
      User.findOne({ token : req.body.token}).then(data=>{
        console.log('route addChild', data.token )
        res.json({ result: true, message: 'Enfant ajouté avec succès', donnee : data});
      })
    }) 
    .catch(err => {
      res.status(500).json({ result: false, error: err.message });
    });
  }
 })


 //creation d une route get pour recuperer toutes les informations utilisateur a sa reconnexion
 router.get('/getUser', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.json({ result: false, message: 'Token is required' });
  }
  User.findOne({ token })
    .then((dataUser) => {
      if (dataUser) {
        res.json({ result: true, dataBdd: dataUser });
      } else {
        res.json({ result: false, message: 'User not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ result: false, message: 'Error retrieving user', error });
    });
}); 


router.get('/children', (req, res) => {
  const userId = req.query.userId; 

  console.log('Requête reçue pour l\'ID utilisateur:', userId);

  User.findById(userId).select('children').then(user => {
    if (!user) {
      console.error('Utilisateur non trouvé pour l\'ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('Données des enfants récupérées depuis la base de données:', user.children);

    if (Array.isArray(user.children)) {
      res.json(user.children); // Renvoie uniquement les enfants de l'utilisateur connecté
    } else {
      console.error('Les données des enfants ne sont pas un tableau:', user.children);
      res.status(500).json({ error: 'Les données des enfants ne sont pas au bon format' });
    }
  }).catch(error => {
    console.error('Erreur lors de la récupération des enfants:', error);
    res.status(500).json({ error: 'An error occurred while retrieving children.' });
  });
});


// Route pour récupérer les informations utilisateur par ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    })
    .catch(error => {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'An error occurred while fetching user data.' });
    });
});


router.put('/updateProfile/:id', (req, res) => {
  // Récupère l'ID de l'utilisateur depuis les paramètres de l'URL
  const userId = req.params.id;

  // Récupère les données envoyées dans le corps de la requête pour mettre à jour le profil de l'utilisateur
  const { password, children, address, city, civility, firstname, name, phone, zip, type } = req.body;

  // Crée un objet qui contiendra les champs à mettre à jour
  let updateFields = {};

  // Si un mot de passe est fourni dans la requête, on le hache avant de l'ajouter aux champs à mettre à jour
  if (password) {
    const bcrypt = require('bcrypt');  // On importe bcrypt pour le hachage du mot de passe
    updateFields.password = bcrypt.hashSync(password, 10);  // Hachage du mot de passe avec un salage de 10 tours
  }

  // Si d'autres informations sont envoyées, on les ajoute dans l'objet updateFields
  if (address) updateFields.address = address;
  if (city) updateFields.city = city;
  if (civility) updateFields.civility = civility;
  if (firstname) updateFields.firstname = firstname;
  if (name) updateFields.name = name;
  if (phone) updateFields.phone = phone;
  if (zip) updateFields.zip = zip;
  if (type) updateFields.type = type;

  // Si des enfants sont envoyés dans la requête, on les ajoute également dans updateFields
  if (children) {
    updateFields.children = children;  // On met à jour directement la liste des enfants
  }

  // Si aucun champ à mettre à jour n'a été envoyé, on renvoie une erreur
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ result: false, message: 'No data provided to update' });
  }

  // On effectue la mise à jour dans la base de données avec les champs spécifiés
  User.findByIdAndUpdate(userId, updateFields, { new: true })
    .then((updatedUser) => {
      // Si l'utilisateur n'est pas trouvé, on renvoie une erreur
      if (!updatedUser) {
        return res.status(404).json({ result: false, message: 'User not found' });
      }
      // Si l'utilisateur est trouvé et mis à jour, on renvoie l'utilisateur mis à jour
      res.json({ result: true, updatedUser });
    })
    .catch((error) => {
      // En cas d'erreur lors de la mise à jour, on renvoie une erreur 500
      res.status(500).json({ result: false, message: 'Update error', error });
    });
});


// Route pour supprimer un enfant
router.put('/removeChild/:userId', (req, res) => {
  const userId = req.params.userId;
  const childId = req.body.childId;  // Récupère l'ID de l'enfant à supprimer

  // Utilise l'opérateur $pull pour supprimer l'enfant du tableau "children"
  User.findByIdAndUpdate(
    userId,
    { $pull: { children: { _id: childId } } },  // Recherche de l'enfant par son _id et suppression
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ result: false, message: 'User not found' });
      }
      res.json({ result: true, updatedUser });
    })
    .catch((error) => {
      res.status(500).json({ result: false, message: 'Update error', error });
    });
});


// Route pour ajouter un enfant
router.put('/addChild/:userId', (req, res) => {
  const userId = req.params.userId;
  const newChild = req.body.newChild;  // L'enfant à ajouter (doit être un objet avec les propriétés du modèle)

  // Utilisation de $push pour ajouter l'enfant au tableau
  User.findByIdAndUpdate(
    userId,
    { $push: { children: newChild } },  // Ajoute l'enfant au tableau "children"
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ result: false, message: 'User not found' });
      }
      res.json({ result: true, updatedUser });
    })
    .catch((error) => {
      res.status(500).json({ result: false, message: 'Update error', error });
    });
});




module.exports = router;
