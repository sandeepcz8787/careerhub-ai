import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { resumeApiService } from '../services/resume.service';
import { SUPPORTED_TEMPLATES } from '../types/resume.types';
import { TemplateRenderer } from '../components/templates';
import { Button } from '@shared/components/ui/Button';

export default function PublicResumePage() {
  const { username, resumeSlug } = useParams<{ username: string; resumeSlug: string }>();
  const [templateSlug, setTemplateSlug] = useState('classic-ats');

  const { data: resume, isLoading, error } = useQuery({
    queryKey: ['public-resume', username, resumeSlug],
    queryFn: () => resumeApiService.getPublicResume(username!, resumeSlug!),
    enabled: !!username && !!resumeSlug,
    retry: false
  });

  useEffect(() => {
    if (resume?.templateId) {
      const found = SUPPORTED_TEMPLATES.find((t) => t.id === resume.templateId.toString() || t.slug === resume.templateId.toString());
      if (found) setTemplateSlug(found.slug);
    }
  }, [resume]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 animate-pulse font-sans">
        Loading shared resume...
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700 font-sans p-6 text-center">
        <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold mb-1">Resume Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">This resume may be private, deleted, or the sharing link could be invalid.</p>
        <a href="/" className="text-sm text-primary-600 font-semibold hover:underline">Go to Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start p-4 md:p-8 font-sans">
      {/* Dynamic Print actions bar */}
      <div className="w-full max-w-[21cm] mb-4 flex justify-between items-center bg-white shadow p-3 rounded-lg border border-slate-200 print:hidden shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-800 uppercase">
            {resume.owner?.firstName?.[0]}{resume.owner?.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{resume.owner?.firstName} {resume.owner?.lastName}</h3>
            <p className="text-[10px] text-slate-500">{resume.owner?.headline || 'Shared Resume'}</p>
          </div>
        </div>

        <Button 
          variant="primary" 
          size="sm"
          onClick={() => window.print()}
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2zm5-17V4a2 2 0 00-2-2H9a2 2 0 00-2 2v3" />
            </svg>
          }
        >
          Print / PDF
        </Button>
      </div>

      {/* Main Resume Sheet Frame */}
      <div className="w-full max-w-[21cm] bg-white text-black shadow-xl rounded border border-slate-200 overflow-y-auto min-h-screen relative print:shadow-none print:border-none print:p-0">
        <TemplateRenderer slug={templateSlug} resume={resume} />
      </div>
    </div>
  );
}
