
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let uuidv4 = require('uuid/v4');
let { BlogPostList } = require('./blog-post-model');
const { DATABASE_URL, PORT } = require( './config' );

let app = express();
let jsonParser = bodyParser.json();
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;


app.use(express.static('public'));//Say to my server were gonna user public directory

app.use(morgan("dev"));



let blogPost =[ {
    id: uuidv4(),
    title: "This is my first post",
    content: "This is the content of my first post",
    author: "Panchito",
    publishDate: new Date(2019,10,23)
},
{
id: uuidv4(),
title: "This is my second post",
content: "This is the content of my second post",
author: "Juan",
publishDate: new Date(2019,10,23)
}] ;


//request of all blog posts should go to /blog-posts
app.get("/blog-posts", (req, res, next) =>{
    BlogPostList.get()
    .then( blogPost => {
        return res.status( 200 ).json( blogPost );
    })
    .catch( error => {
        res.statusMessage = "Something went wrong with the DB. Try again later.";
        return res.status( 500 ).json({
            status : 500,
            message : "Something went wrong with the DB. Try again later."
        })
    });

    /*
    res.statusMessage = "Succes!";

    return res.status(200).json(blogPost);

    return res.status(200).json({
        message: "Success!",
        status: 200,
        blogs: blogPost

    });
    */

});

//GET by author requests should go to /blog-posta?uthor=value
app.get("/blog-post", (req,res,next) =>{
    let author = req.query.author;

    if (author == null){
        res.statusMessage = "missing author";
        return res.status(406).json({
            message: "author missing",
            status: 406
        });
    } 

    BlogPostList.getBlogPostByAuthor(author)
		.then(blogPost => {
			if ( blogPost ){
				return res.status( 200 ).json({
					message : "Post found in the list",
					status : 200,
					blogPost : blogPost
				});
			}
			else{
				res.statusMessage = "Post not found in the list.";

				return res.status( 404 ).json({
					message : "Post not found in the list.",
					status : 404
				});
			}
		})
		.catch( err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		})
     /*
    for (let i= 0; i< blogPost.length; i++){
        if (blogPost[i].author == author){
            //console.log(blogPost[i]);
            res.statusMessage ="Succes!";
            return res.status(200).json({
                message:"success",
                status:200,
                blogs: blogPost[i]
        })
    } 
    res.statusMessage = "author not found";
    return res.status(404).json({
        message: "author not found",
        status: 404
    });
    */
});

//POST requests of a blog post should go to /blog-posts
app.post("/blog-posts",jsonParser,(req,res) =>{
   let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let publishDate = req.body.publishDate;
    
    if (title == null || content == null || author == null || publishDate == null){
        res.statusMessage = "missing field";
        return res.status(406).json({
            message: "missing field",
            status: 406
        });
    } else {
        let newBlogPost = {
            id: uuidv4(),
            title: title,
            content: content,
            author: author,
            publishDate: publishDate
        }
        BlogPostList.post(newBlogPost)
		.then( blogPost => {
			return res.status( 201 ).json({
				message : "Blog added to the list",
				status : 201,
				blogPost : blogPost
			});
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			});
		});
        
    }

    /*
    res.statusMessage = "success";
   

    blogPost.push(newBlog);

    return res.status(201).json({
        message: "success post!",
        status: 201,
        post : newBlog
    });
*/

});

function exists(id){
    for (let i=0; i<blogPost.length; i++){
        if (id == blogPost[i].id){
            return true;
            
        }
    
        
    }
}

function deleteBlog(id){
    for (let i=0; i<blogPost.length; i++){
        if (id == blogPost[i].id){
            blogPost.splice(i,1);
        }
    }
}

//DELETE requests should go to /blog-posts/:id
app.delete("/blog-posts/:id", (req,res) =>{
let id = req.params.id;

BlogPostList.delete(id)
            .then(blogPost => {
                if(blogPost) {
                    return res.status(200).json({
                        message: "id deleted",
                        status: 200
                    });
                }

                res.statusMessage = "id doesnt exists";
                return res.status(404).json({
                    message: res.statusMessage,
                    status: 404
                });
            })
            .catch(err => { throw Error(err) });


/*
if (exists(id)){
  //console.log("exists");
  deleteBlog(id);
  req.statusMessage = "success"
    return res.status(200).json({
    message: "id deleted!",
    status: 200,
    blog: blogPost
});

} else {
    req.statusMessage = "id doesn't exists";
    return res.status(404).json({
        message: "id doesn't exists",
        status: 404
    });
} //end else
*/
});

//PUT requests should go to /blog-posts/:id
app.put("/blog-posts/:id", jsonParser , (req,res) =>{

    let id1= req.params.id;
    let id2= req.body.id;

    if(id1 != id2){
        res.statusMessage = "id doesnt match"
        return res.status(409).json({
            message: "id doesnt match",
            status: 406
        });
    }
    /*
        if (id2 == null || !exists(id2)){
        res.statusMessage = "There's no id in the body"
        return res.status(406).json({
            message: "there's no id in the body",
            status: 406
        });
    }
    */

      /*You need to pass in the body an object with the updated content of the blog
post. This object may just contain 1 field, 2 fields, 3 fields or 4 fields (title,
    content, author, publishDate) Just update whatever is passed, the rest
    should stay the same. Send a 202 status with the updated object.*/
    

    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let publishDate = req.body.publishDate;

    for (let i=0 ; i < req.body.length ; i++){

        if (id1 == req.body[i].id){
            if (title != null){
                req.body[i].title = title;
            }
            if (content != null){
                req.body[i].content = content;
            }
            if (author != null){
                req.body[i].author = author;
            }
            if (publishDate != null){
                req.body[i].publishDate = publishDate;
            }

        }
        
    }


    BlogPostList.put(req.body)
    .then(updatedBlogPost => {
        if(!updatedBlogPost) {
            res.statusMessage = "post dont exists";
            return res.status(404).json({
                message: res.statusMessage,
                status: 404
            });
        }
        return res.status(202).json({
            message: "Blog updated",
            status: 202
        });
    })
    .catch(err => { throw Error(err) });
    });


    /*
    res.statusMessage = " blog updated!"
    return res.status(202).json({
        message: "blog  updated!",
        status: 202,
    
    });

    */



let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };
