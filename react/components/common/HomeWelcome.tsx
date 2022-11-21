import React, { useEffect } from "react";
import { getClientTime } from "../../utils/datetime";

const HomeWelcome = ({ user }: any) => {
  const [timeText, setTimeText] = React.useState("");

  useEffect(() => {
    setTimeText(getClientTime());
  }, []);

  return (
    <>
      <div className="sec-info text-center">
        <div className="date">
          {new Date().toLocaleDateString("en-us", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </div>
        <h1 className="head-lg">
          {timeText}, {user ? user.firstName : ""}
        </h1>
      </div>
    </>
  );
};

export default HomeWelcome;
