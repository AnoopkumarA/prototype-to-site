import React from 'react';

const faqs = [
  {
    question: "What services does your Kline AI coding platform provide?",
    answer: "Our platform offers AI-powered coding tools that assist developers in writing cleaner, more efficient code. We provide AI-driven code generation, real-time debugging, and intelligent code suggestions to enhance productivity. "
  },
  {
    question: "How does the Kline AI code generator work?",
    answer: "Our AI code generator uses advanced machine learning models to understand your project requirements and generate relevant code snippets based on your input. Simply describe your coding task, and our AI will suggest or generate code that you can integrate directly into your project. "
  },
  {
    question: "When will Kline Coder Ai be released?",
    answer: "Kline Coder Ai is currently in development and will be released to the public in the next few months. Stay tuned for updates and announcements on our website and social media channels."
  }
];

export const FAQ = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 hero-gradient">
      <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-200"
          >
            <h3 className="text-xl font-semibold mb-4 text-white">
              {faq.question}
            </h3>
            <p className="font-mono text-sm text-white/70 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};