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

  // Find headers for code sections
  const idxJava = lines.findIndex(l => l.toLowerCase().includes("java code"));
  const idxCpp = lines.findIndex(l => l.toLowerCase().includes("c++ code"));
  const idxPython = lines.findIndex(l => l.toLowerCase().includes("python code"));

  // Title
  sections.title = lines[0];

  // Java section
  if (idxJava !== -1) {
    const javaStart = idxJava + 1;
    const javaEnd = (idxCpp !== -1) ? idxCpp : (idxPython !== -1 ? idxPython : lines.length);
    sections.java = lines.slice(javaStart, javaEnd).join('\n');
  }
  // C++ section
  if (idxCpp !== -1) {
    const cppStart = idxCpp + 1;
    const cppEnd = (idxPython !== -1) ? idxPython : lines.length;
    sections.cpp = lines.slice(cppStart, cppEnd).join('\n');
  }
  // Python section
  if (idxPython !== -1) {
    const pyStart = idxPython + 1;
    // Get lines until we hit an explanation, complexity, or optimization label,
    // or lines that clearly are not code (lacking indentation, etc).
    let pyEnd = lines.length;
    for (let i = pyStart; i < lines.length; i++) {
      const l = lines[i];
      if (/explanation|complexity|optimization/i.test(l)) {
        pyEnd = i;
        break;
      }
    }
    // Main python code
    sections.python = lines.slice(pyStart, pyEnd).join('\n');
    // Remainder is explanation/etc
    const rest = lines.slice(pyEnd).join('\n');
    if (rest) {
      // Split remaining by heading/keywords
      const exMatch = rest.match(/(explanation.*?)(time and space.*?)(optimization.*)/is);
      if (exMatch) {
        sections.explanation = exMatch[1].replace(/explanation.*?:?/i, "").trim();
        sections.complexity = exMatch[2].replace(/time and space.*?:?/i, "").trim();
        sections.optimization = exMatch[3].replace(/optimization.*?:?/i, "").trim();
      } else {
        // Try single splits if no triple match
        const [expBlock, restBlock] = rest.split(/time and space.*?:?/i, 2);
        if (restBlock !== undefined) {
          sections.explanation = expBlock.replace(/explanation.*?:?/i, "").trim();
          const [compBlock, optBlock] = restBlock.split(/optimization.*?:?/i, 2);
          if (optBlock !== undefined) {
            sections.complexity = compBlock.trim();
            sections.optimization = optBlock.trim();
          } else {
            sections.complexity = restBlock.trim();
          }
        } else {
          sections.explanation = rest.replace(/explanation.*?:?/i, "").trim();
        }
      }
    }
  }

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
Generate solution code in java C++ and python for the leetcode problem with problem no:

"${query}" 

Follow this format STRICTLY WITHOUT any markdown syntax:

title of the question

java code
c++ code
python code

Explanaiton: brief explanation of the solution
Time and Space Complexity: time and space complexity of the solution
Optimization: optimization suggestion for solution
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
        This page contains the generated solution code and explanation.
      </p>
    </div>
  );
}

export default Code;
