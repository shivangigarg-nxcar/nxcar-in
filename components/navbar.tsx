"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@components/ui/dialog";
import { Menu, X, Phone, User, UserCog, ChevronRight, ChevronDown, Heart, LogOut, Car, ShoppingCart, Banknote, Wrench, Store, Info, HelpCircle, Shield, FileText } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@hooks/use-auth";
import { ThemeToggle } from "./theme-toggle";

import LoginModal from "@components/login-modal";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileSellOpen, setMobileSellOpen] = useState(false);
  const [mobileBuyOpen, setMobileBuyOpen] = useState(false);
  const { user, isLoading, isAuthenticated, logout: logoutFn } = useAuth();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const handleLogout = useCallback(() => { setProfileOpen(false); setShowLogoutDialog(true); }, []);
  const handleMobileLogout = useCallback(() => { setIsOpen(false); setShowLogoutDialog(true); }, []);
  const confirmLogout = useCallback(() => { setShowLogoutDialog(false); logoutFn(); }, [logoutFn]);
  const openLoginModal = useCallback(() => setShowLoginModal(true), []);

  return (
    <>
    <nav aria-label="Main navigation" className="fixed top-0 z-50 w-full border-b border-slate-200/50 dark:border-white/5 bg-white/90 dark:bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-screen-xl mx-auto items-center justify-between px-6 lg:px-8">
        <Link href="/" className="mr-8 flex items-center" data-testid="link-logo">
          <Image src="/images/nxcar-logo-light.png" alt="Nxcar" width={140} height={48} sizes="(max-width: 640px) 100px, 140px" className="w-[100px] sm:w-[140px] h-auto object-contain drop-shadow-[0_0_12px_rgba(14,169,178,0.6)]" priority />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:space-x-1">
          <div className="relative group" data-testid="nav-sell-dropdown">
            <button className="group relative px-4 py-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors hover:text-primary dark:hover:text-white flex items-center gap-1">
              <span className="relative z-10">Sell Car</span>
              <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              <span className="absolute inset-0 z-0 skew-x-[-20deg] bg-slate-100 dark:bg-white/5 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <Link href="/sell-used-car" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors" data-testid="link-dropdown-sell-online">Sell Car Online</Link>
              <Link href="/sell-used-car/delhi" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors" data-testid="link-dropdown-sell-delhi">Sell Car in Delhi</Link>
              <Link href="/sell-used-car/gurgaon" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors" data-testid="link-dropdown-sell-gurgaon">Sell Car in Gurgaon</Link>
            </div>
          </div>
          <div className="relative group" data-testid="nav-buy-dropdown">
            <button className="group relative px-4 py-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors hover:text-primary dark:hover:text-white flex items-center gap-1">
              <span className="relative z-10">Buy Car</span>
              <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              <span className="absolute inset-0 z-0 skew-x-[-20deg] bg-slate-100 dark:bg-white/5 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <div className="absolute top-full left-0 mt-1 w-[340px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden p-2">
              <Link href="/used-cars" className="block px-3 py-2.5 text-sm font-semibold text-primary hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors mb-1 border-b border-slate-100 dark:border-white/5" data-testid="link-dropdown-buy-online">Buy Car Online</Link>
              <div className="flex gap-1">
                <div className="flex-1">
                  <Link href="/used-cars/delhi" className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors rounded-lg" data-testid="link-dropdown-buy-delhi">Delhi</Link>
                  <Link href="/used-cars/mumbai" className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors rounded-lg" data-testid="link-dropdown-buy-mumbai">Mumbai</Link>
                  <Link href="/used-cars/bangalore" className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors rounded-lg" data-testid="link-dropdown-buy-bangalore">Bangalore</Link>
                  <Link href="/used-cars/hyderabad" className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors rounded-lg" data-testid="link-dropdown-buy-hyderabad">Hyderabad</Link>
                  <Link href="/used-cars/gurgaon" className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors rounded-lg" data-testid="link-dropdown-buy-gurgaon">Gurgaon</Link>
                  <Link href="/used-cars/pune" className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors rounded-lg" data-testid="link-dropdown-buy-pune">Pune</Link>
                </div>
                <div className="flex-1">
                  <Link href="/used-cars/kolkata" className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors rounded-lg" data-testid="link-dropdown-buy-kolkata">Kolkata</Link>
                  <Link href="/used-cars/chennai" className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors rounded-lg" data-testid="link-dropdown-buy-chennai">Chennai</Link>
                  <Link href="/used-cars/jaipur" className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors rounded-lg" data-testid="link-dropdown-buy-jaipur">Jaipur</Link>
                  <Link href="/used-cars/lucknow" className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors rounded-lg" data-testid="link-dropdown-buy-lucknow">Lucknow</Link>
                  <Link href="/used-cars/noida" className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors rounded-lg" data-testid="link-dropdown-buy-noida">Noida</Link>
                  <Link href="/used-cars/faridabad" className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors rounded-lg" data-testid="link-dropdown-buy-faridabad">Faridabad</Link>
                </div>
              </div>
            </div>
          </div>
            <Link href="/used-car-loan" className="group relative px-4 py-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors hover:text-primary dark:hover:text-white" data-testid="link-nav-used-car-loans">
              <span className="relative z-10">Used Car Loans</span>
              <span className="absolute inset-0 z-0 skew-x-[-20deg] bg-slate-100 dark:bg-white/5 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/dealers" className="group relative px-4 py-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors hover:text-primary dark:hover:text-white" data-testid="link-nav-dealers">
              <span className="relative z-10">Dealers</span>
              <span className="absolute inset-0 z-0 skew-x-[-20deg] bg-slate-100 dark:bg-white/5 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          <a 
            href="https://www.nxcar.in/blog" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative px-4 py-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors hover:text-primary dark:hover:text-white"
          >
            <span className="relative z-10">Blogs</span>
            <span className="absolute inset-0 z-0 skew-x-[-20deg] bg-slate-100 dark:bg-white/5 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <div className="relative group" data-testid="nav-services-dropdown">
            <button className="group relative px-4 py-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors hover:text-primary dark:hover:text-white flex items-center gap-1">
              <span className="relative z-10">Services</span>
              <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              <span className="absolute inset-0 z-0 skew-x-[-20deg] bg-slate-100 dark:bg-white/5 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <Link href="/car-services" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors" data-testid="link-dropdown-car-services">Car Services</Link>
              <Link href="/pdi-services" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors" data-testid="link-dropdown-pdi-services">PDI Services</Link>
              <Link href="/insurance-check" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors" data-testid="link-dropdown-insurance-check">Insurance Check</Link>
              <Link href="/challan-check" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors" data-testid="link-dropdown-challan-check">Challan Check</Link>
              <Link href="/rc-check" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors" data-testid="link-dropdown-rc-check">RC Check</Link>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <ThemeToggle />
          <a href="tel:+919355924132" className="hidden md:inline-flex">
            <Button variant="ghost" size="sm" className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 uppercase tracking-wide font-bold" data-testid="button-contact">
              <Phone className="mr-2 h-4 w-4" />
              Contact
            </Button>
          </a>
          {!mounted || isLoading ? (
            <div className="hidden md:block h-8 w-20 bg-white/10 animate-pulse rounded"></div>
          ) : isAuthenticated && user ? (
            <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:inline-flex text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5" data-testid="button-profile">
                  <User className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[380px] bg-background border-l border-border">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground">
                          {user.firstName || user.phone || 'User'}
                        </p>
                        {user.phone && <p className="text-xs text-muted-foreground">+91 {user.phone}</p>}
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-4">
                  <Link href="/profile-edit" onClick={() => setProfileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full text-xs gap-2 text-foreground border-border" data-testid="button-edit-profile">
                      <UserCog className="h-3.5 w-3.5" /> Edit Profile
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 space-y-4">
                  <Link href="/my-cars" onClick={() => setProfileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full text-xs gap-2 text-foreground border-border" data-testid="link-my-cars">
                      <Heart className="h-3.5 w-3.5 text-red-500" /> My Cars
                    </Button>
                  </Link>

                  <div className="pt-4 border-t border-border">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-muted-foreground hover:text-destructive"
                      onClick={handleLogout}
                      data-testid="button-drawer-logout"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              size="sm"
              className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider skew-x-[-10deg] px-6 border-0 shadow-[0_0_15px_rgba(14,169,178,0.4)] transition-all hover:shadow-[0_0_25px_rgba(14,169,178,0.6)]"
              onClick={openLoginModal}
              data-testid="button-login-nav"
            >
              <span className="skew-x-[10deg] flex items-center">
                Login <ChevronRight className="ml-1 h-3 w-3" />
              </span>
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-700 dark:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </nav>

    {/* Mobile Full-Page Drawer — outside nav to avoid backdrop-filter containment */}
      {isOpen && (
        <div className="md:hidden fixed left-0 right-0 top-14 bottom-0 z-50 bg-white dark:bg-background overflow-y-auto" data-testid="mobile-drawer">
          {/* Profile Section */}
          <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-white/10">
            {mounted && isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground" data-testid="text-mobile-user-name">
                      {user.firstName || user.phone || "User"}
                    </p>
                    {user.phone && (
                      <p className="text-xs text-muted-foreground">+91 {user.phone}</p>
                    )}
                  </div>
                </div>
                <Link
                  href="/profile-edit"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-primary flex items-center gap-1"
                  data-testid="link-mobile-edit-profile"
                >
                  <UserCog className="h-3.5 w-3.5" /> Edit Details
                </Link>
              </div>
            ) : (
              <Button
                className="w-full bg-primary font-semibold text-sm"
                onClick={() => { setIsOpen(false); openLoginModal(); }}
                data-testid="button-mobile-login"
              >
                Login / Register
              </Button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="px-2 py-2">
            <button
              onClick={() => setMobileBuyOpen(prev => !prev)}
              className="flex items-center gap-4 px-3 py-3.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors w-full text-left"
              data-testid="button-mobile-buy-toggle"
            >
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Buy Car</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground ml-auto transition-transform ${mobileBuyOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileBuyOpen && (
              <div className="ml-12 border-l-2 border-primary/20 pl-3 mb-1">
                <Link href="/used-cars" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-online" className="block text-sm text-muted-foreground hover:text-primary py-2.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors font-medium">
                  Buy Car Online
                </Link>
                <div className="grid grid-cols-2 gap-x-1">
                  <Link href="/used-cars/delhi" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-delhi" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Delhi</Link>
                  <Link href="/used-cars/mumbai" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-mumbai" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Mumbai</Link>
                  <Link href="/used-cars/bangalore" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-bangalore" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Bangalore</Link>
                  <Link href="/used-cars/hyderabad" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-hyderabad" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Hyderabad</Link>
                  <Link href="/used-cars/gurgaon" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-gurgaon" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Gurgaon</Link>
                  <Link href="/used-cars/pune" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-pune" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Pune</Link>
                  <Link href="/used-cars/kolkata" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-kolkata" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Kolkata</Link>
                  <Link href="/used-cars/chennai" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-chennai" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Chennai</Link>
                  <Link href="/used-cars/jaipur" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-jaipur" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Jaipur</Link>
                  <Link href="/used-cars/lucknow" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-lucknow" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Lucknow</Link>
                  <Link href="/used-cars/ahmedabad" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-ahmedabad" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Ahmedabad</Link>
                  <Link href="/used-cars/chandigarh" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-chandigarh" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Chandigarh</Link>
                  <Link href="/used-cars/noida" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-noida" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Noida</Link>
                  <Link href="/used-cars/faridabad" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-faridabad" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Faridabad</Link>
                  <Link href="/used-cars/ghaziabad" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-ghaziabad" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Ghaziabad</Link>
                  <Link href="/used-cars/amritsar" onClick={() => setIsOpen(false)} data-testid="link-mobile-buy-amritsar" className="block text-sm text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Amritsar</Link>
                </div>
              </div>
            )}

            <button
              onClick={() => setMobileSellOpen(prev => !prev)}
              className="flex items-center gap-4 px-3 py-3.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors w-full text-left"
              data-testid="button-mobile-sell-toggle"
            >
              <Car className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Sell Car</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground ml-auto transition-transform ${mobileSellOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileSellOpen && (
              <div className="ml-12 border-l-2 border-primary/20 pl-3 space-y-0.5 mb-1">
                <Link href="/sell-used-car" onClick={() => setIsOpen(false)} data-testid="link-mobile-sell-online" className="block text-sm text-muted-foreground hover:text-primary py-2.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Sell Car Online
                </Link>
                <Link href="/sell-used-car/delhi" onClick={() => setIsOpen(false)} data-testid="link-mobile-sell-delhi" className="block text-sm text-muted-foreground hover:text-primary py-2.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Sell Car in Delhi
                </Link>
                <Link href="/sell-used-car/gurgaon" onClick={() => setIsOpen(false)} data-testid="link-mobile-sell-gurgaon" className="block text-sm text-muted-foreground hover:text-primary py-2.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Sell Car in Gurgaon
                </Link>
              </div>
            )}

            <Link href="/used-car-loan" onClick={() => setIsOpen(false)} data-testid="link-mobile-loans" className="flex items-center gap-4 px-3 py-3.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <Banknote className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Used Car Loan</span>
            </Link>

            {/* Car Services Dropdown */}
            <button
              onClick={() => setMobileServicesOpen(prev => !prev)}
              className="flex items-center gap-4 px-3 py-3.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors w-full text-left"
              data-testid="button-mobile-services-toggle"
            >
              <Wrench className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Car Services</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground ml-auto transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileServicesOpen && (
              <div className="ml-12 border-l-2 border-primary/20 pl-3 space-y-0.5 mb-1">
                <Link href="/car-services" onClick={() => setIsOpen(false)} data-testid="link-mobile-car-services" className="block text-sm text-muted-foreground hover:text-primary py-2.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  All Services
                </Link>
                <Link href="/pdi-services" onClick={() => setIsOpen(false)} data-testid="link-mobile-pdi-services" className="block text-sm text-muted-foreground hover:text-primary py-2.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  PDI Services
                </Link>
                <Link href="/insurance-check" onClick={() => setIsOpen(false)} data-testid="link-mobile-insurance-check" className="block text-sm text-muted-foreground hover:text-primary py-2.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Insurance Check
                </Link>
                <Link href="/challan-check" onClick={() => setIsOpen(false)} data-testid="link-mobile-challan-check" className="block text-sm text-muted-foreground hover:text-primary py-2.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Challan Check
                </Link>
                <Link href="/rc-check" onClick={() => setIsOpen(false)} data-testid="link-mobile-rc-check" className="block text-sm text-muted-foreground hover:text-primary py-2.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  RC Check
                </Link>
              </div>
            )}

            <Link href="/dealers" onClick={() => setIsOpen(false)} data-testid="link-mobile-dealers" className="flex items-center gap-4 px-3 py-3.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <Store className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Used Car Dealers</span>
            </Link>

            <Link href="/about" onClick={() => setIsOpen(false)} data-testid="link-mobile-about" className="flex items-center gap-4 px-3 py-3.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <Info className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">About Us</span>
            </Link>

            <a href="tel:+919355924132" data-testid="link-mobile-help" className="flex items-center gap-4 px-3 py-3.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Help & Support</span>
            </a>
          </div>

          {/* Logout for authenticated users */}
          {mounted && isAuthenticated && user && (
            <div className="px-5 py-3 border-t border-slate-100 dark:border-white/10">
              <button
                onClick={handleMobileLogout}
                className="flex items-center gap-3 text-sm font-medium text-red-500 hover:text-red-600 py-1"
                data-testid="button-mobile-logout"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}

          {/* Footer - Privacy, Terms, Grievance, Service Partners */}
          <div className="border-t border-slate-100 dark:border-white/10 px-5 py-4 mt-auto space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Link href="/privacy-policy" onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground hover:text-primary transition-colors" data-testid="link-mobile-privacy">
                Privacy Policy
              </Link>
              <Link href="/terms-of-use" onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground hover:text-primary transition-colors" data-testid="link-mobile-terms">
                Terms of Use
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/grievance-policy" onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground hover:text-primary transition-colors" data-testid="link-mobile-grievance">
                Grievance Policy
              </Link>
              <Link href="/service-partner" onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground hover:text-primary transition-colors" data-testid="link-mobile-service-partners">
                Service Partners
              </Link>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
          <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      )}

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent data-testid="dialog-logout-confirm" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
            <DialogDescription>
              Do you really want to logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)} data-testid="button-logout-no">No</Button>
            <Button onClick={confirmLogout} data-testid="button-logout-yes">Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
