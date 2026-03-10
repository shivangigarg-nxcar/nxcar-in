import type { Testimonial, BlogArticle } from "@shared/schema";

const API_BASE = "/api";

export async function getTestimonials(limit: number = 15): Promise<Testimonial[]> {
  const response = await fetch(`${API_BASE}/testimonials?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch testimonials");
  return response.json();
}

export async function getBlogArticlesByStrip(stripPosition: number): Promise<BlogArticle[]> {
  const response = await fetch(`${API_BASE}/blog-articles/strip/${stripPosition}`);
  if (!response.ok) throw new Error("Failed to fetch blog articles");
  return response.json();
}
