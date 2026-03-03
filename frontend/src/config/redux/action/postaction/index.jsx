    import {clientServer} from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

// all post fetched 
export const allPosts= createAsyncThunk("post/posts",
        async(_,thunkAPI)=>{

        try{
            const response= await clientServer.get("/posts");
            console.log("response bala action se "+response);
            console.log("action bala posts all hai ",response.data);
           if(response.status==200){
             return thunkAPI.fulfillWithValue(response.data);
           }
                }
                catch(err){
                    return thunkAPI.rejectWithValue(err.response.data.message || "Failed to fetch posts");
                }

        }

)  
// create post  

export const createPost= createAsyncThunk("post/createPost",
    async(userData, thunkAPI)=>{
        const {file, body}= userData;

        try{
            const formData= new FormData();
            formData.append('token' ,localStorage.getItem('token'));
            formData.append('body',body);
            formData.append('media',file);
            const response= clientServer.post("/post",formData ,{
                headers:{
                    'Content-Type':'multipart/form-data'

                }


            })


            if(response.status==200){
                return thunkAPI.fulfillWithValue(response.data);
            }
        else{
            return thunkAPI.rejectWithValue("Post creation failed");
        }



        }
        catch(err){
            return res.fulfillWithValue(err.response.data.message || "Failed to create post");      
        }
    }
)
          


//delete post here 

export const deletePost= createAsyncThunk(
    "post/deletePost",
    async({post_id}, thunkAPI)=>{

        try{

            const response= await clientServer.delete("/destroy_post",
              {  data: {
                    token:localStorage.getItem("token"),
                    post_id:post_id,
                }
            }
            );
            return thunkAPI.fulfillWithValue(response.data);



        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message || "Failed to delete post");
        }


    }
)


// inctrement like code
export const incrementLikes = createAsyncThunk(
    "post/likesincrement",
    async({post_id}, thunkAPI)=>{
        try{
            const response = await clientServer.post("/increment_likes",{
                post_id:post_id,
               

            });
            if(response.status==200){
                return thunkAPI.fulfillWithValue(response.data);
            }


        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message||"Oops failed to like the post try again!")
        }
    }

)

///get all comments by post code
export const getCommentsByPost= createAsyncThunk(
    "post/getPostComments",

    async(postData, thunkAPI)=>{
        try{

            const response = await clientServer.get("/get_comments",{
                params:
                { 
                    post_id:postData.post_id,
                }
            });
            if(response.status==200){
                console.log("comments 0000000000000000 ", response.data);
                return thunkAPI.fulfillWithValue(
                    {comments:response.data.comments || [],
                        post_id:postData.post_id,
                    }
                );
            }
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message || "Failed to fetch comments");
        }
    }
)


//post commnet code 
export const postComment = createAsyncThunk(


    "post/postComment",
    async({post_id, comment}, thunkAPI)=>{
        try{

            const response = await clientServer.post("/comment_post",{
                token:localStorage.getItem("token"),
                post_id:post_id,
                comment:comment
                

            });
            if(response.status==200){
                return thunkAPI.fulfillWithValue({message:response.data, post_id:post_id, comment:comment});
            }

        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message || "Failed to post comment");
        }


    }
)