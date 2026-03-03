import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  allPosts,
  createPost,
  deletePost,
  incrementLikes ,
  getCommentsByPost,
  postComment
} from "@/config/redux/action/postaction";
import { getAboutUser } from "@/config/redux/action/authaction";
import UserLayout from "@/layout/userlayout";
import DashboardLayout from "@/layout/dasboardLayout";
import styles from "./style.module.css";
import { BASE_URL } from "@/config/index";
import { all } from "axios";
import { resetpostId } from "@/config/redux/reducer/postreducer";
function dashboard() {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.postsreducer);
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [commnetText, setCommnetText] = useState("");

  useEffect(() => {
    if (authState.isTokenThere) {
      // Dispatch action to fetch posts
      // Assuming you have an action to fetch posts

      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      dispatch(allPosts());
      
    }
  }, [authState.isTokenThere]);
 

  const handleUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent("");
    setFileContent("");
    dispatch(allPosts());
  };

  if (!authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollComponent}>
            <h2>Loading...</h2>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollComponent}>
            
            <div className={styles.wrapper}>
              <div className={styles.createPostContainer}>
                {" "}
                <img
                  src={`${BASE_URL}uploads/${authState.user?.userId?.profilePicture}`}
                  alt="Profile"
                  className={styles.userProfile}
                />
                <textarea
                  onChange={(e) => setPostContent(e.target.value)}
                  value={postContent}
                  className={styles.textareaOfContent}
                  name=""
                  id=""
                  placeholder="Write Something..."
                ></textarea>
                <label htmlFor="fileUpload">
                  <div className={styles.Fab}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                </label>
                <input
                  onChange={(e) => setFileContent(e.target.files[0])}
                  type="file"
                  name=""
                  hidden
                  id="fileUpload"
                />
                {postContent.length > 0 && (
                  <div onClick={handleUpload} className={styles.uploadButton}>
                    Post
                  </div>
                )}
              </div>{" "}
              <div className={styles.postContainer}>
                {Array.isArray(postState.posts) &&
                  postState.posts.map((post) => {
                    return (
                      <div key={post._id} className={styles.singleCard}>
                        <div   className={styles.singleCard_profileContainer}>
                          <img style={{cursor:"pointer"}}  onClick={()=>{router.push(`/view_profile?username=${post.userId.username}`)}} 

                            src={`${BASE_URL}uploads/${post.userId.profilePicture}`}
                            alt="profilePicture" 
                            name="profile"
                          />
                          <div>
                            <div   
                            className={styles.postDeleteIconContainer}>
                              <p style={{ fontWeight: "bold" }}>
                                {post.userId.name}
                              </p>
                              {post.userId._id ===
                                authState.user.userId._id && (
                                <div
                                  onClick={async () => {
                                    await dispatch(
                                      deletePost({ post_id: post._id })
                                    );
                                    await dispatch(allPosts());
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <svg
                                    style={{ width: "20px", color: "red" }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p style={{ color: "grey" }}>
                              @{post.userId.username}
                            </p>

                            <p style={{ paddingTop: "1.3rem" }}>{post.body}</p>

                            <div className={styles.singleCard_image}>
                             
                             {post.media!== ""? 
                              <img
                                src={`${BASE_URL}uploads/${post.media}`}
                                alt="media"
                              />:<></>}
                             
                              {/* <img
                                src={`${BASE_URL}/uploads/${post.media}`}
                                alt="media"
                              /> */}
                            </div>
                            
                              <div className= {styles.optionContainer}>
                                <div
                                
                                onClick={async()=>{
                                  //dispatch inctrement likes button here 

                                   await dispatch(incrementLikes ({post_id:post._id,}));
                                  await dispatch(allPosts());
                                }}
                                
                                className={styles.single_optionContainer}>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
</svg>


                                  <span style={{fontWeight: "600"}}>{post.likes}</span>
                                  
                                </div>
                              
                               <div 
                               
                               onClick={()=>{
                                // dispatch action to get all comments by post id here
                                dispatch(getCommentsByPost({post_id:post._id}));
                               }}
                               className={styles.single_optionContainer}>

                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z" clip-rule="evenodd" />
</svg>

                               <span style={{fontWeight: "600"}}>Comments</span>
                               </div>

 <div 
 
 onClick={()=>{
                            const text= encodeURIComponent(`Check out this post: ${post.body}`);
                            const url= `https://twitter.com/intent/tweet?text=${text}`;
                            window.open(url, "_blank");
                          }}

 
 className={styles.single_optionContainer}>
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clip-rule="evenodd" />
</svg>


<span style={{fontWeight: "600"}}>Send</span>
                                </div>

                              </div>


                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          {postState.postId !=""&&
      
          <div 
          
          onClick={()=>{dispatch(resetpostId())}}
          className={styles.commentsContainer}>


          <div
            onClick={(e)=>e.stopPropagation()}
            className={styles.AllCommentsContainer}>

              {postState.comments.length === 0 &&(<h2>No Comments yet</h2>)}


              {postState.comments.length!=0 &&
              <div className={styles.commentsScrollContainer}>

                {postState.comments.map((comment, index)=>{
                  return(
                    <div className={styles.singleCommentContainer} >

                      <div className={styles.singleCommentContainer_avtar}>
                      <img   
                      
      style={{cursor:"pointer"}}  onClick={()=>{router.push(`/view_profile?username=${comment.userId.username}`)}} 
                      
                      src={`${BASE_URL}uploads/${comment.userId?.profilePicture}`}alt="avtar" className={styles.avtarImg} />
                       <p style={{fontWeight:"500", fontSize:"1.1rem"}}>
                        {comment.userId.name}
                      </p>
                      </div>
                     <div className="">
                      
                      {/* <p >{comment.userId.username}</p> */}
                     </div>
                      {/* </div> */}

                      <p className="">{comment.comment}</p>
                    </div>
                      

                  )
                })}


                </div>
              
              }



            <div className={styles.postCommnetContainer}>

            <input type="text" value={commnetText} onChange={(e)=>{setCommnetText(e.target.value)}} placeholder="Comment " />
                  
            <div 
            onClick={async()=>{
              // dispatch action to create comment here
              await dispatch(postComment({post_id:postState.postId, comment:commnetText}));
              setCommnetText("");
              await dispatch(getCommentsByPost({post_id:postState.postId}));
            }}
                       
            className={styles.PostCommnetContainer_commentBtn}>

              <p className="">Comment</p>
            </div>

                </div>
        
            </div>

            


          </div>
          
          }
        </DashboardLayout>
      </UserLayout>
    );
  }
}

export default dashboard;
