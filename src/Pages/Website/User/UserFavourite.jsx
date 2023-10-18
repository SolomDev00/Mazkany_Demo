import "./UserStyle.css";
import axios from "axios";
import Cookie from "cookie-universal";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBath,
  FaBed,
  FaChair,
  FaHeart,
  FaMapMarkerAlt,
  FaShareAlt,
  FaStickyNote,
} from "react-icons/fa";
import { FAV_REQUEST, baseURL } from "../../../API/Api";
import Navbar from "../../../Components/Dashboard/NavBar";
import { Container, Form } from "react-bootstrap";
import LoadingSubmit from "../../../Components/Loading/Loading";

export default function UserFavourites() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cookies
  const navigate = useNavigate();
  const cookie = Cookie();

  // If not Login Out this User!
  useEffect(() => {
    const token = cookie.get("solom");
    if (!token) {
      navigate("/login");
    }
  });

  // Get Token & Custom Config
  const config = {
    headers: {
      Authorization: `Token bbdcedc5d17092c029c548592d94eaa1ee8704c3`,
    },
  };

  // Get User Favourites
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${baseURL}/${FAV_REQUEST}`, config)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  // Handle favorite toggle
  const handleFavoriteToggle = async (propertyId, index) => {
    try {
      const response = await axios.delete(
        `${baseURL}/properties/fav/${data[index].id}`,
        config
      );
      if (response.status === 204) {
        const updatedData = [...data];
        updatedData.splice(index, 1);
        setData(updatedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <LoadingSubmit />
      ) : (
        <Container>
          <section className="UserSection">
            <div className="titleUserSection">
              <h2>المفضلة</h2>
            </div>
            <div className="selectUserSub">
              <div className="btnUserSub">
                <Link to={"/favourites"}>
                  <div className="btnFav">
                    <div className="btnName">
                      <FaHeart />
                      <h2>مفضلتي</h2>
                    </div>
                    <div className="btnArrow">&gt;</div>
                  </div>
                </Link>
                <Link to={"/notes"}>
                  <div className="btnNote">
                    <div className="btnName">
                      <FaStickyNote />
                      <h2>ملاحظاتي</h2>
                    </div>
                    <div className="btnArrow">&gt;</div>
                  </div>
                </Link>
              </div>
              <div className="searchUser">
                <h3>شارك هذه العقارات</h3>
                <div>
                  <Form.Control type="text" defaultValue={"www.google.com"} />
                </div>
              </div>
            </div>
            <div className="fav-content">
              <div className="fav-padding">
                {data.slice(0, 6).map((item, index) => (
                  <div className="favUserContant" key={index}>
                    <div className="favUserImage">
                      <img
                        src={baseURL + item.property.images[0].image}
                        alt="Fav"
                      />
                    </div>
                    <div className="favUserSide">
                      <div className="favUserDetails">
                        <h2 className="favUserPrice">
                          {item.property.price} جنية مصري
                        </h2>
                        <p className="favUserDesc">{item.property.details}</p>
                        <div className="favUserLocation">
                          <FaMapMarkerAlt /> {""}
                          {item.property.city}
                        </div>
                        <div className="bottomSide boPlus">
                          <div className="markerSpace">
                            {item.property.space} م² |{" "}
                          </div>
                          <div className="markerIcons">
                            <FaChair /> {item.property.floor}
                            <FaBath /> {item.property.bathrooms}
                            <FaBed /> {item.property.rooms}
                          </div>
                        </div>
                        <div className="spaceContent">
                          <div className="hrSettings">
                            <hr />
                          </div>
                        </div>
                        <div className="favBtnSettings">
                          <div
                            className="addToFav"
                            onClick={() =>
                              handleFavoriteToggle(item.property.id, index)
                            }
                          >
                            <FaHeart
                              style={{
                                color: `${item.favorite ? "black" : "red"}`,
                              }}
                            />
                            مفضلتي
                          </div>
                          <div className="addToNote">
                            <FaStickyNote />
                            ملاحظة
                          </div>
                          <div className="share">
                            <FaShareAlt />
                            مشاركة
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Container>
      )}
    </>
  );
}
