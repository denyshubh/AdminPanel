const mongoose = require('mongoose');
const Joi = require('joi');
const Reservation =mongoose.model('Reservation', new mongoose.Schema({

    booking_date:{
        type: Date,
        required: true
    },
    time:{
        type: String, 
        required:true
    },

    duration:{
        type: Number,
        required: true
    },
    no_of_guest:{
        type: Number,
        required: true
    },

    purpose:{
        type: String,
        default:'Other'
    },
    booked_on :{
        type: Date,
        default: Date.now(),
    },
    customer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
        unique: true 
    },
    confirmedStatus:{
        type:Number,
        default:-1
    }
  }));


function validateReservation(reservation) {
    const schema = {
        booking_date:Joi.date().min(Date.now()).required(),
        time:Joi.string().required(),
        duration:Joi.number().required(),
        no_of_guest:Joi.number().required(),
        purpose:Joi.string().required(),
        booked_on :Joi.date(),
        customer_id:Joi.required(),
        confirmedStatus:Joi.number()
    };
  
    return Joi.validate(reservation, schema);
  };

  module.exports.removeReservation = function(query, callback){
    Reservation.remove(query, callback);
  };

  module.exports.Reservation = Reservation;
  module.exports.validate = validateReservation;
  