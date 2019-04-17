
const express = require('express');
const router =  express.Router();
const jwt = require('jsonwebtoken');
const Category = require('../models/category');
const { Reservation} = require('../models/reservation'); 


router.get('/', async (req,res) => {

    const reservation = await Reservation
                                  .find({confirmedStatus: {$gte: 0 }});

    var month1 = [0,0,0,0,0,0,0,0,0,0,0,0];
    var month2 = [0,0,0,0,0,0,0,0,0,0,0,0];
    var currDate = new Date();
    var currYear = currDate.getFullYear();
    reservation.forEach(x => {
        if(x.booking_date.getFullYear() == currYear)
             month1[x.booking_date.getMonth()]++;
        else if(x.booking_date.getFullYear() == currYear-1)
             month2[x.booking_date.getMonth()]++;

    });
    if(IsAdmin(req))
         res.render('index',{month1, month2});
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
 Category.getCategories((err, categories) => {
    if(IsAdmin(req)){
        res.render('add-menu', {category: categories});
    }
    else
        res.render('login'); 
});
});

router.get('/add/category', (req,res) => {
    
    if(IsAdmin(req)){
        res.render('add-category');
    }
    else
        res.render('login'); 
});
router.get('/add/review', (req,res) => {
    
    if(IsAdmin(req)){
        res.render('add-review');
    }
    else
        res.render('login'); 
});

router.get('/confirmed', async (req,res) => {

    const reservation = await Reservation
                                  .find({confirmedStatus: { $gte: 0 }})
                                  .sort('booking_date')
                                  .populate('customer_id');
      if(!reservation) return res.status(404).send('Sorry You Do not any Reservations.');
    var history=[];
    var upcoming=[];

      reservation.forEach(x => {
          if(x.booking_date >Date.now() && x.confirmedStatus !=0){
                upcoming.push(x);    
          }
          else
                history.push(x);
                
      });
       res.render('booking-history',{history, upcoming});
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
