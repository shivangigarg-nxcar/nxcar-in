"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, ExternalLink, Newspaper, Lightbulb, BookOpen, Film } from "lucide-react";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";

const BLOG_BASE_URL = "https://www.nxcar.in/blog";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: "news" | "blog" | "insights" | "culture";
  tags: string[];
  author: string;
  readTime: string;
  url: string;
}

const FEATURED_ARTICLES: Article[] = [
  {
    id: "renault-ev",
    title: "Renault Announces India-Specific Electric Platform for Sub-Rs 10 Lakh EVs",
    excerpt: "French automaker Renault unveils plans to develop an India-specific EV platform targeting Rs 8 lakh starting price.",
    image: "/images/blog/renault-ev-platform.jpg",
    category: "news",
    tags: ["EV", "Launch"],
    author: "Vikram Singh",
    readTime: "5 min",
    url: `${BLOG_BASE_URL}/category/news/renault-announces-india-specific-electric-platform-for-sub-rs-10-lakh-evs-1768657322325-22`
  },
  {
    id: "autonomous-testing",
    title: "Autonomous Vehicle Testing Gets Green Signal on Delhi-Mumbai Expressway",
    excerpt: "NHAI approves dedicated autonomous vehicle testing zone on the Delhi-Mumbai Expressway, creating India's first highway testing corridor.",
    image: "/images/blog/autonomous-testing.jpg",
    category: "news",
    tags: ["EV", "Policy"],
    author: "Vikram Singh",
    readTime: "9 min",
    url: `${BLOG_BASE_URL}/category/news/autonomous-vehicle-testing-gets-green-signal-on-delhi-mumbai-expressway-1768657322339-26`
  },
  {
    id: "new-car-dumb",
    title: "Why Buying a Brand New Car is the Dumbest Financial Decision",
    excerpt: "The controversial truth about new car depreciation and why used cars make better financial sense for most buyers.",
    image: "/images/blog/new-car-depreciation.jpg",
    category: "blog",
    tags: ["Opinion", "Finance"],
    author: "Sneha Reddy",
    readTime: "4 min",
    url: `${BLOG_BASE_URL}/category/blog/why-buying-a-brand-new-car-is-the-dumbest-financial-decision-youll-ever-make-1768657322354-30`
  },
  {
    id: "top-used-suvs",
    title: "Top Used SUVs Under 5 Lakhs in India for Maximum Value",
    excerpt: "Get the most value for your money with these affordable and reliable used SUVs priced under 5 lakhs.",
    image: "/images/blog/used-suvs-value.jpg",
    category: "blog",
    tags: ["Used SUVs", "Affordable Cars"],
    author: "Priya Patel",
    readTime: "6 min",
    url: `${BLOG_BASE_URL}/category/blog`
  },
  {
    id: "engine-oil",
    title: "Engine Oil Viscosity and Specifications Decoded",
    excerpt: "Understanding oil viscosity and specifications enables informed selection for your vehicle's needs.",
    image: "/images/blog/engine-oil-viscosity.jpg",
    category: "insights",
    tags: ["Technical", "Review"],
    author: "Arjun Mehta",
    readTime: "8 min",
    url: `${BLOG_BASE_URL}/category/insights/engine-oil-viscosity-and-specifications-decoded-1768657322552-89`
  },
  {
    id: "bollywood-cars",
    title: "Bollywood's Love Affair with Imported Cars",
    excerpt: "From Raj Kapoor's Impala to SRK's Bugatti collection - how Hindi cinema uses cars as status symbols.",
    image: "/images/blog/bollywood-cars.jpg",
    category: "culture",
    tags: ["Movies", "History"],
    author: "Vikram Singh",
    readTime: "5 min",
    url: `${BLOG_BASE_URL}/category/culture/bollywoods-love-affair-with-imported-cars-1768657322673-130`
  }
];

const CATEGORY_INFO = {
  news: { icon: Newspaper, label: "News", color: "bg-blue-500" },
  blog: { icon: BookOpen, label: "Blog", color: "bg-teal-500" },
  insights: { icon: Lightbulb, label: "Insights", color: "bg-amber-500" },
  culture: { icon: Film, label: "Culture", color: "bg-purple-500" }
};

function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const categoryInfo = CATEGORY_INFO[article.category];
  const CategoryIcon = categoryInfo.icon;

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={`block group ${featured ? 'col-span-full lg:col-span-2' : ''}`}
      data-testid={`article-card-${article.id}`}
    >
      <Card className="overflow-hidden h-full bg-white dark:bg-card border-slate-200 dark:border-border hover:border-primary/50 transition-all duration-300">
        <div className={`relative ${featured ? 'aspect-[21/9]' : 'aspect-video'}`}>
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full ${categoryInfo.color} text-white text-xs font-bold flex items-center gap-1.5`}>
            <CategoryIcon className="h-3 w-3" />
            {categoryInfo.label}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {article.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className={`font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors ${featured ? 'text-xl' : 'text-base'}`}>
            {article.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">{article.author}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </div>
          </div>
        </div>
      </Card>
    </motion.a>
  );
}

export function BlogSection() {
  const featuredArticle = FEATURED_ARTICLES[0];
  const regularArticles = FEATURED_ARTICLES.slice(1);

  return (
    <section className="py-16 bg-slate-50 dark:bg-muted/20">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
                Nxcar Loves Cars
              </h2>
            </motion.div>
            <p className="text-slate-600 dark:text-slate-400">
              Automotive news, expert insights, and unfiltered opinions
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              variant="outline"
              className="hidden sm:flex items-center gap-2 border-slate-300 dark:border-slate-600 hover:border-primary hover:text-primary"
            >
              <a href={BLOG_BASE_URL} target="_blank" rel="noopener noreferrer">
                View All
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCard article={featuredArticle} featured />
          {regularArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center sm:hidden"
        >
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <a href={BLOG_BASE_URL} target="_blank" rel="noopener noreferrer">
              Explore All Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
