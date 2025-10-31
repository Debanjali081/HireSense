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
      Analyze the following interview answer for the position of ${jobTitle}.

      Question: ${question}

      Answer: ${answer}

      Provide a comprehensive, narrative analysis of the answer. Structure your response with clear sections:

      **Strengths:**
      - List 2-3 specific strengths of the answer, explaining why they are effective.

      **Areas for Improvement:**
      - Identify 2-3 areas where the answer could be enhanced, with constructive suggestions.

      **Model Answer:**
      Provide a detailed, well-structured model answer that demonstrates excellent response quality for this question. Include specific examples and explanations.

      **Ratings:**
      Rate the answer on a scale of 1-10 for each criterion, providing a brief justification for each score:
      - Confidence: [score] - [brief justification]
      - Clarity: [score] - [brief justification]
      - Relevance: [score] - [brief justification]

      Ensure the feedback is detailed, constructive, and professional, helping the candidate improve their interview skills.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    console.log("Gemini response for analyzeAnswer:", content);
    if (!content) {
      throw new Error("Failed to analyze answer");
    }

    // Parse the response to extract feedback, model answer, and scores
 // New, more flexible parsing logic
const stopLookahead = '(?=\\n?(?:###\\s)?\\*\\*(Strengths|Areas for Improvement|Model Answer|Ratings)\\*\\*|$)';

const strengthsMatch = content.match(new RegExp('(?:###\\s)?\\*\\*Strengths\\*\\*\\s*(.+?)' + stopLookahead, 's'));
const improvementsMatch = content.match(new RegExp('(?:###\\s)?\\*\\*Areas for Improvement\\*\\*\\s*(.+?)' + stopLookahead, 's'));
const modelAnswerMatch = content.match(new RegExp('(?:###\\s)?\\*\\*Model Answer\\*\\*\\s*(.+?)' + stopLookahead, 's'));
const ratingsMatch = content.match(new RegExp('(?:###\s)?\\*\\*Ratings\\*\\*\\s*(.+?)$', 's'));

    let feedback = "No feedback provided";
    if (strengthsMatch?.[1] || improvementsMatch?.[1]) {
      const strengths =
        strengthsMatch?.[1]?.trim() || "No specific strengths identified.";
      const improvements =
        improvementsMatch?.[1]?.trim() ||
        "No specific areas for improvement identified.";
      feedback =
        `**Strengths:**\n${strengths}\n\n**Areas for Improvement:**\n${improvements}`.trim();
    }

    // Apply the quick fix (||) here as well
    const modelAnswer =
      modelAnswerMatch?.[1]?.trim() || "No model answer provided";

    // Extract scores from ratings section
    const confidenceMatch = ratingsMatch?.[1]?.match(/Confidence:\s*(\d+)/);
    const clarityMatch = ratingsMatch?.[1]?.match(/Clarity:\s*(\d+)/);
    const relevanceMatch = ratingsMatch?.[1]?.match(/Relevance:\s*(\d+)/);

    const confidenceScore = confidenceMatch?.[1]
      ? parseInt(confidenceMatch[1], 10)
      : 5;
    const clarityScore = clarityMatch?.[1] ? parseInt(clarityMatch[1], 10) : 5;
    const relevanceScore = relevanceMatch?.[1]
      ? parseInt(relevanceMatch[1], 10)
      : 5;

    console.log("Parsed feedback:", {
      feedback,
      modelAnswer,
      confidenceScore,
      clarityScore,
      relevanceScore,
    });

    return {
      feedback,
      modelAnswer,
      confidenceScore,
      clarityScore,
      relevanceScore,
    };
  } catch (error: any) {
    console.error("Error analyzing answer:", error);
    throw new Error("Failed to analyze answer");
  }
};

module.exports = {
  generateInterviewQuestions,
  analyzeAnswer,
};
