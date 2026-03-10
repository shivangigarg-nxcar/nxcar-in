'use client';

import { CollapsibleSection } from "./collapsible-section";
import { Button } from "@components/ui/button";
import { Switch } from "@components/ui/switch";
import { Shield, FileText, X, Upload, Loader2 } from "lucide-react";

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

interface InsuranceSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  insuranceValid: boolean;
  insuranceDocumentUrl: string;
  updateField: (field: string, value: any) => void;
  isUploadingInsurance: boolean;
  onInsuranceDocUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InsuranceSection({
  isOpen,
  onToggle,
  insuranceValid,
  insuranceDocumentUrl,
  updateField,
  isUploadingInsurance,
  onInsuranceDocUpload,
}: InsuranceSectionProps) {
  return (
    <CollapsibleSection
      title="Insurance Details"
      icon={<Shield className="w-5 h-5 text-teal-500" />}
      isOpen={isOpen}
      onToggle={onToggle}
      testId="insurance"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
          <label className="text-sm font-medium text-foreground" htmlFor="insurance-toggle">Insurance Valid</label>
          <Switch
            id="insurance-toggle"
            checked={insuranceValid}
            onCheckedChange={(checked) => updateField("insuranceValid", checked)}
            data-testid="switch-insurance-valid"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Insurance Document</label>
          {insuranceDocumentUrl ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
              <FileText className="w-5 h-5 text-teal-500 flex-shrink-0" />
              <a
                href={resolveImageUrl(insuranceDocumentUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-teal-500 hover:underline truncate flex-1"
                data-testid="link-insurance-document"
              >
                View Insurance Document
              </a>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => updateField("insuranceDocumentUrl", "")}
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8 p-0"
                data-testid="button-remove-insurance-doc"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className="flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-border/50 cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-colors" data-testid="button-upload-insurance-doc">
              {isUploadingInsurance ? (
                <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">Upload Insurance Document</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={onInsuranceDocUpload}
                className="hidden"
                disabled={isUploadingInsurance}
                data-testid="input-insurance-doc-upload"
              />
            </label>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
