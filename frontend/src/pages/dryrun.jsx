import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { gemini } from '../components/ai'; 
import './css/dryrun.css';
import Loading from '../components/loading'; // Assuming you have a Loading component

function Dryrun() {

  const [inputValue, setInputValue]= useState("");
  const [inputCode, setInputCode] = useState("");
  const [dryrun, setDryrun] = useState("Loading...");
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 

  function handle(e) {
    e.preventDefault();
    if (!inputValue || !inputCode) {
      setDryrun("No input or code provided.");
     
      setIsLoading(false);
      alert("Please provide both input and code.");
      return;
    }
    setDryrun("Loading...");
    setIsLoading(true);
    setShowResult(true);

    const prompt = `
Below is an EXAMPLE. Follow the format strictly.

Input: arr = [1,2,3]
Code:
for(let i=0;i<arr.length;i++) {console.log(arr[i])}

Output Table:
| Step | i | arr[i] | Output       |
|------|---|--------|--------------|
| 1    | 0 |   1    | console.log(1)|
| 2    | 1 |   2    | console.log(2)|
| 3    | 2 |   3    | console.log(3)|

Now, given this input and code:
Input: ${inputValue}
Code: ${inputCode}

Give ONLY the markdown table, same format as above (no code block, no explanation, no skipping any steps).


`
    fetchdryrun(prompt);
  }

  async function fetchdryrun(prompt) {
    try {
      const res = await gemini(prompt);
      if (res?.error) {
        throw new Error(res.error.message || "API Error");
      }
      const generatedDescription = res.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedDescription) {
        throw new Error("Empty response from AI");
      }
      setDryrun(generatedDescription);
      setShowResult(true);
    } catch (error) {
      console.error(error);
      setDryrun(`Failed to generate dry run table: ${error.message || "Unknown error"}`);
      setShowResult(true);
    } finally {
      setIsLoading(false);
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
        <form onSubmit={handle} className="dryrun-form">
          <input
            className="dryrun-input"
            type="text"
            placeholder="Enter the input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <input
            className="dryrun-input dryrun-code-input"
            type="text"
            placeholder="Paste the code here"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          <button type="submit" name="run">Run</button>
        </form>
      ) : (
        <>
        {isLoading ? <Loading /> :
         <div className="dryrun-result description-container">
          <h2>Dry Run Result</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {dryrun}
          </ReactMarkdown>
          <button onClick={resetForm} style={{ marginTop: 16 }}>Try Again</button>
        </div> }
       
        </>
      )}
     
    </div>
    
  );
}

export default Dryrun;
