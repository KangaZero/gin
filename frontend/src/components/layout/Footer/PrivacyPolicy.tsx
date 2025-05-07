"use client";

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

export function PrivacyPolicy() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-xs text-muted-foreground hover:text-primary">
            Privacy Policy
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>
              Last updated: May 7, 2025
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <h3 className="font-medium text-base">1. Introduction</h3>
            <p>
              Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            
            <h3 className="font-medium text-base">2. Information We Collect</h3>
            <p>
              We collect information that you provide directly to us, information we collect automatically when you use our services, and information from third-party sources.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, phone number, and other contact information you provide.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website and services.</li>
              <li><strong>Device Data:</strong> Information about your device, including IP address, browser type, and operating system.</li>
            </ul>
            
            <h3 className="font-medium text-base">3. How We Use Your Information</h3>
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To notify you about changes to our services</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our services</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
            
            <h3 className="font-medium text-base">4. Disclosure of Your Information</h3>
            <p>
              We may disclose your information to third parties in certain circumstances, such as:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and the rights of others</li>
              <li>In connection with a business transaction, such as a merger or acquisition</li>
            </ul>
            
            <h3 className="font-medium text-base">5. Data Security</h3>
            <p>
              We have implemented appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
            
            <h3 className="font-medium text-base">6. Your Data Protection Rights</h3>
            <p>
              Depending on your location, you may have certain rights regarding your personal data, such as the right to access, correct, or delete your personal data.
            </p>
            
            <h3 className="font-medium text-base">7. Changes to This Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            
            <h3 className="font-medium text-base">8. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@petconnect.example.com.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}