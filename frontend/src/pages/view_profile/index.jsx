

import React from "react";
import { useSearchParams } from "next/navigation";
import { clientServer } from "@/config";
import UserLayout from "@/layout/userlayout";
import DashboardLayout from "@/layout/dasboardLayout";
import styles from "./[username].module.css";
import { getImageUrl } from "@/config";
import Avatar from "@/Component/Avatar";
import VerifiedBadge from "@/Component/VerifiedBadge";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { allPosts } from "@/config/redux/action/postaction";
import { useRouter } from "next/router";
import {
  sendConnectionRequest,
  getConnectionRequest,
  getMyConnectionsRequest,
} from "@/config/redux/action/authaction";

export default function ViewProfile({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postreducer = useSelector((state) => state.postsreducer);
  const searchParams = useSearchParams();
  console.log("userProfile", userProfile);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [isConnectionNull, setisConnectionNull] = useState(true);
  const getUserPost = async () => {
    await dispatch(allPosts());
    await dispatch(
      getConnectionRequest({ token: localStorage.getItem("token") })
    );
    await dispatch(
      getMyConnectionsRequest({ token: localStorage.getItem("token") })
    );
  };

  useEffect(() => {
    let post = postreducer.posts?.filter((post) => {
      return post.userId?.username === router.query.username;
    });
    setUserPosts(post);
  }, [postreducer.posts, router.query.username]);

  useEffect(() => {
    if (
      authState.connections?.some(
        (user) =>user.connectionId._id === userProfile.userId?._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connections?.find(
          (user) => user.connectionId._id === userProfile.userId._id
        ).status_accepted === true
      ) {console.log("//////////////////////////////////////////////////////////", authState.connections);
        setisConnectionNull(false);
      }
    }


    if (
      authState.connectionRequet?.some(
        (user) => user.userId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connectionRequet?.find(
          (user) => user.userId._id === userProfile.userId._id
        ).status_accepted === true
      ) {console.log("//////////////////////////////////////////////////////////", authState.connections);
        setisConnectionNull(false);
      }
    }


  }, [authState.connections, authState.connectionRequet, userProfile]);

  useEffect(() => {
    getUserPost();
  }, []);

  if (!userProfile) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.notFound}>User profile not found</div>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.profileContainer}>
          {/* Banner */}
          <div className={styles.banner}></div>

          {/* Profile Header */}
          <div className={styles.header}>
            <Avatar
              src={userProfile.userId?.profilePicture}
              name={userProfile.userId?.name}
              className={styles.profilePic}
              initialClassName={styles.profilePicInitials}
            />

            <div className="userInfoConnect">
              <div className={styles.userInfo}>
                <h2 className={styles.name} style={{ display: "inline-flex", alignItems: "center" }}>
                  {userProfile.userId?.name}
                  <VerifiedBadge verified={userProfile.userId?.verified} size={20} />
                </h2>
                <p className={styles.headline}>
                  {userProfile.currentPost || "@Academor"}
                </p>
                <p className={styles.bio}>
                  {userProfile.bio ||
                    "MERN Stack Developer|| Nodejs || ExpressJs || ReactJs || MongoDB || DSA learner in Java"}
                </p>
                {/* {connection button} */}
              </div>
              <div className={styles.sendConnectionContainer}>
                {" "}
                {isCurrentUserInConnection ? (
                  <button>{isConnectionNull ? "Pending" :"Connected"}</button>
                ) : (
                  <button
                    onClick={ () => {
                      dispatch(
                         sendConnectionRequest({
                          token: localStorage.getItem("token"),
                          user_id: userProfile.userId._id,
                        })
                        
                      );












                    }}
                    className=""
                  >
                    Connect
                  </button>
                )}
              </div>
              <div
                onClick={async () => {
                  const response = await clientServer.get(
                    `/user/user_profile_download?id=${userProfile.userId?._id}`
                  );
                  const url = getImageUrl(response.data.message);
                  if (url) window.open(url, "_blank");
                  console.log(response.data.message);
                }}
                className={styles.profileDownload}
                style={{ width: "1.4rem", cursor: "pointer" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </div>
            </div>
          </div>

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
          </div>

          {/* Education Section */}
          <div className={styles.section}>
            <h3>Education</h3>
            {userProfile.education?.length > 0 ? (
              userProfile.education.map((edu, idx) => (
                <div key={idx} className={styles.card}>
                  <h4>{edu.institution}</h4>
                  <p>{edu.degree}</p>
                  <p>{edu.duration}</p>
                </div>
              ))
            ) : (
              <p>Bachelor in computer Science</p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export const getServerSideProps = async (context) => {
  try {
    const request = await clientServer.get(
      "/user/get_user_profile_based_on_username",
      {
        params: {
          username: context.query.username,
        },
      }
    );

    return {
      props: {
        userProfile: request.data.profile[0] || null,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        userProfile: null,
      },
    };
  }
};
