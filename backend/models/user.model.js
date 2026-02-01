import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,

    },
    email:{
        type:String,
        required:true,
    },
    active:{
        type:Boolean,
        default:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
        default:"default.jpg",
    },
    createdAt:{
        type:Date,
        defaut:Date.now,
    },
    token:{
        type:String,
        defaut:'',
    },

});
const User= mongoose.model("User",userSchema);

export default User;