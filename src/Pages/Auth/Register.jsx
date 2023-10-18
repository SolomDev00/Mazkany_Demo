import "./AuthStyle.css";
import axios from "axios";
import Cookie from "cookie-universal";
import { Form } from "react-bootstrap";
import { REGISTER, baseURL } from "../../API/Api";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import LoadingSubmit from "../../Components/Loading/Loading";

export default function Register() {
  // States
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  // Ref
  const focus = useRef("");

  // Cookies
  const cookie = Cookie();

  // Navgate
  const Navigate = useNavigate();

  // Loading
  const [loading, setLoading] = useState(false);

  // Error Messages
  const [err, setErr] = useState("");

  // Handle From Change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle Focus Ref
  useEffect(() => {
    focus.current.focus();
  }, []);

  // Handle Submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/${REGISTER}`, form);
      setLoading(false);
      const token = res.data.token;
      cookie.set("solom", token);
      Navigate("/", { replace: true });
    } catch (err) {
      setLoading(false);
      if (err?.response?.status === 400) {
        setErr("البريد الالكتروني مستخدم مسبقاً أو كلمة المرور غير متطابقة ..");
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
              {/* <h2 className="authFormTitleStyle">انشاء حساب جديد</h2> */}
              <Form.Group
                className="authFormStyle"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>الاسم بالكامل</Form.Label>
                <Form.Control
                  ref={focus}
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="ادخل الاسم بالكامل"
                  required
                />
              </Form.Group>
              <Form.Group
                className="authFormStyle"
                controlId="exampleForm.ControlInput2"
              >
                <Form.Label>رقم الهاتف</Form.Label>
                <Form.Control
                  name="phoneNumber"
                  type="number"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="ادخل رقم الهاتف"
                  required
                />
              </Form.Group>
              <Form.Group
                className="authFormStyle"
                controlId="exampleForm.ControlInput3"
              >
                <Form.Label>البريد الالكتروني</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ادخل البريد الالكتروني"
                  autoComplete="username"
                  required
                />
              </Form.Group>
              <Form.Group
                className="authFormStyle"
                controlId="exampleForm.ControlInput4"
              >
                <Form.Label>كلمة المرور</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="ادخل كلمة المرور"
                  minLength={6}
                  required
                  autoComplete="current-password"
                />
              </Form.Group>
              <Form.Group
                className="authFormStyle"
                controlId="exampleForm.ControlInput5"
              >
                <Form.Label>إعادة كلمة المرور</Form.Label>
                <Form.Control
                  type="password"
                  name="reset-password"
                  onChange={handleChange}
                  placeholder="إعادة كتابة كلمة المرور"
                  minLength={6}
                  autoComplete="current-password"
                  required
                />
              </Form.Group>
            </div>
            <div className="lastFormStyle2">
              <p className="coypRight">
                بالضغط علي تسجيل، أنت توافق علي <span>احكام و شروط</span> مسكني.
              </p>
              <button className="formBtnStyle">ابدا الآن</button>
              {err !== "" && (
                <span className="error">
                  {err}
                  <FaExclamationCircle className="error-icon" />
                </span>
              )}
              <p className="re-Login">
                هل لديك حساب بالفعل ؟ <Link to={"/login"}>تسجيل الدخول</Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
