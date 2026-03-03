import { BASE_URL } from "@/config";
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
            authState.connectionRequet?.filter((connection)=>connection.status_accepted === null).map((user) => {
              return (
                <div
                  className={styles.userCard}
                  onClick={() => {
                    router.push(
                      `/view_profile?username=${user.userId.username}`
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
                      <img
                        src={`${BASE_URL}uploads/${user.userId.profilePicture}`}
                        alt="profilePicture"
                        className=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p className="">{user.userId.username}</p>
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
       
            {authState.connectionRequet?.filter((connection)=>connection.status_accepted !== null)?.map((user,index )=>{
              return (
               <div
                  className={styles.userCard}
                  onClick={() => {
                    router.push(
                      `/view_profile?username=${user.userId.username}`
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
                      <img
                        src={`${BASE_URL}uploads/${user.userId.profilePicture}`}
                        alt="profilePicture"
                        className=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p className="">{user.userId.username}</p>
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
