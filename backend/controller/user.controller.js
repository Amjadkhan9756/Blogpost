import fs from "fs";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ConnectionsRequest from "../models/connections.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import { getVerifiedUserIds } from "../utils/verified.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";





const cunvertUserDataTOPDF= async (userData)=>{
    const doc = new PDFDocument;
    const outputPath=crypto.randomBytes(32).toString("hex")+".pdf";
    const stream = fs.createWriteStream("uploads/"+outputPath);
    doc.pipe(stream);
    try{
         doc.image(`uploads/${userData.userId.profilePicture}`, 100, 100, {align:'center',valign:'top',height: 100});
    }
    catch(err){
        console.log(err);
    }
   doc.moveDown();
    doc.fontSize(14).text(`name ${userData.userId.name}`);
    doc.fontSize(14).text(`username ${userData.userId.username}`);
    doc.fontSize(14).text(`email ${userData.userId.email}`);
    doc.fontSize(14).text(`bio ${userData.bio}`);
    doc.fontSize(14).text(`current position ${userData.currentPost}`);
    (userData.postwork || userData.pastWork || []).forEach((work,index)=>{
           doc.fontSize(14).text(`company name ${work.company}`);
              doc.fontSize(14).text(`position ${work.position}`);
                 doc.fontSize(14).text(`years ${work.years}`);
    })
    doc.end();
    return outputPath;

}

export const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;
        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        console.log(user);
        if (user) {
            return res.status(409).json({ message: "user already exist in DB" });
        }
        const hashedpassword = await bcrypt.hash(password, 12);
        const newuser = new User({
            name,
            email,
            password: hashedpassword,
            username,
        });
        await newuser.save();
        console.log(newuser);
        const newProfile = new Profile({
            userId: newuser._id
        });
        await newProfile.save();
        return res.status(201).json({ message: "User Signup successfully !" });



    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "something went wrong !" });
    }

}





export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required here!" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user does not exist in DB" });
        }
        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(400).json({ message: "Credential are invalid" });
        }
        const token = crypto.randomBytes(32).toString("hex");
        await User.updateOne({ _id: user._id }, { token });
        return res.json({ token });

    }
    catch (err) {
        return res.status(500).json({ message: "loggedin failed" });
        console.log(err.message);
    }


}





// upload_profilepictuer
export const uploadProfilePicture = async (req, res) => {
    console.log("FILE 👉", req.file);
    console.log("BODY 👉", req.body);
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "No file uploaded here token " });
        }
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not find" });

        }
        if (!req.file) {

            return res.status(400).json({ message: req.file });
        }
        console.log(req.file.filename);
        user.profilePicture = req.file.filename;
        await user.save();
        return res.json({ message: "Profile picture updated successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });

    }

}

// export default uploadProfilePicture;






///upadte userprfile 
const updateuserprofile = async (req, res) => {
    try {
        const { token, ...newuser } = req.body;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const { username, email } = newuser;
        const existuser = await User.findOne({ $or: [{ email }] });
        if (existuser) {
            if (existuser || String(existuser._id != user._id)) {
                return res.status(400).json({ message: "user already exist" })
            }
        }
        Object.assign(user, newuser);
        await user.save();
        return res.json({ message: "user updated !" })

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export default updateuserprofile;



export const getuserupdateprofile = async (req, res) => {
    try {
        const { token } = req.query;
        console.log("tokenn " + token);

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found !" });
        }

        const userProfile = await Profile.findOne({ userId: user._id }).populate(
            "userId",
            "name email username profilePicture"
        );

        if (!userProfile) {
            return res.status(404).json({ message: "userProfile not found" });
        }

        const profileObj = userProfile.toObject();
        profileObj.postwork = profileObj.postwork || profileObj.pastWork || [];
        const verifiedIds = await getVerifiedUserIds();
        if (profileObj.userId) profileObj.userId.verified = verifiedIds.has(profileObj.userId._id.toString());
        return res.status(200).json({ userProfile: profileObj });
    } catch (error) {
        console.error("getuserupdateprofile error:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const updateProfileData= async(req, res)=>{
    try{
        const {token,...newProfileData}= req.body;
        const userProfile= await User.findOne({token});
        if(!userProfile) return res.status(404).json({message:"user not found"});
        const ProfileData=await Profile.findOne({userId:userProfile._id});
        if(!ProfileData)return res.status(404).json({message:"profile not Detect"});
        if (newProfileData.postwork !== undefined) ProfileData.pastWork = newProfileData.postwork;
        if (newProfileData.pastWork !== undefined) ProfileData.pastWork = newProfileData.pastWork;
        if (newProfileData.bio !== undefined) ProfileData.bio = newProfileData.bio;
        if (newProfileData.currentPost !== undefined) ProfileData.currentPost = newProfileData.currentPost;
        if (newProfileData.education !== undefined) ProfileData.education = newProfileData.education;
        await ProfileData.save();
        return res.status(200).json({ message: "Profile updated" });
    }
    catch(err){
        return res.status(500). json({message:err.message});
    }
}

// get profile by username (for view_profile page)
export const getProfileByUsername = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) return res.status(400).json({ message: "username required" });
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "user not found" });
        const profile = await Profile.findOne({ userId: user._id }).populate(
            "userId",
            "name email username profilePicture"
        );
        if (!profile) return res.status(404).json({ message: "profile not found" });
        const profileObj = profile.toObject();
        profileObj.postwork = profileObj.postwork || profileObj.pastWork || [];
        const verifiedIds = await getVerifiedUserIds();
        if (profileObj.userId) profileObj.userId.verified = verifiedIds.has(profileObj.userId._id.toString());
        return res.status(200).json({ profile: [profileObj] });
    } catch (error) {
        console.error("getProfileByUsername error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// user profile data get (attach verified for users with 600k+ total post likes)
export const getUserProfile= async(req,res)=>{
    try{
        const profiles= await Profile.find().populate('userId', 'name username email profilePicture');
        if(!profiles){
            return res.status(404).json({message:"profiele not found Here"});
        }
        const verifiedIds = await getVerifiedUserIds();
        const profilesWithVerified = profiles.map((p) => {
            const po = p.toObject();
            if (po.userId) po.userId.verified = verifiedIds.has(po.userId._id.toString());
            return po;
        });
        return res.status(200).json({ profiles: profilesWithVerified });
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}

//download 
export const userProfileDownload= async (req,res)=>{
    try{
        const user_id= req.query.id;
        if(!user_id) return res.json({message:"userId not found "});
        
      
        const userProfile= await Profile.findOne({userId:user_id}).populate('userId', 'name username  email profilePicture')
       console.log("the profile resume ",userProfile);
        if(!userProfile){
            return res.status(404).json({message:"userprofile not found"});
        }
        let outputPath =  await cunvertUserDataTOPDF(userProfile);
        return res.json({"message":outputPath});
    }
    catch(err){
        return res.status(500).json({message:err.mesage});
    }
}


//ConnectionRequest logic 
//send conection request



export const sendConnectionRequest= async(req, res)=>{
    const { token, connectionId } = req.body;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found !" });
        }

        const connectionUser = await User.findOne({ _id: connectionId });
        if (!connectionUser) {
            return res.status(404).json({ message: "connection user not found " });
        }

        const existRequest = await ConnectionsRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id,
        });
        if (existRequest) {
            return res.status(200).json({ message: "request already sent " });
        }

        // Create and save the new connection request
        const newRequest = new ConnectionsRequest({
            userId: user._id,
            connectionId: connectionUser._id,
            status_accepted: null, // or false if you prefer
        });
        await newRequest.save();

        return res.status(201).json({ message: "Connection request sent successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// get my connection request
export const getMyconnectionRequest= async(req, res)=>{
    const {token}= req.query;
    try{
     const user= await User.findOne({token});
    if(!user){
     return res.status(404).json({message:"user not found !"});
     }
     const connections = await ConnectionsRequest.find({ userId: user._id }).populate('connectionId', 'name username email profilePicture');
     if(!connections){
        return res.status(404).json({message:"connections not found "});
     }
     const verifiedIds = await getVerifiedUserIds();
     const list = connections.map((c) => {
        const co = c.toObject();
        if (co.connectionId) co.connectionId.verified = verifiedIds.has(co.connectionId._id.toString());
        return co;
     });
     return res.status(200).json({ connections: list });
      console.log("connection are that",connections);
  }catch(err){
    return res.status(500).json({message:err.message});    
  }
}



// what are my connection code
export const whataremyconnection= async(req,res)=>{
    const {token} = req.query;
    console.log("token",token)
    try{
        const user = await User.findOne({token});
        if(!user)
        {
            return res.status(404).json({message:"user not found !"});
        }
        const connection = await ConnectionsRequest.find({connectionId:user._id}).populate('userId','name username email profilePicture');
        const verifiedIds = await getVerifiedUserIds();
        const list = connection.map((c) => {
            const co = c.toObject();
            if (co.userId) co.userId.verified = verifiedIds.has(co.userId._id.toString());
            return co;
        });
        return res.json({ connection: list });


    } catch(err){
        return res.status(500).json({message:err.message});
    }

}

// accept connection request code
export const  acceptconnectionrequest= async (req,res) => {
    try{
        const {token, requestId,action_type}= req.body;
        const user= await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"user not found !"});
        }
        const connection = await ConnectionsRequest.findOne({_id:requestId});
        if(!connection){
            return res.status(404).json({message:"connection not found !"});
        }
    if(action_type ==="accepted"){
        connection.status_accepted = true;
    }
    else{
        connection.status_accepted =false;
    }
    await connection.save();
    return res.json({message:"Request updated  successfully !"})
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
    
}

// Danger: wipe all user-related data. Protected by ADMIN_WIPE_SECRET.
export const wipeAllUserData = async (req, res) => {
    try {
        const adminSecret = (process.env.ADMIN_WIPE_SECRET || "").trim();
        const requestedSecret = (req.query.secret || "").trim();
        if (!adminSecret || requestedSecret !== adminSecret) {
            return res.status(403).json({
                message: "Forbidden. Set ADMIN_WIPE_SECRET in .env and pass ?secret=your_secret",
            });
        }

        const [comments, posts, connections, profiles, users] = await Promise.all([
            Comment.deleteMany({}),
            Post.deleteMany({}),
            ConnectionsRequest.deleteMany({}),
            Profile.deleteMany({}),
            User.deleteMany({}),
        ]);

        return res.status(200).json({
            message: "All user data wiped successfully",
            deleted: { comments: comments.deletedCount, posts: posts.deletedCount, connections: connections.deletedCount, profiles: profiles.deletedCount, users: users.deletedCount },
        });
    } catch (err) {
        console.error("wipeAllUserData error:", err);
        return res.status(500).json({ message: err.message });
    }
}
