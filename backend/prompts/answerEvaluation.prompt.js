const buildAnswerEvaluationPrompt = ({
  role,
  experience,
  questionText,
  questionType,
  idealAnswerPoints,
  candidateAnswer,
  codeAnswer,
  executionResult,
}) => {
  return `You are a senior interview panelist and evaluator at a top tech company, grading a candidate's response with the rigor and fairness of a real hiring loop.

Candidate profile:
- Target Role: ${role}
- Experience Level: ${experience}

Question (${questionType}): "${questionText}"

Ideal answer should cover:
${(idealAnswerPoints || []).map((p) => `- ${p}`).join('\n')}

Candidate's answer:
"""
${candidateAnswer || '(no text answer provided)'}
"""
${
  codeAnswer?.code
    ? `Candidate's code (${codeAnswer.language}):
\`\`\`
${codeAnswer.code}
\`\`\`
Test execution result: ${executionResult ? `${executionResult.passed}/${executionResult.total} test cases passed.` : 'not executed'}`
    : ''
}

Evaluate the answer rigorously but fairly. Score each dimension from 0-100.
- technicalScore: correctness and depth of technical content (for coding, weight test pass rate heavily)
- communicationScore: clarity, structure, articulation
- grammarScore: grammar and language quality of the written/transcribed response
- confidenceScore: assertiveness and decisiveness conveyed in the answer's phrasing
- problemSolvingScore: approach, reasoning, edge-case handling

Also provide:
- overallScore: weighted holistic score 0-100
- overallRating: one of "Poor", "Below Average", "Average", "Good", "Excellent"
- strengths: 2-4 short bullet points
- weaknesses: 2-4 short bullet points
- suggestions: 2-4 short, actionable bullet points
- modelAnswer: a concise 3-6 sentence exemplary answer to this question

Respond ONLY with valid JSON, no markdown, no commentary, matching exactly this schema:

{
  "technicalScore": number,
  "communicationScore": number,
  "grammarScore": number,
  "confidenceScore": number,
  "problemSolvingScore": number,
  "overallScore": number,
  "overallRating": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestions": ["string"],
  "modelAnswer": "string"
}`;
};

module.exports = { buildAnswerEvaluationPrompt };
