import React, { useState, useEffect } from "react";
import { ReactComponent as Calendar } from "./images/calendar.svg";
import { ReactComponent as Meetup } from "./images/icons/meetup.svg";
import { ReactComponent as Webinar } from "./images/icons/webinar.svg";
import { ReactComponent as Investorday } from "./images/icons/investorsday.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
function App() {
  const [eventArray, setEventArray] = useState([]);
  const sortArrayByDate = (a, b) => {
    a = new Date(a.datetime);
    b = new Date(b.datetime);
    return a - b;
  };
  const imageEventTypeRender = (type) => {
    switch (type) {
      case "investorsday":
        return <Investorday />;
      case "webinar":
        return <Webinar />;
      case "meetup":
        return <Meetup />;
      default:
        break;
    }
  };
  const dayNameGetter = (dayNumber) => {
    let dayNames = [
      "niedziela",
      "poniedziałek",
      "wtorek",
      "środa",
      "czwartek",
      "piątek",
      "sobota",
    ];
    return dayNames[dayNumber];
  };
  const zeroAdder = (number) => {
    return number < 10 ? "0" + number : number;
  };
  const classSetter = (index) => {
    if (index % 2 === 1) return "even";
    else return "";
  };
  const dateGenerator = (timeInString) => {
    let date = new Date(timeInString.replace(/-/g, "/"));
    let stringDate = `${zeroAdder(date.getDate())}/${zeroAdder(
      date.getMonth() + 1
    )}/${date.getFullYear()} ${dayNameGetter(
      date.getDay()
    )} ${date.getHours()}:${date.getMinutes()}`;
    return <div>{stringDate}</div>;
  };
  useEffect(() => {
    const succesCallback = (data) => {
      data = data.sort(sortArrayByDate);
      setEventArray(data);
    };
    const failureCallback = (error) => {
      console.log("error couldn't get data reason:" + error);
    };
    fetch("https://dev.bfund.ovh/api/events/1197", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((result) => result.json())
      .then(
        (data) => succesCallback(data),
        (error) => failureCallback(error)
      );
  }, []);
  return (
    <div className="App">
      <h1>WYDARZENIA</h1>
      <div className="events-container container">
        {eventArray.map((event, index) => (
          <div className={`event ${classSetter(index)}`} key={index}>
            <div className="date-container event-part">
              <div className="date-text">
                <Calendar className="calendar-svg" />
                {dateGenerator(event.datetime)}
              </div>
              <div className="event-type-container">
                {imageEventTypeRender(event.type)}
              </div>
            </div>
            <div className={`title-container event-part ${classSetter(index)}`}>
              {event.name.toUpperCase()}
              <div className="button-container">
                <div className={`triangle black ${classSetter(index)}`}></div>
                <button className={`${classSetter(index)}`}>
                  <a href={event.registration_url}>ZAPISZ SIĘ</a>{" "}
                </button>
              </div>
            </div>
            <div className="description-container event-part">
              <div className="triangle white"></div>
              {event.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
