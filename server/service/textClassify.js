import { Groq } from "groq-sdk";
import { config } from "dotenv";

config();

const groq = new Groq({ apiKey: process.env.GROQ_KEY });
const FALLBACK_CATEGORY = "Uncategorized";

const classifyText = async (query) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: `You are a text classification API that categorizes user queries with high accuracy.

        Classify each query into one of the following categories:

        1. "Factual Look-Up" – Requests for specific facts, data, definitions, or information retrieval.
        2. "Procedural" – Requests for instructions, processes, tutorials, or step-by-step guidance.
        3. "Tricky or Adversarial" – Misleading, confusing, system-testing, or nonsensical queries.

        Guidelines:
        - Use the dominant intent.
        - Classify nonsense or unclear queries as "Tricky or Adversarial".
        - Output JSON ONLY like:
        {
          "text_classification": {
            "category": "Factual Look-Up" | "Procedural" | "Tricky or Adversarial"
          }
        }`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    console.log("Parsed Result:", result);

    return result;
  } catch (e) {
    console.error("Classification error:", e);

    return {
      text_classification: {
        category: FALLBACK_CATEGORY,
      },
    };
  }
};

export default classifyText;
