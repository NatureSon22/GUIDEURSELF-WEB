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
          content: `You are a text classification API that categorizes user queries specifically related to university information and processes with high accuracy.

          Classify each query into one of the following categories:

          1. "Factual Look-Up" – Requests for specific facts, data, definitions, or information retrieval about the university. Examples include: "What are the tuition fees for the Engineering program?", "Who is the Dean of Students?", "Where is the Registrar's Office located?", "What are the library hours?", "How many students are enrolled this semester?".
          2. "Procedural" – Requests for instructions, processes, tutorials, or step-by-step guidance related to university procedures. Examples include: "How do I apply for admission?", "What is the process for dropping a course?", "How can I request my academic transcript?", "Steps to apply for a student loan?", "What's the procedure for appealing a grade?".
          3. "Tricky or Adversarial" – Misleading, confusing, system-testing, or nonsensical queries that are not clearly related to university information or processes, or are designed to test the system's boundaries.

          Guidelines:
          - Use the dominant intent of the query.
          - Classify nonsense, unclear, or queries that are out-of-scope (not related to university information or processes) as "Tricky or Adversarial".
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