import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { gemini } from '../components/ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Loading from '../components/loading';
import './css/code.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark,oneLight,atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Code() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const [rawCodeText, setRawCodeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

function parseResponse(text) {
  // Split into lines, trim only end to preserve any leading code whitespace
  const lines = text.split('\n').map(l => l.trimEnd());
  const sections = {
    title: "",
    java: "",
    cpp: "",
    python: "",
    explanation: "",
    complexity: "",
    optimization: "",
  };

  // Find all section headers and their indexes
  const sectionMap = {};
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase();
    if (l === "java code") sectionMap.java = i;
    else if (l === "c++ code") sectionMap.cpp = i;
    else if (l === "python code") sectionMap.python = i;
    else if (l.startsWith("brief explanation")) sectionMap.explanation = i;
    else if (l.startsWith("time and space")) sectionMap.complexity = i;
    else if (l.startsWith("optimization") || l.startsWith("optimization suggestion")) sectionMap.optimization = i;
  }

  // Title: everything before first code section header
  const firstHeaderIdx = Math.min(...Object.values(sectionMap).filter(i => typeof i === "number"));
  sections.title = lines.slice(0, firstHeaderIdx).join(' ').trim();

  // Helper: get lines between two indexes
  function between(start, end) {
    if (typeof start !== "number") return "";
    const e = (typeof end === "number") ? end : lines.length;
    return lines.slice(start + 1, e).join('\n').trim();
  }

  sections.java = between(sectionMap.java, sectionMap.cpp);
  sections.cpp = between(sectionMap.cpp, sectionMap.python);
  // Take explanation, complexity, optimization blocks
  const explanationEnd = sectionMap.complexity ?? sectionMap.optimization ?? lines.length;
  const complexityEnd = sectionMap.optimization ?? lines.length;
  sections.python = between(sectionMap.python, sectionMap.explanation ?? sectionMap.complexity ?? sectionMap.optimization);

  sections.explanation = (typeof sectionMap.explanation === "number") ?
    between(sectionMap.explanation, sectionMap.complexity ?? sectionMap.optimization) : "";

  sections.complexity = (typeof sectionMap.complexity === "number") ?
    between(sectionMap.complexity, sectionMap.optimization) : "";

  sections.optimization = (typeof sectionMap.optimization === "number") ?
    lines.slice(sectionMap.optimization + 1).join('\n').trim() : "";

  return sections;
}



  useEffect(() => {
    let isMounted = true;

    async function fetchCode() {
      if (!query) {
        if (isMounted) {
          setError("No question provided.");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError("");
      setRawCodeText("");

      const prompt = `
Give the solution for LeetCode problem number: ${query}

Strict format only — NO markdown, NO code blocks, just plain text as in this example:

[Title of the problem]

java code
<your Java code here. Do not include any other language code here.>

c++ code
<your C++ code here. Do not include any other language code here.>

python code
<your Python code here. Do not include any other language code here.>

brief explanation of the solution

time and space complexity of the solution

optimization suggestion for solution

NEVER put more than one language in a code section. NO markdown. NO triple backticks. Each code only in its own section.

`;

      try {
        const res = await gemini(prompt);
        const text = res?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Empty response");
        if (isMounted) {
          setRawCodeText(text);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to generate code.");
          setLoading(false);
        }
      }
    }

    fetchCode();

    return () => {
      isMounted = false;
    };
  }, [query]);


  if (loading) return <Loading />;

  if (error) return (
    <div className="code-container">
      <h1>Error</h1>
      <p>{error}</p>
    </div>
  );

  if (!rawCodeText) return null;

  const sections = parseResponse(rawCodeText);

  // Render code blocks neatly. We wrap code sections inside <pre><code> with language class for styling if desired,
  // but we leave them as plain text because no markdown is expected in code.

  return (
    <div className="code-container">
      <h1>{sections.title || "LeetCode Solution"}</h1>

      {sections.java && (
        <>
          <h2>Java Code</h2>
          <SyntaxHighlighter language="java" style={oneDark} >
      {sections.java}
    </SyntaxHighlighter>
        </>
      )}

      {sections.cpp && (
        <>
          <h2>C++ Code</h2>
          <SyntaxHighlighter language="cpp" style={oneDark} >
      {sections.cpp}
    </SyntaxHighlighter>
        </>
      )}

      {sections.python && (
        <>
          <h2>Python Code</h2>
          <SyntaxHighlighter language="python" style={oneDark} >
      {sections.python}
    </SyntaxHighlighter>
        </>
      )}

    {sections.explanation && typeof sections.explanation === 'string' && sections.explanation.trim() && (
  <>
    <h2>Explanation</h2>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {sections.explanation}
    </ReactMarkdown>
  </>
)}


      {sections.complexity && (
        <>
          <h2>Time and Space Complexity</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {sections.complexity}
    </ReactMarkdown>
        </>
      )}

      {sections.optimization && (
        <>
          <h2>Optimization Suggestions</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {sections.optimization}
    </ReactMarkdown>
        </>
      )}

      <p style={{ marginTop: '2rem', fontStyle: 'italic', color: '#99bbff' }}>
       
      </p>
    </div>
  );
}

export default Code;
