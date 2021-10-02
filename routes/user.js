const express= require('express');
const User = require('../model/user');
const catchError= require('../utilities/catchError');
const passport= require('passport');
const router= express.Router();
router.get('/register', (req,res)=>{
   res.render('user/new');  
})                                                                                               
router.post('/register', catchError(async(req,res)=>{
   try{
      const {email, username, password}= req.body;
      const user= await new User({email,username});
     const registereduser= await User.register(user,'password');
     req.login(registereduser, err=>{
        if(err) return next(err);
        req.flash('success','welcome to yelpcamp');
        res.redirect('/campgrounds');
     })
     
   }catch(e){
      req.flash('error', e.message);
      res.redirect('/register');
   }
}));                                                                                   
router.get('/login', (req,res)=>{
   res.render('user/login');  
})
router.post('/login',passport.authenticate('local',{failureFlash: true,failureRedirect: '/login' }), catchError(async(req,res)=>{
   req.flash('success',"welcome!!!!!!");
   res.redirect('/campgrounds');
}));
router.get('/logout', (req,res)=>{
  req.logout();
  req.flash('success','logged out');
  res.redirect('/campgrounds');
})
module.exports= router;