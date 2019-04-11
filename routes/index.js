
const express = require('express');
const router =  express.Router();
const jwt = require('jsonwebtoken');
 


router.get('/', (req,res) => {
    
    if(IsAdmin(req))
         res.render('index');
    else
        res.render('login');
});

router.get('/login', (req,res) => {
    res.render('login');
});

router.get('/logout', (req,res) => {
   
    if(IsAdmin(req)){
        res.clearCookie("token");
    }

        res.render('login');   
   
});

router.get('/add/menu', (req,res) => {

    if(IsAdmin(req)){
        res.render('add-menu');
    }

        res.render('login'); 
});

router.get('/add/category', (req,res) => {
    
    if(IsAdmin(req)){
        res.render('add-category');
    }

        res.render('login'); 
});

function IsAdmin(req)
{
  const { token } = req.cookies;
  var decoded = jwt.decode(token, {complete: true});
  var admin;
  if(token!=undefined)
       admin = decoded.payload.isAdmin;
  return admin;
}

module.exports = router;