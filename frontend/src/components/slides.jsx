import React, { useState, useEffect, useRef } from 'react';
import './slides.css'; 

function Slides() {
  const totalCards = 4;
  const [currentCard, setCurrentCard] = useState(0);
  const cardsRef = useRef([]);

  const hint = ["Hint 1", "Hint 2", "Hint 3", "Hint 4"];

  const isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleSwipe = (direction) => {
    let newCurrent = currentCard;
    if (direction === "left") {
      newCurrent = (currentCard + 1) % totalCards;
    } else if (direction === "right") {
      newCurrent = (currentCard - 1 + totalCards) % totalCards;
    }
    setCurrentCard(newCurrent);
  };

  const swipedetect = (el, callback) => {
    let swipedir, startX, startY, distX, distY, startTime, elapsedTime;
    const threshold = 100; // min distance
    const restraint = 100; // max perpendicular distance
    const allowedTime = 500; // max time

    const handleswipe = callback || function (swipedir) { };

    el.addEventListener('touchstart', function (e) {
      const touchobj = e.changedTouches[0];
      swipedir = 'none';
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();
      e.preventDefault();
    }, false);

    el.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);

    el.addEventListener('touchend', function (e) {
      const touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX;
      distY = touchobj.pageY - startY;
      elapsedTime = new Date().getTime() - startTime;
      if (elapsedTime <= allowedTime) {
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
          swipedir = (distX < 0) ? 'left' : 'right';
        }
      }
      handleswipe(swipedir);
      e.preventDefault();
    }, false);
  };

  useEffect(() => {
    if (isTouchDevice) {
      cardsRef.current.forEach(card => {
        swipedetect(card, (dir) => {
          handleSwipe(dir);
        });
      });
    }
  }, [currentCard]);

  const handleClick = (index, isNext) => {
    if (isNext) {
      handleSwipe("left");
    } else {
      handleSwipe("right");
    }
  };

  return (
 <main style={{ position: "relative", height: "600px" }}>
    {Array.from({ length: totalCards }).map((_, idx) => {
      // Calculate horizontal position relative to currentCard
      const offset = idx - currentCard;
      return (
        <div
          key={idx}
          className={`cards ${idx === currentCard ? 'currentCard' : 'notCurrentCard'}`}
          style={{
            zIndex: idx === currentCard ? 999 : 998 - Math.abs(offset),
            transform: `translateX(${offset * 60}px) scale(${idx === currentCard ? 1 : 0.95})`,
            opacity: idx === currentCard ? 1 : 0.7,
            pointerEvents: idx === currentCard ? "auto" : "none",
            transition: "transform 0.3s, opacity 0.3s",
          }}
          ref={el => cardsRef.current[idx] = el}
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
