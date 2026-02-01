import User from "../models/user.model.js";
import Post from "../models/posts.model.js"


export const activeCheck = async (req, res) => {
    return res.status(200).json({ message: 'RUNNING' })

}

// create post 

export const createPost = async (req, res) => {
    const { token } = req.body;
    try {

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        const newPost = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename : "",
            fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
        })
        await newPost.save();
        return res.status(200).json({ message: "Post created succesfully " })
    }
    catch (error) {

        return res.status(500).json({ message: err.message });

    }
}


// get all posts

export const getAllPost = async (req, res) => {

    try {

        const posts = await Post.find().populate('userId', 'name username email profilePicture');
        return res.status(200).json({ posts });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



//delete post

export const destroyPost = async (req, res) => {
    const { token, post_id } = req.body;
    try {

        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(404).json({ message: "user not found " });


        }
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(404).json({ message: "postnot found !" });
        }

        if (user._id.toString() !== post.userId.toString()) {
            return res.json({ message: "you are not owner of this post" })
        }

        await Post.deleteOne({ _id: post_id });
        return res.json({ message: "post deleted successfully !" });

    }
    catch (error) {
        return res.status(500).json({ message: err.message });

    }
}



///commentpost 
export const commentPost= async(req, res)=>{
    const{token, post_id,comment}= req.body;
    try{
        const user = await User.findOne({token:token}).select("_id");
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        const post =  await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"post not found !"});
        }



        const newcomment = new Comment({
            userId:user._id,
            postId:post_id,
            comment:comment,
        });
        await newcomment.save();
        return res.status(200).json({message:"comment created successfully !"});

    }

    catch(err){
        return res.status(500).json({message:err.message});
    }
}
/// get all comments by post code
export const get_comment_bypost= async(req, res)=>{
    const { post_id } = req.query;
    try {
        // Fetch all comments for the given post_id
        const comments = await Comment.find({ postId: post_id }).populate('userId', 'name username profilePicture');
        if (!comments) {
            return res.json({ comments: [] });
        }
        return res.json({ comments });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

/// destroy  comment 
export const destroyCommnet= async(req, res)=>{
    const {token, comment_id}= req.body;
    try{

        const user = await User.findOne({token:token}).select("_id");
        if(!user){
            return res.status(404).json({message:"user not found!"});
        }
        const comment= await Comment.findOne({"_id":comment_id});
        if(!comment){
            return res.status(404).json({message:"commnet not found "});

        }
        if(comment.userId.toString()!==user._id.toString()){
            return res.status(401).json({message:"you are not owner of this comment"});
        }
        await  deleteOne({"_id":comment_id});
        res.status(200).json({message:"comment deleted successfully !"});


    }catch(err){
        return res.status(500).json({message:err.message});
    }
}



///increment likes 
export const incrementLikes= async(req, res)=>{
    const {post_id}= req.body;
    try{
        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"psot not found"});
        }
        post.likes= post.likes+1;
        await post.save();
        return res.status(200).json({message:"likes incremented"});

    } catch(err){
        return res.status(500).json({message:err.message});
    }
}