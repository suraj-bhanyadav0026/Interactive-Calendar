// === FILE: useCalendarState.js ===
// @ts-check
import { useCallback, useMemo, useReducer, useState } from "react";
import { getCalendarDays, getRangeStats, formatDateRange, isSameDay, compareDates } from "../utils/dateUtils";
import { getHoliday } from "../utils/holidays";
import { useLocalStorage } from "./useLocalStorage";

const NOTE_COLORS = ["#2563eb", "#e85d26", "#16a34a", "#9333ea", "#ca8a04"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const HERO_IMAGES = {
  0: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800",
  1: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800",
  2: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800",
  3: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800",
  4: "https://images.unsplash.com/photo-1490750967868-88df5691cc97?w=800",
  5: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  6: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
  7: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800",
  8: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
  9: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  10: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800",
  11: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_MONTH":
      return { ...state, currentMonth: action.month, currentYear: action.year };
    case "SET_THEME":
      return { ...state, theme: action.theme };
    case "SET_SELECTION":
      return { ...state, ...action.payload };
    case "SET_ACTIVE_NOTE":
      return { ...state, activeNote: action.value };
    case "SET_HOVER":
      return { ...state, hoveredDate: action.date };
    case "SET_WEEK_NUMBERS":
      return { ...state, showWeekNumbers: action.value };
    case "SET_DRAGGING":
      return { ...state, isDragging: action.value };
    default:
      return state;
  }
}

export function useCalendarState() {
  const now = new Date();
  const [notes, setNotes] = useLocalStorage("wall-calendar-notes", []);
  const [themeStorage, setThemeStorage] = useLocalStorage("wall-calendar-theme", "light");

  const [state, dispatch] = useReducer(reducer, {
    currentMonth: now.getMonth(),
    currentYear: now.getFullYear(),
    selectedStart: null,
    selectedEnd: null,
    selectionPhase: "idle",
    activeNote: "",
theme: themeStorage,
    hoveredDate: null,
    showWeekNumbers: false,
    isDragging: false,
    liveMessage: `Showing ${MONTH_LABELS[now.getMonth()]} ${now.getFullYear()}`,
  });
  const [toast, setToast] = useState("");

  const days = useMemo(
    () => getCalendarDays(state.currentYear, state.currentMonth, getHoliday),
    [state.currentYear, state.currentMonth]
  );

  const previewEnd = state.selectionPhase === "selecting" ? state.hoveredDate || state.selectedStart : state.selectedEnd;
  const selectedLabel = useMemo(
    () =>
      state.selectedStart || state.selectedEnd
        ? formatDateRange(state.selectedStart, state.selectedEnd || state.selectedStart)
        : `${MONTH_LABELS[state.currentMonth]} (general)`,
    [state.selectedStart, state.selectedEnd, state.currentMonth]
  );

  const rangeStats = useMemo(
    () => getRangeStats(state.selectedStart, state.selectedEnd, getHoliday),
    [state.selectedStart, state.selectedEnd]
  );

  const setTheme = useCallback(
    (theme) => {
      dispatch({ type: "SET_THEME", theme });
      setThemeStorage(theme);
    },
    [setThemeStorage]
  );

  const navigateMonth = useCallback((offset) => {
    dispatch({
      type: "SET_MONTH",
      month: (state.currentMonth + offset + 12) % 12,
      year:
        state.currentMonth + offset < 0
          ? state.currentYear - 1
          : state.currentMonth + offset > 11
          ? state.currentYear + 1
          : state.currentYear,
    });
    dispatch({
      type: "SET_SELECTION",
      payload: { hoveredDate: null },
    });
  }, [state.currentMonth, state.currentYear]);

  const clearSelection = useCallback(() => {
    dispatch({
      type: "SET_SELECTION",
      payload: { selectedStart: null, selectedEnd: null, selectionPhase: "idle", hoveredDate: null },
    });
  }, []);

  const selectDate = useCallback(
    (date) => {
      const { selectedStart, selectedEnd, selectionPhase } = state;
      if (selectedStart && selectedEnd && (isSameDay(date, selectedStart) || isSameDay(date, selectedEnd))) {
        clearSelection();
        return;
      }
      if (!selectedStart || selectionPhase === "idle") {
        dispatch({
          type: "SET_SELECTION",
          payload: { selectedStart: date, selectedEnd: null, selectionPhase: "selecting", hoveredDate: date },
        });
        return;
      }
      if (selectionPhase === "selecting") {
        if (compareDates(date, selectedStart) < 0) {
          dispatch({
            type: "SET_SELECTION",
            payload: { selectedStart: date, selectedEnd: selectedStart, selectionPhase: "idle", hoveredDate: null },
          });
        } else {
          dispatch({
            type: "SET_SELECTION",
            payload: { selectedStart, selectedEnd: date, selectionPhase: "idle", hoveredDate: null },
          });
        }
      }
    },
    [state, clearSelection]
  );

  const saveNote = useCallback(() => {
    const text = state.activeNote.trim();
    if (!text) return;
    const index = notes.length % NOTE_COLORS.length;
    const note = {
      id: crypto.randomUUID(),
      startDate: state.selectedStart ? state.selectedStart.toISOString() : null,
      endDate: state.selectedEnd ? state.selectedEnd.toISOString() : null,
      label: selectedLabel,
      text,
      createdAt: new Date().toISOString(),
      color: NOTE_COLORS[index],
    };
    setNotes([note, ...notes]);
    dispatch({ type: "SET_ACTIVE_NOTE", value: "" });
  }, [state.activeNote, state.selectedStart, state.selectedEnd, notes, setNotes, selectedLabel]);

  const deleteNote = useCallback(
    (id) => setNotes(notes.filter((n) => n.id !== id)),
    [notes, setNotes]
  );

  const restoreNote = useCallback((note) => {
    dispatch({
      type: "SET_SELECTION",
      payload: {
        selectedStart: note.startDate ? new Date(note.startDate) : null,
        selectedEnd: note.endDate ? new Date(note.endDate) : null,
        selectionPhase: "idle",
        hoveredDate: null,
      },
    });
    dispatch({ type: "SET_ACTIVE_NOTE", value: note.text });
  }, []);

  return {
    state,
    days,
    notes,
    toast,
    heroImages: HERO_IMAGES,
    monthLabel: MONTH_LABELS[state.currentMonth],
    previewEnd,
    selectedLabel,
    rangeStats,
    actions: {
      navigateMonth,
      setTheme,
      setHover: (date) => dispatch({ type: "SET_HOVER", date }),
      selectDate,
      clearSelection,
      saveNote,
      deleteNote,
      restoreNote,
      setActiveNote: (value) => dispatch({ type: "SET_ACTIVE_NOTE", value }),
      setShowWeekNumbers: (value) => dispatch({ type: "SET_WEEK_NUMBERS", value }),
      setDragging: (value) => dispatch({ type: "SET_DRAGGING", value }),
      setToast,
      goToToday: () =>
        dispatch({
          type: "SET_MONTH",
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        }),
    },
  };
}
