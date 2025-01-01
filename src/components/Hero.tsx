import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Github, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './ui/use-toast';

export const Hero = () => {
  const [inputValue, setInputValue] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);

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

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 hero-gradient">
      <div className="absolute top-6 right-6 z-10">
        <div className="relative group">
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
        <p className="text-lg md:text-xl text-muted-foreground">
          Let the world's best open source model create a react app for you.
        </p>
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <span>Responses are saved in the open dataset</span>
          <a href="#" className="text-primary hover:underline ml-2">react-code-instructions</a>
          <span className="ml-2">· Help us add to it!</span>
        </div>
        <div className="relative max-w-2xl mx-auto w-full">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your dream react app..."
            className="w-full px-4 py-3 bg-secondary rounded-lg border border-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
          />
          <div className="absolute inset-0 -z-10 blur-xl bg-primary/20 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};