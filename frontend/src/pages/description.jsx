import React, { useEffect, useState } from 'react';
import { gemini } from '../components/ai';
import { useLocation } from "react-router-dom";
import './description.css';
function Description() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const [description, setDescription] = useState("Loading...");

  useEffect(() => {
    async function fetchDescription() {
      if (!query) {
        setDescription("No quesiton provided.");
        return;
      }

   const prompt = `
Generate a simplified description such that a 5th grader could understand it, for this LeetCode problem with problem no:

"${query}"

Follow this format STRICTLY WITHOUT any markdown syntax:

Problem Title:
[Title]

Problem Description:
[Brief description]

Conditions:
- [condition 1]
- [condition 2]

Example:
Input: [input]
Output: [output]
Explanation: [simple explanation]

Do not reveal the solution. DO NOT SKIP ANY LABELS EVEN IF TITLE OR DESCRIPTION IS OBVIOUS.
`;


      try {
        const res = await gemini(prompt);
        const generatedDescription = res.candidates[0].content.parts[0].text;
        setDescription(generatedDescription);
      } catch (error) {
        console.error(error);
        setDescription("Failed to generate description.");
      }
    }

    fetchDescription();
  }, [query]);

  // ✨ Parse the text into sections for formatting
  const parsedDescription = () => {
  const lines = description.split('\n');
  const sections = { title: "", description: "", conditions: [], example: "" };
  let currentSection = "";

  lines.forEach(line => {
    if (line.startsWith("Problem Title:")) {
      currentSection = "title";
      sections[currentSection] = line.replace("Problem Title:", "").trim();
    } else if (line.startsWith("Problem Description:")) {
      currentSection = "description";
      sections[currentSection] = line.replace("Problem Description:", "").trim();
    } else if (line.startsWith("Conditions:")) {
      currentSection = "conditions";
      sections[currentSection] = [];
    } else if (line.startsWith("Example:")) {
      currentSection = "example";
      sections[currentSection] = "";

    }else if (line.startsWith("Solution:")) {
  currentSection = "solution";
  sections[currentSection] = line.replace("Solution:", "").trim();
    } else {
      if (currentSection === "conditions") {
        if (line.trim() !== "") sections[currentSection].push(line.trim());
      } else if (currentSection === "example") {
        sections[currentSection] += line.trim() + " ";
      } else if (currentSection === "description" || currentSection === "title") {
        sections[currentSection] += " " + line.trim();
      } else if (currentSection === "solution") {
        sections[currentSection] += " " + line.trim();
      }
    }
  });

  // If title still missing, infer it from first sentence
  if (!sections.title && lines.length > 0) {
    sections.title = lines[0].split('.')[0]; // Use first sentence as title fallback
  }

  return sections;
};


 


  const sections = parsedDescription();

  return (
    <div className="description-container">
      <h1>{sections.title}</h1>
      <h2>Description:</h2>
      <p>{sections.description}</p>

      {sections.conditions && (
        <div>
          <h3>Conditions:</h3>
          <ul>
            {sections.conditions.map((cond, index) => (
              <li key={index}>{cond.replace("- ", "")}</li>
            ))}
          </ul>
        </div>
      )}

   {sections.example && (
  <div>
    <h3>Example:</h3>
    <div className="example-block">
      {sections.example.split(/(Input:|Output:|Explanation:)/g).map((part, idx, arr) => {
        // If the part is a label, render it bold and on a new line
        if (["Input:", "Output:", "Explanation:"].includes(part)) {
          return <div key={idx} style={{ fontWeight: "bold", marginTop: idx !== 0 ? "0.5em" : 0 }}>{part} {arr[idx + 1] && arr[idx + 1].trim()}</div>;
        }
        // Skip the value part, as it's already rendered with the label
        if (["Input:", "Output:", "Explanation:"].includes(arr[idx - 1])) return null;
        return null;
      })}
    </div>
  </div>
)}

    </div>
  );
}

export default Description;


