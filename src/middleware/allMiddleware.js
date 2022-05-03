const jwt = require('jsonwebtoken')
const blogModel = require("../models/blogModel")


const authentication = async function (req, res, next) {
    try {
      let token = req.headers["x-Api-key"];
      if (!token) token = req.headers["x-api-key"];
      if (!token)
        return res.status(400).send({
          status: false,
          msg: "Token required! Please login to generate token",
        });
  
      let decodedToken = jwt.verify(token, "functionup-uranium");
      console.log(decodedToken)
      if (!decodedToken)
        return res.status(401).send({ status: false, msg: "token is invalid" });
      next();
    } catch (err) {
      res.status(500).send({ msg: "Internal Server Error", error: err.message });
    }
  };

const deleteandUpdateBlogById=async(req,res,next)=>{
    try{

        let token = req.headers["x-api-key" || "X-Api-Key"]
        let decodedToken = jwt.verify(token,"functionup-uranium")
        let Id = req.params.blogsId
        if(Id.length!=24){
            return res.status(401).send({ staus:false, error: "invalid Id " })
        }
        let blog = await blogModel.findById(Id)
        console.log(blog)
        if(!blog){
           return res.status(404).send({ error: "document not found " })
        }
        console.log(decodedToken.userId)
        if(blog.authorId!=decodedToken.userId){
           return res.status(401).send({ error: "you are not authourized to change other user document " })
        }
        next()
    }
    catch(err){
        console.log(err)
        res.status(500).send({ msg: err.message })
      }
}


const deleteBlogbyParams= async (req,res,next)=>{
    try{

        let token = req.headers["x-api-key" || "X-Api-Key"]
        let decodedToken = jwt.verify(token,"functionup-uranium")
        let { authorId, isPublished, tags, category, subcategory } = req.query
        let blog = await blogModel.find({$or:[{authorId:authorId},{isPublished:isPublished},{tags:tags}, {category:category}, {subcategory:subcategory}]})
        if(blog[0].authorId!=decodedToken.userId){
           return res.status(401).send({ error: "you are not authourized to change other user document " })
        }
        next()
    }
    catch(err){
        res.status(500).send({ msg: err.message })
      }
}


module.exports.deleteBlogbyParams = deleteBlogbyParams
module.exports.authentication = authentication
module.exports.deleteandUpdateBlogById = deleteandUpdateBlogById
