import "./403.css";
import { Link } from "react-router-dom";

export default function Err403({ role }) {
  return (
    <div className="text-wrapper">
      <div className="title" data-content={404}>
        403 - ACCESS DENIED
      </div>
      <div className="subtitle">
        عذراً, انت لا تملك الصلاحيات الكافية لدخول هذه الصفحة!
        <Link
          className="d-block text-center btn btn-primary"
          to={role === "1996" ? "/dashboard/hacker" : "/"}
        >
          {role === "1996" ? "Go To Hacker!" : "Return to Home!"}
        </Link>
      </div>
    </div>
  );
}
