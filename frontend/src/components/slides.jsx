import React, { useState, useRef } from 'react';
import './slides.css'; 

function Slides({ hints }) {
  const totalCards = 4;
  const [currentCard, setCurrentCard] = useState(0);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  const lines = hints.split("\n").map(line => line.trim()).filter(Boolean);

  // First line is the Problem Title
  const title = lines.length > 0 ? lines[0] : "No Title Found";

  // Filter lines starting with "Hint" and remove the label e.g. "Hint 1:"
  const hint = lines
    .filter(line => line.startsWith("Hint"))
    .map(line => line.replace(/^Hint \d+:\s*/, ""));

  // Optionally pad hints to 4 entries if needed
  while (hint.length < 4) {
    hint.push("No further hint available.");
  }

  const handleSwipe = (direction) => {
    let newCurrent = currentCard;
    if (direction === "left") {
      newCurrent = (currentCard + 1) % totalCards;
    } else if (direction === "right") {
      newCurrent = (currentCard - 1 + totalCards) % totalCards;
    }
    setCurrentCard(newCurrent);
  };

  const handleTouchStart = (e) => {
    const touch = e.changedTouches[0];
    touchStartRef.current = {
      x: touch.pageX,
      y: touch.pageY,
      time: new Date().getTime()
    };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const distX = touch.pageX - touchStartRef.current.x;
    const distY = touch.pageY - touchStartRef.current.y;
    const elapsedTime = new Date().getTime() - touchStartRef.current.time;

    const threshold = 50; // min distance
    const restraint = 100; // max perpendicular distance
    const allowedTime = 300; // max time

    if (elapsedTime <= allowedTime) {
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        const direction = (distX < 0) ? 'left' : 'right';
        handleSwipe(direction);
      }
    }
  };

  const handleClick = (index, isNext) => {
    if (isNext) {
      handleSwipe("left");
    } else {
      handleSwipe("right");
    }
  };

  const isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const cardOffset = window.innerWidth < 600 ? 20 : 60;

  return (
    <main style={{ position: "relative", height: "450px", marginTop: "20px" }}>
      {Array.from({ length: totalCards }).map((_, idx) => {
        // Calculate horizontal position relative to currentCard
        const offset = idx - currentCard;
        return (
          <div
            key={idx}
            className={`cards ${idx === currentCard ? 'currentCard' : 'notCurrentCard'}`}
            style={{
              zIndex: idx === currentCard ? 999 : 998 - Math.abs(offset),
              transform: `translateX(${offset * cardOffset}px) scale(${idx === currentCard ? 1 : 0.95})`,
              opacity: idx === currentCard ? 1 : 0.7,
              pointerEvents: idx === currentCard ? "auto" : "none",
              transition: "transform 0.3s, opacity 0.3s",
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={idx === currentCard && !isTouchDevice ? () => handleClick(idx, true) : undefined}
          >
            <h2>{hint[idx]}</h2>
          </div>
        );
      })}
    </main>
  );
}

export default Slides;
