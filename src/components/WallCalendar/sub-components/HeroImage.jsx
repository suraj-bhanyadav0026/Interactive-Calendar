// === FILE: HeroImage.jsx ===
import React, { useEffect, useState } from "react";
import styles from "../WallCalendar.module.css";

export function HeroImage({ imageUrl, monthLabel, year }) {
  const [prevImage, setPrevImage] = useState(imageUrl);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (imageUrl !== prevImage) {
      setFade(true);
      const t = setTimeout(() => {
        setPrevImage(imageUrl);
        setFade(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [imageUrl, prevImage]);

  return (
    <div className={styles.heroWrap}>
      <div className={styles.heroImage} style={{ backgroundImage: `url(${prevImage})`, opacity: fade ? 0 : 1 }} />
      <div className={styles.heroImageNext} style={{ backgroundImage: `url(${imageUrl})`, opacity: fade ? 1 : 0 }} />
      <div className={styles.heroCorner} />
      <div className={styles.heroMeta}>
        <div className={styles.heroYear}>{year}</div>
        <div className={styles.heroMonth}>{monthLabel.toUpperCase()}</div>
      </div>
    </div>
  );
}
