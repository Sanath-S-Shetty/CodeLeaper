import { useLocation } from "react-router-dom";
import { useState } from 'react';
import { gemini } from '../components/ai';
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './css/gowrong.css';
import Loading from '../components/loading'

function Gowrong() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const [message, setMessage] = useState("Loading...");
  const [code, setCode] = useState("");
  const [bool, setBool] = useState(false);
  const [loading,setLoading] = useState(false);

  function handle(e) {
    e.preventDefault();
    if (!query) {
      setMessage("No question provided.");
       setLoading(false);
      return;
    }
    if (!code) {
      setMessage("No code provided.");
      setLoading(false);
      return;
    }
    setBool(true);
     setLoading(true);

    const prompt = `for the leetcode problem with problem no: "${query}",tell me what are the mistakes in the code below "${code}" ;

follow this format STRICTLY and provide markdown syntax:

title of the question
mistakes in the code

please dont give any other information other than the mistakes in the code.
`;
    fetchGowrong(prompt);
  }

  async function fetchGowrong(prompt) {
  try {
    const res = await gemini(prompt);
    console.log('DEBUG: Gemini raw response:', res);
    // Fix this line:
    const generatedMessage = res.candidates[0].content.parts[0].text;
    setMessage(generatedMessage);
  } catch (error) {
    console.error(error);
    setMessage("Failed to generate response.");
  } finally {
    setLoading(false);
  }
}
  const parsedDescription = (description) => {
    const lines = description.split('\n');
    const sections = { title: "", mistakes: "" };
    let currentSection = "";

    lines.forEach(line => {
      if (!sections.title && line.trim() && !line.startsWith('```') && !line.toLowerCase().includes('mistakes in the code')) {
        sections.title = line.trim();
        return;
      }
      if (line.toLowerCase().includes("mistakes in the code")) {
        currentSection = "mistakes";
      } else if (currentSection === "mistakes") {
        sections.mistakes += line.trim() + '\n';
      }
    });
    sections.mistakes = sections.mistakes.trim();
    return sections;
  };

  const sections = parsedDescription(message);

  return (
    <div>
      <h1>Finding the Mistakes</h1>
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
      ) : ( <>
       {loading? <Loading/> : <div className="code-container">
          <h1>{sections.title}</h1>
          <h2>Code:</h2>
          <SyntaxHighlighter  style={oneDark}>
            {code}
          </SyntaxHighlighter>
          <h2>Mistakes:</h2>
          <Markdown remarkPlugins={[remarkGfm]}>
            {sections.mistakes}
          </Markdown>
        </div> }
       </>
      )}
    </div>

    
     
  
  );
}

export default Gowrong;
