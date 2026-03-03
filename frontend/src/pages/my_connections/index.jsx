import Avatar from "@/Component/Avatar";
import VerifiedBadge from "@/Component/VerifiedBadge";
import { getMyConnectionsRequest } from "@/config/redux/action/authaction";
import DashboardLayout from "@/layout/dasboardLayout";
import UserLayout from "@/layout/userlayout";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { connection } from "next/server";
import {acceptConnectionRequest} from  "@/config/redux/action/authaction";

function Myconnection() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnectionsRequest({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if (authState.connectionRequet?.length != 0) {
      console.log(" 8888888888888888", authState.connectionRequet);
    }
  }, [authState.connectionRequet]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div  style={{display:"flex", flexDirection:"column", gap:"1.2rem"}}>
          <h4>My Connections</h4>
          {authState.connectionRequet?.length == 0 && (
            <h1>No Connections Requests</h1>
          )}
          {authState.connectionRequet?.length !== 0 &&
            authState.connectionRequet
              ?.filter((connection)=>connection.status_accepted === null)
              .map((user) => {
              const profileUser = user.userId;

              if (!profileUser) return null;

              return (
                <div
                  className={styles.userCard}
                  onClick={() => {
                    router.push(
                      `/view_profile?username=${profileUser.username}`
                    );
                  }}
                >
                  <div
                    className={styles.layout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.1rem",
                    }}
                  >
                    <div className={styles.profilePicture}>
                      <Avatar
                        src={profileUser.profilePicture}
                        name={profileUser.name}
                        className={styles.connectionAvatar}
                        initialClassName={styles.connectionAvatarInitials}
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3 style={{ display: "inline-flex", alignItems: "center" }}>
                        {profileUser.name}
                        <VerifiedBadge verified={profileUser.verified} size={16} />
                      </h3>
                      <p className="">{profileUser.username}</p>
                    </div>

                  
                      <button 
                      
                    onClick={(e)=>{e.stopPropagation();

                      dispatch(acceptConnectionRequest({
                        connectionId: user._id,
                        token: localStorage.getItem("token"),
                        action:"accepted",

                      }))
                    }}                  
                      className={styles.connectedBtn}>Accept</button>
                    
                  </div>
                </div>
              );
            })}
        <h4 className="">My Networks</h4>
       
            {authState.connectionRequet
              ?.filter((connection)=>connection.status_accepted !== null)
              ?.map((user,index )=>{
              const profileUser = user.userId;
              if (!profileUser) return null;

              return (
               <div
                  className={styles.userCard}
                  onClick={() => {
                    router.push(
                      `/view_profile?username=${profileUser.username}`
                    );
                  }}
                >
                  <div
                    className={styles.layout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.1rem",
                    }}
                  >
                    <div className={styles.profilePicture}>
                      <Avatar
                        src={profileUser.profilePicture}
                        name={profileUser.name}
                        className={styles.connectionAvatar}
                        initialClassName={styles.connectionAvatarInitials}
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3 style={{ display: "inline-flex", alignItems: "center" }}>
                        {profileUser.name}
                        <VerifiedBadge verified={profileUser.verified} size={16} />
                      </h3>
                      <p className="">{profileUser.username}</p>
                    </div>

                  
                      
                  </div>
                </div>
              )
            })}

        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default Myconnection;
