const upload    = require('../middleware/upload');
const express = require('express');
const { Menu, validate, updateMenu, removeMenu } = require('../models/menu'); 
const router =  express.Router();
const jwt = require('jsonwebtoken');
const Jimp = require('jimp');


router.post('/',upload, async (req,res) => {
  
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const path = req.file.destination+"/"+req.file.filename;
  thumb(path.substring(2),req.file.filename);
    let menu = new Menu({ 

        title:req.body.title,
        menu_desc:req.body.menu_desc,
        offer_percentage:req.body.offer_percentage,
        category:req.body.category,
        extra_ingrediants:req.body.extra_ingrediants,
        price:req.body.price,
        img_url:path.substring(8)
      });
      menu = await menu.save();

      res.redirect("/menu");

});

router.get('/', async (req, res) => {

  const menu = await Menu.find().sort('title');
 
   if(IsAdmin(req)){

      res.render('menu', {menu});
  }
  else
       res.render('login');
     
});

router.post('/edit/:id',upload,(req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const query = {_id: req.params.id};
  const path = req.file.destination+"/"+req.file.filename;
  thumb(path.substring(2),req.file.filename);
  const update=
    { 
      title:req.body.title,
      menu_desc:req.body.menu_desc,
      offer_percentage:req.body.offer_percentage,
      category:req.body.category,
      extra_ingrediants:req.body.extra_ingrediants,
      price:req.body.price,
      img_url:path.substring(8)
    };

    updateMenu(query, update, {}, (err, menu) => {
      if(err){
        return res.status(404).send('The menu with the given ID was not found.');
      }

     res.redirect('/menu');
});

});


router.all('/delete/:id', async (req, res) => {
  const query = {_id: req.params.id}
  if(IsAdmin(req))
  {
    removeMenu(query, (err, menu)=> {
      if(err) {
        return res.status(404).send('The menu with the given ID was not found.');
      }
      res.redirect('/menu');
    });
  }

});


router.get('/:id', async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  if (!menu) return res.status(404).send('The menu with the given ID was not found.');
  if(IsAdmin(req))
   res.render('edit-menu',{menu});
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

function thumb(url, filename)
{Jimp.read(url, (err, img) => {
    if (err) throw err;
    img
      .resize(256, 256) // resize
      .quality(60) // set JPEG quality
      .write('public/thumb/thumb-'+filename); // save
  });
}

module.exports = router; 
