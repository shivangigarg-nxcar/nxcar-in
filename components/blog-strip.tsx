"use client";

import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { ArrowRight, Newspaper, TrendingUp, Lightbulb, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getBlogArticlesByStrip } from "@lib/api";

interface BlogStripProps {
  stripPosition: 1 | 2 | 3 | 4;
}

const stripConfigs = {
  1: {
    title: "Buyer's Insights",
    subtitle: "Expert tips for smart car buying decisions",
    icon: Lightbulb,
    gradient: "from-slate-200/50 to-gray-100/30",
    accentColor: "slate",
    bgClass: "bg-white dark:bg-[#0f1419]",
  },
  2: {
    title: "News & Updates",
    subtitle: "Latest from the automotive industry",
    icon: Newspaper,
    gradient: "from-blue-500/10 to-slate-200/30",
    accentColor: "blue",
    bgClass: "bg-slate-50 dark:bg-[#111a22]",
  },
  3: {
    title: "Top Picks & Trends",
    subtitle: "Best cars and market trends",
    icon: TrendingUp,
    gradient: "from-teal-500/10 to-slate-100/40",
    accentColor: "teal",
    bgClass: "bg-white dark:bg-[#0f1419]",
  },
  4: {
    title: "What's New at Nxcar",
    subtitle: "Latest updates and announcements",
    icon: Newspaper,
    gradient: "from-primary/15 to-slate-200/30",
    accentColor: "teal",
    bgClass: "bg-slate-50 dark:bg-[#111a22]",
  },
};

export function BlogStrip({ stripPosition }: BlogStripProps) {
  const config = stripConfigs[stripPosition];
  const Icon = config.icon;

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["blog-articles", stripPosition],
    queryFn: () => getBlogArticlesByStrip(stripPosition),
  });

  if (isLoading) {
    return (
      <section className={`py-12 sm:py-16 ${config.bgClass} relative overflow-hidden`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-800 dark:text-white">{config.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{config.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:hidden gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="hidden sm:flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-72 h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  const mobileArticles = articles.slice(0, 4);

  return (
    <section className={`py-12 sm:py-16 ${config.bgClass} relative overflow-hidden`} data-testid={`blog-strip-${stripPosition}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-50 dark:opacity-30`}></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-heading font-bold text-slate-800 dark:text-white">{config.title}</h2>
              <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-400">{config.subtitle}</p>
            </div>
          </div>
          <a 
            href="https://www.nxcar.in/blog" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline font-medium"
            data-testid="blog-view-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {mobileArticles.map((article, index) => (
            <motion.a
              key={article.id}
              href={article.externalUrl || "https://www.nxcar.in/blog"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
              data-testid={`blog-article-${article.id}`}
            >
              <Card className="overflow-hidden border-slate-200 dark:border-white/5 rounded-xl hover:border-primary/50 transition-all duration-300 bg-white dark:bg-[#161B22] h-full">
                <div className="aspect-[16/10] w-full overflow-hidden relative">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    loading="lazy"
                    sizes="(max-width: 640px) 45vw, 280px"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/blog/new-car-depreciation.jpg"; }}
                  />
                  <Badge className="absolute top-1.5 left-1.5 bg-black/70 text-white backdrop-blur text-[8px] font-semibold px-1.5 py-0.5 uppercase tracking-wider">
                    {article.category}
                  </Badge>
                </div>
                <div className="p-2 sm:p-2.5">
                  <h3 className="font-semibold text-slate-800 dark:text-white text-[11px] sm:text-xs line-clamp-2 group-hover:text-primary transition-colors mb-1 sm:mb-1.5 leading-snug">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-500">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{new Date(article.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                </div>
              </Card>
            </motion.a>
          ))}
        </div>

        <div className="hidden sm:flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
          {articles.map((article, index) => (
            <motion.a
              key={article.id}
              href={article.externalUrl || "https://www.nxcar.in/blog"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-72 group"
              data-testid={`blog-article-${article.id}`}
            >
              <Card className="overflow-hidden border-slate-200 dark:border-white/5 rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-white dark:bg-[#161B22] h-full">
                <div className="aspect-[16/10] w-full overflow-hidden relative">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    loading="lazy"
                    sizes="280px"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/blog/new-car-depreciation.jpg"; }}
                  />
                  <Badge className="absolute top-3 left-3 bg-black/70 text-white backdrop-blur text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
                    {article.category}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-white text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(article.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </Card>
            </motion.a>
          ))}
        </div>

        <a 
          href="https://www.nxcar.in/blog" 
          target="_blank" 
          rel="noopener noreferrer"
          className="sm:hidden flex items-center justify-center gap-1 text-xs text-primary hover:underline font-medium mt-4"
        >
          View All Articles <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
