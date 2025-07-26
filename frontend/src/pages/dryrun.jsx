 
 import React, { useState } from "react";
 import ReactMarkdown from "react-markdown";
 import { gemini } from '../components/ai';
 import './dryrun.css';
 function Dryrun() {

      
    const [inputValue, setInputValue]= useState("");
    const [inputCode, setInputCode] = useState("");

    const [dryrun,setDryrun] = useState("Loading...");
    const [showResult, setShowResult] = useState(false);

    function handel(e){
      e.preventDefault();
      setDryrun("Loading...");
 const prompt = `
      dry run the code for input "${inputValue}" for the code "${inputCode}" and generate a table for all the values of the variables in the code,
      such that it helps me to understand the code better.  generate only the table dont give any information or explanation. and must be in markdown format.
        give '-' for empty values.
      `;
      fetchdryrun(prompt);

    }
          async function fetchdryrun(prompt) {

            let generatedDescription = "";

            if (!inputValue || !inputCode) {
              setDryrun("No input or code provided.");
              setShowResult(true);
              return;
            }
      
        
      
            try {
              const res = await gemini(prompt);
              try {
  generatedDescription = res.candidates[0].content.parts[0].text;
} catch (parseError) {
  console.error("Failed to parse Gemini response:", parseError);
}
              setDryrun(generatedDescription);
              setShowResult(true);
            } catch (error) {
              console.error(error);
              setDryrun("Failed to generate description.");
              setShowResult(true);
            }
          }
      
        function resetForm() {
    setInputValue("");
    setInputCode("");
    setShowResult(false);
    setDryrun("Loading...");
  }
      
    


  return (
    <div>
      <h1>Dry Run Page</h1>
      {!showResult ? (
        <form onSubmit={handel}>
          <input type="text" placeholder="Enter the input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          <input type="text" placeholder="Enter the code" value={inputCode} onChange={(e) => setInputCode(e.target.value)} />
          <button type="submit">run</button>
        </form>
      ) : (
        <div>
          <h2>Dry Run Result</h2>
          <ReactMarkdown>{dryrun}</ReactMarkdown>
          <button onClick={resetForm}>Try Again</button>
        </div>
      )}
      <p>This page is designed for dry runs of the project.</p>
    </div>
  );}

export default Dryrun;