import {clientServer} from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser= createAsyncThunk(
"user/login",
async(user, thunkAPI)=>{
    try{
        const response= await clientServer.post("/login",{
            email:user.email,
            password:user.password
        });
        if(response.data.token){
            localStorage.setItem("token",response.data.token);
        }
        else{
            return thunkAPI.rejectWithValue({message:"token not recived Here!"});

        }
        return thunkAPI.fulfillWithValue(response.data.token);


    }
    catch(err){
        return thunkAPI.rejectWithValue(err.response.data.message || "Login failed");
    }
}



)









export const registerUser= createAsyncThunk("user/register",
    async(user, thunkAPI)=>{
        try{
const response = await clientServer.post("/register", {
    username:user.username,
     name:user.name,
     email:user.email,
     password:user.password
});

    }
    catch (err) {
        console.log(err);
      return thunkAPI.rejectWithValue(err.response.data.message || "Registration failed");
    }
   
    }

   

)


export const getAboutUser= createAsyncThunk("user/getAboutUser",
    async({token},thunkAPI)=>{
    try{ 

            const response= await clientServer.get("/get_user_update_profile",{
               params:{
                    token:token,
                }
            })
            console.log("checked fro ",response);
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message || "Failed to fetch user data");
        }
    }
)


export const getAllUser= createAsyncThunk("user/getAllUser",

    async(_,thunkAPI)=>{
        try{

            const response= await clientServer.get("/user/get_allusers");
            console.log("response in getAllUser action", response.data);
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){


            return thunkAPI.rejectWithValue(err.response.data.message || "Failed to fetch all users");
        }
    }
)

export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async(user, thunkAPI)=>{
        try{

            const response = await clientServer.post("/user/send_connection_request",{
                token : user.token,
                connectionId:user.user_id

            });
            
        thunkAPI.dispatch(getConnectionRequest({token : user.token}));
        return thunkAPI.fulfillWithValue(response.data);

        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message|| "failed to send the request ")
        }

    }


)


export const getConnectionRequest= createAsyncThunk(

    "user/getConnectionRequest",
    async(user, thunkAPI)=>{
        try{
                 const response = await clientServer.get("/user/get_connection_request", {

                    params:{
                        token: user.token,
                    }
                 });
                 console.log("699",response.data.connections)
                 return thunkAPI.fulfillWithValue(response.data.connections);


        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message|| " We are unable to getconnection request");

            
        }

    }
)

export const getMyConnectionsRequest= createAsyncThunk("user/getMyConnections",

    async(user, thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/user_connection_request", {
                params:{ 
                    token: user.token,
                }
                
            });
            console.log("090",response.data.connection);
                        console.log("091",response.data.connection);

            return thunkAPI.fulfillWithValue(response.data.connection);
            

    
        }

        catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message||"Anable to fetch the getMyConnection !")

        }




    }
)

export const acceptConnectionRequest= createAsyncThunk("user/accept_connection_request",


    async(user, thunkAPI)=>{

        try{

            const response = await clientServer.post("/user/accept_connection_request",{
               token: user.token,
               requestId:user.connectionId,
               action_type:user.action,

            }) 
            thunkAPI.dispatch(getConnectionRequest({token:user.token}));
            thunkAPI.dispatch(getMyConnectionsRequest({token:user.token}));
           return thunkAPI.fulfillWithValue(response.data);

        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message|| "Did not Accept the request please try again !")
        }

    }
)