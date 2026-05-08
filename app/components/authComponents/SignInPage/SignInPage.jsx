"use client";

import useAuth from "@/app/hooks/useAuth";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFacebook, FaGoogle } from "react-icons/fa";

const SignInPage = () => {
  const { user, googleLogin, emailLogin, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");

  if (user) {
    router.push("/");
  }

  useEffect(() => {
    const tryFetch = async () => {
      const authData = JSON.parse(localStorage.getItem("auth"));
      if (authData?.user?.email) {
        setEmail(authData?.user?.email);
      }
    };
    tryFetch();
  }, []);

  const handleLoginUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    console.log("User data from form:", userData);
    const loginUser = await emailLogin(userData.email, userData.password);
    if (loginUser?.user) {
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await googleLogin();
      if (user?.user) {
        const payload = {
          name: user?.user?.displayName || "",
          email: user?.user?.email || "",
          uid: user?.user?.uid,
          phone: user?.user?.phoneNumber || "",
          photo: user?.user?.photoURL || "",
          emailVerified: user?.user?.emailVerified || false,
        };
        const userCreated = await axiosInstance.post("/users/signup", payload);
        if (userCreated?.data?.success) {
          const responseData = userCreated?.data;
          console.log("User created successfully in backend:", responseData);
          // save token and user data to localStorage
          const authData = {
            token: responseData?.data?.token,
            user: responseData?.data?.user,
            timestamp: new Date().getTime(), // to check expiry
          };
          localStorage.setItem("auth", JSON.stringify(authData));
          setTimeout(() => {
            router.push("/");
          }, 100);
        } else {
          console.error(
            "Failed to create user in backend:",
            userCreated?.data?.message,
          );
        }
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleFacebookLogin = () => {
    toast.success("Facebook Login Coming Soon", {
      style: {
        border: "1px solid #713200",
        padding: "16px",
        color: "#713200",
      },
      iconTheme: {
        primary: "#713200",
        secondary: "#FFFAEE",
      },
    });
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <h1 className="text-orange-600 text-2xl font-bold py-2">
        Sign In to Your Account
      </h1>
      <form
        onSubmit={handleLoginUser}
        className="flex flex-col items-center gap-6"
      >
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-md outline-0 bg-gray-800 focus:outline-1 focus:outline-orange-700 font-bold"
            placeholder="Email"
          />

          <label className="label">Password</label>
          <input
            type="password"
            name="password"
            className="px-4 py-2 rounded-md outline-0 bg-gray-800 focus:outline-1 focus:outline-orange-700 font-bold"
            placeholder="Password"
          />

          <button className="btn btn-neutral mt-4">Sign In</button>
        </fieldset>
      </form>
      {/* Divider with fancy line */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-100"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-8 bg-white text-sm text-gray-400 font-semibold uppercase tracking-wider">
            <span className="bg-linear-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">
              Or register with
            </span>
          </span>
        </div>
      </div>

      {/* Social Buttons with hover effects */}
      <div className="flex items-center justify-center gap-5">
        <button
          onClick={handleGoogleLogin}
          className="cursor-pointer flex items-center gap-3 px-6 py-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
        >
          <div className="p-1 rounded-full bg-linear-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition-transform duration-300">
            <FaGoogle className="text-white text-sm" />
          </div>
          <span className="text-gray-700 font-medium group-hover:text-blue-700 transition-colors">
            Google
          </span>
        </button>

        <button
          onClick={handleFacebookLogin}
          className="cursor-pointer flex items-center gap-3 px-6 py-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
        >
          <div className="p-1 rounded-full bg-linear-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition-transform duration-300">
            <FaFacebook className="text-white text-sm" />
          </div>
          <span className="text-gray-700 font-medium group-hover:text-blue-700 transition-colors">
            Facebook
          </span>
        </button>
      </div>
      {/* navigate to sing in page */}
      <p className="text-sm text-gray-500 mt-6 text-center">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/login")}
          className="text-orange-600 font-medium cursor-pointer hover:underline"
        >
          Sign In
        </span>
      </p>
    </div>
  );
};

export default SignInPage;
