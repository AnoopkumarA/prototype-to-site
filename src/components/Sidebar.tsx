import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { LogOut, Bookmark, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface SidebarProps {
  onSignOut: () => Promise<void>;
}

export const Sidebar = ({ onSignOut }: SidebarProps) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <div
      className="fixed h-full z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Collapsed sidebar content - only visible when not hovered */}
      <div
        className={`absolute top-0 left-0 w-12 h-full flex flex-col items-center py-6 transition-opacity duration-200 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-6 ">
          <User className="w-5 h-5 text-primary" />
        </div>
        <Bookmark className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
      </div>

      {/* Expandable sidebar */}
      <div
        className={`h-full bg-background/95 backdrop-blur-sm border-r border-primary/20 overflow-hidden transition-all duration-300 ease-out ${
          isHovered ? 'w-72' : 'w-0'
        }`}
      >
        <div className="h-full flex flex-col min-w-[256px]">
          <div className="p-6 border-b border-primary/20">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-primary">Kline</span> Coder AI
            </h2>
          </div>
          
          <div className="flex-1 p-6">
            {user && (
              <div className="space-y-4 relative top-[31rem]">
                <div className="space-y-2 relative left-3">
                  <p className="text-sm text-muted-foreground px-14">Signed in as:</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                
                <div className="pt-4 p-12">
                  <Button
                    onClick={onSignOut}
                    variant="outline"
                    className="px-10 flex items-center gap-2 border-primary/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
