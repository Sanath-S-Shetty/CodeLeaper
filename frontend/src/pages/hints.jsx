import Slides from '../components/slides.jsx';  
import { useLocation } from 'react-router-dom';
import {useState, useEffect } from 'react';
import {gemini} from '../components/ai';

function Hints() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

      const[hint,setHint] = useState("");


  useEffect(() => {
    async function fetchDescription() {

      const generatedhint="";
      if (!query) {
        setHint("No quesiton provided.");
        return;
      }

  const prompt = `
Generate 4 distinct hints for the LeetCode problem with problem number: "${query}".

Hints must be arranged in increasing order of helpfulness:
- Hint 1: very minimal help
- Hint 4: provides majority of the help

Follow this EXACT format WITHOUT markdown syntax:

Problem Title

Hint 1: [first hint]
Hint 2: [second hint]
Hint 3: [third hint]
Hint 4: [fourth hint]

Do NOT reveal the solution or any code, only small helpful hints.
`;


      try {
        const res = await gemini(prompt);
        const generatedhint = res.candidates[0].content.parts[0].text;
        setHint(generatedhint);
      } catch (error) {
        console.error(error);
        setHint("Failed to generate hint.");
      }
    }

    fetchDescription();
  }, [query]);









  return (
    <div>


      
        <Slides hints={hint} />
    
      <p>This page contains hints for the project.</p>
    </div>
  );
}

export default Hints;
