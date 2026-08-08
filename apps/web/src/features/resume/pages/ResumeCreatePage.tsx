import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { resumeApiService } from '../services/resume.service';
import { profileApiService } from '../../profile/services/profile.service';
import { SUPPORTED_TEMPLATES } from '../types/resume.types';
import { Button } from '@shared/components/ui/Button';
import { Card, CardBody } from '@shared/components/ui/Card';
import { Input } from '@shared/components/ui/Input';
import { useToast } from '@shared/components/ui/Toast';

export default function ResumeCreatePage() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('classic-ats');
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'personal_info',
    'summary',
    'education',
    'experience',
    'skills',
    'projects',
    'certifications'
  ]);

  // Load profile data to summarize in step 2
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApiService.getProfile(),
  });

  const createResumeMutation = useMutation({
    mutationFn: (body: any) => resumeApiService.createResume(body),
    onSuccess: (newResume) => {
      success('Resume created successfully!');
      navigate(`/resume-builder/edit/${newResume.id}`);
    },
    onError: () => {
      error('Failed to create resume');
    }
  });

  const toggleSection = (type: string) => {
    setSelectedSections((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleNext = () => {
    if (step === 1 && !title.trim()) {
      error('Please name your resume first');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleCreate = () => {
    createResumeMutation.mutate({
      title: title.trim(),
      templateId: SUPPORTED_TEMPLATES.find((t) => t.slug === selectedTemplate)?.id,
      importFromProfile: true,
      selectedSections
    });
  };

  const allSectionsList = [
    { type: 'personal_info', label: 'Personal Information', desc: 'Name, phone, email, and social profiles' },
    { type: 'summary', label: 'Professional Summary', desc: 'Manual or AI-improved profile bio statement' },
    { type: 'objective', label: 'Career Objective', desc: 'Targeted objective for entry-level roles' },
    { type: 'education', label: 'Education Records', desc: 'Schools, degrees, fields of study, and GPAs' },
    { type: 'experience', label: 'Work Experience', desc: 'Employment records, achievements, and tech used' },
    { type: 'internships', label: 'Internships', desc: 'Internship titles, descriptions, and results' },
    { type: 'projects', label: 'Key Projects', desc: 'Software repositories, feature details, and URLs' },
    { type: 'skills', label: 'Technical Skills', desc: 'Grouped categories (e.g. languages, databases)' },
    { type: 'soft_skills', label: 'Soft Skills', desc: 'Communication, leadership, and team collaboration' },
    { type: 'certifications', label: 'Certifications', desc: 'Credential names, issuers, and verification URLs' },
    { type: 'achievements', label: 'Achievements', desc: 'Honors, contest completions, and metrics' },
    { type: 'languages', label: 'Languages', desc: 'Spoken/written languages and proficiency levels' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 bg-[color:var(--bg-base)] min-h-screen">
      {/* Step Progress Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-extrabold text-[color:var(--text-primary)]">
          Create Resume Version
        </h1>
        <p className="text-sm text-[color:var(--text-muted)] max-w-md mx-auto">
          Tailor a specialized copy of your resume in a few guided steps.
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center items-center gap-8 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border ${
                  step === s 
                    ? 'bg-primary-500 border-primary-500 text-white shadow shadow-primary-500/20 scale-110' 
                    : step > s 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'bg-[color:var(--bg-surface)] border-[color:var(--border-default)] text-[color:var(--text-secondary)]'
                }`}
              >
                {step > s ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : s}
              </div>
              <span className={`text-xs font-semibold hidden md:inline ${
                step === s ? 'text-[color:var(--text-primary)]' : 'text-[color:var(--text-muted)]'
              }`}>
                {s === 1 && 'Choose Template'}
                {s === 2 && 'Load Career Profile'}
                {s === 3 && 'Configure Sections'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Content */}
      <Card className="border border-[color:var(--border-default)] shadow-sm bg-[color:var(--bg-surface)]">
        <CardBody className="p-6">
          {/* STEP 1: Choose Resume Template & Title */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[color:var(--text-primary)] mb-1">
                  1. Give your resume a title
                </h3>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Software Engineer - React Specialist"
                  required
                  autoFocus
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[color:var(--text-primary)] mb-3">
                  2. Select a design template
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SUPPORTED_TEMPLATES.map((tmpl) => (
                    <div 
                      key={tmpl.slug}
                      className={`cursor-pointer rounded-xl border p-4 flex gap-4 transition-all hover:border-primary-400 ${
                        selectedTemplate === tmpl.slug 
                          ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10 shadow-sm shadow-primary-500/10' 
                          : 'border-[color:var(--border-default)]'
                      }`}
                      onClick={() => setSelectedTemplate(tmpl.slug)}
                    >
                      <img 
                        src={tmpl.thumbnailUrl} 
                        alt={tmpl.name} 
                        className="w-16 h-20 object-cover rounded-lg border border-[color:var(--border-default)] bg-gray-100"
                      />
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-sm text-[color:var(--text-primary)]">{tmpl.name}</h4>
                        <p className="text-xs text-[color:var(--text-muted)] mt-1 line-clamp-2">{tmpl.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Choose Career Profile */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[color:var(--text-primary)]">
                Import from your primary Career Profile
              </h3>
              <p className="text-sm text-[color:var(--text-muted)]">
                The builder will automatically populate your resume with details loaded from your Career Profile so you don't have to retype it.
              </p>

              {isProfileLoading ? (
                <div className="py-8 text-center text-xs text-[color:var(--text-muted)]">Loading profile details...</div>
              ) : profileData?.data ? (
                <div className="p-4 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-subtle)] space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-[color:var(--border-default)]">
                    <span className="text-sm font-bold text-[color:var(--text-primary)]">
                      {profileData.data.profile?.firstName} {profileData.data.profile?.lastName}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Sync Enabled
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[color:var(--text-secondary)]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[color:var(--text-muted)]">Work Experience</div>
                      <div className="mt-1 font-semibold">{profileData.data.experience?.length || 0} records</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[color:var(--text-muted)]">Education</div>
                      <div className="mt-1 font-semibold">{profileData.data.education?.length || 0} records</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[color:var(--text-muted)]">Skills</div>
                      <div className="mt-1 font-semibold">{profileData.data.profile?.skills?.length || 0} technical skills</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[color:var(--text-muted)]">Projects</div>
                      <div className="mt-1 font-semibold">{profileData.data.projects?.length || 0} items</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs">
                  We couldn't locate your primary Career Profile. You can still proceed and fill out details in the editor.
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Configure Sections */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[color:var(--text-primary)]">
                Choose Sections to Include
              </h3>
              <p className="text-sm text-[color:var(--text-muted)]">
                Choose which parts of your profile should be initially written to this resume. You can add or reorder them anytime later in the editor.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
                {allSectionsList.map((sec) => (
                  <div 
                    key={sec.type}
                    className={`cursor-pointer rounded-xl border p-3 flex items-start gap-3 transition-colors ${
                      selectedSections.includes(sec.type) 
                        ? 'border-primary-500 bg-primary-50/10 dark:bg-primary-950/5' 
                        : 'border-[color:var(--border-default)]'
                    }`}
                    onClick={() => toggleSection(sec.type)}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedSections.includes(sec.type)}
                      onChange={() => {}} // handled by div click
                      className="mt-0.5 rounded border-[color:var(--border-default)] text-primary-500 focus:ring-primary-500"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[color:var(--text-primary)]">{sec.label}</h4>
                      <p className="text-[10px] text-[color:var(--text-muted)] mt-0.5">{sec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>

        {/* Wizard Footer Controls */}
        <div className="p-4 bg-[color:var(--bg-subtle)] border-t border-[color:var(--border-default)] flex justify-between items-center rounded-b-2xl">
          {step > 1 ? (
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div /> // dummy
          )}

          {step < 3 ? (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleCreate}
              isLoading={createResumeMutation.isPending}
            >
              Build Resume
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
