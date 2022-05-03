const mongoose = require('mongoose')
const authorSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      trim:true,
      required: true,
    },
    lname: {
      type: String,
      trim:true,
      required: true,
    },
    title: {
      type: String,
      require: 'Emailis required',
      enum: ['Mr', 'Mrs', 'Miss'],
    },
    email: {
      type: String,
      trim:true,
      required: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Author', authorSchema)
