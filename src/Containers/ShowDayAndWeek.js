import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";

//for changing leftside functionality, consider taking two values as arguments for slice() from function call. This would make it easy to change leftside.
//iterate one loop: list objects{} //  list[i]
//iterate two loops: iterate through each object
//  list[i].main.choose (AND list[i].dt_txt, AND list[i].weather.main)

export const ShowDayAndWeek = ({ data }) => {
  const getLocalTime = (index) => {
    return moment
      .utc(data.list[index].dt_txt)
      .utcOffset(data.city.timezone / 3600); //converting second offset to hour offset
  };

  const weatherMoji = (index) => {
    switch (data.list[index].weather[0].main) {
      case "Clouds":
        return <i className="fa-solid fa-cloud-sun"></i>;
      case "Rain":
        return <i className="fa-solid fa-cloud-showers-heavy"></i>;
      case "Snow":
        return <i className="fa-duotone fa-cloud-snow"></i>;
      case "Extreme":
        return (
          <i style={{ color: "red" }} className="fa-duotone fa-siren-on"></i>
        );
      case "Clear":
        return <i className="fa-solid fa-sun"></i>;
      default:
        return (
          <i style={{ color: "lightgreen" }} className="fa-solid fa-bug">
            {" "}
            <span style={{ color: "red", fontWeight: "bold" }}> bug!!</span>
          </i>
        );
    }
  };

  const getHumidityDaily = (list1, list2) => {
    //(begin, end)
    let sumAvgHumidity = 0;
    for (let i = list1; i < list2; i++) {
      sumAvgHumidity += data.list[i].main.humidity;
    }
    const meanHumidity = Math.round(sumAvgHumidity / Math.abs(list2 - list1));
    return getHumidityCurrent(undefined, meanHumidity);
  };

  const getHumidityCurrent = (index, humidity = 0) => {
    humidity = humidity ? humidity : Math.round(data.list[index].main.humidity); //makes it possible to pass in a specified humidity
    if (humidity > 65) {
      return (
        <>
          <i className="fa-solid fa-raindrops"></i>
          <span className="text-secondary"> {humidity}%</span>
        </>
      );
    } else if (humidity > 55) {
      return (
        <>
          <i className="fa-regular fa-raindrops"></i>
          <span className="text-secondary"> {humidity}%</span>
        </>
      );
    }
    return (
      <>
        <i className="fa-light fa-raindrops"></i>
        <span className="text-secondary"> {humidity}%</span>
      </>
    );
  };

  const getMinMaxTempStyled = (list1, list2) => {
    const getListMain = (index, key) => {
      return data.list[index].main[key];
    };

    let min = { minimum: getListMain(0, "temp_min"), index: 0 },
      max = { maximum: 0, index: 0 };

    for (; list1 < list2; list1++) {
      if (getListMain(list1, "temp_min") < min.minimum) {
        min.minimum = getListMain(list1, "temp_min");
        min.index = list1;
      }
      if (getListMain(list1, "temp_max") > max.maximum) {
        max.maximum = getListMain(list1, "temp_max");
        max.index = list1;
      }
    }
    //return {min: min.minimum, max: max.maximum, minI: min.index, maxI: max.index}
    return (
      <>
        {weatherMoji(min.index)}
        <span className="text-secondary">{` ${Math.round(
          min.minimum
        )}°  /  ${Math.round(max.maximum)}° `}</span>
        {weatherMoji(max.index)}
      </>
    );
  };

  const getWindSpeedMean = (list1, list2) => {
    let sumWindSpeed = 0;
    for (let i = list1; i < list2; i++) {
      sumWindSpeed += data.list[i].wind.speed;
    }
    const meanWindSpeed =
      Math.round((sumWindSpeed / Math.abs(list2 - list1)) * 10) / 10;
    return (
      <>
        <i className="fas fa-wind"></i>
        <span className="text-secondary"> {meanWindSpeed}mph</span>
      </>
    );
  };

  return (
    <>
      {data && (
        <>
          <div>
            <span style={{ color: "#383632", fontSize: ".7rem" }}>
              {getLocalTime(0).format("ddd, MMMM D h:mm A")}
            </span>
            <br />
            <div className="d-inline-flex justify-content-start">
              <div style={{ fontSize: "3rem" }} className="mx-3 my-auto">
                <i className="fa-solid fa-sun"></i>{" "}
                {Math.round(data.list[0].main.temp)}°
              </div>
              <div style={{ fontSize: ".7rem" }} className="mx-3 my-auto">
                {weatherMoji(0)} {data.list[0].weather[0].description}
                <br />
                {`${Math.round(data.list[0].main.temp_max)}° / ${Math.round(
                  data.list[0].main.temp_min
                )}°`}
                <br />
                {`Feels like ${data.list[0].main.feels_like}°`}
              </div>
            </div>
          </div>
          <div
            style={{ fontSize: ".8rem" }}
            className="d-inline-flex justify-content-around p-4"
          >
            <div
              style={{ width: "45%" }}
              className="d-flex flex-wrap m-lg-5 bg-my p-1"
            >
              <div className="w-20 p-1 text-secondary">
                {getLocalTime(0).format("h A")}
              </div>
              <div className="w-20 p-1 text-secondary">
                {getLocalTime(1).format("h A")}
              </div>
              <div className="w-20 p-1 text-secondary">
                {getLocalTime(2).format("h A")}
              </div>
              <div className="w-20 p-1 text-secondary">
                {getLocalTime(3).format("h A")}
              </div>
              <div className="w-20 p-1 text-secondary">
                {getLocalTime(4).format("h A")}
              </div>

              <div className="iconry w-20 p-1">{weatherMoji(0)}</div>
              <div className="iconry w-20 p-1">{weatherMoji(1)}</div>
              <div className="iconry w-20 p-1">{weatherMoji(2)}</div>
              <div className="iconry w-20 p-1">{weatherMoji(3)}</div>
              <div className="iconry w-20 p-1">{weatherMoji(4)}</div>

              <div className="w-20 p-1 bigTemp">{`${Math.round(
                data.list[0].main.temp
              )}°`}</div>
              <div className="w-20 p-1 bigTemp">{`${Math.round(
                data.list[1].main.temp
              )}°`}</div>
              <div className="w-20 p-1 bigTemp">{`${Math.round(
                data.list[2].main.temp
              )}°`}</div>
              <div className="w-20 p-1 bigTemp">{`${Math.round(
                data.list[3].main.temp
              )}°`}</div>
              <div className="w-20 p-1 bigTemp">{`${Math.round(
                data.list[4].main.temp
              )}°`}</div>

              <div className="w-20 p-1">{getHumidityCurrent(0)}</div>
              <div className="w-20 p-1">{getHumidityCurrent(1)}</div>
              <div className="w-20 p-1">{getHumidityCurrent(2)}</div>
              <div className="w-20 p-1">{getHumidityCurrent(3)}</div>
              <div className="w-20 p-1">{getHumidityCurrent(4)}</div>
            </div>

            <div
              style={{ width: "45%" }}
              className="d-flex flex-row flex-wrap m-lg-5 bg-my p-2"
            >
              <div className="w-20 p-1 text-secondary">
                {getLocalTime(0).format("dddd")}
                {/*ddd for shortened, dddd for full: https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/*/}
              </div>
              <div className="w-20 p-1">{getHumidityDaily(0, 8)}</div> 
              {/*note that all of these include the first index and cut the final one. (0,8) will cover indices 0 through 7, inclusive.*/}
              <div className="w-40 p-1">{getMinMaxTempStyled(0, 8)}</div>
              <div className="w-20 p-1">{getWindSpeedMean(0, 8)}</div>

              <div className="w-20 p-1 text-secondary">
                {getLocalTime(8).format("dddd")}
              </div>
              <div className="w-20 p-1">{getHumidityDaily(8, 16)}</div>
              <div className="w-40 p-1">{getMinMaxTempStyled(8, 16)}</div>
              <div className="w-20 p-1">{getWindSpeedMean(8, 16)}</div>

              <div className="w-20 p-1 text-secondary">
                {getLocalTime(16).format("dddd")}
              </div>
              <div className="w-20 p-1">{getHumidityDaily(16, 24)}</div>
              <div className="w-40 p-1">{getMinMaxTempStyled(16, 24)}</div>
              <div className="w-20 p-1">{getWindSpeedMean(16, 24)}</div>

              <div className="w-20 p-1 text-secondary">
                {getLocalTime(24).format("dddd")}
              </div>
              <div className="w-20 p-1">{getHumidityDaily(24, 32)}</div>
              <div className="w-40 p-1">{getMinMaxTempStyled(24, 32)}</div>
              <div className="w-20 p-1">{getWindSpeedMean(24, 32)}</div>

              <div className="w-20 p-1 text-secondary">
                {getLocalTime(32).format("dddd")}
              </div>
              <div className="w-20 p-1">{getHumidityDaily(32, 40)}</div>
              <div className="w-40 p-1">{getMinMaxTempStyled(32, 40)}</div>
              <div className="w-20 p-1">{getWindSpeedMean(32, 40)}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
