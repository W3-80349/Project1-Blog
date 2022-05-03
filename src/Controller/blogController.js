const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel')


const createBlog = async function (req, res) {
  try {
    let data = req.body
   
    let { authorId, title, body, category} = req.body

    if (!title) {
      return res.status(401).send({ status:false,error: "Title is missing" })
    }

    if (title.length < 0) {
      return res.status(401).send({status:false, error: "length of title must be greater than 2" })
    }

    if (!body) {
      return res.status(401).send({ status:false,error: "Body is missing" })
    }

    if (body.length < 0) {
      return res.status(401).send({status:false, error: "length of body must be greater than 50" })
    }

    if (!category) {
      return res.status(401).send({ error: "category is missing" })
    }
    if (!authorId) {
      return res.status(401).send({status:false, msg: 'please enter authorId' })
    }

    let validId = await authorModel.findById(authorId)
    if (!validId) {
      return res.status(401).send({status:false, msg: 'Author not found' })
    }

    let savedData = await blogModel.create(data)
    return res.status(201).send({staus:true, data: savedData })
  }

  catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
}


const getBlogs = async (req, res) => {
  try {
    let Data = req.query
    let { authorId, tags, category, subcategory } = req.query

    
    let blog = await blogModel.find({$or:
      [{isPublished: true, isDeleted: false}, {$or: [{ authorId: authorId },
      { tags: tags },
      { category: category },
      { subcategory: subcategory }]}
      ]})
    console.log(blog);
    if (!blog) {
      return res.status(404).send({staus:true, msg: "Data not found!" })
    }
    return res.status(200).send({staus:true, data: blog })
  } catch (err) {
    console.log(err)
    res.status(500).send({ err: 'server not found' })
  }
}


const updateBlog = async (req, res) => {
  try {
    let {tags, subcategory, category, body, isPublished} = req.body
    let Id = req.params.blogsId
   
    let blog = await blogModel.findById(Id)

    if(!blog){
      return res.send({status:404, msg:"Blog not found"})
    }

    let updatedTags = blog.tags
    if (tags) {
      updatedTags.push(tags)
    }
    // updatedTags.push(tags)
    let updatedSubCategory = blog.subcategory
    if (subcategory) {
      updatedSubCategory.push(subcategory)
    }
    // updatedSubCategory.push(subcategory)

    let updatedBlog = await blogModel.findOneAndUpdate(
      { _id: Id  , isDeleted:false},
      {
        category: category,
        tags: updatedTags,  
        subcategory: updatedSubCategory, 
        body: body,
        isPublished:isPublished,

      },
      { returnDocument: 'after' },
    )
    console.log(updatedBlog)
    if (!updatedBlog) {
      return res.status(404).send({ staus:false, msg: 'error: Document not found / already deleted' })
    }
    return res.status(200).send({status:true ,Updates: updatedBlog })
  } catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
  }
}




const deleteBlog = async (req, res) => {
  try {
    let Id = req.params.blogsId

    let deletedDoc = await blogModel.findOneAndUpdate(
      { _id: Id, isDeleted:false },
      { isDeleted: true, deletedAt: Date() },
      { returnDocument: 'after' },
    )
    console.log(deletedDoc)
    if (!deletedDoc) {
      return res
        .status(404)
        .send({ status:false,error: 'Document not found with Given Id/ Already deleted' })
    }
    res.status(200).send({ status:true, Data: deletedDoc })
  } catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
  }
}



const deleteByParams = async (req, res) => {
  try {
    let { authorId, isPublished, tags, category, subcategory } = req.query


    if (!req.query) {
      return res
        .status(404)
        .send({ error: 'Inavlid Input---Query shoud not be emplpty' })
    }

    let deletedDoc = await blogModel.updateMany({
      isDeleted: false, $or: [{authorId:authorId},
      { isPublished: isPublished },
      { tags: tags },
      { category: category },
      { subcategory: subcategory }],
    },
      { isDeleted: true, deletedAt: Date()}, { returnDocument: 'after' })
    if (!deletedDoc) {
      res
        .status(404)
        .send({status:false, msg: 'Document not found / given data not exists/ is Already Deleted' })
    }
    res.status(200).send({status:true, Updates: deletedDoc })
  } catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
  }
}


module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteByParams = deleteByParams
