'use client';

import { CollapsibleSection } from "./collapsible-section";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { FileText, X, Upload, Loader2 } from "lucide-react";

const RC_STATUS_OPTIONS = ["Original", "Duplicate", "Lost"];

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

interface RcDetailsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: {
    rcStatus: string;
    rtoCode: string;
    engineNumber: string;
    chassisNumber: string;
    rcDocumentUrl: string;
  };
  updateField: (field: string, value: any) => void;
  isUploadingRc: boolean;
  onRcDocUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RcDetailsSection({
  isOpen,
  onToggle,
  formData,
  updateField,
  isUploadingRc,
  onRcDocUpload,
}: RcDetailsSectionProps) {
  return (
    <CollapsibleSection
      title="RC & Vehicle Details"
      icon={<FileText className="w-5 h-5 text-teal-500" />}
      isOpen={isOpen}
      onToggle={onToggle}
      testId="rc-details"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">RC Status</label>
            <select
              value={formData.rcStatus}
              onChange={e => updateField("rcStatus", e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              data-testid="select-rc-status"
            >
              <option value="">Select RC Status</option>
              {RC_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">RTO Code</label>
            <Input
              value={formData.rtoCode}
              onChange={e => updateField("rtoCode", e.target.value)}
              placeholder="e.g. DL01"
              data-testid="input-rto-code"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Engine Number</label>
            <Input
              value={formData.engineNumber}
              onChange={e => updateField("engineNumber", e.target.value)}
              placeholder="Engine number"
              data-testid="input-engine-number"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Chassis Number</label>
            <Input
              value={formData.chassisNumber}
              onChange={e => updateField("chassisNumber", e.target.value)}
              placeholder="Chassis number"
              data-testid="input-chassis-number"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">RC Document</label>
          {formData.rcDocumentUrl ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
              <FileText className="w-5 h-5 text-teal-500 flex-shrink-0" />
              <a
                href={resolveImageUrl(formData.rcDocumentUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-teal-500 hover:underline truncate flex-1"
                data-testid="link-rc-document"
              >
                View RC Document
              </a>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => updateField("rcDocumentUrl", "")}
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8 p-0"
                data-testid="button-remove-rc-doc"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className="flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-border/50 cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-colors" data-testid="button-upload-rc-doc">
              {isUploadingRc ? (
                <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">Upload RC Document</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={onRcDocUpload}
                className="hidden"
                disabled={isUploadingRc}
                data-testid="input-rc-doc-upload"
              />
            </label>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
