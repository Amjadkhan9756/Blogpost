import { useEffect } from "react";
import { useState } from "react";
import UserLayout from "@/layout/userlayout";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "@/config/redux/action/authaction";
import { emptyMessage } from "@/config/redux/reducer/authreducer";
function LoginComponent() {
    const dispatch= useDispatch();
    const router= useRouter();

    const authState= useSelector((state) => state.auth);

    const [name, setname]= useState("");
     const [username, setusername]= useState("");
      const [email, setemail]= useState("");
      const [password, setpassword]= useState("");
       const [isloggedMethod, setisloggedMethod]= useState(false);

    const handleRegisterUser= ()=>{
        console.log("HI, it 's working ");
        console.log(authState.message);
        dispatch(registerUser({username, name, email, password}));
    }

    const  handleLoginuser= ()=>{ 

          dispatch(loginUser({email, password}));
     }

  


    useEffect(() => {
        if(authState.isloggedin){
            router.push("/dashboard");
        }

    },[authState.isloggedin]);



    useEffect(()=>{
        if(localStorage.getItem("token")){
            router.push("/dashboard");
        }
    },[]);
   useEffect(()=>{
    dispatch(emptyMessage());
   }, [isloggedMethod]);
  

    return ( 
        <UserLayout>
            <div className={styles.container}>
            <div className={styles.cardContainer}>
                <div className={styles.cardContainer_left}>
                   <p className={styles.cardleft_heading}>{isloggedMethod? "Sign In" :"Sign Up"}</p> 
          <p style={{color:authState.isError ? "red":"green"}}>{authState.message}</p> 
                <div className={styles.inputcontainers  }>
                    {!isloggedMethod && <div className={styles.inputRow}>
                        <input onChange={(e)=>setusername(e.target.value)} className={styles.inputField} type="text"  placeholder="Username"/>
                     <input   onChange={(e)=>setname(e.target.value)} className={styles.inputField} type="text"  placeholder="Name"/>
                    </div>}
                   
                    <input  onChange={(e)=>setemail(e.target.value)} className= {styles.inputField } type="email"  placeholder="email"/>
                    <input onChange={(e)=>setpassword(e.target.value)} className= {styles.inputField } type="password"  placeholder="password"/>
                    <div className={styles.buttonWithOutline} onClick={()=>{if(isloggedMethod){
                         handleLoginuser();
                    }
        
                        else{
                            handleRegisterUser();
                        }
                    }}>
                        <p className={styles.buttonWithOutline_text}>
                            {isloggedMethod? "Sign In" :"Sign Up"}
                        </p>
                    </div>
                </div>
                
                </div>
                <div className={styles.cardContainer_right}>
                    {isloggedMethod ?<p>Don't have an account</p>:<p>Already have an account </p>}
                    <div onClick={()=>setisloggedMethod(!isloggedMethod)}
                     className={styles.buttonWithOutline} 
                     style={{color:"black" , textAlign:"center", cursor:"pointer"}}>
                     <p className={styles.buttonWithOutline_text}>
                            {isloggedMethod? "Sign Up" :"Sign In"}
                        </p>
                    </div>
                </div>
            </div>
            </div>
 

        </UserLayout>
        
     );
}

export default LoginComponent;