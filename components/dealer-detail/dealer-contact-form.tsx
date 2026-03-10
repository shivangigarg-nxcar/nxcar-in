'use client';

import { useState } from "react";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { useToast } from "@hooks/use-toast";

interface DealerContactFormProps {
  dealerInfoId: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  youtubeLink?: string;
  mapQuery: string;
  onWhatsApp: () => void;
}

export function DealerContactForm({
  dealerInfoId, facebookLink, instagramLink, linkedinLink,
  youtubeLink, mapQuery, onWhatsApp,
}: DealerContactFormProps) {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: "", mobile: "", subject: "", message: "", dealer_info_id: dealerInfoId,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.mobile.trim() || !contactForm.subject.trim() || !contactForm.message.trim()) {
      toast({ title: "Error", description: "Please fill all required fields." });
      return;
    }
    if (contactForm.mobile.length < 10) {
      toast({ title: "Error", description: "Please enter a valid mobile number." });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/nxcar/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (response.ok) {
        toast({ title: "Submitted!", description: "Our team will contact you shortly." });
        setContactForm(prev => ({ ...prev, name: "", mobile: "", subject: "", message: "" }));
      } else {
        toast({ title: "Error", description: "Form not submitted. Please try again." });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-8 border-t border-border">
      <h2 className="text-xl font-bold text-foreground mb-4">Contact Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {facebookLink && (
              <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-facebook">
                <span className="text-xs font-bold">FB</span>
              </a>
            )}
            {instagramLink && (
              <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-instagram">
                <span className="text-xs font-bold">IG</span>
              </a>
            )}
            {linkedinLink && (
              <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-linkedin">
                <span className="text-xs font-bold">IN</span>
              </a>
            )}
            <button onClick={onWhatsApp} className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-whatsapp-social">
              <MessageSquare className="h-5 w-5" />
            </button>
            {youtubeLink && (
              <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-youtube">
                <span className="text-xs font-bold">YT</span>
              </a>
            )}
          </div>

          {youtubeLink && (
            <div className="aspect-video rounded-xl overflow-hidden border border-border">
              <iframe
                src={youtubeLink}
                title="YouTube video player"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="iframe-youtube"
              />
            </div>
          )}

          <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(mapQuery)}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dealer Location"
              data-testid="iframe-map"
            />
          </div>
        </div>

        <Card className="border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Send an Inquiry</h3>
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <Input
                placeholder="Your Name *"
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                data-testid="input-contact-name"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
                <Input
                  className="pl-10"
                  placeholder="Mobile Number *"
                  type="tel"
                  maxLength={10}
                  value={contactForm.mobile}
                  onChange={(e) => setContactForm(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, "") }))}
                  data-testid="input-contact-mobile"
                />
              </div>
              <Input
                placeholder="Subject *"
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                data-testid="input-contact-subject"
              />
              <Textarea
                placeholder="Your Inquiry *"
                rows={3}
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                data-testid="input-contact-message"
              />
              <Button type="submit" className="w-full" disabled={submitting} data-testid="button-submit-contact">
                {submitting ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
