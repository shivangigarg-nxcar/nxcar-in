'use client';

import { CollapsibleSection } from "./collapsible-section";
import { Button } from "@components/ui/button";
import { Settings, FileText, X, Plus, Loader2 } from "lucide-react";

function resolveImageUrl(path: string): string {
  if (!path) return "/images/car-sedan.png";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/") || path.startsWith("objects/")) return `/api${path.startsWith('/') ? '' : '/'}${path}`;
  if (path.startsWith("/replit-objstore")) {
    const match = path.match(/\/replit-objstore[^/]*\/\.private\/(.*)/);
    if (match) return `/api/objects/${match[1]}`;
  }
  return "/images/car-sedan.png";
}

interface OtherDocsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  otherDocumentUrls: string[];
  isUploadingOther: boolean;
  onOtherDocUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveOtherDoc: (index: number) => void;
}

export function OtherDocsSection({
  isOpen,
  onToggle,
  otherDocumentUrls,
  isUploadingOther,
  onOtherDocUpload,
  onRemoveOtherDoc,
}: OtherDocsSectionProps) {
  return (
    <CollapsibleSection
      title="Other Documents"
      icon={<Settings className="w-5 h-5 text-teal-500" />}
      isOpen={isOpen}
      onToggle={onToggle}
      testId="other-docs"
    >
      <div className="space-y-3">
        {otherDocumentUrls.map((doc, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
            <FileText className="w-5 h-5 text-teal-500 flex-shrink-0" />
            <a
              href={resolveImageUrl(doc)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal-500 hover:underline truncate flex-1"
              data-testid={`link-other-doc-${index}`}
            >
              Document {index + 1}
            </a>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveOtherDoc(index)}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8 p-0"
              data-testid={`button-remove-other-doc-${index}`}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <label className="flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-border/50 cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-colors" data-testid="button-upload-other-doc">
          {isUploadingOther ? (
            <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
          ) : (
            <Plus className="w-5 h-5 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground">Add Document</span>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={onOtherDocUpload}
            className="hidden"
            disabled={isUploadingOther}
            data-testid="input-other-doc-upload"
          />
        </label>
      </div>
    </CollapsibleSection>
  );
}
