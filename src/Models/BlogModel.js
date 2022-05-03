const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim:true,
      required: true,
    },
    body: {
      type: String,
      trim:true,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Author',
    },
    tags: {
      type: [String], 
      trim:true,
    },
    category: {
      type: String, 
      trim:true,
      required: true,
    },
    subcategory: {
      type: [String],
      trim:true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('blog', blogSchema)

