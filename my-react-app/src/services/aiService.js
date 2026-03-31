import axios from "axios";

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

const DEFAULT_MODEL = "gpt-4o-mini";

function getApiKey() {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (typeof key !== "string" || key.trim() === "") {
    throw new Error(
      "Missing VITE_OPENAI_API_KEY. Create a .env file (see .env.example) and restart the dev server.",
    );
  }
  return key.trim();
}

function getModel() {
  const m = import.meta.env.VITE_OPENAI_MODEL;
  return typeof m === "string" && m.trim() !== "" ? m.trim() : DEFAULT_MODEL;
}

function buildUserMessage(topic, action) {
  const t = topic.trim();
  switch (action) {
    case "summary":
      return `The student is studying "${t}". Write a clear, structured study summary: key concepts, definitions, and how ideas connect. Use short headings and bullet points. Aim for concise depth they can review before an exam.`;
    case "practice":
      return `The student is studying "${t}". Generate 6–10 practice questions that test understanding (mix recall, application, and one harder synthesis question). Number each question. After each question, add "Answer:" on the next line with a brief model answer.`;
    case "flashcards":
      return `The student is studying "${t}". Create 12–20 flashcards as plain text. Each flashcard must be exactly two lines: first line "Q: ...", second line "A: ...". Separate cards with a blank line between them.`;
    default:
      throw new Error("Unknown action");
  }
}

export async function runOpenAiAction({ topic, action }) {
  const trimmed = topic?.trim();
  if (!trimmed) {
    throw new Error("Topic is required.");
  }

  const apiKey = getApiKey();
  const userMessage = buildUserMessage(trimmed, action);

  const { data } = await axios.post(
    OPENAI_CHAT_URL,
    {
      model: getModel(),
      messages: [
        {
          role: "system",
          content:
            "You are a patient, accurate tutor for students. Be clear and educational. Do not invent citations or claim to browse the web. If the topic is ambiguous, make reasonable assumptions and state them briefly.",
        },
        { role: "user", content: userMessage },
      ],
      temperature: 0.6,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 120_000,
    },
  );

  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("No content returned from OpenAI.");
  }

  return text;
}

export function formatAiError(error) {
  if (axios.isAxiosError(error)) {
    const apiMsg = error.response?.data?.error?.message;
    if (typeof apiMsg === "string" && apiMsg) return apiMsg;
    if (error.response?.status === 401) {
      return "Invalid API key or unauthorized. Check VITE_OPENAI_API_KEY.";
    }
    if (error.response?.status === 429) {
      return "Rate limit reached. Try again in a moment.";
    }
    if (error.code === "ECONNABORTED") {
      return "Request timed out. Try again with a shorter topic or later.";
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
