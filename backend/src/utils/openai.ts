const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

/**
 * Generate interview questions based on resume content and job details
 */
const generateInterviewQuestions = async (
  resumeContent: string,
  jobTitle: string,
  jobDescription?: string
) => {
  try {
    const prompt = `
      Based on the following resume and job details, generate 5 relevant interview questions that would be asked in a real interview.
      The questions should be challenging but fair, and should assess the candidate's fit for the role.
      Format the questions as a numbered list, each question on a new line.
      
      Resume Content:
      ${resumeContent}
      
      Job Title: ${jobTitle}
      ${jobDescription ? `Job Description: ${jobDescription}` : ""}
      
      Generate 5 interview questions:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    if (!content) {
      throw new Error("Failed to generate interview questions");
    }

    // Parse the response to extract questions
    const questions = content
      .split("\n")
      .filter(
        (line: string) =>
          line.trim().length > 0 && (line.includes("?") || /^\d+\./.test(line))
      )
      .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
      .slice(0, 5);

    return questions;
  } catch (error: any) {
    console.error("Error generating interview questions:", error);
    // Handle rate limit error by providing fallback questions
    if (error.status === 429 || error.code === "rate_limit_exceeded") {
      console.warn("Gemini API rate limit exceeded, using fallback questions");
      return [
        "Can you tell me about your experience with this role?",
        "What are your strengths and weaknesses?",
        "Why are you interested in this position?",
        "Describe a challenging project you've worked on.",
        "Where do you see yourself in 5 years?",
      ];
    }
    throw new Error("Failed to generate interview questions");
  }
};

/**
 * Analyze an interview answer and provide feedback and a model answer
 */
const analyzeAnswer = async (
  question: string,
  answer: string,
  jobTitle: string
) => {
  try {
    const prompt = `
You are an Interview Answer Evaluation AI for the role: ${jobTitle}.

Your output must follow this exact format:

**1. Key Strengths:**
- ...
- ...
- ...

**2. Areas of Improvement:**
- ...
- ...
- ...

**3. Model Answer (Improved Version):**
(Write the improved answer here)

**4. Score (Out of 10) with Reasoning:**
Confidence: X/10 — short reason
Clarity: X/10 — short reason
Relevance: X/10 — short reason

Question: ${question}
User Answer: ${answer}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text() || "";

    console.log("Gemini response:", content);

    // ✅ Parse sections reliably
    const strengths =
      content
        .match(/\*\*1\. Key Strengths:\*\*([\s\S]*?)\*\*2\./)?.[1]
        ?.trim() || "";
    const improvements =
      content
        .match(/\*\*2\. Areas of Improvement:\*\*([\s\S]*?)\*\*3\./)?.[1]
        ?.trim() || "";
    const modelAnswer =
      content
        .match(
          /\*\*3\. Model Answer \(Improved Version\):\*\*([\s\S]*?)\*\*4\./
        )?.[1]
        ?.trim() || "No model answer provided";

    const scoreSection =
      content.match(
        /\*\*4\. Score \(Out of 10\) with Reasoning:\*\*([\s\S]*)/
      )?.[1] || "";

    const confidenceScore = parseInt(
      scoreSection.match(/Confidence:\s*(\d+)/)?.[1] || "5"
    );
    const clarityScore = parseInt(
      scoreSection.match(/Clarity:\s*(\d+)/)?.[1] || "5"
    );
    const relevanceScore = parseInt(
      scoreSection.match(/Relevance:\s*(\d+)/)?.[1] || "5"
    );

    const feedback = `
**Key Strengths:**
${strengths}

**Areas of Improvement:**
${improvements}
`.trim();

    return {
      feedback,
      modelAnswer,
      confidenceScore,
      clarityScore,
      relevanceScore,
    };
  } catch (error) {
    console.error("Error analyzing answer:", error);
    throw new Error("Failed to analyze answer");
  }
};

module.exports = {
  generateInterviewQuestions,
  analyzeAnswer,
};
