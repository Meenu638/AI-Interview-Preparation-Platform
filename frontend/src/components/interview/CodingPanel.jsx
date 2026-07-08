import { useState } from 'react';
import Editor from '@monaco-editor/react';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

const CodingPanel = ({ starterCode = '', onChange }) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(starterCode);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    onChange?.({ language: e.target.value, code });
  };

  const handleCodeChange = (value) => {
    setCode(value || '');
    onChange?.({ language, code: value || '' });
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-surface-border">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-light">
        <span className="text-sm text-gray-400">Code Editor</span>
        <select value={language} onChange={handleLanguageChange} className="bg-surface-border text-sm rounded-lg px-2 py-1 border-none focus:outline-none">
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>
      <Editor
        height="400px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleCodeChange}
        options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false }}
      />
    </div>
  );
};

export default CodingPanel;
