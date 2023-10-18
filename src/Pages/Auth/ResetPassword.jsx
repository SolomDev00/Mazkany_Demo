import "./AuthStyle.css";
import axios from "axios";
import Cookie from "cookie-universal";
import { Form } from "react-bootstrap";
import emailValidator from "email-validator";
import { useEffect, useRef, useState } from "react";
import { OTP_REQUEST, baseURL } from "../../API/Api";
import { Link, useNavigate } from "react-router-dom";
import LoadingSubmit from "../../Components/Loading/Loading";

const ResetPassword = () => {
  // States
  const [form, setForm] = useState({
    email: "",
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

  // Handle Foucs Ref
  useEffect(() => {
    focus.current.focus();
  }, []);

  // Handle Submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!emailValidator.validate(form.email)) {
        setLoading(false);
        setErr("برجاء التأكد من الايميل , لايوجد حساب مسجل بهذا الايميل ..");
        return;
      }
      const token = cookie.get("solom");
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      const res = await axios.post(`${baseURL}/${OTP_REQUEST}`, form, config);
      setLoading(false);
      cookie.set("solom", res.data.token);
      if (emailValidator.validate(form.email)) {
        setLoading(false);
        navigate("/otp", { replace: true });
        cookie.set("isVerified", "isVerified");
        return;
      }
      cookie.set("solom", res.data.token);
    } catch (err) {
      setLoading(false);
      if (err.response.status === 400) {
        setErr("اسم المستخدم او كلمة المرور غير صحيحة ..");
      } else {
        setErr("مشكلة من الخادم ، يرجي المحاولة بعد قليل ..");
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
              <h2 className="authFormTitleStyle">هل نسيت كلمة المرور ؟</h2>
              <Form.Group
                className="authFormStyleR"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>البريد الالكتروني</Form.Label>
                <Form.Control
                  ref={focus}
                  name="email"
                  type="email"
                  autoComplete="username"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="اكتب البريد الالكتروني"
                  required
                />
              </Form.Group>
            </div>
            <div className="lastFormStyle">
              <button className="formBtnStyle">ابدا الآن</button>
              {err !== "" && <span className="error">{err}</span>}
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

export default ResetPassword;
