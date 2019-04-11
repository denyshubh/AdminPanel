const upload    = require('./upload');
const express = require('express');
const { Category, validate, updateCategory, removeCategory  } = require('../models/category'); 
const router =  express.Router();

router.post('/', async (req,res) => {

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);


    let category = new Category({ 
        title:req.body.title,
        desc:req.body.desc,
        img:req.body.img
      });

     category = await category.save();

      res.redirect('/category');

});

router.get('/', async (req, res) => {
  const category = await Category.find().sort('title');
  const { token } = req.cookies;
  if(token != undefined){
      res.render('category', {category});
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
      desc:req.body.desc,
      img:req.body.img
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
  removeCategory(query, (err, category)=> {
      if(err) {
        return res.status(404).send('The Category with the given ID was not found.');
      }
      res.redirect('/category');
    });

});

router.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) return res.status(404).send('The category with thegiven ID was not found.');
  res.render('edit-category', {category});
});

module.exports = router; 
