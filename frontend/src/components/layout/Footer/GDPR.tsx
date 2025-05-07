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

export function GDPR() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-xs text-muted-foreground hover:text-primary">
            GDPR
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>GDPR Compliance Statement</DialogTitle>
            <DialogDescription>
              Last updated: May 7, 2025
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <h3 className="font-medium text-base">1. Introduction</h3>
            <p>
              We are committed to processing personal data in accordance with the European Union's General Data Protection Regulation (GDPR). This statement outlines how we comply with GDPR principles when processing personal data.
            </p>
            
            <h3 className="font-medium text-base">2. Data Controller</h3>
            <p>
              For the purposes of the GDPR, we are the data controller for personal data processed through our website. If you have any questions about this GDPR compliance statement or our data practices, please contact our Data Protection Officer at dpo@petconnect.example.com.
            </p>
            
            <h3 className="font-medium text-base">3. Your Rights Under GDPR</h3>
            <p>
              Under the GDPR, you have several rights regarding your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Right to access:</strong> You have the right to request a copy of your personal data.</li>
              <li><strong>Right to rectification:</strong> You have the right to request that we correct inaccurate or incomplete personal data.</li>
              <li><strong>Right to erasure:</strong> You have the right to request that we erase your personal data in certain circumstances.</li>
              <li><strong>Right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data in certain circumstances.</li>
              <li><strong>Right to data portability:</strong> You have the right to request that we transfer your personal data to another controller.</li>
              <li><strong>Right to object:</strong> You have the right to object to the processing of your personal data in certain circumstances.</li>
            </ul>
            
            <h3 className="font-medium text-base">4. Data Processing Principles</h3>
            <p>
              We process personal data in accordance with the following GDPR principles:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Lawfulness, fairness, and transparency</li>
              <li>Purpose limitation</li>
              <li>Data minimization</li>
              <li>Accuracy</li>
              <li>Storage limitation</li>
              <li>Integrity and confidentiality (security)</li>
              <li>Accountability</li>
            </ul>
            
            <h3 className="font-medium text-base">5. Data Breach Notification</h3>
            <p>
              In the event of a data breach that is likely to result in a risk to your rights and freedoms, we will notify the relevant supervisory authority within 72 hours and, if required, notify the affected individuals without undue delay.
            </p>
            
            <h3 className="font-medium text-base">6. International Transfers</h3>
            <p>
              When we transfer personal data outside the European Economic Area (EEA), we ensure appropriate safeguards are in place to protect your personal data.
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