import "./PublicStyle.css";
import axios from "axios";
import Modal from "react-modal";
import Cookie from "cookie-universal";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Dashboard/NavBar";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaSatellite,
} from "react-icons/fa";
import {
  CATE_REQUEST,
  MAP_REQUEST,
  SEEN_REQUEST,
  baseURL,
} from "../../API/Api";
import { useNavigate } from "react-router-dom";

export default function Map() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mapType, setMapType] = useState("roadmap");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [buttonColor, setButtonColor] = useState("transparent");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Cookies
  const cookie = Cookie();
  const navigate = useNavigate();

  // If not Login Out this User!
  useEffect(() => {
    const token = cookie.get("solom");
    if (!token) {
      navigate("/login");
    }
  });

  // Get Token & Custom Config
  const token = cookie.get("solom");
  const config = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  const customConfig = {
    headers: {
      Authorization: `Token bbdcedc5d17092c029c548592d94eaa1ee8704c3`,
    },
  };

  // Get Marker Data
  useEffect(() => {
    axios
      .get(`${baseURL}/${MAP_REQUEST}`, config)
      .then((res) => setData(res.data))
      // .then((res) => console.log(res.data))
      .catch((error) => console.error(error));
  }, []);

  // Get Categories Data
  useEffect(() => {
    axios
      .get(`${baseURL}/${CATE_REQUEST}`, config)
      .then((res) => setCategories(res.data))
      .catch((error) => console.error(error));
  }, []);

  // Post User seen a Marker
  useEffect(() => {
    if (selectedMarker && selectedMarker.is_seen === true) {
      axios
        .post(
          `${baseURL}/${SEEN_REQUEST}`,
          { property_id: selectedMarker.id },
          customConfig
        )

        .then((res) => {
          const updatedMarker = {
            ...selectedMarker,
            is_seen: true,
          };
          setData((prevData) =>
            prevData.map((markerData) =>
              markerData.id === updatedMarker.id ? updatedMarker : markerData
            )
          );
          setSelectedMarker(updatedMarker);
          if (updatedMarker.infoWindow) {
            updatedMarker.infoWindow.setContent(
              `<p className="markerPrice" style="color: red !important;">${formatPrice(
                updatedMarker.title
              )}</p>`
            );
            updatedMarker.infoWindow.setOptions({
              backgroundColor: "#fff",
              borderColor: "#ff0000",
            });
          }
        })
        .catch((error) => console.log(error));
    }
  }, [selectedMarker]);

  // Pop-up Open
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Pop-up Close
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // FilterData to Category
  const filteredData = () => {
    if (selectedCategory) {
      return data.filter(
        (markerData) => markerData.category.id === selectedCategory.id
      );
    } else {
      return data;
    }
  };

  // Format Price [M + K]
  function formatPrice(price) {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + "مليون";
    } else if (price >= 1000) {
      return (price / 1000).toFixed(1) + "الف";
    } else {
      return price;
    }
  }

  useEffect(() => {
    const mapOptions = {
      center: { lat: 32, lng: 12 },
      mapId: "5f27b96b54e5bec6",
      zoom: 21,
      mapTypeControl: false,
      fullScreenControl: false,
      streetViewControl: false,
      scaleControl: true,
      fullscreenControl: false,
      styles: [
        {
          featureType: "poi.business",
          elementType: "labels",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
      ],
      gestureHandling: "greedy",
      disableDoubleClickZoom: true,
      mapTypeId: mapType,
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: window.google.maps.ControlPosition.BOTTOM_CENTER,
        mapTypeIds: [
          window.google.maps.MapTypeId.ROADMAP,
          window.google.maps.MapTypeId.SATELLITE,
          window.google.maps.MapTypeId.HYBRID,
        ],
      },
      zoomControl: true,
      clickableIcons: false,
    };

    const map = new window.google.maps.Map(
      document.getElementById("map"),
      mapOptions
    );

    filteredData().forEach((markerData) => {
      const lat = parseFloat(markerData.lat);
      const lng = parseFloat(markerData.long);
      const marker = new window.google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: markerData.title,
        icon: {
          url: "",
          scaledSize: new window.google.maps.Size(32, 30),
          anchor: new window.google.maps.Point(16, 30),
        },
      });

      const infowindow = new window.google.maps.InfoWindow({
        content: `<p className="markerPrice">${formatPrice(
          markerData.price
        )}</p>`,
        position: marker.getPosition(),
      });
      infowindow.open({
        anchor: marker,
        shouldFocus: true,
      });

      // Handle Marker Click
      const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
        if (marker.infoWindow) {
          if (marker.is_seen === true) {
            marker.infoWindow.setOptions({
              content: `<p className="markerPrice" style="color: red !important;">${formatPrice(
                marker.title
              )}</p>`,
              backgroundColor: "#fff",
              borderColor: "#00ff00",
            });
          } else {
            marker.infoWindow.setOptions({
              content: `<p className="markerPrice">${formatPrice(
                marker.title
              )}</p>`,
              backgroundColor: "#fff",
              borderColor: "#000",
            });
          }
          marker.infoWindow.open(map, marker);
        }
        openModal();
      };

      marker.addListener(
        "click",
        () => {
          handleMarkerClick(markerData);
        },
        { passive: true }
      );
    });
  }, [data, selectedCategory, mapType]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setButtonColor("#9b927d");
  };

  const handleMapTypeChange = (type) => {
    setMapType(type);
    setIsSatellite(!isSatellite);
  };

  return (
    <>
      <Navbar />
      <section>
        <div className="categories-container">
          <div className="categories">
            <button
              className="btnFilter"
              onClick={() => {
                setSelectedCategory(null);
                setButtonColor("transparent");
              }}
              style={{
                backgroundColor: buttonColor,
                color: buttonColor === "#9b927d" ? "white" : "black",
              }}
            >
              الكل
            </button>
            {categories.map((category) => (
              <button
                className="btnFilterR"
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                style={{
                  color: selectedCategory === category ? "black" : "white",
                  backgroundColor:
                    selectedCategory === category ? "transparent" : "#9b927d",
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mapAPI" style={{ marginTop: "5px" }}>
          <div id="map" style={{ width: "100%", height: "760px" }}></div>
          <div className="mapTypeButtons">
            <button
              className="satelliteBtn"
              onClick={() =>
                handleMapTypeChange(isSatellite ? "roadmap" : "satellite")
              }
            >
              <span className="satelliteIcon" role="img" aria-label="Map Type">
                {isSatellite ? <FaSatellite /> : <FaMapMarkedAlt />}
              </span>
            </button>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Marker Details"
          className="popup"
          overlayClassName="overlay"
          ariaHideApp={false}
        >
          <div className="popup-content plplus">
            {selectedMarker && (
              <div>
                <span className="popup-close" onClick={closeModal}>
                  &times;
                </span>
                <div className="popup-padding">
                  <div className="paddingSide">
                    <div className="leftSide">
                      <div className="topSide">
                        <h2>{selectedMarker.title}</h2>
                        <h3>{selectedMarker.price} جنية مصري</h3>
                        <p>{selectedMarker.details}</p>
                      </div>
                      <div className="bottomSide">
                        <div className="markerSpace">
                          {selectedMarker.space} م² |{" "}
                        </div>
                        <div className="markerIcons">
                          <FaChair />
                          {selectedMarker.floor}
                          <FaBath />
                          {selectedMarker.bathrooms}
                          <FaBed />
                          {selectedMarker.rooms}
                        </div>
                      </div>
                    </div>
                    <div className="rightSide">
                      <img
                        src={baseURL + selectedMarker.images[0].image}
                        alt="Marker"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </section>
    </>
  );
}
