const express = require('express');
const { Reservation, validate, removeReservation } = require('../models/reservation'); 
const router =  express.Router();
const jwt = require('jsonwebtoken');


router.post('/', async (req,res) => {

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    if(IsUserLoggedIn)
    {
      let reservation = new Reservation({ 
        booking_date:req.body.booking_date,
        time:req.body.time,
        duration:req.body.duration,
        no_of_guest:req.body.no_of_guest,
        booked_on :req.body.booked_on ,
        customer:req.body.customer
      
    });
  
    reservation = await reservation.save();
    res.send(reservation);
  }
  
});

router.get('/', async (req,res) => {
  if(IsAdmin(req))
 { const reservation = await Reservation
                                .find({confirmedStatus: -1})
                                .sort('booking_date');
    if(!reservation) return res.status(404).send('Sorry You Do not any Reservations.');
    else
     res.render('bookinglist',{reservation});}

     else
     res.redirect('/login')
});


router.get('/:id', async (req,res) => {

  const reservation = await Reservation
                          .findById(req.params.id);

});

router.all('/delete/:id', async (req, res) => {
  if(IsAdmin(req))
 { const id = {_id: req.params.id}
  try {
   const updates = await Reservation.updateOne(
       { "_id" : id },
       { $set: { "confirmedStatus" : 0 } }
    );

    res.redirect('/reservation');
 } catch (e) {
    print(e);
 }}
  else
  res.redirect('/login')
  });
  
router.post('/update/:id', async (req,res) => {

  if(IsAdmin(req))
  {const id = {_id: req.params.id}
  try {
   const updates = await Reservation.updateOne(
       { "_id" : id },
       { $set: { "confirmedStatus" : 1 } }
    );

    res.redirect('/reservation');
 } catch (e) {
    print(e);
 }}
 res.redirect('/login');
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

  function IsUserLoggedIn(req)
{
  const { token } = req.cookies;
  let loggedIn =false;
  if(token!=undefined)
      loggedIn = true;
  return loggedIn;
}

module.exports = router; 