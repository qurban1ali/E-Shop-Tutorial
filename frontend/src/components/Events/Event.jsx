import React from "react";
import styles from "../../styles/style";
import EventCard from "./EventCard.jsx";
import { useSelector } from "react-redux";
  import { useTranslation } from "react-i18next";


const Event = () => {
    const { t } = useTranslation();
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
        <h1>{t("popular_events")}</h1>
      </div>
      <div className="w-full grid">
        {allEvents && allEvents.length > 0 ? (
          <EventCard data={allEvents && allEvents[0]} />
        ) : (
          <p>{t("no_events")}</p>
        )}
      </div>
    </div>
  );
};

export default Event;
