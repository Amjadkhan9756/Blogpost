
import UserLayout from "@/layout/userlayout";
import DashboardLayout from "@/layout/dasboardLayout";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllUser } from "@/config/redux/action/authaction";
import {BASE_URL } from "@/config/index";
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
                
                return(

                    <div  onClick={()=>{router.push(`/view_profile?username=${users.userId.username}`)}} className={styles.userCard} key={users._id}>
                    <img src={`${BASE_URL}uploads/${users.userId?.profilePicture}`}alt="avtar"  style={{width:"10%"}}/>
                   <div className="">

                     <h3 className={styles.userName}>{users.userId.name}</h3>
                    <p style={{color:"gray"}} className={styles.userName}>{users.userId.username}</p>
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