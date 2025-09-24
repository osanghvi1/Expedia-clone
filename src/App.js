import "./App.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { AllRoutes } from "./Pages/AllRoutes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase_app from "./01_firebase/config_firebase";
import { login_user } from "./Redux/Authantication/auth.action";

const auth = getAuth(firebase_app);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Firebase auth state changed:", firebaseUser);

      if (firebaseUser) {
        // User is signed in, check if we have their profile in localStorage
        const storedUserData = localStorage.getItem("MkuserData");
        const isAuth = localStorage.getItem("MkisAuth");

        console.log("Stored user data:", storedUserData, "isAuth:", isAuth);

        if (storedUserData && isAuth === "true") {
          // User data exists in localStorage, restore Redux state
          const userData = JSON.parse(storedUserData);
          dispatch(login_user(userData));
          console.log("User session restored from localStorage");
        }
      } else {
        // User is signed out, clear any stored data
        localStorage.setItem("MkuserData", JSON.stringify({}));
        localStorage.setItem("MkisAuth", JSON.stringify(false));
        console.log("User signed out, localStorage cleared");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="App">
      <Navbar />

      <AllRoutes />

      <Footer />


    </div>
  );
}

export default App;
