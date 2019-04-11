const mongoose = require('mongoose');
const Joi = require('joi');
const Category =mongoose.model('Category', new mongoose.Schema({

    title: {
      type: String,
      maxlength: 200,
      required: true
    },
    
    desc: {
        type: String,
        minlength:10,
        maxlength:2000,
        required: true
    },

    img: {
        type: String,
        required: true
    }
  }));


  
  // Update Category
  function updateCategory(query, update, options, callback){
    Category.findOneAndUpdate(query, update, options, callback);
  };
  
  // Remove Category
  module.exports.removeCategory = function(query, callback){
    Category.remove(query, callback);
  }
  

  function validateCategory(category) {
    const schema = {
        
      title: Joi.string().max(200).required(),
      desc:  Joi.string().max(2000).min(10).required(),
      img:   Joi.string().required()
    };
  
    return Joi.validate(category, schema);
  }
  
module.exports.updateCategory = updateCategory;
module.exports.Category = Category;
module.exports.validate = validateCategory;