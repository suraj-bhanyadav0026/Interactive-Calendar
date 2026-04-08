// === FILE: DayCell.jsx ===
import React from "react";
import styles from "../WallCalendar.module.css";
import { isInRange, isSameDay } from "../utils/dateUtils";

export function DayCell({
  day,
  selectedStart,
  selectedEnd,
  previewEnd,
  selecting,
  onClick,
  onHover,
  onMouseDown,
  onMouseEnterDrag,
  dayIndex,
}) {
  const inPreview = selecting && selectedStart && previewEnd ? isInRange(day.date, selectedStart, previewEnd) : false;
  const inRange = isInRange(day.date, selectedStart, selectedEnd);
  const isStart = selectedStart && isSameDay(day.date, selectedStart);
  const isEnd = selectedEnd && isSameDay(day.date, selectedEnd);
  const singleDay = isStart && isEnd;
  const selected = inRange || inPreview;
  const label = `${day.date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}${selected ? ", selected" : ""}${day.holiday ? `, ${day.holiday.name}` : ""}`;

  return (
    <button
      role="gridcell"
      aria-selected={selected}
      aria-label={label}
      className={[
        styles.dayButton,
        !day.isCurrentMonth ? styles.isOutside : "",
        day.isWeekend && !selected && !isStart && !isEnd ? styles.isWeekend : "",
        (inRange || inPreview) && !isStart && !isEnd ? styles.isInRange : "",
        isStart ? styles.isStart : "",
        isEnd ? styles.isEnd : "",
        singleDay ? styles.isSameDay : "",
        day.isToday ? styles.isToday : "",
        day.holiday ? styles.hasHoliday : "",
      ].join(" ")}
      data-holiday={day.holiday?.name || ""}
      style={{ "--day-index": dayIndex }}
      onClick={() => onClick(day.date)}
      onMouseEnter={() => onHover(day.date)}
      onMouseDown={() => onMouseDown(day.date)}
      onMouseMove={() => onMouseEnterDrag(day.date)}
    >
      <time className={styles.dateCircle} dateTime={day.date.toISOString().slice(0, 10)}>
        {day.dayOfMonth}
      </time>
      {day.holiday ? (
        <span className={`${styles.holidayDot} ${day.holiday.type === "national" ? styles.holidayNational : styles.holidayFestival}`} />
      ) : null}
    </button>
  );
}
