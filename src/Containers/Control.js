/*require('dotenv').config()*/

import "../styles.css";
import { useState, useEffect } from "react";
import { SearchBarsC } from "./SearchBarsC.js";
import { ShowDayAndWeek } from "./ShowDayAndWeek.js";
import axios from "axios";

export default function Control() {
  const [locationData, setLocationData] = useState({});
  const [apiData, setApiData] = useState();

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${locationData.lat}&lon=${locationData.lon}&appid=${process.env.REACT_APP_API_KEY}&units=imperial`
      )
      .then((response) => {
        console.log("Api Data Fetched");
        setApiData(response.data);
      })
      .catch((error) => {
        console.log("error caught.");
        console.log({ ...error });
        return "error";
      });
  }, [locationData]);

  const handleUserInput = (searchBarOutput) => {
    console.log("Control has received locationData. Printing now:");
    console.log({...searchBarOutput});
    setLocationData(searchBarOutput);
  };

  return (
    <div className="Control">
      <SearchBarsC onSubmit={handleUserInput}/>
      <section className="infoPlusGradient">
        {locationData.name ? (
          <>
            <h2>
              <strong>Weather Forecast</strong>
            </h2>
            <span style={{ fontSize: "1.6rem" }}>
              <i className="fa-solid fa-location-dot"></i>{" "}
              {locationData.name +
                (locationData.state
                  ? `, ${locationData.state}`
                  : ` (${locationData.country})`)}
            </span>
          </>
        ) : (
          <img
            width="65%"
            src="https://media2.giphy.com/media/zcdlNbRSr6YHocQifM/giphy.gif?cid=790b76114b6609685635a7f8918ae31c382bb3b2fe1c885c&rid=giphy.gif&ct=s"
            alt="GIF courtesy of flevix.com. But it failed to load."
          />
        )}

        <ShowDayAndWeek data={apiData} />
        {/*much easier because there is absolutely NO interactivity with user (?).
      might add a feature where you can set what day is being displayed on the left by clicking it on the right.*/}
      </section>
    </div>
  );
}
