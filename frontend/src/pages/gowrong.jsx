import { useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import { gemini } from '../components/ai';
import Markdown from "react-markdown";

function Gowrong() {
const location = useLocation();
const query = new URLSearchParams(location.search).get("query");

const [message,setMessage] = useState("Loading...");
const [code,setCode] = useState("");
const [bool,setBool] = useState(false);



  function handle(e){
    e.preventDefault();
    if (!query) {
      setMessage("No question provided.");
      return;
    }
      if(!code){
        setMessage("No code provided.");
        return; 
      }
    setBool(true);

    const prompt = `for the leetcode problem with problem no: "${query}",tell me what are the mistakes in the code below "${code}" ;

    follow this format STRICTLY and provide markdown syntax:

    title of the question
    [code]
    mistakes in the code


    please dont give any other information other than the mistakes in the code.


`
    fetchGowrong(prompt);
  }
async function fetchGowrong(prompt) {
  const generatedMessage = "";
      try {
        const res = await gemini(prompt);
        const generatedMessage = res.candidates[0].content.parts[0].text;
        setMessage(generatedMessage);
      } catch (error) {
        console.error(error);
        setMessage("Failed to generate response.");
      }
    }

  
  return (
    <div>
      <h1>Find the Mistakes</h1>

      {!bool ? (
        <form onSubmit={handle}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here"
            rows={8}
            cols={50}
          />
          <br />
          <button type="submit">Check Mistakes</button>
        </form>
      ) : (
        <Markdown>{message}</Markdown>
      )}

     
    </div>
  );
}

export default Gowrong; 
