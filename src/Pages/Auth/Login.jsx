import "./AuthStyle.css";
import axios from "axios";
import Cookie from "cookie-universal";
import { Form } from "react-bootstrap";
import { LOGIN, baseURL } from "../../API/Api";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import LoadingSubmit from "../../Components/Loading/Loading";

const Login = () => {
  // States
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Ref
  const focus = useRef("");

  // Cookies
  const cookie = Cookie();

  // Navigate
  const navigate = useNavigate();

  // Loading
  const [loading, setLoading] = useState(false);

  // Error Messages
  const [err, setErr] = useState("");

  // Handle From Change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    cookie.remove("solom");
    cookie.remove("isVerified");
  }, []);

  // Handle Foucs Ref
  useEffect(() => {
    focus.current.focus();
  }, []);

  // Handle Submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/${LOGIN}`, form);
      setLoading(false);
      const token = res.data.token;
      cookie.set("solom", token);
      console.log(res);
      navigate("/", { replace: true });
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 400) {
        setErr("اسم المستخدم او كلمة المرور غير صحيحة ..");
      } else {
        setErr("مشكلة من الخادم ، يرجى المحاولة بعد قليل ..");
      }
    }
  }

  return (
    <>
      {loading && <LoadingSubmit />}
      <div className="container">
        <div className="row" style={{ height: "100vh" }}>
          <Form className="form" onSubmit={handleSubmit}>
            <div className="authForm">
              <img
                className="authFormLogo"
                src={require("../../Assets/Images/logo.png")}
                alt="logo"
              />
              {/* <h2 className="authFormTitleStyle">تسجيل الدخول</h2> */}
              <Form.Group
                className="authFormStyle"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>البريد الالكتروني / اسم المستخدم</Form.Label>
                <Form.Control
                  ref={focus}
                  name="email"
                  type="email"
                  autoComplete="username"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="اكتب البريد الالكتروني / اسم المستخدم"
                  required
                />
              </Form.Group>
              <Form.Group
                className="authFormStyle"
                controlId="exampleForm.ControlInput2"
              >
                <Form.Label>كلمة المرور</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="اكتب كلمة المرور"
                  autoComplete="current-password"
                  minLength={6}
                  required
                />
              </Form.Group>
            </div>
            <div className="lastFormStyle">
              <div className="checkboxStyle">
                <input type="checkbox" id="remember-me" />
                <label htmlFor="remember-me">تذكرني</label>
              </div>
              <Link to={"/resetpassword"} className="faqPassword">
                هل نسيت كلمة المرور ؟
              </Link>
              <button className="formBtnStyle">تسجيل الدخول</button>
              {err !== "" && (
                <span className="error">
                  {err}
                  <FaExclamationCircle className="error-icon" />
                </span>
              )}
              <p className="re-Login">
                هل ليس لديك حساب ؟ <Link to={"/register"}>تسجيل حساب جديد</Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
