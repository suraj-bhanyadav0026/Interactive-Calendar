// === FILE: WallCalendar.jsx ===
import React, { useCallback, useMemo, useRef, useState } from "react";
import styles from "./WallCalendar.module.css";
import { useCalendarState } from "./hooks/useCalendarState";
import { getCalendarDays } from "./utils/dateUtils";
import { getHoliday } from "./utils/holidays";
import { SpiralBinding } from "./sub-components/SpiralBinding";
import { HeroImage } from "./sub-components/HeroImage";
import { DayCell } from "./sub-components/DayCell";
import { NotesPanel } from "./sub-components/NotesPanel";
import { Particles } from "./sub-components/Particles";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function MiniMonthPreview({ year, month }) {
  const days = useMemo(() => getCalendarDays(year, month, getHoliday).slice(0, 14), [year, month]);
  return (
    <div className={styles.miniMonth}>
      {days.map((d) => (
        <span className={styles.miniCell} key={d.date.toISOString()}>
          {d.dayOfMonth}
        </span>
      ))}
    </div>
  );
}

export default function WallCalendar() {
  const { state, days, notes, toast, heroImages, monthLabel, previewEnd, selectedLabel, rangeStats, actions } = useCalendarState();
  const [flipClass, setFlipClass] = useState("");
  const [mobileNotesOpen, setMobileNotesOpen] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const calendarRef = useRef(null);

  const handleMonthTransition = useCallback(
    (offset) => {
      setFlipClass(styles.flipOut);
      setTimeout(() => {
        actions.navigateMonth(offset);
        setFlipClass(styles.flipIn);
      }, 250);
      setTimeout(() => setFlipClass(""), 500);
    },
    [actions]
  );

  const handleKeyDownGrid = useCallback(
    (e) => {
      if (e.key === "Escape") {
        actions.clearSelection();
        return;
      }
      if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowRight") setFocusedIndex((v) => Math.min(days.length - 1, v + 1));
      if (e.key === "ArrowLeft") setFocusedIndex((v) => Math.max(0, v - 1));
      if (e.key === "ArrowDown") setFocusedIndex((v) => Math.min(days.length - 1, v + 7));
      if (e.key === "ArrowUp") setFocusedIndex((v) => Math.max(0, v - 7));
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        actions.selectDate(days[focusedIndex].date);
      }
    },
    [actions, days, focusedIndex]
  );

  const handleMouseDown = useCallback((date) => {
    actions.setDragging(true);
    actions.selectDate(date);
  }, [actions]);

  const handleMouseEnterDrag = useCallback((date) => {
    if (state.isDragging && state.selectionPhase === "selecting") actions.setHover(date);
  }, [state.isDragging, state.selectionPhase, actions]);

  const handleCopy = useCallback(async () => {
    const text = `📅 ${selectedLabel}${rangeStats ? ` (${rangeStats.total} days)` : ""}\n📝 ${state.activeNote || "(No note text)"}`;
    await navigator.clipboard.writeText(text);
    actions.setToast("Copied!");
    setTimeout(() => actions.setToast(""), 2000);
  }, [state.activeNote, selectedLabel, rangeStats, actions]);

  return (
    <section
className={`${styles.wallCalendar} ${state.theme === "dark" ? styles.themeDark : ""} ${state.theme === "sepia" ? styles.themeSepia : ""} ${state.theme === "cyber" ? styles.themeCyber : ""}`}
      ref={calendarRef}
      onMouseUp={() => actions.setDragging(false)}
      onTouchStart={(e) => setTouchStartX(e.changedTouches[0].clientX)}
      onTouchEnd={(e) => {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        if (deltaX > 50) handleMonthTransition(-1);
        if (deltaX < -50) handleMonthTransition(1);
      }}
    >
      <div className={styles.topBar}>
        <SpiralBinding />
        <div className={styles.themeSwitcher}>
          <button className={styles.swatch} style={{ background: "#faf8f3" }} onClick={() => actions.setTheme("light")} aria-label="Light theme" />
          <button className={styles.swatch} style={{ background: "#1a1a2a" }} onClick={() => actions.setTheme("dark")} aria-label="Dark theme" />
<button className={styles.swatch} style={{ background: "#f5edd6" }} onClick={() => actions.setTheme("sepia")} aria-label="Sepia theme" />
          <button className={styles.swatch} style={{ background: "linear-gradient(45deg, #00f5ff, #ff00aa)" }} onClick={() => actions.setTheme("cyber")} aria-label="Cyberpunk theme" />
        </div>
      </div>

      <div className={flipClass}>
        <HeroImage imageUrl={heroImages[state.currentMonth]} monthLabel={monthLabel} year={state.currentYear} />
        <div className={styles.calendarBody}>
          <aside className={styles.notesCol}>
            <NotesPanel
              selectedLabel={selectedLabel}
              activeNote={state.activeNote}
              onChange={actions.setActiveNote}
              onSave={actions.saveNote}
              notes={notes}
              onDelete={actions.deleteNote}
              onRestore={actions.restoreNote}
              onCopy={handleCopy}
              open={mobileNotesOpen}
              onToggleMobile={() => setMobileNotesOpen((v) => !v)}
            />
          </aside>

          <section className={styles.gridCol}>
            <header className={styles.header}>
              <div className={styles.headerTitle}>{monthLabel} {state.currentYear}</div>
              <div className={styles.navGroup}>
                <button className={styles.navBtn} aria-label="Previous month" onClick={() => handleMonthTransition(-1)}>‹</button>
                <button className={styles.todayBtn} onClick={() => { actions.goToToday(); calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>Today</button>
                <button className={styles.navBtn} aria-label="Next month" onClick={() => handleMonthTransition(1)}>›</button>
              </div>
            </header>

            <div className={styles.navGroup}>
              <label>
                <input type="checkbox" checked={state.showWeekNumbers} onChange={(e) => actions.setShowWeekNumbers(e.target.checked)} /> Show week numbers
              </label>
            </div>

            <div className={styles.miniPreviewWrap}>
              <MiniMonthPreview year={state.currentMonth === 0 ? state.currentYear - 1 : state.currentYear} month={(state.currentMonth + 11) % 12} />
              <MiniMonthPreview year={state.currentMonth === 11 ? state.currentYear + 1 : state.currentYear} month={(state.currentMonth + 1) % 12} />
            </div>

            <div className={state.showWeekNumbers ? styles.withWeekNumber : ""}>
              <div className={styles.weekdayRow}>
                {state.showWeekNumbers && <div className={styles.weekNumHead}>WK</div>}
                {WEEKDAYS.map((d) => <div key={d} className={styles.weekday}>{d}</div>)}
              </div>

              <div role="grid" className={styles.grid} onKeyDown={handleKeyDownGrid} tabIndex={0}>
                {days.map((day, i) => (
                  <React.Fragment key={day.date.toISOString()}>
                    {state.showWeekNumbers && i % 7 === 0 ? <div className={styles.weekNum}>{day.weekNumber}</div> : null}
                    <DayCell
                      day={day}
                      dayIndex={i}
                      selectedStart={state.selectedStart}
                      selectedEnd={state.selectedEnd}
                      previewEnd={previewEnd}
                      selecting={state.selectionPhase === "selecting"}
                      onClick={actions.selectDate}
                      onHover={actions.setHover}
                      onMouseDown={handleMouseDown}
                      onMouseEnterDrag={handleMouseEnterDrag}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>

            {rangeStats ? (
              <div className={styles.rangeStats}>
                {rangeStats.total} days selected · {rangeStats.weekends} weekends · {rangeStats.workingDays} working days · {rangeStats.holidays} holidays
              </div>
            ) : null}
            <p aria-live="polite" style={{ position: "absolute", left: "-10000px" }}>
              Showing {monthLabel} {state.currentYear}
            </p>
          </section>
        </div>
      </div>
      <footer className={styles.footerStrip}>←/→ change focus · Enter select · Esc clear · Swipe to navigate months</footer>
      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </section>
  );
}
