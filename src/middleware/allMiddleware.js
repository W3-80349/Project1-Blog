const jwt = require('jsonwebtoken')
const blogModel = require("../models/blogModel")


const authentication = async function (req, res, next) {
    let token = req.headers["x-api-key" || "X-Api-Key"]
    if (!token) {
        res.status(401).send({ error: "no token found" })
    }

    let decodeToken = jwt.verify(token, "functionup-uranium")
    if(!decodeToken){
        res.send({error:"Invalid token"})
    }
    next();

}

const deleteandUpdateBlogById=async(req,res,next)=>{
    let token = req.headers["x-api-key" || "X-Api-Key"]
    let decodedToken = jwt.verify(token,"functionup-uranium")
    let Id = req.params.blogsId
    if(Id.length!=24){
        res.status(401).send({ staus:false, error: "invalid Id " })
    }
    let blog = await blogModel.findById(Id)
    console.log(blog)
    if(!blog){
        res.status(404).send({ error: "document not found " })
    }
    console.log(decodedToken.userId)
    if(blog.authorId!=decodedToken.userId){
        res.status(401).send({ error: "you are not authourized to change other user document " })
    }
    next()
}


const deleteBlogbyParams= async (req,res,next)=>{
     let token = req.headers["x-api-key" || "X-Api-Key"]
     let decodedToken = jwt.verify(token,"functionup-uranium")
     let { authorId, isPublished, tags, category, subcategory } = req.query
     let blog = await blogModel.find({$or:[{authorId:authorId},{isPublished:isPublished},{tags:tags}, {category:category}, {subcategory:subcategory}]})
     if(blog[0].authorId!=decodedToken.userId){
         res.status(401).send({ error: "you are not authourized to change other user document " })
     }
     next()
}


module.exports.deleteBlogbyParams = deleteBlogbyParams
module.exports.authentication = authentication
module.exports.deleteandUpdateBlogById = deleteandUpdateBlogById
