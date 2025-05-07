"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { getCookiePreferences, setCookiePreferences } from '@/lib/cookieService';

export function CookieConsentBanner() {
  const [open, setOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(true); // Default to true to hide banner initially
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    functionality: false,
    targeting: false
  });

  useEffect(() => {
    // Check if user has already consented by fetching preferences
    const checkConsent = async () => {
      try {
        const storedPreferences = await getCookiePreferences();
        setPreferences(storedPreferences);
        
        // If we got valid preferences back, assume user has already made a choice
        setHasConsented(true);
      } catch (error as Error) {
        // If there was an error or no preferences found, show the banner
        setHasConsented(false);
        console.error(error)
      }
    };

    // Only run on client-side
    if (typeof window !== 'undefined') {
      checkConsent();
    }
  }, []);

  const handleAcceptAll = async () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      functionality: true,
      targeting: true
    };
    
    try {
      await setCookiePreferences(allAccepted);
      setPreferences(allAccepted);
      setHasConsented(true);
      setOpen(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const handleSavePreferences = async () => {
    try {
      await setCookiePreferences(preferences);
      setHasConsented(true);
      setOpen(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const handleEssentialOnly = async () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      functionality: false,
      targeting: false
    };
    
    try {
      await setCookiePreferences(essentialOnly);
      setPreferences(essentialOnly);
      setHasConsented(true);
      setOpen(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  if (hasConsented) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-50">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">We use cookies</h3>
            <p className="text-sm text-muted-foreground">
              This website uses cookies to improve your experience, personalize content, and analyze our traffic.
              You can choose your cookie preferences below.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleEssentialOnly}>
              Essential Only
            </Button>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Customize
            </Button>
            <Button onClick={handleAcceptAll}>
              Accept All
            </Button>
          </div>
        </div>
      </div>

      {/* Customize Preferences Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
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
                id="essential" 
                checked={preferences.essential} 
                disabled={true} // Essential cookies can't be disabled
              />
              <label htmlFor="essential" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Essential Cookies <span className="text-xs text-muted-foreground">(Required)</span>
              </label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              These cookies are necessary for the website to function and cannot be switched off.
            </p>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="analytics" 
                checked={preferences.analytics}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, analytics: checked === true }))
                }
              />
              <label htmlFor="analytics" className="text-sm font-medium leading-none">
                Analytics Cookies
              </label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Help us analyze how the site is used so we can improve it.
            </p>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="functionality" 
                checked={preferences.functionality}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, functionality: checked === true }))
                }
              />
              <label htmlFor="functionality" className="text-sm font-medium leading-none">
                Functionality Cookies
              </label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Enable enhanced functionality and personalization.
            </p>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="targeting" 
                checked={preferences.targeting}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, targeting: checked === true }))
                }
              />
              <label htmlFor="targeting" className="text-sm font-medium leading-none">
                Targeting Cookies
              </label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Used to deliver advertising content relevant to your interests.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
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