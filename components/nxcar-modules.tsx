"use client";

import { Card } from "@components/ui/card";
import { FileText, Scan, Newspaper, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const modules = [
  {
    id: "docs",
    title: "NxCar Docs",
    subtitle: "Documents & RTO Services",
    description: "Create agreements, transfer RC, and handle all paperwork digitally from anywhere in India.",
    url: "https://docs.nxcar.in",
    icon: FileText,
    gradient: "from-slate-600 to-slate-700",
    iconImage: "/images/icon-3d-documents.png",
    previewImage: "/images/preview-docs.png",
    isNew: false
  },
  {
    id: "pdi",
    title: "NxCar PDI",
    subtitle: "Pre-Delivery Inspection",
    description: "200+ point inspection with X-ray diagnostics. Know exactly what you're buying.",
    url: "https://pdi.nxcar.in",
    icon: Scan,
    gradient: "from-slate-600 to-slate-700",
    iconImage: "/images/icon-3d-inspection.png",
    previewImage: "/images/preview-pdi.png",
    isNew: true
  },
  {
    id: "blogs",
    title: "NxCar Insights",
    subtitle: "News, Blogs & Regulations",
    description: "Stay updated with industry news, expert insights, and latest automotive regulations.",
    url: "https://www.nxcar.in/blog",
    icon: Newspaper,
    gradient: "from-slate-600 to-slate-700",
    iconImage: "/images/icon-3d-community.png",
    previewImage: "/images/preview-blogs.png",
    isNew: false
  }
];

export function NxcarModules() {
  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#0c1518] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/40 via-white to-gray-100/30 dark:from-teal-950/40 dark:via-transparent dark:to-slate-950/30"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400/40 to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 dark:bg-teal-500/15 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-3 sm:mb-4">
            The <span className="text-primary">NxCar</span> Ecosystem
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need for a seamless used car experience — from inspection to documentation to insights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {modules.map((module, index) => (
            <motion.a
              key={module.id}
              href={module.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              data-testid={`link-module-${module.id}`}
            >
              <Card className="group bg-white dark:bg-card border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all duration-300 overflow-hidden h-full relative">
                {module.isNew && (
                  <div className="absolute top-2 right-2 z-10 bg-primary text-white text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
                    New
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 sm:p-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    <img
                      src={module.iconImage}
                      alt={module.title}
                      width={36}
                      height={36}
                      loading="lazy"
                      className="h-7 w-7 sm:h-8 sm:w-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-heading font-black text-slate-900 dark:text-white uppercase italic tracking-tight group-hover:text-primary transition-colors truncate">
                        {module.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors shrink-0 ml-2" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider mt-0.5">
                      {module.subtitle}
                    </p>
                  </div>
                </div>
                <div className="px-3 pb-3 sm:px-4 sm:pb-4 -mt-1">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm line-clamp-2">
                    {module.description}
                  </p>
                </div>
              </Card>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
