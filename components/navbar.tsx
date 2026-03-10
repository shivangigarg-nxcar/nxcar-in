"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@components/ui/dialog";
import { Menu, X, Phone, User, UserCog, ChevronRight, ChevronDown, Heart, LogOut } from "lucide-react";
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
  const { user, isLoading, isAuthenticated, logout: logoutFn } = useAuth();

  useEffect(() => { setMounted(true); }, []);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const handleLogout = useCallback(() => { setProfileOpen(false); setShowLogoutDialog(true); }, []);
  const handleMobileLogout = useCallback(() => { setIsOpen(false); setShowLogoutDialog(true); }, []);
  const confirmLogout = useCallback(() => { setShowLogoutDialog(false); logoutFn(); }, [logoutFn]);
  const openLoginModal = useCallback(() => setShowLoginModal(true), []);

  return (
    <nav aria-label="Main navigation" className="fixed top-0 z-50 w-full border-b border-slate-200/50 dark:border-white/5 bg-white/90 dark:bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-20 max-w-screen-xl mx-auto items-center justify-between px-6 lg:px-8">
        <Link href="/" className="mr-8 flex items-center" data-testid="link-logo">
          <Image src="/images/nxcar-logo-light.png" alt="Nxcar" width={160} height={56} sizes="(max-width: 640px) 120px, 160px" className="w-[120px] sm:w-[160px] h-auto object-contain drop-shadow-[0_0_12px_rgba(14,169,178,0.6)]" priority />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:space-x-1">
          <Link href="/sell-used-car" className="group relative px-4 py-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors hover:text-primary dark:hover:text-white" data-testid="link-nav-sell-car">
              <span className="relative z-10">Sell Car</span>
              <span className="absolute inset-0 z-0 skew-x-[-20deg] bg-slate-100 dark:bg-white/5 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/used-cars" className="group relative px-4 py-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors hover:text-primary dark:hover:text-white" data-testid="link-nav-buy-car">
              <span className="relative z-10">Buy Car</span>
              <span className="absolute inset-0 z-0 skew-x-[-20deg] bg-slate-100 dark:bg-white/5 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
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
              <Link href="/insurance-check" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors" data-testid="link-dropdown-insurance-check">Insurance Check</Link>
              <Link href="/challan-check" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors" data-testid="link-dropdown-challan-check">Challan Check</Link>
              <Link href="/rc-check" className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors" data-testid="link-dropdown-rc-check">RC Check</Link>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <a href="tel:+919355924132">
            <Button variant="ghost" size="sm" className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 uppercase tracking-wide font-bold" data-testid="button-contact">
              <Phone className="mr-2 h-4 w-4" />
              Contact
            </Button>
          </a>
          {!mounted || isLoading ? (
            <div className="h-8 w-20 bg-white/10 animate-pulse rounded"></div>
          ) : isAuthenticated && user ? (
            <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5" data-testid="button-profile">
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
              className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider skew-x-[-10deg] px-6 border-0 shadow-[0_0_15px_rgba(14,169,178,0.4)] transition-all hover:shadow-[0_0_25px_rgba(14,169,178,0.6)]"
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
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-background/95 backdrop-blur-xl p-4 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="flex flex-col space-y-1">
            <Link href="/sell-used-car" className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-primary py-2" data-testid="link-mobile-sell" onClick={() => setIsOpen(false)}>Sell Car</Link>
            <Link href="/used-cars" className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-primary py-2" data-testid="link-mobile-buy" onClick={() => setIsOpen(false)}>Buy Car</Link>
            <Link href="/used-car-loan" className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-primary py-2" data-testid="link-mobile-loans" onClick={() => setIsOpen(false)}>Used Car Loans</Link>
            <Link href="/dealers" className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-primary py-2" data-testid="link-mobile-dealers" onClick={() => setIsOpen(false)}>Dealers</Link>
            <a href="https://www.nxcar.in/blog" target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-primary py-2" data-testid="link-mobile-blogs">
              Blogs
            </a>
            <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Services</span>
              <Link href="/car-services" className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-primary pl-3 py-2" data-testid="link-mobile-car-services" onClick={() => setIsOpen(false)}>Car Services</Link>
              <Link href="/insurance-check" className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-primary pl-3 py-2" data-testid="link-mobile-insurance-check" onClick={() => setIsOpen(false)}>Insurance Check</Link>
              <Link href="/challan-check" className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-primary pl-3 py-2" data-testid="link-mobile-challan-check" onClick={() => setIsOpen(false)}>Challan Check</Link>
              <Link href="/rc-check" className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-primary pl-3 py-2" data-testid="link-mobile-rc-check" onClick={() => setIsOpen(false)}>RC Check</Link>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200 dark:border-white/10">
            {mounted && isAuthenticated && user ? (
              <div className="space-y-3">
                <Link href="/my-cars" className="flex items-center text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary" onClick={() => setIsOpen(false)} data-testid="link-mobile-my-cars">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  My Cars
                </Link>
                <Link href="/profile-edit" className="flex items-center text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary" onClick={() => setIsOpen(false)} data-testid="link-mobile-edit-profile">
                  <UserCog className="h-4 w-4 mr-2 text-primary" />
                  Edit Profile
                </Link>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-foreground font-medium" data-testid="text-mobile-user-name">{user.firstName || user.phone || 'User'}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-destructive"
                    onClick={handleMobileLogout}
                    data-testid="button-mobile-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="w-full bg-primary font-bold uppercase tracking-wider"
                onClick={() => { setIsOpen(false); openLoginModal(); }}
                data-testid="button-mobile-login"
              >
                Login / Register
              </Button>
            )}
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
    </nav>
  );
}
