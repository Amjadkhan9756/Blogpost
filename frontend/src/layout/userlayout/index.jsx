import NavbarComponent from "@/Component/Navbar";

function UserLayout({children}) {
    return ( 

       <div>
        <NavbarComponent></NavbarComponent>
       
         {children}
       </div>
     );
}

export default UserLayout;