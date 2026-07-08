import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCheck,
  FiMic,
  FiCode,
  FiTrendingUp,
  FiFileText,
  FiAward,
} from 'react-icons/fi';

const features = [
  { icon: FiMic, title: 'Voice & Video Interviews', desc: 'Practice with webcam and real-time speech-to-text just like a real interview.' },
  { icon: FiCode, title: 'Live Coding Rounds', desc: 'Solve DSA problems in a full Monaco code editor with multi-language support.' },
  { icon: FiTrendingUp, title: 'AI-Powered Feedback', desc: 'Get scored on technical depth, communication, grammar, and confidence — instantly.' },
  { icon: FiFileText, title: 'Resume-Based Questions', desc: 'Upload your resume and get questions tailored to your real experience.' },
  { icon: FiAward, title: 'Achievements & Streaks', desc: 'Stay motivated with daily streaks, badges, and a global leaderboard.' },
];

const steps = [
  { step: '01', title: 'Set up your interview', desc: 'Choose a role, company, skills, and difficulty.' },
  { step: '02', title: 'Answer AI-generated questions', desc: 'Speak, type, or code your answers in a realistic environment.' },
  { step: '03', title: 'Get instant AI feedback', desc: 'Receive a detailed scorecard with strengths and suggestions.' },
];

const testimonials = [
  { name: 'Aditi R.', role: 'SDE-2 @ Fintech Startup', quote: 'The mock coding rounds felt closer to my real onsite than any course I paid for.' },
  { name: 'Marcus L.', role: 'New Grad', quote: 'The feedback on my communication score alone completely changed how I answer behavioral questions.' },
  { name: 'Priya K.', role: 'Product Manager', quote: 'Resume-based questions caught gaps in my own story I hadn\'t noticed.' },
];

const faqs = [
  { q: 'Is it really free?', a: 'Yes — the Free plan gives you unlimited practice with core AI feedback, no credit card required.' },
  { q: 'What interview types are supported?', a: 'Technical, HR, Behavioral, Coding, and Mixed interviews across any role or company.' },
  { q: 'Does it work for non-technical roles?', a: 'Yes, question generation adapts to any target role, not just engineering.' },
];

const LandingPage = () => {
  return (
    <div className="bg-surface text-white overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-surface/70 border-b border-surface-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center font-display font-bold">AI</div>
            <span className="font-display font-bold text-lg">InterviewPrep</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white">Log In</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started Free</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto text-center px-6 pt-24 pb-20">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-600/20 rounded-full blur-3xl -z-10" />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-display font-extrabold leading-tight"
        >
          Master your next interview <br /> with an AI that actually grades you
        </motion.h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
          Practice technical, HR, behavioral, and coding interviews with AI-generated questions tailored to your role — and get real, detailed feedback after every answer.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/register" className="btn-primary">Start Practicing Free</Link>
          <a href="#how-it-works" className="btn-secondary">See How It Works</a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-display font-bold text-center mb-12">Everything you need to walk in confident</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card hover:border-primary-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center text-primary-400 text-xl mb-4">
                <Icon />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-display font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="text-5xl font-display font-extrabold text-primary-600/40 mb-3">{step}</div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-display font-bold text-center mb-12">Loved by candidates everywhere</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card">
              <p className="text-gray-300 italic mb-4">"{t.quote}"</p>
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Simple, honest pricing</h2>
        <p className="text-gray-400 mb-10">Start free. No credit card required.</p>
        <div className="glass-card max-w-sm mx-auto text-left">
          <p className="text-sm text-primary-400 font-semibold mb-1">FREE PLAN</p>
          <p className="text-4xl font-display font-bold mb-4">$0<span className="text-base text-gray-400">/forever</span></p>
          <ul className="space-y-2 mb-6">
            {['Unlimited mock interviews', 'AI feedback on every answer', 'Resume-based questions', 'Progress analytics', 'Achievements & streaks'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                <FiCheck className="text-emerald-400" /> {f}
              </li>
            ))}
          </ul>
          <Link to="/register" className="btn-primary w-full text-center block">Get Started Free</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-display font-bold text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="glass-card">
              <p className="font-semibold mb-1">{f.q}</p>
              <p className="text-sm text-gray-400">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AI InterviewPrep. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
