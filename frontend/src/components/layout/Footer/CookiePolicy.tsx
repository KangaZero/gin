"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCookiePreferences, setCookiePreferences } from '@/lib/cookieService';
import { Checkbox } from "@/components/ui/checkbox";

export function CookiePolicy() {
  const [openPreferences, setOpenPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    functionality: false,
    targeting: false
  });

  const handleManagePreferences = async () => {
    try {
      const currentPreferences = await getCookiePreferences();
      setPreferences(currentPreferences);
      setOpenPreferences(true);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSavePreferences = async () => {
    try {
      await setCookiePreferences(preferences);
      setOpenPreferences(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-xs text-muted-foreground hover:text-primary">
            Cookie Policy
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cookie Policy</DialogTitle>
            <DialogDescription>
              Last updated: May 7, 2025
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <h3 className="font-medium text-base">1. Introduction</h3>
            <p>
              This Cookie Policy explains how our website uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
            
            <h3 className="font-medium text-base">2. What are cookies?</h3>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>
            
            <h3 className="font-medium text-base">3. How we use cookies</h3>
            <p>
              We use cookies for several reasons. Some cookies are required for technical reasons for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our Website. Third parties serve cookies through our Website for advertising, analytics and other purposes.
            </p>
            
            <h3 className="font-medium text-base">4. Types of cookies we use</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Essential cookies:</strong> These are cookies that are required for the operation of our website.</li>
              <li><strong>Analytical/performance cookies:</strong> They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it.</li>
              <li><strong>Functionality cookies:</strong> These are used to recognize you when you return to our website.</li>
              <li><strong>Targeting cookies:</strong> These cookies record your visit to our website, the pages you have visited and the links you have followed.</li>
            </ul>
            
            <h3 className="font-medium text-base">5. How to control cookies</h3>
            <p>
              You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
            </p>
            <div className="my-4">
              <Button 
                variant="outline" 
                onClick={handleManagePreferences}
                className="w-full"
              >
                Manage Cookie Preferences
              </Button>
            </div>
            
            <h3 className="font-medium text-base">6. Contact us</h3>
            <p>
              If you have any questions about our use of cookies or other technologies, please email us at privacy@petconnect.example.com.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cookie Preferences Dialog */}
      <Dialog open={openPreferences} onOpenChange={setOpenPreferences}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Customize which cookies you want to allow. You can change these settings at any time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="policy-essential" 
                checked={preferences.essential} 
                disabled={true} // Essential cookies can't be disabled
              />
              <label htmlFor="policy-essential" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Essential Cookies <span className="text-xs text-muted-foreground">(Required)</span>
              </label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              These cookies are necessary for the website to function and cannot be switched off.
            </p>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="policy-analytics" 
                checked={preferences.analytics}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, analytics: checked === true }))
                }
              />
              <label htmlFor="policy-analytics" className="text-sm font-medium leading-none">
                Analytics Cookies
              </label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Help us analyze how the site is used so we can improve it.
            </p>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="policy-functionality" 
                checked={preferences.functionality}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, functionality: checked === true }))
                }
              />
              <label htmlFor="policy-functionality" className="text-sm font-medium leading-none">
                Functionality Cookies
              </label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Enable enhanced functionality and personalization.
            </p>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="policy-targeting" 
                checked={preferences.targeting}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, targeting: checked === true }))
                }
              />
              <label htmlFor="policy-targeting" className="text-sm font-medium leading-none">
                Targeting Cookies
              </label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Used to deliver advertising content relevant to your interests.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenPreferences(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}