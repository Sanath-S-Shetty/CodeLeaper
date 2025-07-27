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





function App() {
  

   return (
   <Router>
      <div className="App">
        <Navbar />
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solution" element={<Solution />} />
          <Route path="/code" element={<Code />} />
          <Route path="/dryrun" element={<Dryrun />} />
          <Route path="/description" element={<Description />} />
          <Route path="/hints" element={<Hints />} />
          <Route path="/gowrong" element={<Gowrong />} /> 

        </Routes>
      </div>
    </Router>
   )
}

export default App
