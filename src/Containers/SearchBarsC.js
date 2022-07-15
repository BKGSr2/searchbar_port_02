import { SearchBars } from "../Presentational/SearchBars.js";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
//const fs = require('fs');
//const yaml = require('js-yaml');

export function SearchBarsC(props) {
  //console.log(yaml.safeLoad(fs.readFileSync('%PUBLIC_URL%/config.yml', 'utf8'))) //server side, client side, blah blah blah

  const [firstDisabled, setFirstDisabled] = useState(false);
  const [userInput, setUserInput] = useState({
    location: "",
    zipCode: ""
  });
  const [locationData, setLocationData] = useState({
    byName: [
      { name: null },
      { name: null },
      { name: null },
      { name: null },
      { name: null }
    ],
    byZip: {}
  });

  const dataSet = (
    //sets the data in locationData
    firstAdd = locationData.byName,
    secondAdd = locationData.byZip
  ) => {
    setLocationData({
      byName: {
        ...locationData.byName,
        ...firstAdd
      },
      byZip: {
        ...locationData.byZip,
        ...secondAdd
      }
    });
  };

  const getLocationData = (
    locChange = userInput.location,
    zipChange = userInput.zipCode
  ) => {
    //also, if(!userInput){console.log("enter a value first, please."); return;}
    axios
      .get(
        firstDisabled
          ? `https://api.openweathermap.org/geo/1.0/zip?zip=${zipChange}&appid=${process.env.REACT_APP_API_KEY}`
          : `https://api.openweathermap.org/geo/1.0/direct?q=${locChange}&limit=5&appid=${process.env.REACT_APP_API_KEY}`
      )
      .then((response) => {
        console.log(response.data);
        console.log("locationData ^");
        if (firstDisabled) {
          console.log("zip API call went through");
          //if zip is selected.
          dataSet(undefined, response.data); //puts data in byZip
          return;
        } //if zip is not selected.
        dataSet(response.data); //puts data in byName
      })
      .catch((error) => {
        console.log("api error: (ethan)");
        console.log(error);
      });
  };

  const handleClick = ({ target }) => {
    setFirstDisabled(target.name === "location" ? false : true);
  };

  const handleChange = ({ target }) => {
    setUserInput({
      ...userInput,
      [target.name]: target.value
    });
  };

  const stableGetter = useCallback(() => getLocationData(), []);
  useEffect(() => {
    console.log("useEffect called"); //tested, works perfectly!

    const waitForTyper = setTimeout(() => {
      getLocationData();
    }, 500); //changed to 0.5 sec delay because it feels much more responsive. Note that only 60 calls per minute are allowed.
    return () => clearTimeout(waitForTyper);
  }, [userInput, stableGetter]);

  const stableCurrentLoc = useCallback(() => currentLocation(), [])
  useEffect(() => { //last minute add-on
    currentLocation();
  }, [stableCurrentLoc])

  const currentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        axios
          .get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=${process.env.REACT_APP_API_KEY}`)
          .then((response) => {
            /*new Promise(()=> {
              setUserInput({...userInput, location: response.data[0].state})
            })
            .finally(()=>{*/
            //setUserInput({...userInput, location: ""})
              dataSet(response.data); //simple, doesn't really work, but I'm not wasting any more time on this. fin
            //}) //this promise doesn't actually work because setUserInput triggers useEffect, which calls getLocationData() and re-renders, which incidentally calls dataSet again. Painful.
            
          })
          .catch((error) => {
            console.log(error);
          })
      })
    } else {
      console.log("geolocation error");
    }
  }

  const outputSelector = () => {
    //zipCode already returns a single array, so it doesn't use this.
    if(firstDisabled) {
      console.log("byZip selected in outputSelector")
      return locationData.byZip
    }
    for (let i = 0; i < 5; i++) {
      if (
        `${locationData.byName[i].name} (${locationData.byName[i].state}, ${locationData.byName[i].country})` ===
        userInput.location
      ) {
        return locationData.byName[i];
      }
    }
    console.log(
      "no output was selected. check outputSelector() in SearchBars.js."
    );
    return "Error. Check outputSelector() in SearchBarsC.js";
  };

  return (
    <section className="searchBars">
      <SearchBars
        onClick={handleClick}
        firstDisabled={firstDisabled}
        secondDisabled={!firstDisabled}
        onChange={handleChange}
        locVal={userInput.location}
        zipVal={userInput.zipCode}
        nameValues={
          firstDisabled
            ? [null, null, null, null, null]
            : [
                locationData.byName[0].name,
                locationData.byName[1].name,
                locationData.byName[2].name,
                locationData.byName[3].name,
                locationData.byName[4].name
              ]
        }
        countryStateValues={
          firstDisabled
            ? [null, null, null, null, null]
            : [
                `${locationData.byName[0].state}, ${locationData.byName[0].country}`,
                `${locationData.byName[1].state}, ${locationData.byName[1].country}`,
                `${locationData.byName[2].state}, ${locationData.byName[2].country}`,
                `${locationData.byName[3].state}, ${locationData.byName[3].country}`,
                `${locationData.byName[4].state}, ${locationData.byName[4].country}`
              ]
        }
      />
      <button onClick={currentLocation} className="search-bars">Get my current location, please!</button>
      <input //could move this back to SearchBars.js and make it possible to press enter after typing in location in order to submit form.
        className="search-bars"
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          console.log("\n\nsending locationData...");
          props.onSubmit(outputSelector()); //reference a function from the parent and input a value. In this case, the values passed to props.onSubmit will go to handleUserInput() in control.js
        }}
      />
      {/*return one location[userInput===location]*/}
    </section>
  );
}
