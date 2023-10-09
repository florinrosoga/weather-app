import React, {useEffect, useState} from "react";
import search from "../images/search.png";
import Clock from "react-live-clock";
import moment from "moment";
import ReactAnimatedWeather from "react-animated-weather";

export default function Forcast() {
  var [forcast, setForcast] = useState({});

  var [city, setCity] = useState("");
  var [iconName, setIconName] = useState("CLEAR_DAY");
  useEffect(() => {
    async function getData() {
      if (city !== "") {
        var response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ca8c2c7970a09dc296d9b3cfc4d06940`
        );
        var data = await response.json();

        if (
          data.weather[0].main === "Thunderstorm" ||
          data.weather[0].main === "Rain" ||
          data.weather[0].main === "Drizzle" ||
          data.weather[0].main === "Mist"
        ) {
          setIconName("RAIN");
        } else if (
          data.weather[0].main === "Dust" ||
          data.weather[0].main === "Fog" ||
          data.weather[0].main === "Smoke" ||
          data.weather[0].main === "Haze"
        ) {
          setIconName("FOG");
        } else if (data.weather[0].main === "Snow") {
          setIconName("SNOW");
        } else if (data.weather[0].main === "Clouds") {
          setIconName("CLOUDY");
        } else if (data.weather[0].main === "Clear") {
          setIconName("CLEAR_DAY");
        }
        setForcast(data);
        console.log(data);
      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              var response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}lon=${pos.coords.longitude}&units=metric&id=524901&appid=ca8c2c7970a09dc296d9b3cfc4d06940`
              );
              var data = await response.json();

              if (
                data.weather[0].main === "Thunderstorm" ||
                data.weather[0].main === "Rain" ||
                data.weather[0].main === "Drizzle" ||
                data.weather[0].main === "Mist"
              ) {
                setIconName("RAIN");
              } else if (
                data.weather[0].main === "Dust" ||
                data.weather[0].main === "Fog" ||
                data.weather[0].main === "Smoke" ||
                data.weather[0].main === "Haze"
              ) {
                setIconName("FOG");
              } else if (data.weather[0].main === "Snow") {
                setIconName("SNOW");
              } else if (data.weather[0].main === "Clouds") {
                setIconName("CLOUDY");
              } else if (data.weather[0].main === "Clear") {
                setIconName("CLEAR_DAY");
              }
              setForcast(data);
              console.log(data);
            },
            () => {
              alert("Location services denied!");
              setCity("london");
            }
          );
        } else {
          alert("Location services not found!");
        }
      }
    }

    getData();
  }, [city]);

  function searchCity() {
    var cityName = document.getElementById("cityName").value;
    if (cityName.trim() !== "") {
      setCity(cityName);
      document.getElementById("cityName").value = "";
    } else {
      alert("Please enter the city name");
    }
  }

  function searchOnEnter(e) {
    if (e.keyCode === 13) {
      searchCity();
    }
  }

  const defaults = {
    icon: iconName,
    color: "white",
    size: 100,
    animate: true,
  };
  return (
    <div>
      <div className="main-container">
        <div className="forcast-1">
          <div className="upper-text">
            <h1>{forcast.name}</h1>
            <h3>{forcast.sys?.country}</h3>
          </div>
          <div className="bottom-text">
            <div className="left-box">
              <h1>
                <Clock
                  format={"HH:mm:ss"}
                  ticking={true}
                  timezone={"US/Pacific"}
                />
              </h1>
              <p>{moment(forcast.dt * 1000).format("ll")}</p>
            </div>
            <div className="right-box">
              <h1>{Math.round(forcast.main?.temp)}°C</h1>
            </div>
          </div>
        </div>
        <div className="forcast-2">
          <div className="icon-container">
            <ReactAnimatedWeather
              icon={defaults.icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
          </div>
          <h1 className="weather-info">{forcast.weather?.[0].main}</h1>
          <hr className="line" />
          <div className="search-container">
            <input
              onKeyDown={searchOnEnter}
              type="text"
              placeholder="Search.."
              name="cityName"
              id="cityName"
            />
            <button onClick={searchCity} onKeyDown={searchOnEnter}>
              <img
                src={search}
                alt="search"
                width={20}
                height={20}
                className="search-icon"
              />
            </button>
          </div>
          <div className="small-icon">
            <h3 className="weather-description">
              {forcast.weather?.[0].description}
            </h3>
            <img
              src={`https://openweathermap.org/img/wn/${forcast.weather?.[0].icon}@2x.png`}
              alt="icn"
            />
          </div>
          <hr />
          <div className="details-section">
            <h3>Temperature</h3>
            <h3>{Math.round(forcast.main?.temp)}</h3>
          </div>

          <hr />
          <div className="details-section">
            <h3>Wind Speed</h3>
            <h3>{Math.round(forcast.wind?.speed)} kmh</h3>
          </div>
          <hr />
          <div className="details-section">
            <h3>Humidity</h3>
            <h3>{forcast.main?.humidity}</h3>
          </div>
          <hr />
          <div className="details-section">
            <h3>Visibility</h3>
            <h3>{forcast.visibility} m</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
