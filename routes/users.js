const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');
// const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Grocery = require('../models/grocery');

////////////////////////////////////////////////////////////////////////////////

// Login Page
router.get('/login',  (req, res) => res.render('login'));

// Register Page
router.get('/register',  (req, res) => res.render('register'));

////////////////////////////////////////////////////////////////////////////////

//Registeration form POST method
router.post('/register',(req,res)=>{
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (!name || !email || !password || !password2) {
  errors.push({ msg: 'All fields Required' });
  }
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (errors.length > 0) {
  res.render('register', {errors,name, email,password,password2 });
}else{
  User.findOne({email:email}).then(user=>{
    if(user){
      errors.push({ msg: 'Email already exists' });
      res.render('register', {errors,name, email,password,password2 });
    }
    else{
      const newUser = new User({ name,email,password});
      bcrypt.genSalt(10, (err,salt)=>
        bcrypt.hash(newUser.password, salt, (err,hash)=>{
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
          .then(user=>{
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/users/login')})
          .catch(err=>console.log(err));
      }))
    }
  })
}
});


////////////////////////////////////////////////////////////////////////////////


//login post after authentication
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

////////////////////////////////////////////////////////////////////////////////


// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

///////////////////////////////////////////////////////////////////////////////

//getAll from Grocery
router.get("/allGrocery",  (req, res) => {
  let errors = [];
	Grocery.find().then(item=>{
    if(item){
      console.log('success')
      res.render('allGrocery.ejs',{items:item})
    }
    else{
      console.log('failed')
      errors.push({ msg: 'No item to display' });
      res.render('allGrocery.ejs',{errors,items:item})
    }
  })
});


////////////////////////////////////////////////////////////////////////////////

//get method for addGrocery
router.get('/addGrocery',  (req, res) => res.render('addGrocery'));

// post to Grocery
router.post("/addGrocery", (req, res) => {
  const { id,name,price,description,quantity } = req.body;
  let errors = [];
  if (!id  || !name || !price || !description || !quantity) {
  errors.push({ msg: 'All fields Required' });
  }
  else{
    Grocery.findOne({id:id}).then(item=>{
    if(item){
      errors.push({ msg: 'ID already exists' });
      res.render('addGrocery', {errors,id, name,price,description,quantity });
    }
    else{
    const newGrocery = new Grocery({ id,name,price,description,quantity});
    newGrocery.save()
    .then(user=>{
      req.flash('success_msg', 'Product Added');
      res.redirect('/users/allGrocery')
    })
    .catch(err=>console.log(err));
  }
})
}

});

////////////////////////////////////////////////////////////////////////////////


// post to Grocery
router.post("/order",  (req, res) => {
  const { id, quantityorderd } = req.body;
  console.log(req.body);

});

////////////////////////////////////////////////////////////////////////////////

//get method for addGrocery
router.get('/contactus',  (req, res) => res.render('contactus'));


//post for contact us


////////////////////////////////////////////////////////////////////////////////

module.exports = router;
