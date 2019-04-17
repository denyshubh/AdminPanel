const express = require('express');
const { Reservation, validate, removeReservation } = require('../models/reservation'); 
const router =  express.Router();



router.post('/', async (req,res) => {

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    if(IsUserLoggedIn)
    {
      let reservation = new Reservation({ 

        table: req.body.table,
        booking_date:req.body.booking_date,
        time:req.body.time,
        duration:req.body.duration,
        no_of_guest:req.body.no_of_guest,
        purpose:req.body.purpose,
        booked_on :req.body.booked_on ,
        customer_id:req.body.customer_id
      
    });
    reservation = await reservation.save();
    res.send(reservation);
  }
  
});

router.get('/', async (req,res) => {

  const reservation = await Reservation
                                .find({confirmedStatus: -1})
                                .sort('booking_date')
                                .populate('customer_id');
    if(!reservation) return res.status(404).send('Sorry You Do not any Reservations.');
    else
     res.render('bookinglist',{reservation});
});


router.get('/:id', async (req,res) => {

  const reservation = await Reservation
                          .findById(req.params.id);

});

router.all('/delete/:id', async (req, res) => {
  const id = {_id: req.params.id}
  try {
   const updates = await Reservation.updateOne(
       { "_id" : id },
       { $set: { "confirmedStatus" : 0 } }
    );

    res.redirect('/reservation');
 } catch (e) {
    print(e);
 }
  
  });
  
router.post('/update/:id', async (req,res) => {
  const id = {_id: req.params.id}
  try {
   const updates = await Reservation.updateOne(
       { "_id" : id },
       { $set: { "confirmedStatus" : 1 } }
    );

    res.redirect('/reservation');
 } catch (e) {
    print(e);
 }
});

  function IsUserLoggedIn(req)
{
  const { token } = req.cookies;
  let loggedIn =false;
  if(token!=undefined)
      loggedIn = true;
  return loggedIn;
}

module.exports = router; 