const upload    = require('../middleware/upload');
const express = require('express');
const { Menu, validate, removeMenu} = require('../models/menu'); 
const Category = require('../models/category');
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
      categoryId:req.body.category.toString(),
      extra_ingrediants:req.body.extra_ingrediants,
      price:req.body.price,
      img_url:path.substring(8)
    });
    menu = await menu.save();

    res.redirect("/menu");

});

router.get('/', async (req, res) => {

  const menu = await Menu.find().populate('category').sort('title');
 
   if(IsAdmin(req)){
      //   res.send(menu);
      res.render('menu', {menu});
  }
  else
       res.render('login');
     
});

router.post('/edit/:id',upload,async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const path = req.file.destination+"/"+req.file.filename;
  thumb(path.substring(2),req.file.filename);
    
  const menu=await Menu.findByIdAndUpdate(req.params.id, 
    { 
      title:req.body.title,
      menu_desc:req.body.menu_desc,
      offer_percentage:req.body.offer_percentage,
      category:req.body.category,
      categoryId:req.body.category.toString(),
      extra_ingrediants:req.body.extra_ingrediants,
      price:req.body.price,
      img_url:path.substring(8)
    }, { new: true });

    if (!menu) return res.status(404).send('The movie with the given ID was not found.');
    else
     res.redirect('/menu');
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
  Category.getCategories((err, categories) => {
    if(IsAdmin(req))
    res.render('edit-menu',{
      menu:menu,
      category:categories
    });
});

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
