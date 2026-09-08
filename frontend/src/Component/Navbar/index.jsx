import { useSelector } from "react-redux";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
function NavbarComponent() {


  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  console.log("term " + authState.user)
  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h2 className={styles.proConnect}

          onClick={() => {
            router.push("/");
          }}
        >
          socialBlogsSite
        </h2>
        <div className={styles.navBarOptionContainer}>


          {!authState?.profileFetch && (

            <div style={{ cursor: 'Pointer' }}
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              Be a part
            </div>
          )}

        </div>
      </nav>
    </div>
  );
}

export default NavbarComponent;
