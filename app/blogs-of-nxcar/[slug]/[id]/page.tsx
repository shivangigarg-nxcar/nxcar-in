'use client';

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { BlogArticle } from "@shared/schema";

async function fetchBlogArticles(): Promise<BlogArticle[]> {
  const response = await fetch("/api/blog-articles");
  if (!response.ok) throw new Error("Failed to fetch blog articles");
  return response.json();
}

export default function BlogDetail() {
  const params = useParams();
  const articleId = params?.id ? parseInt(params.id as string, 10) : null;

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["blog-articles"],
    queryFn: fetchBlogArticles,
  });

  const article = articleId ? articles.find((a) => a.id === articleId) : null;

  useEffect(() => {
    if (article?.externalUrl) {
      window.location.href = article.externalUrl;
    }
  }, [article]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E14] flex items-center justify-center" data-testid="blog-detail-page">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (article?.externalUrl) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E14] flex items-center justify-center" data-testid="blog-detail-page">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Redirecting to article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14]" data-testid="blog-detail-page">
      <Navbar />
      <div className="max-w-screen-md mx-auto px-6 py-32 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4" data-testid="blog-not-found-heading">Blog post not found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8" data-testid="blog-not-found-message">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/blogs-of-nxcar" className="inline-flex items-center gap-2 text-primary hover:underline font-medium" data-testid="link-back-to-blogs">
          <ArrowLeft className="h-4 w-4" />
          Back to all articles
        </Link>
      </div>
      <Footer />
    </div>
  );
}
