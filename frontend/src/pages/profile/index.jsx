// pages/profile.tsx or .jsx
import DashboardLayout from "@/layout/dasboardLayout";
import UserLayout from "@/layout/userlayout";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { BASE_URL, clientServer } from "@/config";
import { useSelector, useDispatch } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authaction";
import { allPosts } from "@/config/redux/action/postaction";

const Profile = () => {
  const postreducer = useSelector((state) => state.postsreducer);

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [userProfile, setuserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const[isOpenModal, setisOpenModal]= useState(false);
  const [Expreince, setExpreince]= useState();
  const [updateProfileBtn, setupdateProfileBtn] = useState(true);
 const[isOpenModalForEdu , setisOpenModalForEdu ]= useState(false);
  useEffect(() => {
    dispatch(getAboutUser({ token:localStorage.getItem("token")}));
     dispatch(allPosts());

   
  }, []);

  const[inputData, setinputData]= useState({company:"", position: "", year:""});
const[inputDataEdu, setinputDataEdu]= useState({school:"", degree: "", fieldStudy:""})

  const handleInputWorkChnage= async(e)=>{
   const {name, value} = e.target;
   setinputData({...inputData, [name]:value})



  }
   const handleInputWorkChnageEdu= async(e)=>{
   const {name, value} = e.target;
   setinputDataEdu({...inputDataEdu, [name]:value})



  }

  useEffect(() => {

    console.log(" the company is that here please check that",authState.user)
    if (authState.user != undefined) {
      setuserProfile(authState.user);
      let post = postreducer.posts?.filter((post) => {
        return post.userId.username === authState.user?.userId?.username;
      });
      setUserPosts(post);
    }
  }, [authState.user, postreducer.posts]);

  const uploadprofilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile", file);
    formData.append("token", localStorage.getItem("token"));
    const response = await clientServer.post("/update_profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
   await  dispatch(getAboutUser({ token:localStorage.getItem("token")}));
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const response = await clientServer.post("/update_Profile_Data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      postwork: userProfile.postwork,
      education: userProfile.education,
    });
    await dispatch(getAboutUser({ token:localStorage.getItem("token")}));
    setupdateProfileBtn(false);
  };
  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile?.userId && (
          <div className={styles.profileContainer}>
            {/* Banner */}
            <div className={styles.banner}></div>

            {/* Profile Header */}
            <div className={styles.header}>
              <div className="">
                <label
                  htmlFor="uploadprofilePicture"
                  className={styles.profile_overlay}
                >
                  <p className="">edit </p>
                </label>
                <input
                  onChange={(e) => uploadprofilePicture(e.target.files[0])}
                  type="file"
                  id="uploadprofilePicture"
                  style={{ display: "none" }}
                />
                <img
                  src={`${BASE_URL}uploads/${userProfile.userId?.profilePicture}`}
                  alt="Profile Picture"
                  className={styles.profilePic}
                />
              </div>

              <div className={styles.userInfoConnect}>
                <div className={styles.userInfo}>
                  {/* <h2 className={styles.name}>{userProfile.userId?.name}</h2> */}
                  <input
                    type="text"
                    className={styles.editname}
                    value={userProfile.userId.name}
                    onChange={(e) => {
                      setuserProfile({
                        ...userProfile,
                        userId: { ...userProfile.userId, name: e.target.value },
                      });
                      setupdateProfileBtn(true);
                    }}
                  />
                  <p className={styles.headline}>
                    {authState.user?.postwork[0]?.company || "@Academor"}
                    
                  </p>
                  <div className={styles.textarea_container}>
                    <textarea
                      name=""
                      id=""
                      value={
                        userProfile.bio
  
                      }
                      onChange={(e) => {
                        setuserProfile({ ...userProfile, bio: e.target.value });
                        
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length/80))}
                      style={{  }}
                    />
                  </div>
                  {/* {connection button} */}
                </div>
              </div>
            </div>
            {userProfile != authState.user && (
              <div
                className={styles.updateProfileBtn}
                onClick={() => updateProfileData()}
              >
                Update Profile
              </div>
            )}

            {/* About Section */}
            {/* <div className={styles.section}>
              <h3>About</h3>
              <p>
                {userProfile.about ||
                  " I am a passionate Full Stack Developer with a strong foundation in Java and expertise in Data Structures and Algorithms (DSA)Skilled in building scalable, responsive, and efficient web applications, I enjoy solving complex problems and bringing creative solutions to life. I have hands-on experience with both front-end and back-end technologies, and I am committed to writing clean, maintainable code that drives real-world impact,, "}
              </p>
            </div> */}

            {/* Experience Section */}
            <div className={styles.section}>
              <h3>Experience</h3>
              {userProfile.postwork?.length > 0 ? (
                userProfile.postwork.map((work, idx) => (
                  <div key={idx} className={styles.card}>
                    <h4>{work.position}</h4>
                    <p>{work.company}</p>
                    <p>{work.years}</p>
                  </div>
                ))
              ) : (
                <p>No postwork..... posted</p>
              )}
              <button    
              
  onClick={()=>{setisOpenModal(true)}}              
              className={styles.addExpreince}>Add Experience</button>
            </div>

            {/* Education Section */}
            <div className={styles.section}>
              <h3>Education</h3>
              {userProfile.education?.length > 0 ? (
                userProfile.education.map((edu, idx) => (
                  <div key={idx} className={styles.card}>
                    <h4>{edu.school}</h4>
                    <p>{edu.degree}</p>
                    <p>{edu.fieldStudy}</p>
                  </div>
                ))
              ) : (
                <p>Bachelor in computer Science</p>
              )}
              <button    
              
  onClick={()=>{setisOpenModalForEdu(true)}}              
              className={styles.addExpreinceEdu}>Add Education</button>
            </div>
                {/* <button    
              
  onClick={()=>{setisOpenModalForEdu(true)}}              
              className={styles.addExpreinceEdu}>Add Education</button> */}
          </div>
        )}


















        {isOpenModal !=""&&
      
          <div 
          
          onClick={()=>{setisOpenModal(false)}}
          className={styles.commentsContainer}>


          <div
            onClick={(e)=>e.stopPropagation()}
            className={styles.AllCommentsContainer}>
          <input  onChange={handleInputWorkChnage}  name="company" className= {styles.addExpreinceInput } type="text"  placeholder="Enter Company"/>
          <input  onChange={handleInputWorkChnage}  name="position" className= {styles.addExpreinceInput } type="text"  placeholder="Enter Position "/>
          <input  onChange={handleInputWorkChnage}  name="years" className= {styles.addExpreinceInput } type="Number"  placeholder="Enter Year "/>
<div   

 onClick={()=>{setuserProfile({...userProfile,postwork:[...userProfile.postwork, inputData]}) ,setisOpenModal(false)} }
className={styles.updateProfileBtnEX}>Add Work    
</div>
            </div>
          </div>
}









 {isOpenModalForEdu !=""&&
      
          <div 
          
          onClick={()=>{setisOpenModalForEdu(false)}}
          className={styles.commentsContainer}>


          <div
            onClick={(e)=>e.stopPropagation()}
            className={styles.AllCommentsContainer}>
          <input  onChange={handleInputWorkChnageEdu}  name="school" className= {styles.addExpreinceInput } type="text"  placeholder="Enter School"/>
          <input  onChange={handleInputWorkChnageEdu}  name="degree" className= {styles.addExpreinceInput } type="text"  placeholder="Enter degree "/>
          <input  onChange={handleInputWorkChnageEdu}  name="fieldStudy" className= {styles.addExpreinceInput } type="text"  placeholder="Enter Fieldstudy "/>
<div   

 onClick={()=>{setuserProfile({...userProfile,education:[...userProfile.education, inputDataEdu]}) ,setisOpenModalForEdu(false)} }
className={styles.updateProfileBtnEX}>Add Education...    
</div>
            </div>
          </div>
}





      </DashboardLayout>
    </UserLayout>
  );
};

export default Profile;
