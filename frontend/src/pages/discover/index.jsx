
import UserLayout from "@/layout/userlayout";
import DashboardLayout from "@/layout/dasboardLayout";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllUser } from "@/config/redux/action/authaction";
import { getImageUrl } from "@/config/index";
import Avatar from "@/Component/Avatar";
import VerifiedBadge from "@/Component/VerifiedBadge";
import styles from "./style.module.css";
import { Router } from "next/router";
import { useRouter } from "next/router";


function Discover() {
    const dispatch = useDispatch();
    const authState= useSelector((state) => state.auth);
    const router= useRouter();
    useEffect(() => {
         if(!authState.all_profiles_fetched){
            dispatch(getAllUser());    
        }},[]);

        
    return ( 

        <UserLayout>
            <DashboardLayout>
        <div className={styles.alluserProfile}>

            <h1>Discover</h1>
            {authState.all_profiles_fetched && authState.all_profiles.map((users)=>{
                const profileUser = users.userId;
                if (!profileUser) return null;

                return(
                
                    <div  onClick={()=>{router.push(`/view_profile?username=${profileUser.username}`)}} className={styles.userCard} key={users._id}>
                    <Avatar
                      src={profileUser?.profilePicture}
                      name={profileUser?.name}
                      className={styles.discoverAvatar}
                      initialClassName={styles.discoverAvatarInitials}
                    />
                   <div className="">

                     <h3 className={styles.userName} style={{ display: "inline-flex", alignItems: "center" }}>
                      {profileUser.name}
                      <VerifiedBadge verified={profileUser.verified} size={16} />
                    </h3>
                    <p style={{color:"gray"}} className={styles.userName}>{profileUser.username}</p>
                   </div>
                   
                    <hr />


                    </div>
                )
            })}
        
        </div>
        </DashboardLayout>
    
    </UserLayout> 
);
}

export default Discover;