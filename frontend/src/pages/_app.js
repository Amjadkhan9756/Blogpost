import "@/styles/globals.css";
// import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useEffect } from "react";
import { Provider } from "react-redux";

import {store} from "@/config/redux/store";
export default function App({ Component, pageProps }) { useEffect(() => {
    // ✅ Import Bootstrap JS only in the browser
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return <Provider store= {store}>
  <Component {...pageProps} /> 
 
  </Provider>;
}
