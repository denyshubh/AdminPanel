const express = require('express');
const { Config, validate} = require('../models/configuration'); 
const router =  express.Router();


router.post('/', async (req,res) => {

  const {error} = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let config = new Config({ 
    name: req.body.name,
    adminData:req.body.adminData
  });
 config = await config.save();
  res.send(config);

});

router.get('/', async (req, res) => {
  const config = await Config.find();
  
  if(IsAdmin(req)){
      res.render('config', {config});
  }
  else
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
