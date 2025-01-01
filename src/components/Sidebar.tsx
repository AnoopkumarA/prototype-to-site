import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SidebarProps {
  onSignOut: () => Promise<void>;
}

export const Sidebar = ({ onSignOut }: SidebarProps) => {
  const [user, setUser] = useState<User | null>(null);
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
      className="fixed top-0 left-0 h-full z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
              <div className="space-y-4  relative top-[31rem] ">
                <div className="space-y-2 relative left-3 ">
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
