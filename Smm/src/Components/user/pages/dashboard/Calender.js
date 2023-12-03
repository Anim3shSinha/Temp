import "smart-webcomponents-react/source/styles/smart.default.css";
import { useEffect, useState, useRef } from "react";
import Scheduler from "smart-webcomponents-react/scheduler";
import { Calendar } from "smart-webcomponents-react/calendar";
import { add, edit, remove, getAll } from "./EventService";
import { useValue } from "../../../../contexts/ValueContext";
import axios from "axios";
import { CONST } from "../../../../constants";

function Calender() {
  const { userType, userId } = useValue();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.post(`${CONST.server}/get_events`, {
        userId,
        userType,
      });
      if (response) {
        setEvents(response.data);
        // console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const schedulerRef = useRef(null);

  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currDate, setCurrDate] = useState(new Date());

  const getPreviousMonthDate = (date) => {
    const previousMonthDate = new Date(date);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    return previousMonthDate;
  };

  const getNextsMonthDate = (date) => {
    const nextMonthDate = new Date(date);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    return nextMonthDate;
  };
  useEffect(() => {
    setCurrentDate(getPreviousMonthDate(new Date()));
    setCurrDate(getNextsMonthDate(new Date()));
  }, []);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            width: "80%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              // border: "2px solid black",
              width: "90%",
              height: "50%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={
                {
                  // border: "2px solid black",
                }
              }
            >
              <Calendar
                selectedDates={[currentDate]}
                id="calendar"
                disableAutoNavigation={true}
                hideArrows={true}
              ></Calendar>
            </div>

            <h1>
              {month} {year}
            </h1>
            <div
              style={
                {
                  // border: "2px solid black",
                }
              }
            >
              <Calendar
                selectedDates={[currDate]}
                id="calendar"
                disableAutoNavigation={true}
                hideArrows={true}
              ></Calendar>
            </div>
          </div>
          <Scheduler
            style={{ width: "70%" }}
            id="scheduler"
            ref={schedulerRef}
            dataSource={events}
            view="month"
            // onItemChange={handleItemChange}
            // onEditDialogOpen={handleEditDialogOpen}
          />
        </div>
        <div>Taskbar</div>
      </div>
    </>
  );
}

export default Calender;
