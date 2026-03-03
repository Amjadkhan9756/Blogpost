import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/router";
import UserLayout from "@/layout/userlayout";

import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
const router= useRouter();
  return (
    <UserLayout>
    <>
    
    <div className={styles.container}>
    <div className={styles.mainContainer}>
      <div className={styles.container_Left}>
         <p className={styles.para}>Connect with friends without Exaggeration</p>
         <p  className={styles.para}> A true social media platfrom, with stories with no blufs</p>
         <div onClick={()=>{router.push("/login")}} className={styles.buttonJoin}>
          <p>Join Now</p>
         </div>
         </div>
      <div className={styles.container_right}>
        <img  style={{width:"95%"}} src="images/banner.png" alt="connection_img" />
      </div>
    </div>

    </div>

    </>
    </UserLayout>
   
  );
}
