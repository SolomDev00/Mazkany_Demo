import { useEffect } from "react";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const cookie = Cookie();

  useEffect(() => {
    // Delete all tokens
    cookie.remove("solom");
    cookie.remove("isVerified");
    navigate("/login");
  }, []);

  return null;
};

export default Logout;
