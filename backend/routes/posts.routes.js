import { Router } from "express";
import { activeCheck } from  "../controller/posts.controller.js";
import multer from "multer";
import { commentPost,get_comment_bypost, createPost, destroyCommnet, destroyPost, getAllPost, incrementLikes } from "../controller/posts.controller.js";

const router=Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
 filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // keep file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
})

const upload = multer({ storage })   

router.route("/post").
post(upload.single('media'),createPost);


router.route("/posts").get(getAllPost);




//destroy post 
router.route("/destroy_post").delete(destroyPost);

router.route("/comment_post").post(commentPost);
router.route("/get_comments").get(get_comment_bypost);
router.route("/destroy_comment").post(destroyCommnet);
router.route("/increment_likes").post(incrementLikes);






router.route('/').get(activeCheck);

export default router;