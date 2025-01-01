import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="bg-secondary rounded-lg px-6">
            <AccordionTrigger className="text-left hover:text-primary transition-colors">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};