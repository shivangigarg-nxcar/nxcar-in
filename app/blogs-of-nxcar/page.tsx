'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { BookOpen, Clock, Newspaper, Lightbulb, Film, Search, FlaskConical } from "lucide-react";
import type { BlogArticle } from "@shared/schema";

const CATEGORIES = [
  { key: "all", label: "All", icon: BookOpen },
  { key: "news", label: "News", icon: Newspaper },
  { key: "blog", label: "Blog", icon: BookOpen },
  { key: "insights", label: "Insights", icon: Lightbulb },
  { key: "culture", label: "Culture", icon: Film },
  { key: "research", label: "Research", icon: FlaskConical },
];

const CATEGORY_COLORS: Record<string, string> = {
  news: "bg-blue-500",
  blog: "bg-teal-500",
  insights: "bg-amber-500",
  culture: "bg-purple-500",
  research: "bg-emerald-500",
};

async function fetchBlogArticles(): Promise<BlogArticle[]> {
  const response = await fetch("/api/blog-articles");
  if (!response.ok) throw new Error("Failed to fetch blog articles");
  return response.json();
}

function ArticleCard({ article }: { article: BlogArticle }) {
  const badgeColor = CATEGORY_COLORS[article.category] || "bg-slate-500";

  return (
    <motion.a
      href={article.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="block group"
      data-testid={`article-card-${article.id}`}
    >
      <Card className="overflow-hidden h-full bg-white dark:bg-[#161B22] border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className="aspect-video w-full overflow-hidden relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            data-testid={`article-image-${article.id}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <Badge className={`absolute top-3 left-3 ${badgeColor} text-slate-900 dark:text-white text-[10px] font-semibold px-2.5 py-0.5 uppercase tracking-wider`} data-testid={`article-category-${article.id}`}>
            {article.category}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-2 group-hover:text-primary transition-colors mb-2" data-testid={`article-title-${article.id}`}>
            {article.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3" data-testid={`article-excerpt-${article.id}`}>
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium capitalize" data-testid={`article-category-label-${article.id}`}>{article.category}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span data-testid={`article-date-${article.id}`}>{new Date(article.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.a>
  );
}

export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["blog-articles"],
    queryFn: fetchBlogArticles,
  });

  const filteredArticles = activeCategory === "all"
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14]" data-testid="blogs-page">
      <Navbar />

      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E14] via-[#0f1923] to-[#0A0E14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60" />
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="p-2.5 bg-primary/20 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-white" data-testid="blogs-heading">
              Nxcar Loves Cars
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto"
            data-testid="blogs-subtitle"
          >
            Automotive news, expert insights, and unfiltered opinions
          </motion.p>
        </div>
      </section>

      <section className="max-w-screen-xl mx-auto px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-10 -mx-6 px-6 lg:mx-0 lg:px-0"
          data-testid="category-tabs"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                }`}
                data-testid={`category-tab-${cat.key}`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-100 dark:bg-[#161B22] rounded-xl animate-pulse">
                <div className="aspect-video bg-slate-200 dark:bg-slate-700/50 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 text-lg" data-testid="no-articles-message">No articles found in this category.</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="articles-grid">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
