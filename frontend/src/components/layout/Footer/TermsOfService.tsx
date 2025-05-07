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

export function TermsOfService() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-xs text-muted-foreground hover:text-primary">
            Terms of Service
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription>
              Last updated: May 7, 2025
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <h3 className="font-medium text-base">1. Introduction</h3>
            <p>
              These Terms of Service ("Terms") govern your access to and use of our website and services. By accessing or using our services, you agree to be bound by these Terms.
            </p>
            
            <h3 className="font-medium text-base">2. Eligibility</h3>
            <p>
              You must be at least 18 years of age to use our services. By using our services, you represent and warrant that you meet all eligibility requirements.
            </p>
            
            <h3 className="font-medium text-base">3. Your Account</h3>
            <p>
              To access certain features of our services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            
            <h3 className="font-medium text-base">4. Prohibited Conduct</h3>
            <p>
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Violating any applicable laws or regulations</li>
              <li>Infringing on the intellectual property rights of others</li>
              <li>Attempting to gain unauthorized access to our systems or user accounts</li>
              <li>Using our services to distribute malware or other harmful code</li>
              <li>Engaging in any activity that interferes with or disrupts our services</li>
            </ul>
            
            <h3 className="font-medium text-base">5. Intellectual Property</h3>
            <p>
              All content, features, and functionality of our services, including but not limited to text, graphics, logos, and software, are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            
            <h3 className="font-medium text-base">6. Termination</h3>
            <p>
              We reserve the right to suspend or terminate your access to our services at any time for any reason, including but not limited to a violation of these Terms.
            </p>
            
            <h3 className="font-medium text-base">7. Disclaimer of Warranties</h3>
            <p>
              Our services are provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            
            <h3 className="font-medium text-base">8. Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or in connection with your use of our services.
            </p>
            
            <h3 className="font-medium text-base">9. Changes to Terms</h3>
            <p>
              We may revise these Terms from time to time. The most current version will always be posted on our website. By continuing to use our services after any changes, you accept and agree to the revised Terms.
            </p>
            
            <h3 className="font-medium text-base">10. Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is registered, without regard to its conflict of law provisions.
            </p>
            
            <h3 className="font-medium text-base">11. Contact Us</h3>
            <p>
              If you have any questions about these Terms, please contact us at legal@petconnect.example.com.
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