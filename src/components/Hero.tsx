import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Github, LogOut, Paperclip, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './ui/use-toast';
import { Sidebar } from './Sidebar';
import { generateCode } from '@/services/deepseek';

export const Hero = () => {
  const [inputValue, setInputValue] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: session } = await supabase.auth.getSession();
    setIsSignedIn(!!session?.session);
  };

  const handleGithubAuth = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        // If logged in, sign out
        await supabase.auth.signOut();
        setIsSignedIn(false);
        toast({
          title: "Signed out successfully"
        });
      } else {
        // If not logged in, sign in with GitHub
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication error",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCodeGeneration = async () => {
    if (!inputValue.trim()) {
      toast({
        title: "Please enter a description",
        description: "Describe what you want to build and we'll generate the code for you.",
        variant: "destructive"
      });
      return;
    }

    if (!isSignedIn) {
      toast({
        title: "Please sign in",
        description: "You need to sign in with GitHub to generate code.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedCode(null); // Clear previous code
    
    try {
      const result = await generateCode(inputValue);
      if (result.code) {
        setGeneratedCode(result.code);
        toast({
          title: "Code generated successfully!",
          description: "Your code is ready. You can now view and copy it.",
        });
      } else {
        throw new Error('No code was generated');
      }
    } catch (error: any) {
      console.error('Error generating code:', error);
      toast({
        title: "Error generating code",
        description: error.message || "There was an error generating your code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {isSignedIn && (
        <Sidebar onSignOut={handleGithubAuth} />
      )}
      <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 hero-gradient">
        <div className="absolute top-6 right-6 z-10">
          <div className="relative group right-20">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
            <Button 
              onClick={handleGithubAuth} 
              variant="outline"
              className="relative flex items-center gap-2 bg-background/90 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-200 px-4 py-2"
            >
              {isSignedIn ? (
                <>
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                  <LogOut className="w-5 h-5" />
                  <span className="font-mono">Disconnect</span>
                </>
              ) : (
                <>
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <Github className="w-5 h-5" />
                  <span className="font-mono">Initialize Auth</span>
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="animate-fade-up text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Kline <span className="text-primary">Coder Ai</span>
          </h1>
          <p className="text-lg md:text-lg text-muted-foreground">
            Let's build something together with AI powered code generator and real-time debugging tools. 
          </p>
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <span>Responses are saved in the open dataset</span>
            <a href="#" className="text-primary hover:underline ml-2">react-code-instructions</a>
            <span className="ml-2">· Help us add to it!</span>
          </div>
          <div className="relative max-w-2xl mx-auto w-full">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your dream react app..."
                className="w-full px-4 py-3 pr-24 bg-secondary rounded-lg border border-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCodeGeneration();
                  }
                }}
              />
              <div className="absolute right-3 flex items-center gap-2">
                <label htmlFor="file-upload" className="cursor-pointer group">
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <Paperclip className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </label>
                <Button
                  size="sm"
                  onClick={handleCodeGeneration}
                  disabled={isGenerating || !inputValue.trim()}
                  className="ml-2"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>
            </div>
            {selectedFile && (
              <div className="absolute right-0 -bottom-6 text-xs text-muted-foreground">
                File selected: {selectedFile.name}
              </div>
            )}
            <div className="absolute inset-0 -z-10 blur-xl bg-primary/20 rounded-lg"></div>
          </div>

          {/* Generated Code Display */}
          {generatedCode && (
            <div className="mt-8 w-full max-w-4xl mx-auto">
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Generated Code</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(generatedCode)}
                  >
                    Copy Code
                  </Button>
                </div>
                <pre className="overflow-x-auto">
                  <code className="text-sm font-mono text-white/80">
                    {generatedCode}
                  </code>
                </pre>
              </div>
            </div>
          )}
          <div className="mt-6 w-full max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                'Start a blog with Astro',
                'Build a mobile app with NativeScript',
                'Create a docs site with Vitepress',
                'Scaffold UI with shadcn',
                'Draft a presentation with Slidev',
                'Code a video with Remotion'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputValue(suggestion)}
                  className="px-4 py-2 text-sm bg-black/40 backdrop-blur-sm border border-white/10 rounded-full text-white/80 hover:bg-black/60 hover:border-white/20 transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};