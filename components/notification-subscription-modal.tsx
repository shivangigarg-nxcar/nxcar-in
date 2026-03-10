"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Checkbox } from "@components/ui/checkbox";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Bell, Mail, Phone, Car, MapPin, DollarSign } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createSubscription, type SubscriptionData } from "@lib/api";
import { useToast } from "@hooks/use-toast";

interface NotificationSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const POPULAR_BRANDS = ["Maruti", "Hyundai", "Tata", "Honda", "Toyota", "Mahindra", "Kia", "BMW", "Mercedes", "Audi"];
const POPULAR_LOCATIONS = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"];

export function NotificationSubscriptionModal({ open, onOpenChange }: NotificationSubscriptionModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notifyPriceDrops, setNotifyPriceDrops] = useState(true);
  const [notifyNewListings, setNotifyNewListings] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  const mutation = useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      toast({
        title: "Subscribed!",
        description: "You'll be notified about price drops and new listings.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email && !phone) {
      toast({
        title: "Contact Required",
        description: "Please enter your email or phone number.",
        variant: "destructive",
      });
      return;
    }

    const data: SubscriptionData = {
      email: email || undefined,
      phone: phone || undefined,
      notifyPriceDrops,
      notifyNewListings,
      preferredBrands: selectedBrands.length > 0 ? selectedBrands : undefined,
      budgetMin: budgetMin ? parseInt(budgetMin) * 100000 : undefined,
      budgetMax: budgetMax ? parseInt(budgetMax) * 100000 : undefined,
      preferredLocations: selectedLocations.length > 0 ? selectedLocations : undefined,
    };

    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-md bg-background border-border overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground text-xl">
              <Bell className="h-5 w-5 text-primary" />
              Get Notified
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Never miss a great deal. We'll notify you about price drops and new listings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                  data-testid="input-subscription-email"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Phone Number (optional)
                </Label>
                <Input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                  data-testid="input-subscription-phone"
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <Label className="text-muted-foreground text-sm font-medium">Notification Preferences</Label>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 border border-border">
                <Checkbox
                  id="priceDrops"
                  checked={notifyPriceDrops}
                  onCheckedChange={(checked) => setNotifyPriceDrops(checked as boolean)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  data-testid="checkbox-price-drops"
                />
                <Label htmlFor="priceDrops" className="text-foreground cursor-pointer flex-1">
                  Price drops on favorites
                  <span className="block text-xs text-muted-foreground mt-0.5">Get notified when cars in your favorites list drop in price</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 border border-border">
                <Checkbox
                  id="newListings"
                  checked={notifyNewListings}
                  onCheckedChange={(checked) => setNotifyNewListings(checked as boolean)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  data-testid="checkbox-new-listings"
                />
                <Label htmlFor="newListings" className="text-foreground cursor-pointer flex-1">
                  New listings matching my criteria
                  <span className="block text-xs text-muted-foreground mt-0.5">Get notified when new cars match your preferences</span>
                </Label>
              </div>
            </motion.div>

            <AnimatePresence>
              {notifyNewListings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Car className="h-4 w-4 text-primary" />
                      Preferred Brands
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_BRANDS.map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => toggleBrand(brand)}
                          data-testid={`button-brand-${brand.toLowerCase()}`}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                            selectedBrands.includes(brand)
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-muted/50 border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Budget Range (in Lakhs)
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value)}
                        className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        data-testid="input-budget-min"
                      />
                      <span className="text-muted-foreground self-center">to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value)}
                        className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        data-testid="input-budget-max"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Preferred Locations
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_LOCATIONS.map((location) => (
                        <button
                          key={location}
                          type="button"
                          onClick={() => toggleLocation(location)}
                          data-testid={`button-location-${location.toLowerCase()}`}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                            selectedLocations.includes(location)
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-muted/50 border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full h-11 font-bold uppercase tracking-wider transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid="button-subscribe"
              >
                {mutation.isPending ? "Subscribing..." : "Subscribe to Notifications"}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                You can unsubscribe at any time. We respect your privacy.
              </p>
            </motion.div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
