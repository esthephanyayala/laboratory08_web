let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let blogPostSchema = mongoose.Schema({
 
    title: { type: String},
    content: {type: String},
    author: {type: String},
    publishDate: {type: Date},
	id : { 
			type : String,
			required : true }
});

let BlogPost = mongoose.model( 'BlogPost', blogPostSchema );

let BlogPostList = {
	get : function(){
		return BlogPost.find()
				.then( blogPost => {
					return blogPost;
				})
				.catch( error => {
					throw Error( error );
				});
	},
	getBlogPostByAuthor : function(author){
		return BlogPost.findOne({author : author})
			.then(blogPost => {
				return blogPost;
			})
			.catch( error => {
				throw Error( error );
			});

	},
	post : function( newBlogPost ){
		return BlogPost.create( newBlogPost )
				.then( blogPost => {
					return blogPost;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	put : function(updatedStudent){
		return BlogPost.getByID( updatedBlogPost.id )
			.then( blogPost => {
				if ( blogPost ){
					return BlogPost.findOneAndUpdate( {id : blogPost.id}, {$set : updatedBlogPost}, {new : true})
						.then( newBlogPost => {
							return newBlogPost;
						})
						.catch(error => {
							throw Error(error);
						});
				}
				else{
					throw Error( "404" );
				}
			})
			.catch( error => {
				throw Error(error);
			});
    },
    
    delete: function(id){
        return BlogPost.findOneAndDelete({id: id})
        .then(function(blogPost) {
            return blogPost;
        })
        .catch(function(error) {
            throw Error(error);
        });
    }
};

module.exports = { BlogPostList };
