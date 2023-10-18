import Navbar from "../../../Components/Dashboard/NavBar";
import "./404.css";
import { Link } from "react-router-dom";

export default function Err404() {
  return (
    <>
      <Navbar />
      <section className="page_404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 text-center">
              <h1 className="Error404">404</h1>
              <div className="ErrorInfoContent">
                <h3 className="ErrorInfo">الصفحة غير موجودة</h3>
                <p>الصفحة التي تبحث عنها غير متوفرة أو تم حذفها ..</p>
                <Link className="link_404" to={"/"}>
                  العودة الي الرئيسية!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
