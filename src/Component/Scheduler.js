import React, { useState, useEffect } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import jsonData from "../data/data.json";
import "./Scheduler.css";

const SchedulerHeader = () => {
  // Define days of the week and time zones
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeZones = [
    { name: "UTC-0", offset: 0 },
    { name: "UTC+23", offset: 23 },
  ];

  // States for managing data and UI
  const [displayedDate, setDisplayedDate] = useState(moment());
  const [selectedTimeZone, setSelectedTimeZone] = useState(timeZones[0]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dateData, setDateData] = useState([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  // Fetch data for the displayed date on mount or when displayedDate changes
  useEffect(() => {
    const formattedDate = displayedDate.format("YYYY-MM-DD");
    const filteredData = jsonData.filter((item) => item.Date === formattedDate);
    setDateData(filteredData);
  }, [displayedDate]);

  // Handle calendar date change
  const handleDateChange = (date) => {
    const newDate = moment(date);
    setDisplayedDate(newDate);
    setSelectedCalendarDate(newDate.format("YYYY-MM-DD"));
  };

  // Handle click on calendar date tile
  const handleCalendarTileClick = ({ date }) => {
    const clickedDate = moment(date);
    setDisplayedDate(clickedDate);
    setSelectedCalendarDate(clickedDate.format("YYYY-MM-DD"));
  };

  // Move to the previous week
  const handlePreviousWeek = () => {
    setDisplayedDate(moment(displayedDate).subtract(7, "days"));
  };

  // Move to the next week
  const handleNextWeek = () => {
    setDisplayedDate(moment(displayedDate).add(7, "days"));
  };

  // Handle change in time zone selection
  const handleTimeZoneChange = (event) => {
    const selected = timeZones.find((zone) => zone.name === event.target.value);
    setSelectedTimeZone(selected);
    setDisplayedDate(moment.utc(displayedDate).utcOffset(selected.offset * 60));
  };

  // Generate time slots from 8 AM to 11 PM with 30-minute intervals
  const generateTimeSlots = () => {
    const timeSlots = [];
    let currentTime = moment("2022-01-01T08:00:00");
    const endTime = moment("2022-01-01T23:00:00");

    while (currentTime <= endTime) {
      timeSlots.push(currentTime.format("h:mm A"));
      currentTime.add(30, "minutes");
    }

    return timeSlots;
  };

  // Handle day selection
  const handleDayClick = (day) => {
    setSelectedDay(daysOfWeek.indexOf(day));
    const selectedDay = displayedDate.clone().day(day);
    setDisplayedDate(selectedDay);
  };

  // Check if a time slot is checked based on available data
  const isTimeSlotChecked = (timeSlot) => {
    const dayData = dateData.find(
      (item) =>
        item.Date === displayedDate.format("YYYY-MM-DD") &&
        item.Time === timeSlot
    );
    return !!dayData;
  };

  // Generate time slots
  const timeSlots = generateTimeSlots();

  return (
    <div>
      {/* Scheduler header */}
      <div className="scheduler-header">
        <div className="button-bar">
          <button className="prev" onClick={handlePreviousWeek}>
            Previous Week
          </button>
          <div className="date-info">
            <span>{displayedDate.format("dddd - MMMM Do, YYYY")}</span>
          </div>
          <button className="next" onClick={handleNextWeek}>
            Next Week
          </button>
        </div>
      </div>
      
      {/* Timezone selection */}
      <div className="timezone-dropdown">
        <select value={selectedTimeZone.name} onChange={handleTimeZoneChange}>
          {timeZones.map((zone) => (
            <option key={zone.name} value={zone.name}>
              {zone.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Calendar component */}
      <div className="calendar">
        <div className="calendar_container">
          <Calendar
            className="calendar_component"
            value={displayedDate.toDate()}
            onChange={handleDateChange}
            onClickDay={handleCalendarTileClick}
          />
        </div>
      </div>
      
      {/* Table displaying days and time slots */}
      <div className="table_container">
        <table>
          <tbody>
            {daysOfWeek.map((day, index) => (
              <tr
                key={day}
                className={index === selectedDay ? "selected-day" : ""}
                onClick={() => handleDayClick(day)}
              >
                <td onClick={() => handleDayClick(day)}>{day}</td>
                {timeSlots.map((timeSlot, index) => (
                  <td
                    key={`${day}-${index}`}
                    className={
                      dateData.some(
                        (item) =>
                          item.Date === selectedCalendarDate &&
                          item.Time === timeSlot
                      )
                        ? "highlight"
                        : ""
                    }
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={isTimeSlotChecked(timeSlot)}
                        readOnly={true}
                      />
                      {timeSlot}
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchedulerHeader;
