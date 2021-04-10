const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');
// const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Grocery = require('../models/grocery');


// Login Page
router.get('/login',  (req, res) => res.render('login'));

// Register Page
router.get('/register',  (req, res) => res.render('register'));


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

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});



//getAll from Grocery
router.get("/allGrocery",  (req, res) => {
  let errors = [];
	const grocery = Grocery.find().then(item=>{
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


// //post to Grocery
// router.post("/grocery", async (req, res) => {
//   const { id,item,price,description,quantity } = req.body;
//   let errors = [];
//   if (!id  || !item || !price || !description || !quantity) {
//   errors.push({ msg: 'All fields Required' });
//   }
//   else{
//     Grocery.findOne({id:id}).then(item=>{
//     if(item){
//       errors.push({ msg: 'Email already exists' });
//       res.render('grocery', {errors,name, email,password,password2 });
//     }
//     else{
//
//     const newGrocery = new Grocery({ id,item,price,description,quantity});
//     newGrocery.save()
//     .then(user=>{
//       req.flash('success_msg', 'You are now registered and can log in');
//       res.redirect('/users/login')})
//     .catch(err=>console.log(err));
//   }
//
// 	const post = new Post({
// 		title: req.body.title,
// 		content: req.body.content,
// 	})
// 	await post.save()
// 	res.send(post)
// })
//





module.exports = router;
