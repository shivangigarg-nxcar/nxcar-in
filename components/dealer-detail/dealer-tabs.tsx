'use client';

const stickyTabs = [
  { name: "Listing", link: "#listing" },
  { name: "Services", link: "#services" },
  { name: "Photos", link: "#photos" },
  { name: "Contact", link: "#contact" },
  { name: "Reviews", link: "#reviews" },
];

interface DealerTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showReviews?: boolean;
}

export function DealerTabs({ activeTab, onTabChange, showReviews = true }: DealerTabsProps) {
  const visibleTabs = showReviews ? stickyTabs : stickyTabs.filter(t => t.name !== "Reviews");
  return (
    <div className="sticky top-16 z-30 bg-background border-b border-border shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
        {visibleTabs.map(tab => (
          <a
            key={tab.name}
            href={tab.link}
            onClick={() => onTabChange(tab.link)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.link
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`tab-${tab.name.toLowerCase()}`}
          >
            {tab.name}
          </a>
        ))}
      </div>
    </div>
  );
}
