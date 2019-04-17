const upload    = require('../middleware/upload');
const express = require('express');
const { Review, validate, updateReview, removeReview  } = require('../models/review'); 
const router =  express.Router();
const jwt = require('jsonwebtoken');
const Jimp = require('jimp');


router.post('/', upload, async (req,res) => {

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const path = req.file.destination+"/"+req.file.filename;
  thumb(path.substring(2),req.file.filename);

    let review = new Review({ 
        head:req.body.head,
        message:req.body.message,
        img:path.substring(8)
      });
      if(IsAdmin(req))
        {  review = await review.save();
            res.redirect('/review');
          }
      else
          res.redirect('/login');

});

router.get('/', async (req, res) => {
  const review = await Review.find();
  if(IsAdmin(req)){
      res.render('review', {review});
  }
  else
  res.redirect('/login');
     
});

router.post('/edit/:id', upload, (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const query = {_id: req.params.id};
  const path = req.file.destination+"/"+req.file.filename;
  thumb(path.substring(2),req.file.filename);

  const update=
    { 
        head:req.body.head,
        message:req.body.message,
        img:path.substring(8)
    };

    if(IsAdmin(req))
    {updateReview(query, update, {}, (err, review) => {
      if(err){
        return res.status(404).send('The review with the given ID was not found.');
      }
     res.redirect('/review');
});
    }
    else
    res.redirect('/login');
});


router.all('/delete/:id', async (req, res) => {
  const query = {_id: req.params.id}
  if(IsAdmin(req))
   { removeReview(query, (err, review)=> {
      if(err) {
        return res.status(404).send('The review with the given ID was not found.');
      }
      res.redirect('/review');
     });
}
else
res.redirect('/login');
});

router.get('/:id', async (req, res) => {
  const review = await Review.findById(req.params.id);
  if(IsAdmin(req))
  {    if (!review) return res.status(404).send('The review with thegiven ID was not found.');
      res.render('edit-review', {review});
  }
  else
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
