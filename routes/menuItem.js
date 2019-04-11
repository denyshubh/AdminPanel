const upload    = require('./upload');
const express = require('express');
const { Menu, validate, updateMenu, removeMenu } = require('../models/menu'); 
const app = express();
const router =  express.Router();


router.post('/', async (req,res) => {

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);


    let menu = new Menu({ 

        title:req.body.title,
        menu_desc:req.body.menu_desc,
        offer_percentage:req.body.offer_percentage,
        category:req.body.category,
        extra_ingrediants:req.body.extra_ingrediants,
        price:req.body.price,
        img_url:req.body.img_url
      });
      menu = await menu.save();

      res.redirect("/menu");

});

router.get('/', async (req, res) => {

  const menu = await Menu.find().sort('title');
  const { token } = req.cookies;

  if(token != undefined){

      res.render('menu', {menu});
  }
  else
       res.render('login');
     
});

router.post('/edit/:id',(req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const query = {_id: req.params.id};
  const update=
    { 
      title:req.body.title,
      menu_desc:req.body.menu_desc,
      offer_percentage:req.body.offer_percentage,
      category:req.body.category,
      extra_ingrediants:req.body.extra_ingrediants,
      price:req.body.price,
      img_url:req.body.img_url
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
  removeMenu(query, (err, menu)=> {
      if(err) {
        return res.status(404).send('The menu with the given ID was not found.');
      }
      res.redirect('/menu');
    });

});


router.get('/:id', async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  if (!menu) return res.status(404).send('The menu with the given ID was not found.');
  res.render('edit-menu',{menu});
});


module.exports = router; 
