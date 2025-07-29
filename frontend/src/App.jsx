import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/navbar'
import Home from  './pages/home'
import Solution from './pages/solution'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Code from './pages/code'
import Dryrun from './pages/dryrun'
import Description from './pages/description'
import Hints from './pages/hints'
import Gowrong from './pages/gowrong'
import About from './pages/about'
import Contact from './pages/contact'
import { useEffect } from 'react';




function App() {
  

 useEffect(() => {
  const starsContainer = document.querySelector(".stars-container");

  // Safety: stop if not mounted (shouldn't happen in SPA)
  if (!starsContainer) return;

  function spawnStar() {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.left = Math.random() * window.innerWidth + "px";
    star.style.top = "0px";
    star.style.opacity = Math.random().toFixed(2);
    const size = Math.random() * 2 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.dataset.speed = (Math.random() * 3 + 1).toFixed(2);
    starsContainer.appendChild(star);
  }

  function moveStars() {
    const stars = starsContainer.querySelectorAll(".star");
    stars.forEach((star) => {
      let top = parseFloat(star.style.top);
      const speed = parseFloat(star.dataset.speed);
      top += speed;
      star.style.top = top + "px";
      if (top > window.innerHeight) {
        star.remove();
      }
    });
  }

  function spawnInitialStars(count) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.left = Math.random() * window.innerWidth + "px";
      star.style.top = Math.random() * window.innerHeight + "px";
      star.style.opacity = Math.random().toFixed(2);
      const size = Math.random() * 2 + 1;
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.dataset.speed = (Math.random() * 3 + 1).toFixed(2);
      starsContainer.appendChild(star);
    }
  }

  spawnInitialStars(300);

  const spawnInterval = setInterval(spawnStar, 100);
  const moveInterval = setInterval(moveStars, 50);

  // Clean up intervals and stars when component unmounts
  return () => {
    clearInterval(spawnInterval);
    clearInterval(moveInterval);
    if (starsContainer) starsContainer.innerHTML = "";
  };
}, []);


   return (
   <Router>
      <div className="App">
        <Navbar />
        <div className="stars-container"></div>
        <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solution" element={<Solution />} />
          <Route path="/code" element={<Code />} />
          <Route path="/dryrun" element={<Dryrun />} />
          <Route path="/description" element={<Description />} />
          <Route path="/hints" element={<Hints />} />
          <Route path="/gowrong" element={<Gowrong />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact/>}/>

        </Routes>
        </div>
      </div>
    </Router>
   )
}

export default App
