const mongoose = require('mongoose');
const Joi = require('joi');

const Config =  mongoose.model('Config', new mongoose.Schema({

   adminData:{
       type:[Object],
   }

  }));


  function validateConfig(config) {
    const schema = {
     adminData: Joi.array()
    };
  
    return Joi.validate(config, schema);
  }
  

module.exports.validate = validateConfig;
module.exports.Config = Config;