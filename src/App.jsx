import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    try {
      setLoading(true);
      setReview(""); 
      const response = await axios.post("https://backend-resume-vercel-dzpx.vercel.app/", {
        code,
      });
      setReview(response.data);
    } catch (err) {
      setReview(" Error: Server not responding");
    }
    setLoading(false);
  }

  return (
    <div className="container">
      <header>
        <h1>AI Code Reviewer</h1>
        <p>Paste code → Click Review → Get quality suggestions instantly ⚡</p>
      </header>

      <main>
        <div className="panel editor-panel">
          <h2>Code Editor</h2>

          <div className="editor-box">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={14}
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 15,
              }}
            />
          </div>

          <button onClick={reviewCode} className="review-btn">
            {loading ? "Analyzing..." : "Review Code"}
          </button>
        </div>

        <div className="panel result-panel">
          <h2>AI Review Result</h2>

          <div className="output-box">
            {loading && <div className="loader"></div>}

            {!loading && (
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review || "Result will appear here after review"}
              </Markdown>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
