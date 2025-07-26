import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/solution?query=${encodeURIComponent(searchQuery)}`);
  };



  return (
    <div className="home">
      <h1>Get help to ace your DSA journey</h1>
      <h2>Enter the Question No or title</h2>

      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Question No or title" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
       
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default Home;
