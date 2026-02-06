import { createSlice } from "@reduxjs/toolkit";
import { allPosts,createPost } from "../../action/postaction";
import { getCommentsByPost } from "../../action/postaction";

const initialState={
posts:[],
isError:false,
isSuccess:false,
isloading:false,
postFetched:false,
message:" ",
comments:[],
postId:""

}
export const postreducer= createSlice({
    name:"posts",
    initialState,
    reducers:{
        reset:(state)=>initialState,
        resetpostId:(state)=>{
            state.postId= "";
        }
        
    },
    extraReducers:(builder)=>{
        builder
        .addCase(allPosts.pending,(state)=>{
            state.isloading= true;
            state.message="posts is loading !"
        })
        .addCase(allPosts.fulfilled,(state, action)=>{
            state.isError= false;
            state.isloading= false;
            state.isSuccess=true;
            console.log("xxxxxxxxxxxxxxxxxxxxx", action.payload);
            state.posts= action.payload.posts.reverse();
            console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyy ", state.posts);
         
            state.message="Posts fetched successfully";
        })
        .addCase(allPosts.rejected,(state, action)=>{
            state.isloading= false;
            state.isSuccess= false;
             console.log("❌ Reducer error:", action.payload);
            state.isError= true;
            state.message= action.payload
        })

        .addCase(getCommentsByPost.pending,(state)=>{
            state.isloading=true
        })
        .addCase(getCommentsByPost.fulfilled,(state,action)=>{
            state.isloading=false
            state.isError=false
            state.isSuccess=true
            state.comments=action.payload.comments
            console.log("comments in reducer checkkkkkkk ",state.comments);
            state.postId= action.payload.post_id
            state.message="Comments fetched successfully"
        })
        .addCase(getCommentsByPost.rejected,(state,action)=>{
            state.isloading=false
            state.isError=true
            state.isSuccess=false
            state.message=action.payload
        })
        .addCase(createPost.pending,(state)=>{
            state.isloading=true
            state.message="Creating post..."
        })
        .addCase(createPost.fulfilled,(state,action)=>{
            state.isloading=false
            state.isError=false
            state.isSuccess=true
            state.posts.unshift(action.payload)
            state.message="Post created successfully"
        })
        .addCase(createPost.rejected,(state,action)=>{
            state.isloading=false
            state.isError=true
            state.isSuccess=false
            state.message=action.payload
        })
    }
} 
)

export const{ reset, resetpostId } = postreducer.actions;
export default postreducer.reducer;