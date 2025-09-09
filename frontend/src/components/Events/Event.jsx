import React, { useEffect } from "react";
import styles from "../../styles/style";
import EventCard from "./EventCard.jsx";
import { useSelector } from "react-redux";

const Event = () => {
  const { allEvents, isLoading } = useSelector((state) => state.event);
  if (isLoading) {
    return (
      <div className={`${styles.section}`}>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Popular Events</h1>
      </div>
      <div className="w-full grid">
        {allEvents && allEvents.length > 0 ? (
          <EventCard data={allEvents && allEvents[0]} />
        ) : (
          <p>No events available</p>
        )}
      </div>
    </div>
  );
};

export default Event;
