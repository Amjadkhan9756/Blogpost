import { createSlice } from "@reduxjs/toolkit";
import { getConnectionRequest, getMyConnectionsRequest, loginUser,registerUser} from "../../action/authaction";
import { getAboutUser, getAllUser } from "../../action/authaction";
const initialState={
user:undefined,
all_profiles:[],
isError:false,
isSuccess:false,
isloading:false,
isloggedin:false,
message:" ",
profileFetch:false, 
connections:[],
isTokenThere: false,
connectionRequet:[],
all_profiles_fetched: false,
postId: "",
Comment:[],



}
export const authreducer= createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:(state)=>initialState,
        handleLoginUser:(state)=>{
            state.message= "Hello"
        },
        emptyMessage:(state)=>{
            state.message= " "
        },
        setisTokenThere:(state)=>{
            state.isTokenThere= true
        },
        setisTokenIsNotThere:(state)=>{
            state.isTokenThere= false
        },
        logoutUser:(state) => {
      state.user = null;
      state.isloggedin = false;
      state.profileFetch = false;
      
    },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.isloading= true;
            state.message="you getting  in the Application"
        })
        .addCase(loginUser.fulfilled,(state, action)=>{
            state.pending= false;
            state.isError= false;
            state.isloading= false;
            state.isSuccess=true;
            state.isloggedin=true;
            state.message="User logged in successfully";
        })
        .addCase(loginUser.rejected,(state, action)=>{
            state.isloading= false;
            state.isSuccess= false;
            state.isError= true;
            state.message= action.payload
        })
        .addCase(registerUser.pending,(state)=>{
            state.isloading= true;
            state.message="registering user...."

        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isloading= false;
            state.isError= false;
            state.isSuccess= true;
            state.message= "user register Successfuly!";
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isError= true;
            state.isloading= false;
            state.message= action.payload;
        })

        .addCase(getAboutUser.pending,(state)=>{
            state.isloading= true;
            state.message="fetching user profile"
        })
        .addCase(getAboutUser.fulfilled,(state, action)=>{
            state.isloading= false;
            state.isError= false;
            state.isSuccess= true;
            state.profileFetch= true;
            state.user= action.payload.userProfile;
            state.connections= action.payload.connections;      
            state.connectionRequet= action.payload.connectionRequet;
            console.log("action payload in getAboutUser", state.user);
            state.message="User profile fetched successfully";
        })
        .addCase(getAboutUser.rejected,(state, action)=>{
            state.isloading= false;
            state.isSuccess= false;
            state.isError= true;
            state.message= action.payload;
        })
        .addCase(getAllUser.pending,(state)=>{
            state.isloading= true;
            state.message="fetching all users"
        })
        .addCase(getAllUser.fulfilled,(state, action)=>{
            state.isloading= false;
            state.isError= false;
            state.isSuccess= true;
            state.all_profiles_fetched= true;
            state.all_profiles= action.payload.profiles;
             
            state.message="All users fetched successfully";
        
        })
        .addCase(getAllUser.rejected,(state, action)=>{
            state.isloading= false;
            state.isSuccess= false;
            state.isError= true;
            state.message= "something went wrong while fetching all users"
        })
        .addCase(getConnectionRequest.fulfilled, (state, action)=>{
            state.connections= action.payload
        })
        .addCase(getConnectionRequest.rejected, (state, action)=>{
            state.message= action.payload


        })
        .addCase(getMyConnectionsRequest.fulfilled,(state,action)=>{
            state.connectionRequet= action.payload
            console.log("form reducers state.connectionRequest",state.connectionRequet)
        })
        .addCase(getMyConnectionsRequest.rejected, (state, action)=>{
            state.message= action.payload
        })
        



        
    }
} 
)





export const{ reset, handleLoginUser, emptyMessage,setisTokenThere,setisTokenIsNotThere,logoutUser } = authreducer.actions;
export default authreducer.reducer;