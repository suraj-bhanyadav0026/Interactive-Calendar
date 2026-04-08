// === FILE: NotesPanel.jsx ===
import React from "react";
import styles from "../WallCalendar.module.css";

export function NotesPanel({
  selectedLabel,
  activeNote,
  onChange,
  onSave,
  notes,
  onDelete,
  onRestore,
  onCopy,
  open,
  onToggleMobile,
}) {
  return (
    <>
      <button className={styles.notesToggle} onClick={onToggleMobile} aria-expanded={open}>
        Notes {open ? "▲" : "▼"}
      </button>
      <section className={`${styles.notesPanel} ${!open ? styles.notesPanelMobileHidden : ""}`}>
        <div className={styles.notesHeader}>
          <strong>{selectedLabel.includes("(") ? `General notes for ${selectedLabel.replace(" (general)", "")}` : `Note for ${selectedLabel}`}</strong>
        </div>
        <textarea
          className={styles.notesTextarea}
          aria-label={`Notes for ${selectedLabel.replace(/-/g, "to")}`}
          placeholder="Add a note for this period..."
          value={activeNote}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className={styles.notesActions}>
          <button className={styles.saveBtn} onClick={onSave}>Save Note</button>
          <button className={styles.copyBtn} onClick={onCopy} aria-label="Copy range and note">Copy</button>
        </div>
        <div className={styles.notesList}>
          {notes.length === 0 ? (
            <p className={styles.emptyState}>No notes yet. Select dates and start writing.</p>
          ) : (
            notes.map((note) => (
              <article key={note.id} className={styles.noteItem} style={{ borderLeftColor: note.color }} onClick={() => onRestore(note)}>
                <div className={styles.noteTop}>
                  <span>{note.label}</span>
                  <button
                    className={styles.noteDelete}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(note.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
                <p>{note.text.slice(0, 60)}{note.text.length > 60 ? "..." : ""}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}
