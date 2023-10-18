import axios from "axios";
import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import Navbar from "../../Components/Dashboard/NavBar";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import Cookie from "cookie-universal";

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedButton, setSelectedButton] = useState("button1");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [city, setCity] = useState("");

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type === selectedType ? "all" : type);
  };

  const cookie = Cookie();
  const token = cookie.get("solom");

  const handleSearch = () => {
    axios
      .get(`http://66.45.248.247:8000/properties/`, {
        params: {
          type: selectedType,
          minPrice,
          maxPrice,
          city,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setSearchResults(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navbar />
      <Container>
        <section className="searchSection">
          <div className="titleSearchSection">
            <h2>ابحث عن عقارات للبيع أو للإيجار</h2>
          </div>
          <div className="searchLocation">
            <h3 className="searchTitle">المنطقة</h3>
            <div className="searchInput">
              <FaMapMarkerAlt />
              <Form.Control
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={"المدينة او الحي او الشارع"}
              />
            </div>
          </div>
          <div className="searchType">
            <h3 className="searchTitle">القسم</h3>
            <div className="buttonGroup">
              <button
                className={`colorButton ${
                  selectedButton === "button1" ? "selectedButton" : ""
                }`}
                onClick={() => handleButtonClick("button1")}
              >
                للبيع
              </button>
              <button
                className={`colorButton2 ${
                  selectedButton === "button2" ? "selectedButton" : ""
                }`}
                onClick={() => handleButtonClick("button2")}
              >
                للإيجار
              </button>
            </div>
            <div className="searchSelected">
              <h3 className="searchTitle">النوع</h3>
              <div className="typeButtons">
                <button
                  className={`typeButton ${
                    selectedType === "all" ? "selectedTypeButton" : ""
                  }`}
                  onClick={() => handleTypeSelect("all")}
                >
                  كل الخيارات
                  {selectedType === "all" && <FaTimes className="cancelIcon" />}
                </button>
                <button
                  className={`typeButton ${
                    selectedType === "2" ? "selectedTypeButton" : ""
                  }`}
                  onClick={() => handleTypeSelect("2")}
                >
                  للبيع
                  {selectedType === "2" && <FaTimes className="cancelIcon" />}
                </button>
                <button
                  className={`typeButton ${
                    selectedType === "button2" ? "selectedTypeButton" : ""
                  }`}
                  onClick={() => handleTypeSelect("button2")}
                >
                  محل
                  {selectedType === "button2" && (
                    <FaTimes className="cancelIcon" />
                  )}
                </button>
                <button
                  className={`typeButton ${
                    selectedType === "button3" ? "selectedTypeButton" : ""
                  }`}
                  onClick={() => handleTypeSelect("button3")}
                >
                  شقق مفروشة
                  {selectedType === "button3" && (
                    <FaTimes className="cancelIcon" />
                  )}
                </button>
                <button
                  className={`typeButton ${
                    selectedType === "button4" ? "selectedTypeButton" : ""
                  }`}
                  onClick={() => handleTypeSelect("button4")}
                >
                  شاليهات
                  {selectedType === "button4" && (
                    <FaTimes className="cancelIcon" />
                  )}
                </button>
              </div>
            </div>
            <div className="searchPrice">
              <h3 className="searchTitle">السعر</h3>
              <div className="searchSelectPrice">
                <div className="lowPrice">
                  <select
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  >
                    <option value="">اقل سعر</option>
                    <option value="25000">25,000</option>
                    <option value="50000">50,000</option>
                    <option value="100000">100,000</option>
                  </select>
                </div>
                <div className="highPrice">
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  >
                    <option value="">اعلى سعر</option>
                    <option value="25000">25,000</option>
                    <option value="50000">50,000</option>
                    <option value="100000">100,000</option>
                    {/* يمكنك إضافة المزيد من الخيارات هنا */}
                  </select>
                </div>
              </div>
            </div>
            <div className="btnSubmit">
              <button onClick={handleSearch} className="submitFormSearch">
                بحث الآن
              </button>
            </div>
          </div>
          <div>
            {searchResults.map((result, index) => (
              <div key={index}>
                {/* {console.log(result)} */}
                <p>عنوان العقار: {result.title}</p>
                <p>نوع العقار: {result.category.name}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
