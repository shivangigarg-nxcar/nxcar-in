"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useState } from "react";
import { MessageSquarePlus, Facebook, Instagram, Linkedin, MessageCircle, Youtube } from "lucide-react";
import PlatformFeedbackModal from "./platform-feedback-modal";
import { useAuth } from "@hooks/use-auth";

export const Footer = memo(function Footer() {
  const [showFeedback, setShowFeedback] = useState(false);
  const { isDealer } = useAuth();
  
  return (
    <footer className="bg-slate-100 dark:bg-[#0D1117] text-slate-600 dark:text-slate-300 pt-10 sm:pt-16 pb-6 sm:pb-8 border-t border-slate-200 dark:border-white/5">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-8 sm:mb-12">
          <div className="lg:max-w-xs text-center sm:text-left">
            <Image src="/images/nxcar-logo-light.png" alt="Nxcar" width={130} height={46} sizes="130px" loading="lazy" className="mb-4 w-[130px] h-auto object-contain drop-shadow-[0_0_8px_rgba(14,169,178,0.5)] mx-auto sm:mx-0" />
            <p className="text-slate-500 dark:text-slate-400 mb-4 text-xs sm:text-sm leading-relaxed">
              India's most trusted platform for buying and selling used cars. 
              Transparency, trust, and technology.
            </p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
              <a 
                href="https://apps.apple.com/us/app/nxcar/id6739413869" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Download Nxcar on App Store"
                data-testid="link-download-ios"
                className="flex items-center gap-2 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-white/5"
              >
                <Image src="/images/icon-3d-appstore.png" alt="App Store" width={20} height={20} sizes="20px" loading="lazy" className="object-contain" />
                <div className="text-left">
                  <span className="text-[9px] text-slate-500 block leading-tight">Download on</span>
                  <span className="text-[11px] font-medium text-slate-900 dark:text-white">App Store</span>
                </div>
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=com.listing.nxcar" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Download Nxcar on Google Play"
                data-testid="link-download-android"
                className="flex items-center gap-2 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-white/5"
              >
                <Image src="/images/icon-3d-playstore.png" alt="Play Store" width={20} height={20} sizes="20px" loading="lazy" className="object-contain" />
                <div className="text-left">
                  <span className="text-[9px] text-slate-500 block leading-tight">Get it on</span>
                  <span className="text-[11px] font-medium text-slate-900 dark:text-white">Google Play</span>
                </div>
              </a>
            </div>
            
            <div className="flex justify-center sm:justify-start gap-2">
              <a href="https://www.facebook.com/nxfin" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" data-testid="link-social-facebook" className="h-9 w-9 rounded-lg bg-white dark:bg-slate-800/60 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all border border-slate-200 dark:border-white/5">
                <Facebook className="h-5 w-5 text-[#1877F2] dark:text-[#4DA3FF]" />
              </a>
              <a href="https://www.instagram.com/nxcarindia/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" data-testid="link-social-instagram" className="h-9 w-9 rounded-lg bg-white dark:bg-slate-800/60 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all border border-slate-200 dark:border-white/5">
                <Instagram className="h-5 w-5 text-[#E4405F] dark:text-[#F06292]" />
              </a>
              <a href="https://www.linkedin.com/company/nxfin/mycompany/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="Follow us on LinkedIn" data-testid="link-social-linkedin" className="h-9 w-9 rounded-lg bg-white dark:bg-slate-800/60 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all border border-slate-200 dark:border-white/5">
                <Linkedin className="h-5 w-5 text-[#0A66C2] dark:text-[#5EA6E8]" />
              </a>
              <a href="https://api.whatsapp.com/send/?phone=%2B919355924132&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp" data-testid="link-social-whatsapp" className="h-9 w-9 rounded-lg bg-white dark:bg-slate-800/60 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all border border-slate-200 dark:border-white/5">
                <MessageCircle className="h-5 w-5 text-[#25D366] dark:text-[#5EE89A]" />
              </a>
              <a href="https://www.youtube.com/@Nxcar-sr3ce" target="_blank" rel="noopener noreferrer" aria-label="Subscribe on YouTube" data-testid="link-social-youtube" className="h-9 w-9 rounded-lg bg-white dark:bg-slate-800/60 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all border border-slate-200 dark:border-white/5">
                <Youtube className="h-5 w-5 text-[#FF0000] dark:text-[#FF6666]" />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-5 sm:gap-8 flex-1">
            <div role="navigation" aria-label="Footer navigation">
              <h3 className="text-slate-900 dark:text-white font-bold mb-2 sm:mb-4 text-sm">Services</h3>
              <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-sm">
                <li><a href="/sell-used-car" data-testid="link-service-sell" className="hover:text-[#0EA9B2] transition-colors">Sell Your Car</a></li>
                <li><a href="/used-cars" data-testid="link-service-buy" className="hover:text-[#0EA9B2] transition-colors">Buy Used Car</a></li>
                <li><a href="/used-car-loan" data-testid="link-service-loans" className="hover:text-[#0EA9B2] transition-colors">Car Loans</a></li>
                <li><a href="/calculator" data-testid="link-service-calculator" className="hover:text-[#0EA9B2] transition-colors">EMI Calculator</a></li>
                <li><a href="/insurance-check" data-testid="link-service-insurance" className="hover:text-[#0EA9B2] transition-colors">Car Insurance</a></li>
                <li><a href="/car-services" data-testid="link-service-car-services" className="hover:text-[#0EA9B2] transition-colors">Car Services</a></li>
                <li><a href="/rc-check" data-testid="link-service-rc-check" className="hover:text-[#0EA9B2] transition-colors">RC Check</a></li>
                <li><a href="/challan-check" data-testid="link-service-challan-check" className="hover:text-[#0EA9B2] transition-colors">Challan Check</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold mb-2 sm:mb-4 text-sm">Buy Used Cars</h3>
              <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-sm">
                <li><a href="/used-cars/delhi" data-testid="link-buy-city-delhi" className="hover:text-[#0EA9B2] transition-colors">Buy Car in Delhi</a></li>
                <li><a href="/used-cars/mumbai" data-testid="link-buy-city-mumbai" className="hover:text-[#0EA9B2] transition-colors">Buy Car in Mumbai</a></li>
                <li><a href="/used-cars/bangalore" data-testid="link-buy-city-bangalore" className="hover:text-[#0EA9B2] transition-colors">Buy Car in Bangalore</a></li>
                <li><a href="/used-cars/hyderabad" data-testid="link-buy-city-hyderabad" className="hover:text-[#0EA9B2] transition-colors">Buy Car in Hyderabad</a></li>
                <li><a href="/used-cars/gurgaon" data-testid="link-buy-city-gurgaon" className="hover:text-[#0EA9B2] transition-colors">Buy Car in Gurgaon</a></li>
                <li><a href="/used-cars/pune" data-testid="link-buy-city-pune" className="hover:text-[#0EA9B2] transition-colors">Buy Car in Pune</a></li>
                <li><a href="/used-cars/kolkata" data-testid="link-buy-city-kolkata" className="hover:text-[#0EA9B2] transition-colors">Buy Car in Kolkata</a></li>
                <li><a href="/used-cars/jaipur" data-testid="link-buy-city-jaipur" className="hover:text-[#0EA9B2] transition-colors">Buy Car in Jaipur</a></li>
                <li><a href="/used-cars/chennai" data-testid="link-buy-city-chennai" className="hover:text-[#0EA9B2] transition-colors">Buy Car in Chennai</a></li>
                <li><a href="/used-cars/chandigarh" data-testid="link-buy-city-chandigarh" className="hover:text-[#0EA9B2] transition-colors">Buy Car in Chandigarh</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold mb-2 sm:mb-4 text-sm">Sell Used Cars</h3>
              <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-sm">
                <li><a href="/sell-used-car/delhi" data-testid="link-sell-city-delhi" className="hover:text-[#0EA9B2] transition-colors">Sell Car in Delhi</a></li>
                <li><a href="/sell-used-car/gurgaon" data-testid="link-sell-city-gurgaon" className="hover:text-[#0EA9B2] transition-colors">Sell Car in Gurgaon</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold mb-2 sm:mb-4 text-sm">Company</h3>
              <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-sm">
                <li><a href="/about" data-testid="link-company-about" className="hover:text-[#0EA9B2] transition-colors">About Us</a></li>
                <li><a href="https://www.nxcar.in/blog" data-testid="link-company-blog" className="hover:text-[#0EA9B2] transition-colors">Blog</a></li>
                <li><a href="/contact-us" data-testid="link-company-contact" className="hover:text-[#0EA9B2] transition-colors">Contact Us</a></li>
                <li><a href="/faq" data-testid="link-company-faq" className="hover:text-[#0EA9B2] transition-colors">FAQ</a></li>
                <li><Link href="/privacy-policy" data-testid="link-company-privacy" className="hover:text-[#0EA9B2] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" data-testid="link-company-terms" className="hover:text-[#0EA9B2] transition-colors">Terms</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold mb-2 sm:mb-4 text-sm">Partners</h3>
              <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-sm">
                {isDealer && (
                  <li><a href="/list-car" data-testid="link-partner-list-car" className="hover:text-[#0EA9B2] transition-colors font-medium text-[#0EA9B2]">List Your Car</a></li>
                )}
                <li><a href="/partner" data-testid="link-partner-dealer-login" className="hover:text-[#0EA9B2] transition-colors">Dealer Registration</a></li>
                <li><a href="/service-partner" data-testid="link-partner-become" className="hover:text-[#0EA9B2] transition-colors">Become a Partner</a></li>
                <li><a href="/dealers" data-testid="link-partner-network" className="hover:text-[#0EA9B2] transition-colors">Dealer Network</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold mb-2 sm:mb-4 text-sm">Contact</h3>
              <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-sm">
                <li className="text-slate-500 dark:text-slate-400">
                  <span className="block text-slate-900 dark:text-white font-medium">Email</span>
                  <a href="mailto:contact@nxcar.in" data-testid="link-contact-email" className="hover:text-[#0EA9B2] transition-colors">contact@nxcar.in</a>
                </li>
                <li className="text-slate-500 dark:text-slate-400">
                  <span className="block text-slate-900 dark:text-white font-medium">Phone</span>
                  <a href="tel:+919355924132" data-testid="link-contact-phone" className="hover:text-[#0EA9B2] transition-colors">+91 93559 24132</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mb-4">
          <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed text-center max-w-4xl mx-auto">
            Nxcar is India's leading platform for <strong className="text-slate-700 dark:text-slate-400">selling used cars</strong>, <strong className="text-slate-700 dark:text-slate-400">buying verified second-hand cars</strong>, and connecting with trusted dealers across Delhi NCR, Mumbai, Bangalore, Hyderabad, Chennai, Pune, and 50+ cities. 
            Get instant car valuation, doorstep inspection, same-day payment, RC transfer assistance, and used car loans from 25+ banking partners. 
            Whether you want to <strong className="text-slate-700 dark:text-slate-400">sell your old car</strong>, <strong className="text-slate-700 dark:text-slate-400">buy a certified pre-owned vehicle</strong>, or become a dealer partner, Nxcar makes it simple, transparent, and hassle-free.
          </p>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-slate-500 gap-3">
          <p data-testid="text-copyright">&copy; 2026 Nxcar Services Pvt Ltd.</p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <button 
              onClick={() => setShowFeedback(true)}
              data-testid="button-open-feedback"
              className="flex items-center gap-1.5 hover:text-[#0EA9B2] transition-colors"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              Feedback
            </button>
            <Link href="/privacy-policy" data-testid="link-footer-privacy" className="hover:text-[#0EA9B2] transition-colors">Privacy</Link>
            <Link href="/terms" data-testid="link-footer-terms" className="hover:text-[#0EA9B2] transition-colors">Terms</Link>
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </div>
      
      {showFeedback && (
        <PlatformFeedbackModal 
          open={showFeedback} 
          onOpenChange={setShowFeedback} 
        />
      )}
    </footer>
  );
});
