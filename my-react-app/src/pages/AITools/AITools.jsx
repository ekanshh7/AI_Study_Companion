import { useState } from "react";
import { toast } from "react-toastify";
import {
  formatAiError,
  runOpenAiAction,
} from "../../services/aiService.js";
import "./AITools.css";

const ACTIONS = [
  { value: "summary", label: "Generate Summary" },
  { value: "practice", label: "Generate Practice Questions" },
  { value: "flashcards", label: "Generate Flashcards" },
];

export default function AITools() {
  const [topic, setTopic] = useState("");
  const [action, setAction] = useState("summary");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) {
      toast.error("Please enter a topic.");
      return;
    }

    setLoading(true);
    setResult("");
    const toastId = toast.loading("Generating response…");

    try {
      const text = await runOpenAiAction({
        topic: trimmed,
        action,
      });
      setResult(text);
      toast.update(toastId, {
        render: "Done!",
        type: "success",
        isLoading: false,
        autoClose: 2200,
      });
    } catch (err) {
      const message = formatAiError(err);
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 6000,
      });
      setResult("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-tools">
      <header className="ai-tools__header">
        <h1 className="ai-tools__title">AI Tools</h1>
        <p className="ai-tools__intro">
          Enter a topic and choose an action. 
        </p>
      </header>

      <form
        className="ai-tools__form"
        onSubmit={handleSubmit}
        aria-busy={loading}
      >
        <div className="ai-tools__field">
          <label className="ai-tools__label" htmlFor="ai-topic">
            Topic
          </label>
          <input
            id="ai-topic"
            className="ai-tools__input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Photosynthesis, Newton’s laws, SQL joins"
            disabled={loading}
            autoComplete="off"
          />
        </div>

        <div className="ai-tools__field">
          <span className="ai-tools__label" id="ai-action-label">
            Action
          </span>
          <div
            className="ai-tools__actions"
            role="group"
            aria-labelledby="ai-action-label"
          >
            {ACTIONS.map((a) => (
              <label key={a.value} className="ai-tools__radio">
                <input
                  type="radio"
                  name="action"
                  value={a.value}
                  checked={action === a.value}
                  onChange={() => setAction(a.value)}
                  disabled={loading}
                />
                <span>{a.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="ai-tools__submit-wrap">
          <button
            type="submit"
            className="ai-tools__submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="ai-tools__spinner" aria-hidden />
                Generating…
              </>
            ) : (
              "Run"
            )}
          </button>
        </div>
      </form>

      <section
        className="ai-tools__results-section"
        aria-label="AI response"
      >
        <h2 className="ai-tools__results-heading">Result</h2>
        {result ? (
          <div className="ai-tools__results">
            <pre className="ai-tools__results-text">{result}</pre>
          </div>
        ) : (
          <div className="ai-tools__results ai-tools__results--empty">
            <p className="ai-tools__placeholder">
              {loading
                ? "Waiting for the model…"
                : "Your generated summary, questions, or flashcards will appear here."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
