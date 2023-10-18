import "./PublicStyle.css";
import { baseURL } from "../../API/Api";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Navbar from "../../Components/Dashboard/NavBar";
import { FaBath, FaBed, FaChair } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSubmit from "../../Components/Loading/Loading";
import Footer from "../../Components/Footer/Footer";

export default function SearchResult() {
  const location = useLocation();
  const { filteredData } = location.state;
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handlePaddingSideClick = (propID) => {
    if (propID === 3) {
      navigate(`/property/2`);
    } else {
      navigate(`/property/${propID}`);
    }
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <LoadingSubmit />
      ) : (
        <Container>
          <section className="resultSection">
            <div className="popup-content">
              {filteredData.map((result, key) => (
                <div className="popup-padding" key={key}>
                  <div
                    className="paddingSide poPlus"
                    onClick={() => handlePaddingSideClick(key)}
                  >
                    <div className="leftSide plus">
                      <div className="topSide">
                        <h2 className="dataTitle">{result.title}</h2>
                        <h3 className="dataPrice">{result.price} جنية مصري</h3>
                        <div className="bottomSide boPlus">
                          <div className="markerSpace">
                            {result.space} م² |{" "}
                          </div>
                          <div className="markerIcons">
                            <FaChair />
                            {result.floor}
                            <FaBath />
                            {result.bathrooms}
                            <FaBed />
                            {result.rooms}
                          </div>
                        </div>
                        <p className="dataDetails">{result.details}</p>
                      </div>
                    </div>
                    <div className="rightSide">
                      <img
                        src={baseURL + result.images[0].image}
                        alt="Marker"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Container>
      )}
      <Footer />
    </>
  );
}
