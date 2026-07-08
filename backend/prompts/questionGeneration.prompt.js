const buildQuestionGenerationPrompt = ({
  role,
  company,
  experience,
  skills,
  difficulty,
  type,
  questionCount,
  resumeContext,
}) => {
  return `You are an expert technical interviewer and hiring panel lead with 15+ years of experience conducting interviews at top tech companies.

Generate exactly ${questionCount} interview questions for the following candidate profile:

- Target Role: ${role}
- Target Company: ${company || 'Not specified (use general industry standards)'}
- Experience Level: ${experience}
- Key Skills: ${skills.join(', ')}
- Difficulty: ${difficulty}
- Interview Type: ${type}
${resumeContext ? `- Resume Context: ${resumeContext.slice(0, 2000)}` : ''}

Rules:
1. Questions must match the interview type "${type}":
   - "technical": deep-dive conceptual + applied questions on the listed skills
   - "hr": culture-fit, motivation, career goals, salary expectations style questions
   - "behavioral": STAR-method situational questions about past experience
   - "coding": DSA / problem-solving questions solvable in a code editor
   - "mixed": a balanced blend of the above categories
2. Difficulty must genuinely reflect "${difficulty}" and the candidate's experience level.
3. If resume context is provided, tailor at least 30% of questions to specific resume details (projects, past roles, technologies mentioned).
4. For "coding" type questions, include starter code skeleton and 2-3 test cases (one hidden).
5. Provide 2-4 concise bullet points per question describing what an ideal answer should cover (idealAnswerPoints) — for internal grading use, never shown to the candidate up front.
6. Order questions from easier/warm-up to more challenging.

Respond ONLY with valid JSON, no markdown, no commentary, matching exactly this schema:

{
  "questions": [
    {
      "order": number,
      "text": "string",
      "type": "technical" | "hr" | "behavioral" | "coding",
      "topic": "string (short topic label, e.g. 'React Hooks', 'System Design', 'Conflict Resolution')",
      "difficulty": "easy" | "medium" | "hard",
      "idealAnswerPoints": ["string", "string"],
      "codingMeta": {
        "language": "string or empty string if not coding",
        "starterCode": "string or empty string if not coding",
        "testCases": [
          { "input": "string", "expectedOutput": "string", "isHidden": boolean }
        ]
      }
    }
  ]
}`;
};

module.exports = { buildQuestionGenerationPrompt };
