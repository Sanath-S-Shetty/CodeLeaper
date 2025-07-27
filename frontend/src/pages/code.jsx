import { useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';
import {gemini} from '../components/ai'; 
import Markdown from 'react-markdown';  
function Code() {



  const [code, setCode] = useState("Loading...");
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

     useEffect(() => {
        async function fetchCode() {
          if (!query) {
            setCode("No question provided.");
            return;
          }
    
       const prompt = `
    Generate solution code in java C++ and pyton for the leetcode problem with problem no:
    
    "${query}" 

    Strictly follow the format given below


    title of the question

    java code
    c++ code
    python code

    brief explanation of the solution
    time and space complexity
    optimization suggestion
    `;
    
    
          try {
            const res = await gemini(prompt);
            const code = res.candidates[0].content.parts[0].text;
            setCode(code);
          } catch (error) {
            console.error(error);
            setCode("Failed to generate code.");
          }
        }
    
        fetchCode();
      }, [query]);
    




  return (
    <div>
      <h1>Code Page</h1>
      <Markdown>{code}</Markdown>
      <p>This page contains the code for the project.</p>
    </div>
  );
}
export default Code;