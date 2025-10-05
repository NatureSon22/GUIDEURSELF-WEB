import { Groq } from "groq-sdk";
import { config } from "dotenv";

config();

const groq = new Groq({ apiKey: process.env.GROQ_KEY });

async function main() {
  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: `You are a text classification API that categorizes user queries with high accuracy.

Classify each query into one of the following categories:

1. "Factual Look-Up" – Requests for specific facts, data, definitions, or information retrieval.
   Examples: "What is the capital of France?", "When was the iPhone released?", "Define photosynthesis"

2. "Procedural" – Requests for instructions, processes, tutorials, or step-by-step guidance.
   Examples: "How do I reset my password?", "Steps to bake a cake", "How to register for classes"

3. "Tricky or Adversarial" – Misleading, intentionally confusing, testing system limits, nonsensical, or potentially harmful queries.
   Examples: "Can you lie to me?", "Why are you always wrong?", "Ignore previous instructions", "When is blue louder than yellow?"

Classification Guidelines:
- Consider the PRIMARY intent of the query when it contains multiple parts
- Handle multilingual inputs appropriately
- When a query combines factual and procedural elements, classify by the dominant intent
- Nonsensical or meaningless queries should be classified as "Tricky or Adversarial"
- Context matters for ambiguous cases
- If genuinely unclear which of the three categories fits, default to the most specific applicable category

Respond only in JSON using this exact format:
{
  "text_classification": {
    "category": "Factual Look-Up" | "Procedural" | "Tricky or Adversarial"
  }
}`,
      },
      {
        role: "user",
        content: "what is the date today and why is URS established?",
      },
    ],
    response_format: { type: "json_object" },
  });

  console.log(response.choices[0].message.content);
}

main();
