
const express = require('express');
const router =  express.Router();
const fs = require('fs');

router.get('/', (req,res) => {

    const { token } = req.cookies;


    if(token != undefined)
         res.render('index');
    else
        res.render('login');
});

router.get('/login', (req,res) => {
    res.render('login');
});

router.get('/logout', (req,res) => {
    const { token } = req.cookies;
    
    if(token != undefined){
        res.clearCookie("token");
    }

        res.render('login');   
   
});

router.get('/add/menu', (req,res) => {
    const { token } = req.cookies;
    
    if(token != undefined){
        res.render('add-menu');
    }

        res.render('login'); 
});

router.get('/add/category', (req,res) => {
    const { token } = req.cookies;
    
    if(token != undefined){
        res.render('add-category');
    }

        res.render('login'); 
});



router.get('/categoryedit', (req,res) => {
    const { token } = req.cookies;
    if(token != undefined){
        res.render('form-samples');
        // res.clearCookie('category');
    }
    else
         res.render('login');
});
module.exports = router;
