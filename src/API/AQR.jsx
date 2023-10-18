import React, { useState, useEffect } from "react";
import axios from "axios";
import { MAP_REQUEST, baseURL } from "./Api";

export default function AQR() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    axios
      .get(`${baseURL}/${MAP_REQUEST}`)
      .then((res) => setData(res.data))
      .catch((error) => console.error(error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  const filteredData = showAll
    ? data
    : data.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div>
      <div>
        <input type="text" value={searchTerm} onChange={handleSearch} />
        <button onClick={handleToggle}>
          {showAll ? "Show Matching Only" : "Show All"}
        </button>
      </div>
      {filteredData.map((item) => (
        <div key={item.id}>{item.title}</div>
        // AIzaSyBpWfR8k4kYJlrG38-7SthuvkyKSa4Bt68
      ))}
    </div>
  );
}

// For Test !!!
