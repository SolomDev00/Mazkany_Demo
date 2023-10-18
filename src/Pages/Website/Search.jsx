import axios from "axios";
import "./PublicStyle.css";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Container, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Dashboard/NavBar";
import Footer from "../../Components/Footer/Footer";

export default function Search() {
  const [city, setCity] = useState("");
  const [data, setData] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedButton, setSelectedButton] = useState("button1");
  const [propertyCategories, setPropertyCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://66.45.248.247:8000/properties/categories/", {
        headers: {
          Authorization: `Token bbdcedc5d17092c029c548592d94eaa1ee8704c3`,
        },
      })
      .then((res) => {
        setPropertyCategories(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("http://66.45.248.247:8000/properties", {
        headers: {
          Authorization: `Token bbdcedc5d17092c029c548592d94eaa1ee8704c3`,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleButtonClick = (button) => {
    if (button === "بحث الآن") {
      handleSearch();
    } else {
      setSelectedType("all");
      setSelectedButton(button);
    }
  };

  const handleTypeSelect = (type) => {
    // عند اختيار نوع، قم بإلغاء تحديد القسم
    setSelectedButton("button1");
    setSelectedType(type);
  };

  const handleSearch = () => {
    let filteredResults = [...data];

    if (city) {
      filteredResults = filteredResults.filter((result) =>
        result.city.includes(city)
      );
    }

    if (selectedType !== "all") {
      filteredResults = filteredResults.filter(
        (result) => result.category.id === selectedType
      );
    }

    if (minPrice) {
      filteredResults = filteredResults.filter(
        (result) => result.price >= parseInt(minPrice)
      );
    }

    if (maxPrice) {
      filteredResults = filteredResults.filter(
        (result) => result.price <= parseInt(maxPrice)
      );
    }

    if (filteredResults.length === 0) {
      navigate("/search/result", {
        state: { filteredData: ["لا يوجد شيء متوافق"] },
      });
    } else {
      navigate("/search/result", { state: { filteredData: filteredResults } });
    }
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
              </button>
              {propertyCategories.map((category) => (
                <button
                  key={category.id}
                  className={`typeButton ${
                    selectedType === category.id ? "selectedTypeButton" : ""
                  }`}
                  onClick={() => handleTypeSelect(category.id)}
                >
                  {category.name}
                </button>
              ))}
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
                    <option value="500000">500,000</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="btnSubmit">
              <button
                onClick={() => handleButtonClick("بحث الآن")}
                className="submitFormSearch"
              >
                بحث الآن
              </button>
            </div>
          </div>
        </section>
      </Container>
      <Footer />
    </>
  );
}
