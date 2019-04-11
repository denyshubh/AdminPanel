const upload    = require('../middleware/upload');
const express = require('express');
const { Category, validate, updateCategory, removeCategory  } = require('../models/category'); 
const router =  express.Router();
const jwt = require('jsonwebtoken');
const Jimp = require('jimp');

router.post('/', upload, async (req,res) => {

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const path = req.file.destination+"/"+req.file.filename;
  thumb(path.substring(2),req.file.filename);

    let category = new Category({ 
        title:req.body.title,
        desc:req.body.desc,
        img:path.substring(8)
      });

     category = await category.save();

      res.redirect('/category');

});

router.get('/', async (req, res) => {
  const category = await Category.find().sort('title');
  if(IsAdmin(req)){
      res.render('category', {category});
  }
  else
       res.render('login');
     
});

router.post('/edit/:id', upload, (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const query = {_id: req.params.id};
  const path = req.file.destination+"/"+req.file.filename;
  thumb(path.substring(2),req.file.filename);

  const update=
    { 
      title:req.body.title,
      desc:req.body.desc,
      img:path.substring(8)
    };

    updateCategory(query, update, {}, (err, category) => {
      if(err){
        return res.status(404).send('The category with the given ID was not found.');
      }

     res.redirect('/category');
});

});


router.all('/delete/:id', async (req, res) => {
  const query = {_id: req.params.id}
  if(IsAdmin(req))
    removeCategory(query, (err, category)=> {
      if(err) {
        return res.status(404).send('The Category with the given ID was not found.');
      }
      res.redirect('/category');
     });

});

router.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id);
  if(IsAdmin(req))
  {    if (!category) return res.status(404).send('The category with thegiven ID was not found.');
      res.render('edit-category', {category});
  }
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
