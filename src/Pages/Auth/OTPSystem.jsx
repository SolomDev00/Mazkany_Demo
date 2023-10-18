import "./AuthStyle.css";
import axios from "axios";
import Cookie from "cookie-universal";
import { Form } from "react-bootstrap";
import { OTP_SEND, baseURL } from "../../API/Api";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import LoadingSubmit from "../../Components/Loading/Loading";

const OTP = () => {
  // States
  const [form, setForm] = useState({
    otp: "",
    new_password: "",
  });

  const [isVerified, setIsVerified] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);
  const [isDataSent, setIsDataSent] = useState(false);

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

  // Check if user is verified
  useEffect(() => {
    const token = cookie.get("solom");
    const isVerified = cookie.get("isVerified");
    if (!token || !isVerified) {
      navigate("/login", { replace: true });
    }
  }, []);

  // useEffect(() => {
  //   return () => {
  //     cookie.remove("solom");
  //     cookie.remove("isVerified");
  //   };
  // }, []);

  // Handle From Change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle Foucs Ref
  useEffect(() => {
    focus.current.focus();
  }, []);

  // Handle Submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const token = cookie.get("solom");
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      const res = await axios.post(`${baseURL}/${OTP_SEND}`, form, config);
      setLoading(false);
      setIsDataSent(true);
      cookie.remove("solom");
      cookie.remove("isVerified");
      navigate("/login", { replace: true });
    } catch (err) {
      setLoading(false);
      if (err.response.status === 400) {
        setErr("رمز التحقق غير صحيح او كلمة المرور غير مطابقة  ..");
      } else {
        setErr("مشكلة من الخادم ، يرجي المحاولة بعد قليل ..");
      }
    }
  }

  // Check if OTP and password are valid
  useEffect(() => {
    if (form.otp.length === 6 && form.new_password.length >= 8) {
      setIsOtpValid(true);
      setIsPasswordValid(true);
    } else {
      setIsOtpValid(false);
      setIsPasswordValid(false);
    }
  }, [form.otp, form.new_password]);

  // Check if password and re-typed password match
  useEffect(() => {
    if (form.new_password === form.new_passwordR) {
      setIsPasswordMatched(true);
    } else {
      setIsPasswordMatched(false);
    }
  }, [form.new_password, form.new_passwordR]);

  // Send data if OTP and password are valid and matched
  useEffect(() => {
    if (isOtpValid && isPasswordValid && isPasswordMatched) {
      handleSubmit();
    }
  }, [isOtpValid, isPasswordValid, isPasswordMatched]);

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
              <h2 className="authFormTitleStyle">هل نسيت كلمة المرور ؟</h2>
              <Form.Group
                className="authFormStyleR"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>كود التفعيل</Form.Label>
                <Form.Control
                  ref={focus}
                  name="otp"
                  type="number"
                  autoComplete="username"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="اكتب كود التفعيل"
                  required
                />
              </Form.Group>
              <Form.Group
                className="authFormStyleR"
                controlId="exampleForm.ControlInput2"
              >
                <Form.Label>كلمة المرور الجديدة</Form.Label>
                <Form.Control
                  name="new_password"
                  type="password"
                  autoComplete="username"
                  value={form.new_password}
                  onChange={handleChange}
                  placeholder="اكتب كلمة المرور الجديدة"
                  required
                />
              </Form.Group>
              <Form.Group
                className="authFormStyleR"
                controlId="exampleForm.ControlInput3"
              >
                <Form.Label>إعادة كلمة المرور الجديدة</Form.Label>
                <Form.Control
                  name="new_passwordR"
                  type="password"
                  autoComplete="username"
                  onChange={handleChange}
                  placeholder="اكتب إعادة كلمة المرور الجديدة"
                  required
                />
              </Form.Group>
            </div>
            <div className="lastFormStyle">
              {isDataSent ? (
                <Link to={"/"} className="formBtnStyle">
                  العودة إلى الصفحة الرئيسية
                </Link>
              ) : (
                <button
                  className="formBtnStyle"
                  // disabled={
                  //   !isOtpValid || !isPasswordValid || !isPasswordMatched
                  // }
                >
                  ابدا الآن
                </button>
              )}
              {err !== "" && (
                <span className="error">
                  {err}
                  <FaExclamationCircle className="error-icon" />
                </span>
              )}
              <p className="re-Login">
                هل تذكرت كلمة المرور ؟ <Link to={"/login"}>الي الخلف</Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default OTP;
