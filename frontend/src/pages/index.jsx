import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/router";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router=useRouter();
  return (
    <>
    <div className="container">
      <div className="mainContainer">
        <div className="mianCntainer__Left">

    <h1>Connect with friends without Exaggeration </h1>


        </div>
        <p>A true social media platfrom, with stories with no blufs</p>
         <button onClick={()=>{router.push("/login")}} className="Joinbutton">JOIN</button>

        <div className="mainContainer__Right">
          <img src="/imgaes/banner.png "></img>
        </div>
      </div>
    </div>
    </>
   
  );
}
