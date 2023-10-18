import Err403 from "./403";
import { USER } from "../../API/Api";
import Cookie from "cookie-universal";
import { Axios } from "../../API/Axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingSubmit from "../../Components/Loading/Loading";

export default function RequireAuth({ allowedRole }) {
  // User
  const [user, setUser] = useState("");

  // Navgate
  const Navigate = useNavigate();

  useEffect(() => {
    Axios.get(`/${USER}`)
      .then((data) => setUser(data.data))
      .catch(() => Navigate("/login", { replace: true }));
  }, []);

  // Token & Cookies
  const cookie = Cookie();
  const token = cookie.get("solom");

  return token ? (
    user === "" ? (
      <LoadingSubmit />
    ) : allowedRole.includes(user.role) ? (
      <Outlet />
    ) : (
      <Err403 role={user.role} />
    )
  ) : (
    <Navigate to={"/login"} replace={true} />
  );
}

// For Dashboard !!!
