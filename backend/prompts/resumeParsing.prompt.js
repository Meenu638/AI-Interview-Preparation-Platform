const buildResumeParsingPrompt = (resumeText) => {
  return `Extract structured data from the following resume text. Be precise and only extract what is explicitly present.

Resume text:
"""
${resumeText.slice(0, 8000)}
"""

Respond ONLY with valid JSON matching exactly this schema:

{
  "skills": ["string"],
  "experienceYears": number,
  "projects": ["string (short project titles/descriptions)"],
  "education": ["string"]
}`;
};

module.exports = { buildResumeParsingPrompt };
