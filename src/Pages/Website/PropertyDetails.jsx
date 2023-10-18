import "./PublicStyle.css";
import axios from "axios";
import Navbar from "../../Components/Dashboard/NavBar";
import { Container } from "react-bootstrap";
import {
  FaBath,
  FaBed,
  FaChair,
  FaHeart,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { FAV_REQUEST, MAP_REQUEST, baseURL } from "../../API/Api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import LoadingSubmit from "../../Components/Loading/Loading";

export default function PropertyDetails() {
  const [data, setData] = useState([]);
  const [dataADS, setDataADS] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favourites, setFavourites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const { id } = useParams();

  const customConfig = {
    headers: {
      Authorization: `Token bbdcedc5d17092c029c548592d94eaa1ee8704c3`,
    },
  };

  // Get Marker Data
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${baseURL}/${MAP_REQUEST}`, customConfig)
      // .then((res) => console.log(res.data))
      .then((res) => {
        setData(res.data[id]);
      })
      .catch((error) => console.error(error));
  }, [id]);

  useEffect(() => {
    axios
      .get(`${baseURL}/${MAP_REQUEST}`, customConfig)
      // .then((res) => console.log(res.data))
      .then((res) => {
        setDataADS(res.data);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    axios
      .get(`${baseURL}/${FAV_REQUEST}`, customConfig)
      .then((res) => {
        const favoritesList = res.data[id].id;
        setFavourites(favoritesList);
        setIsFavorite(favoritesList.includes(data.id));
      })
      .catch((error) => console.error(error));
  }, [id]);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      axios
        .delete(
          `http://66.45.248.247:8000/properties/fav/prop/${data.id}/`,
          customConfig
        )
        .then(() => {
          setIsFavorite(false);
          setFavourites(favourites.filter((fav) => fav !== data.id));
        })
        .catch((error) => console.error(error));
    } else {
      setIsFavorite(true);
      axios
        .post(
          `http://66.45.248.247:8000/properties/fav/`,
          {
            property_id: data.id,
          },
          customConfig
        )
        .then((res) => {
          setIsFavorite(true);
          setFavourites([...favourites, data.id]);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <LoadingSubmit />
      ) : (
        <Container>
          <section className="propertySection">
            <h2 className="titlepropertySection">{data.category.name}</h2>
            <div className="sides">
              <div className="rightSideP">
                <div className="images">
                  {data.images.length === 1 ? (
                    <div className="singleImage">
                      <img src={baseURL + data.images[0].image} alt="home" />
                    </div>
                  ) : data.images.length === 2 ? (
                    <div className="twoImages">
                      <img src={baseURL + data.images[0].image} alt="home" />
                      <img src={baseURL + data.images[1].image} alt="home" />
                    </div>
                  ) : (
                    <div className="threeImages">
                      <div className="right">
                        <img src={baseURL + data.images[0].image} alt="home" />
                        <img src={baseURL + data.images[1].image} alt="home" />
                      </div>
                      <div className="left">
                        <img src={baseURL + data.images[2].image} alt="home" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="addHistory">
                  {data.category.name} {""}
                  {DateTime.fromISO(data.created_at, { locale: "ar" }).toFormat(
                    "dd MMMM yyyy G"
                  )}
                </p>
                <div className="contant">
                  <div className="propertyPrice">{data.price} جنية مصري</div>
                  <div className="propertyLocation">
                    {<FaMapMarkerAlt />} {data.city}
                  </div>
                  <div className="propertyDetails">
                    <h4 className="TitlePropertyDetails">تفاصيل الاعلان</h4>
                    <div className="propertySpace">
                      <span>المساحات</span>
                      <span>{data.space} متر</span>
                    </div>
                    <div className="propertyRooms">
                      <span>الغرف</span>
                      <span>{data.rooms} غرف</span>
                    </div>
                    <div className="propertyBathroom">
                      <span>الحمامات</span>
                      <span>{data.bathrooms} حمام</span>
                    </div>
                    <div className="propertyFloor">
                      <span>الدور</span>
                      <span>{data.floor} ادوار</span>
                    </div>
                    <div className="propertyView">
                      <span>تطل علي</span>
                      <span>{data.overlooking_at}</span>
                    </div>
                    <div className="propertyPay">
                      <span>طريقة الدفع</span>
                      <span>{data.pay_way}</span>
                    </div>
                    <div className="propertyAD">
                      <span>نوع المعلن</span>
                      <span>مسكني</span>
                    </div>
                    <h4 className="TitlePropertyDetails">تفاصيل الاعلان</h4>
                    <div className="propertyDesc">{data.details}</div>
                  </div>
                </div>
              </div>
              <div className="leftSideP">
                <div className="shareAndFavourite">
                  <div className="favouriteBtn">
                    <FaHeart
                      style={{ color: isFavorite ? "red" : "black" }}
                      onClick={handleFavoriteClick}
                    />
                    مفضلة
                  </div>
                  <hr className="spaceHr" />
                  <div className="contactBtn">
                    <button className="contactEmailBtn">
                      {<AiOutlineMail />} ارسل بريد الكتروني
                    </button>
                    <button className="contactPhoneBtn">
                      {<FaPhoneAlt />} اظهار رقم الجوال
                    </button>
                  </div>
                </div>
                <div className="ADS">
                  <h2>إعلانات ذات صلة</h2>
                </div>
                <div className="ADSView">
                  <div className="favUserContant">
                    <div className="favUserImage">
                      <img
                        src={
                          baseURL +
                          (id === 0
                            ? dataADS[1].images[0].image
                            : dataADS[0].images[0].image)
                        }
                        alt="Fav"
                      />
                    </div>
                    <div className="favUserSide">
                      <div className="favUserDetails">
                        <h2 className="favUserPrice">
                          {dataADS[0].price} جنية مصري
                        </h2>
                        <p className="favUserDesc">{dataADS[0].details} </p>
                        <div className="favUserLocation">
                          <FaMapMarkerAlt /> {""}
                          {dataADS[0].city}
                        </div>
                        <div className="bottomSide boPlus">
                          <div className="markerSpace">
                            {dataADS[0].space} م² |{" "}
                          </div>
                          <div className="markerIcons">
                            <FaChair /> {dataADS[0].floor}
                            <FaBath /> {dataADS[0].bathrooms}
                            <FaBed /> {dataADS[0].rooms}
                          </div>
                        </div>
                        <div className="spaceContent">
                          <div className="hrSettings">
                            <hr />
                          </div>
                        </div>
                        <div className="favBtnSetting">
                          <button className="searchNow">ابحث الآن</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>
      )}
    </>
  );
}
