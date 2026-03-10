'use client';

import { useState, useEffect } from "react";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Button } from "@components/ui/button";
import { Receipt, ShoppingCart, Car } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@hooks/use-auth";
import LoginModal from "@components/login-modal";

export default function MyTransactions() {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-background" data-testid="my-transactions-page">
      <Navbar />

      <section className="pt-20 pb-3">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground" data-testid="text-page-title">My Transactions</h1>
              <p className="text-xs text-muted-foreground" data-testid="text-page-subtitle">
                Track your buying and selling activity
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-background relative min-h-[400px]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Receipt className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold text-muted-foreground mb-2">Login to see transactions</h2>
              <p className="text-muted-foreground mb-6">Sign in to view your buying and selling activity.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center text-center py-16"
            >
              <div className="p-6 bg-muted/50 rounded-full mb-6 border border-border">
                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3" data-testid="text-no-transactions">
                No transactions yet
              </h2>
              <p className="text-muted-foreground max-w-md mb-8" data-testid="text-transactions-description">
                Your buying and selling transactions will appear here once you complete a deal.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/used-cars">
                  <Button className="bg-primary hover:bg-primary/90 font-bold uppercase px-8" data-testid="button-browse-cars">
                    <Car className="h-4 w-4 mr-2" />
                    Browse Cars
                  </Button>
                </Link>
                <Link href="/sell-used-car">
                  <Button variant="outline" className="font-bold uppercase px-8" data-testid="button-sell-car">
                    Sell Your Car
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  );
}
