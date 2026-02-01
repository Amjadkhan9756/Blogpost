import { Router } from "express";
import multer from "multer";
import { register } from "../controller/user.controller.js";
import { login } from "../controller/user.controller.js";
import uploadProfilePicture from "../controller/user.controller.js";
import updateuserprofile from "../controller/user.controller.js";
import { getuserupdateprofile } from "../controller/user.controller.js";
import { updateProfileData } from "../controller/user.controller.js";
import  getUserProfile  from "../controller/user.controller.js";
import { userProfileDownload } from "../controller/user.controller.js";
import { sendConnectionRequest } from "../controller/user.controller.js";
import { getMyconnectionRequest } from "../controller/user.controller.js";
import { whataremyconnection } from "../controller/user.controller.js";
import { acceptconnectionrequest } from "../controller/user.controller.js";

const router = Router();









//multer profile picture here
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })


router.route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);


router.route('/register').post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateuserprofile);
router.route("/get_user_update_profile").get(getuserupdateprofile);



router.route("/update_Profile_Data").post(updateProfileData);
router.route("/user/get_allusers").get(getUserProfile);
router.route("/user/user_profile_download").get(userProfileDownload);







router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/get_connection_request").get( getMyconnectionRequest);
router.route("/user/user_connection_request").get(whataremyconnection);
router.route("/user/accept_connection_request").post(acceptconnectionrequest);







export default router;