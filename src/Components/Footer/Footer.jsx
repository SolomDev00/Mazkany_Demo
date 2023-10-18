import {
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import "./FooterStyle.css";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <section className="footerSection">
      <Container>
        <div className="footerFlex">
          <div className="left">
            <h2>
              مسكني
              <FaMapMarkerAlt />
            </h2>
            <p>
              تقدم لك افضل الاحصائيات و النسب الاستثمارية بشكل مبسط لمساعدتك علي
              تحديد الحي و نوع العقار الذي يحقق لك افضل عائد استثماري
            </p>
          </div>
          <div className="right">
            <ul>
              <li>
                <Link to="/">عن مسكني</Link>
              </li>
              <li>
                <Link to="/contact">تواصل معنا</Link>
              </li>
              <li>
                <Link to="/map">خريطة الموقع</Link>
              </li>
              <li>
                <Link to="/raw">الأحكام</Link>
              </li>
            </ul>
            <div>
              <FaFacebook />
              <FaInstagram />
              <FaYoutube />
              <FaTwitter />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
