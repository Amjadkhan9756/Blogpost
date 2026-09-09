import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { logoutUser, setisTokenThere } from "@/config/redux/reducer/authreducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Avatar from "@/Component/Avatar";
function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      router.push("/login");
    }
    dispatch(setisTokenThere());
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.homeContainer}>
        <div className={styles.homeContainer_left}>
          {/* <div className={styles.brand}>devlog</div> */}
          <div
            onClick={() => router.push("/dashboard")}
            className={
              router.pathname === "/dashboard"
                ? `${styles.sidebarOption} ${styles.activeSidebarOption}`
                : styles.sidebarOption
            }
          >
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
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>

            <p>Home</p>
          </div>
          <div
            onClick={() => router.push("/discover")}
            className={
              router.pathname === "/discover"
                ? `${styles.sidebarOption} ${styles.activeSidebarOption}`
                : styles.sidebarOption
            }
          >
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>

            <p>Search</p>
          </div>

          <div
            onClick={() => router.push("/my_connections")}
            className={
              router.pathname === "/my_connections"
                ? `${styles.sidebarOption} ${styles.activeSidebarOption}`
                : styles.sidebarOption
            }
          >
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
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>

            <p>Connections</p>
          </div>

          <div onClick={handleLogout} className={styles.sidebarOption}>
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
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            <p>Log out</p>
          </div>
        </div>

        <div className={styles.homeContainer_feedContainer}>{children}</div>
        <aside className={styles.homeContainer_extraContainer}>
          {authState.user && (
            <div
              className={styles.profileSummary}
              onClick={() => router.push("/profile")}
            >
              <div className={styles.profileCover} />
              <div className={styles.profileSummaryBody}>
                <Avatar
                  src={authState.user.userId?.profilePicture}
                  name={authState.user.userId?.name}
                  className={styles.profileSummaryAvatar}
                  initialClassName={styles.profileSummaryAvatar}
                />
                <h3>{authState.user.userId?.name || "Your profile"}</h3>
                <section className={styles.profileSummaryEducation}>
                  {/* <h4>Education</h4> */}
                  {authState.user.education?.length > 0 ? (
                    authState.user.education.map((education, index) => (
                      <div key={`${education.school || "education"}-${index}`}>
                        <strong>{education.school || "School"}</strong>
                        <span>{education.degree || "Degree not added"}</span>
                        <span>{education.fieldStudy || "Field of study not added"}</span>
                      </div>
                    ))
                  ) : (
                    <span>Add your education</span>
                  )}
                </section>
                <p className={styles.profileSummaryAbout}>
                  {authState.user.about ||
                    authState.user.bio ||
                    "Add an About section to tell people more about you."}
                </p>
                <span>View profile</span>
              </div>
            </div>
          )}
        </aside>
      </div>

      <div className={styles.mobileNavBar}>
        <div
          onClick={() => router.push("/dashboard")}
          className={styles.singleitemNavbarView}
        >
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
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </div>

        <div
          onClick={() => router.push("/discover")}
          className={styles.singleitemNavbarView}
        >
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
        </div>

        <div
          onClick={() => router.push("/my_connections")}
          className={styles.singleitemNavbarView}
        >
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
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
