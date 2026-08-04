import { useState } from 'react';
import { Card } from '@shared/components/ui/Card';
import { Button } from '@shared/components/ui/Button';
import { Badge } from '@shared/components/ui/Badge';
import type { JobRecommendation } from '../services/dashboard.service';

export interface RecommendationCardProps {
  job: JobRecommendation;
  onSave?: (id: string) => void;
  onApply?: (id: string) => void;
}

export function RecommendationCard({ job, onSave, onApply }: RecommendationCardProps) {
  const [isSaved, setIsSaved] = useState(job.saved);

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (onSave) onSave(job.id);
  };

  const handleApply = () => {
    if (onApply) onApply(job.id);
  };

  return (
    <Card
      variant="glass"
      padding="sm"
      className="border border-[color:var(--glass-border)] hover:border-primary-500/20 transition-all flex flex-col justify-between relative overflow-hidden group"
    >
      {/* Compatibility match percentage banner */}
      <div className="absolute top-2 right-2 z-10">
        <Badge variant="success" size="sm" className="font-bold">
          {job.matchScore}% Match
        </Badge>
      </div>

      <div className="flex gap-3 mb-3">
        {/* Company Logo wrapper */}
        <div className="w-11 h-11 rounded-xl overflow-hidden border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] flex items-center justify-center shrink-0">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt={job.companyName} className="object-cover w-full h-full" />
          ) : (
            <span className="font-black text-sm text-[color:var(--text-secondary)]">
              {job.companyName.charAt(0)}
            </span>
          )}
        </div>

        {/* Role & Company Details */}
        <div className="space-y-0.5 pr-14">
          <h4 className="text-xs font-bold text-[color:var(--text-primary)] leading-snug group-hover:text-primary-500 transition-colors line-clamp-1">
            {job.role}
          </h4>
          <p className="text-[10px] font-semibold text-[color:var(--text-secondary)] line-clamp-1">
            {job.companyName}
          </p>
        </div>
      </div>

      {/* Metadata - Location, Salary */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-3 text-[10px] text-[color:var(--text-muted)] font-medium">
        <span className="flex items-center gap-1">
          📍 {job.location}
        </span>
        <span className="text-[color:var(--border-strong)]">•</span>
        <span className="flex items-center gap-1">
          💰 {job.salary}
        </span>
      </div>

      {/* Tech stack tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[color:var(--bg-subtle)] text-[color:var(--text-secondary)] hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-all cursor-default"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons: Apply & Save */}
      <div className="flex items-center gap-2 pt-2.5 border-t border-[color:var(--border-subtle)] mt-auto">
        <Button
          variant={isSaved ? 'secondary' : 'ghost'}
          size="xs"
          className={`px-2 shrink-0 ${isSaved ? 'text-warning-500 dark:text-warning-400' : ''}`}
          onClick={handleSave}
          aria-label={isSaved ? 'Unsave job' : 'Save job'}
        >
          {isSaved ? '★ Saved' : '☆ Save'}
        </Button>
        
        <Button
          variant="primary"
          size="xs"
          className="flex-1 font-bold text-[10px] tracking-wide"
          onClick={handleApply}
        >
          Apply Now
        </Button>
      </div>
    </Card>
  );
}
