import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeApiService } from '../services/resume.service';
import { ClientResume, FONTS_LIST, FONT_SIZES_LIST, HEADING_SIZES_LIST, LINE_HEIGHTS_LIST, MARGINS_LIST, SPACING_LIST, ACCENT_COLORS_LIST, SUPPORTED_TEMPLATES } from '../types/resume.types';
import { TemplateRenderer } from '../components/templates';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { Accordion } from '@shared/components/ui/Accordion';
import { useToast } from '@shared/components/ui/Toast';
import { Card, CardBody } from '@shared/components/ui/Card';

export default function ResumeEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: toastError, info } = useToast();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit'); // Mobile tab toggle

  // Editor states
  const [localResume, setLocalResume] = useState<ClientResume | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState('classic-ats');

  // Load resume data
  const { data: serverResume, isLoading, error: queryError } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => resumeApiService.getResume(id!),
    enabled: !!id,
  });

  // Load versions
  const { data: versions = [] } = useQuery({
    queryKey: ['resume-versions', id],
    queryFn: () => resumeApiService.getResumeVersions(id!),
    enabled: !!id,
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (body: Partial<ClientResume>) => resumeApiService.updateResume(id!, body),
    onSuccess: () => {
      setSaveStatus('saved');
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
    },
    onError: () => {
      setSaveStatus('error');
      toastError('Failed to autosave changes');
    }
  });

  const exportPdfMutation = useMutation({
    mutationFn: () => resumeApiService.exportPdf(id!, localResume?.title || 'resume'),
    onSuccess: () => success('PDF downloaded successfully!'),
    onError: () => toastError('Failed to generate PDF'),
  });

  const restoreVersionMutation = useMutation({
    mutationFn: (versionId: string) => resumeApiService.restoreResumeVersion(id!, versionId),
    onSuccess: (restored) => {
      setLocalResume(restored);
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
      queryClient.invalidateQueries({ queryKey: ['resume-versions', id] });
      success('Version restored successfully!');
    },
    onError: () => toastError('Failed to restore version'),
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ privacy, slug }: { privacy: 'public' | 'unlisted'; slug?: string }) => 
      resumeApiService.publishResume(id!, { customSlug: slug, privacy }),
    onSuccess: (updated) => {
      if (localResume) {
        setLocalResume({
          ...localResume,
          privacy: updated.privacy,
          publicShareLink: updated.publicShareLink,
          slug: updated.slug
        });
      }
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
      success(`Resume published as ${updated.privacy}`);
    },
    onError: () => toastError('Failed to update sharing settings'),
  });

  const unpublishMutation = useMutation({
    mutationFn: () => resumeApiService.unpublishResume(id!),
    onSuccess: (updated) => {
      if (localResume) {
        setLocalResume({
          ...localResume,
          privacy: updated.privacy,
          publicShareLink: undefined,
          slug: updated.slug
        });
      }
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
      success('Resume is now private');
    },
    onError: () => toastError('Failed to make resume private'),
  });

  // Copy server values to local on load
  useEffect(() => {
    if (serverResume) {
      setLocalResume(serverResume);
      if (serverResume.templateId) {
        const found = SUPPORTED_TEMPLATES.find((t) => t.id === serverResume.templateId?.toString() || t.slug === serverResume.templateId?.toString());
        if (found) setSelectedTemplateSlug(found.slug);
      }
    }
  }, [serverResume]);

  // Debounced Autosave
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleLocalChange = (updated: ClientResume) => {
    setLocalResume(updated);
    setSaveStatus('saving');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateMutation.mutate({
        title: updated.title,
        templateId: updated.templateId,
        sections: updated.sections,
        customization: updated.customization,
        privacy: updated.privacy,
        atsScore: updated.atsScore
      });
    }, 1500);
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500 animate-pulse">Loading Resume Editor...</div>;
  }

  if (queryError || !localResume) {
    return <div className="p-12 text-center text-red-500">Failed to load resume. Please check link.</div>;
  }

  // --- Change Handlers ---
  const updateCustomization = (key: keyof ClientResume['customization'], value: any) => {
    const updated = {
      ...localResume,
      customization: {
        ...localResume.customization,
        [key]: value
      }
    };
    handleLocalChange(updated);
  };

  const updateSectionContent = (sectionId: string, updatedContent: any) => {
    const updatedSections = localResume.sections.map((s) =>
      s.id === sectionId ? { ...s, content: updatedContent } : s
    );
    handleLocalChange({ ...localResume, sections: updatedSections });
  };

  const renameSection = (sectionId: string, newName: string) => {
    const updatedSections = localResume.sections.map((s) =>
      s.id === sectionId ? { ...s, name: newName } : s
    );
    handleLocalChange({ ...localResume, sections: updatedSections });
  };

  const reorderSection = (index: number, direction: 'up' | 'down') => {
    const sections = [...localResume.sections] as any[];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    // Swap
    const temp = sections[index];
    sections[index] = sections[targetIdx];
    sections[targetIdx] = temp;

    // Recalculate order fields
    const updated = sections.map((s, idx) => ({ ...s, order: idx }));
    handleLocalChange({ ...localResume, sections: updated });
  };

  const deleteOrHideSection = (sectionId: string) => {
    const updatedSections = localResume.sections.filter((s) => s.id !== sectionId);
    handleLocalChange({ ...localResume, sections: updatedSections });
  };

  const addNewSection = (type: string, name: string) => {
    const order = localResume.sections.length;
    const newSec = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      type: type as any,
      content: type === 'skills' || type === 'education' || type === 'experience' || type === 'projects' || type === 'certifications' || type === 'achievements' || type === 'languages' ? { items: [] } : {},
      order
    };
    handleLocalChange({
      ...localResume,
      sections: [...localResume.sections, newSec]
    });
    setActiveSectionId(newSec.id);
  };

  // AI improve summary handler
  const handleAiImproveSummary = async (sectionId: string, currentText: string) => {
    if (!currentText.trim()) {
      toastError('Write a draft summary first so AI can improve it!');
      return;
    }
    info('AI is refining your summary...');
    try {
      const refined = await resumeApiService.aiImproveText(currentText, 'professional', 'Software Engineer');
      updateSectionContent(sectionId, { text: refined });
      success('Summary improved with AI!');
    } catch {
      toastError('AI improvement failed');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* 1. Header Bar */}
      <header className="h-16 px-6 bg-slate-950 border-b border-slate-800 flex justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/resume-builder')}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <input 
              type="text"
              value={localResume.title}
              onChange={(e) => handleLocalChange({ ...localResume, title: e.target.value })}
              className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-primary-500 font-bold text-md text-white outline-none px-1"
            />
            {/* Status indicator */}
            <div className="text-[10px] pl-1 text-slate-500 flex items-center gap-1.5 mt-0.5">
              {saveStatus === 'saved' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Saved to Cloud</span>
                </>
              )}
              {saveStatus === 'saving' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Saving...</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>Autosave failed</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Download PDF button */}
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => exportPdfMutation.mutate()}
            isLoading={exportPdfMutation.isPending}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          >
            Download PDF
          </Button>

          {/* Share Link setup */}
          <Button 
            variant="outline" 
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
            onClick={() => {
              const action = localResume.privacy === 'private' ? 'public' : 'private';
              if (action === 'public') {
                togglePublishMutation.mutate({ privacy: 'public' });
              } else {
                unpublishMutation.mutate();
              }
            }}
            isLoading={togglePublishMutation.isPending || unpublishMutation.isPending}
          >
            {localResume.privacy === 'private' ? 'Publish Link' : 'Unpublish Link'}
          </Button>
        </div>
      </header>

      {/* Mobile view tabs selector */}
      <div className="md:hidden flex bg-slate-950 border-b border-slate-800 shrink-0">
        <button 
          className={`flex-1 py-3 text-center text-xs font-bold ${activeTab === 'edit' ? 'border-b-2 border-primary-500 text-white' : 'text-slate-400'}`}
          onClick={() => setActiveTab('edit')}
        >
          Edit Code
        </button>
        <button 
          className={`flex-1 py-3 text-center text-xs font-bold ${activeTab === 'preview' ? 'border-b-2 border-primary-500 text-white' : 'text-slate-400'}`}
          onClick={() => setActiveTab('preview')}
        >
          Live Preview
        </button>
      </div>

      {/* 2. Main Work Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Forms Editor */}
        <div className={`w-full md:w-1/2 flex flex-col border-r border-slate-800 bg-slate-900 ${activeTab === 'edit' ? 'block' : 'hidden md:flex'}`}>
          {/* Style Customization Header Bar */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-4 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Design Settings</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-500">Template</label>
                <select 
                  value={selectedTemplateSlug} 
                  onChange={(e) => {
                    const found = SUPPORTED_TEMPLATES.find((t) => t.slug === e.target.value);
                    if (found && localResume) {
                      setSelectedTemplateSlug(found.slug);
                      handleLocalChange({
                        ...localResume,
                        templateId: found.id as any
                      });
                    }
                  }}
                  className="w-full mt-1 bg-slate-850 border border-slate-700 text-white px-2 py-1.5 rounded focus:border-primary-500 focus:outline-none"
                >
                  {SUPPORTED_TEMPLATES.map((t) => (
                    <option key={t.slug} value={t.slug}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500">Font</label>
                <select 
                  value={localResume.customization.font || 'Inter'}
                  onChange={(e) => updateCustomization('font', e.target.value)}
                  className="w-full mt-1 bg-slate-850 border border-slate-700 text-white px-2 py-1.5 rounded focus:border-primary-500 focus:outline-none"
                >
                  {FONTS_LIST.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500">Font Size</label>
                <select 
                  value={localResume.customization.fontSize || '10pt'}
                  onChange={(e) => updateCustomization('fontSize', e.target.value)}
                  className="w-full mt-1 bg-slate-850 border border-slate-700 text-white px-2 py-1.5 rounded focus:border-primary-500 focus:outline-none"
                >
                  {FONT_SIZES_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500">Accent Color</label>
                <select 
                  value={localResume.customization.accentColor || '#0284c7'}
                  onChange={(e) => updateCustomization('accentColor', e.target.value)}
                  className="w-full mt-1 bg-slate-850 border border-slate-700 text-white px-2 py-1.5 rounded focus:border-primary-500 focus:outline-none font-bold"
                  style={{ color: localResume.customization.accentColor || '#0284c7' }}
                >
                  {ACCENT_COLORS_LIST.map((c) => (
                    <option key={c.hex} value={c.hex} style={{ color: c.hex }}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Micro Layout details */}
            <div className="grid grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <label className="text-[10px] text-slate-500">Margins</label>
                <select 
                  value={localResume.customization.margins || '0.5in'}
                  onChange={(e) => updateCustomization('margins', e.target.value)}
                  className="w-full mt-1 bg-slate-850 border border-slate-700 text-white px-2 py-1 rounded focus:border-primary-500 focus:outline-none"
                >
                  {MARGINS_LIST.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500">Spacing</label>
                <select 
                  value={localResume.customization.spacing || '0.5rem'}
                  onChange={(e) => updateCustomization('spacing', e.target.value)}
                  className="w-full mt-1 bg-slate-850 border border-slate-700 text-white px-2 py-1 rounded focus:border-primary-500 focus:outline-none"
                >
                  {SPACING_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500">Line Height</label>
                <select 
                  value={localResume.customization.lineHeight || '1.4'}
                  onChange={(e) => updateCustomization('lineHeight', e.target.value)}
                  className="w-full mt-1 bg-slate-850 border border-slate-700 text-white px-2 py-1 rounded focus:border-primary-500 focus:outline-none"
                >
                  {LINE_HEIGHTS_LIST.map((lh) => <option key={lh} value={lh}>{lh}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resume Sections</h3>

            {/* List sections */}
            {[...localResume.sections].sort((a, b) => a.order - b.order).map((sec: any, sIdx) => (
              <Card key={sec.id} className="border border-slate-800 bg-slate-950 overflow-visible">
                <CardBody className="p-3">
                  {/* Reorder and toggle bar */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800 gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => reorderSection(sIdx, 'up')}
                        disabled={sIdx === 0}
                        className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => reorderSection(sIdx, 'down')}
                        disabled={sIdx === localResume.sections.length - 1}
                        className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                      >
                        ▼
                      </button>
                      <input 
                        type="text" 
                        value={sec.name}
                        onChange={(e) => renameSection(sec.id, e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-slate-800 focus:border-primary-500 text-xs font-bold text-white outline-none px-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="xs"
                        onClick={() => setActiveSectionId(activeSectionId === sec.id ? null : sec.id)}
                      >
                        {activeSectionId === sec.id ? 'Close' : 'Edit'}
                      </Button>
                      <button 
                        onClick={() => deleteOrHideSection(sec.id)}
                        className="text-red-500 hover:text-red-400 text-xs px-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Section content inputs */}
                  {activeSectionId === sec.id && (
                    <div className="space-y-4 pt-1">
                      {/* Render Personal Info inputs */}
                      {sec.type === 'personal_info' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input 
                            label="First Name" 
                            value={sec.content.firstName || ''}
                            onChange={(e) => updateSectionContent(sec.id, { ...sec.content, firstName: e.target.value })}
                          />
                          <Input 
                            label="Last Name" 
                            value={sec.content.lastName || ''}
                            onChange={(e) => updateSectionContent(sec.id, { ...sec.content, lastName: e.target.value })}
                          />
                          <Input 
                            label="Email Address" 
                            value={sec.content.email || ''}
                            onChange={(e) => updateSectionContent(sec.id, { ...sec.content, email: e.target.value })}
                          />
                          <Input 
                            label="Phone Number" 
                            value={sec.content.phone || ''}
                            onChange={(e) => updateSectionContent(sec.id, { ...sec.content, phone: e.target.value })}
                          />
                          <Input 
                            label="City" 
                            value={sec.content.city || ''}
                            onChange={(e) => updateSectionContent(sec.id, { ...sec.content, city: e.target.value })}
                          />
                          <Input 
                            label="Country" 
                            value={sec.content.country || ''}
                            onChange={(e) => updateSectionContent(sec.id, { ...sec.content, country: e.target.value })}
                          />
                          <Input 
                            label="LinkedIn Link" 
                            value={sec.content.linkedin || ''}
                            onChange={(e) => updateSectionContent(sec.id, { ...sec.content, linkedin: e.target.value })}
                          />
                          <Input 
                            label="GitHub Link" 
                            value={sec.content.github || ''}
                            onChange={(e) => updateSectionContent(sec.id, { ...sec.content, github: e.target.value })}
                          />
                        </div>
                      )}

                      {/* Render Summary text statement */}
                      {(sec.type === 'summary' || sec.type === 'objective') && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-xs text-slate-400">Statement Content</label>
                            {sec.type === 'summary' && (
                              <button 
                                onClick={() => handleAiImproveSummary(sec.id, sec.content.text || '')}
                                className="text-xs text-primary-400 hover:text-primary-300 font-bold flex items-center gap-1"
                              >
                                ✦ Improve with AI
                              </button>
                            )}
                          </div>
                          <textarea
                            value={sec.content.text || ''}
                            onChange={(e) => updateSectionContent(sec.id, { ...sec.content, text: e.target.value })}
                            rows={4}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:border-primary-500 focus:outline-none"
                            placeholder="Introduce yourself or describe your objective..."
                          />
                        </div>
                      )}

                      {/* Render Education items list */}
                      {sec.type === 'education' && (
                        <div className="space-y-4">
                          {(sec.content.items || []).map((item: any, iIdx: number) => (
                            <div key={iIdx} className="p-3 border border-slate-800 rounded bg-slate-900 relative space-y-3">
                              <button 
                                onClick={() => {
                                  const updatedItems = sec.content.items.filter((_: any, idx: number) => idx !== iIdx);
                                  updateSectionContent(sec.id, { ...sec.content, items: updatedItems });
                                }}
                                className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-400 font-bold"
                              >
                                Remove
                              </button>
                              <div className="grid grid-cols-2 gap-3">
                                <Input 
                                  label="Institution" 
                                  value={item.institution || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].institution = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                                <Input 
                                  label="Degree" 
                                  value={item.degree || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].degree = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                                <Input 
                                  label="Field of Study" 
                                  value={item.fieldOfStudy || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].fieldOfStudy = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                                <Input 
                                  label="Grade (CGPA / %)" 
                                  value={item.grade || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].grade = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                                <Input 
                                  label="Start Date" 
                                  type="date"
                                  value={item.startDate || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].startDate = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                                <Input 
                                  label="End Date" 
                                  type="date"
                                  disabled={item.isCurrent}
                                  value={item.endDate || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].endDate = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                              </div>
                              <label className="flex items-center gap-2 text-xs">
                                <input 
                                  type="checkbox"
                                  checked={item.isCurrent || false}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].isCurrent = e.target.checked;
                                    if (e.target.checked) items[iIdx].endDate = '';
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                  className="rounded text-primary-500"
                                />
                                Currently Studying Here
                              </label>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="xs"
                            onClick={() => {
                              const items = sec.content.items || [];
                              updateSectionContent(sec.id, {
                                ...sec.content,
                                items: [...items, { institution: '', degree: '', fieldOfStudy: '', grade: '', startDate: '', endDate: '', isCurrent: false }]
                              });
                            }}
                          >
                            + Add Education
                          </Button>
                        </div>
                      )}

                      {/* Render Experience list */}
                      {(sec.type === 'experience' || sec.type === 'internships') && (
                        <div className="space-y-4">
                          {(sec.content.items || []).map((item: any, iIdx: number) => (
                            <div key={iIdx} className="p-3 border border-slate-800 rounded bg-slate-900 relative space-y-3">
                              <button 
                                onClick={() => {
                                  const updatedItems = sec.content.items.filter((_: any, idx: number) => idx !== iIdx);
                                  updateSectionContent(sec.id, { ...sec.content, items: updatedItems });
                                }}
                                className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-400 font-bold"
                              >
                                Remove
                              </button>
                              <div className="grid grid-cols-2 gap-3">
                                <Input 
                                  label="Company Name" 
                                  value={item.company || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].company = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                                <Input 
                                  label="Job Title" 
                                  value={item.jobTitle || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].jobTitle = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                                <Input 
                                  label="Location" 
                                  value={item.location || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].location = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                                <Input 
                                  label="Employment Type" 
                                  value={item.employmentType || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].employmentType = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                  placeholder="Full-time, Internship, etc."
                                />
                                <Input 
                                  label="Start Date" 
                                  type="date"
                                  value={item.startDate || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].startDate = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                                <Input 
                                  label="End Date" 
                                  type="date"
                                  disabled={item.isCurrent}
                                  value={item.endDate || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].endDate = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                              </div>
                              <label className="flex items-center gap-2 text-xs">
                                <input 
                                  type="checkbox"
                                  checked={item.isCurrent || false}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].isCurrent = e.target.checked;
                                    if (e.target.checked) items[iIdx].endDate = '';
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                  className="rounded text-primary-500"
                                />
                                Currently Work Here
                              </label>

                              {/* Achievements bullet list editor */}
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400">Achievements (Bullets)</label>
                                {(item.achievements || []).map((ach: string, achIdx: number) => (
                                  <div key={achIdx} className="flex gap-2 items-center">
                                    <input 
                                      type="text" 
                                      value={ach}
                                      onChange={(e) => {
                                        const items = [...sec.content.items];
                                        items[iIdx].achievements[achIdx] = e.target.value;
                                        updateSectionContent(sec.id, { ...sec.content, items });
                                      }}
                                      className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white rounded p-1.5 focus:border-primary-500 outline-none"
                                    />
                                    <button 
                                      onClick={() => {
                                        const items = [...sec.content.items];
                                        items[iIdx].achievements = items[iIdx].achievements.filter((_: any, idx: number) => idx !== achIdx);
                                        updateSectionContent(sec.id, { ...sec.content, items });
                                      }}
                                      className="text-xs text-red-500 hover:text-red-400 font-bold px-1"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <Button 
                                  variant="ghost" 
                                  size="xs"
                                  onClick={() => {
                                    const items = [...sec.content.items];
                                    if (!items[iIdx].achievements) items[iIdx].achievements = [];
                                    items[iIdx].achievements.push('');
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                >
                                  + Add Achievement Bullet
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="xs"
                            onClick={() => {
                              const items = sec.content.items || [];
                              updateSectionContent(sec.id, {
                                ...sec.content,
                                items: [...items, { company: '', jobTitle: '', location: '', employmentType: 'full_time', startDate: '', endDate: '', isCurrent: false, achievements: [], technologies: [] }]
                              });
                            }}
                          >
                            + Add Job Experience
                          </Button>
                        </div>
                      )}

                      {/* Render Skills */}
                      {sec.type === 'skills' && (
                        <div className="space-y-4">
                          {(sec.content.items || []).map((group: any, gIdx: number) => (
                            <div key={gIdx} className="p-3 border border-slate-800 rounded bg-slate-900 relative space-y-2">
                              <button 
                                onClick={() => {
                                  const updatedItems = sec.content.items.filter((_: any, idx: number) => idx !== gIdx);
                                  updateSectionContent(sec.id, { ...sec.content, items: updatedItems });
                                }}
                                className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-400 font-bold"
                              >
                                Remove
                              </button>
                              <Input 
                                label="Skill Category" 
                                value={group.category || ''}
                                onChange={(e) => {
                                  const items = [...sec.content.items];
                                  items[gIdx].category = e.target.value;
                                  updateSectionContent(sec.id, { ...sec.content, items });
                                }}
                                placeholder="e.g. Frontend, Languages"
                              />
                              <div>
                                <label className="text-xs text-slate-400">Skills (comma separated)</label>
                                <input
                                  type="text"
                                  value={(group.skills || []).join(', ')}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[gIdx].skills = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded p-1.5 focus:border-primary-500 outline-none"
                                  placeholder="e.g. React, Vue, Svelte"
                                />
                              </div>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="xs"
                            onClick={() => {
                              const items = sec.content.items || [];
                              updateSectionContent(sec.id, {
                                ...sec.content,
                                items: [...items, { category: '', skills: [] }]
                              });
                            }}
                          >
                            + Add Skill Group
                          </Button>
                        </div>
                      )}

                      {/* Render Soft Skills */}
                      {sec.type === 'soft_skills' && (
                        <div>
                          <label className="text-xs text-slate-400">Soft Skills (comma separated)</label>
                          <input
                            type="text"
                            value={(sec.content.items || []).join(', ')}
                            onChange={(e) => {
                              const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              updateSectionContent(sec.id, { items: list });
                            }}
                            className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded p-2 focus:border-primary-500 outline-none"
                            placeholder="e.g. Communication, Team Leadership"
                          />
                        </div>
                      )}

                      {/* Render Projects list */}
                      {sec.type === 'projects' && (
                        <div className="space-y-4">
                          {(sec.content.items || []).map((item: any, iIdx: number) => (
                            <div key={iIdx} className="p-3 border border-slate-800 rounded bg-slate-900 relative space-y-3">
                              <button 
                                onClick={() => {
                                  const updatedItems = sec.content.items.filter((_: any, idx: number) => idx !== iIdx);
                                  updateSectionContent(sec.id, { ...sec.content, items: updatedItems });
                                }}
                                className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-400 font-bold"
                              >
                                Remove
                              </button>
                              <div className="grid grid-cols-2 gap-3">
                                <Input 
                                  label="Project Name" 
                                  value={item.projectName || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].projectName = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                                <Input 
                                  label="Role on Project" 
                                  value={item.role || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].role = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                                <Input 
                                  label="GitHub URL" 
                                  value={item.githubUrl || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].githubUrl = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                                <Input 
                                  label="Live Demo URL" 
                                  value={item.liveUrl || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].liveUrl = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-slate-400">Description</label>
                                <textarea
                                  value={item.description || ''}
                                  onChange={(e) => {
                                    const items = [...sec.content.items];
                                    items[iIdx].description = e.target.value;
                                    updateSectionContent(sec.id, { ...sec.content, items });
                                  }}
                                  rows={2}
                                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white focus:border-primary-500 focus:outline-none"
                                />
                              </div>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="xs"
                            onClick={() => {
                              const items = sec.content.items || [];
                              updateSectionContent(sec.id, {
                                ...sec.content,
                                items: [...items, { projectName: '', role: '', githubUrl: '', liveUrl: '', description: '', technologies: [] }]
                              });
                            }}
                          >
                            + Add Project
                          </Button>
                        </div>
                      )}

                      {/* Custom Section */}
                      {sec.type === 'custom' && (
                        <div className="space-y-2">
                          <label className="text-xs text-slate-400">Custom Text / Markdown Body</label>
                          <textarea
                            value={sec.content.text || ''}
                            onChange={(e) => updateSectionContent(sec.id, { text: e.target.value })}
                            rows={6}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:border-primary-500 focus:outline-none font-mono"
                            placeholder="Add details like publications, volunteer experience, etc."
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}

            {/* Section addition widget */}
            <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-300">Add custom sections</h4>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="xs"
                  onClick={() => addNewSection('objective', 'Career Objective')}
                >
                  + Add Objective
                </Button>
                <Button 
                  variant="secondary" 
                  size="xs"
                  onClick={() => addNewSection('custom', 'Custom Section')}
                >
                  + Add Custom
                </Button>
              </div>
            </div>

            {/* Version History Snaps listing */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Version History Snapshots</h4>
              <div className="space-y-2">
                {versions.map((v: any) => (
                  <div key={v.id} className="p-2 border border-slate-800 rounded bg-slate-950 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-slate-200">v{v.versionNumber}</span>
                      <span className="text-slate-500 text-[10px] ml-2">{v.createdReason}</span>
                    </div>
                    <button 
                      onClick={() => restoreVersionMutation.mutate(v.id)}
                      className="text-xs text-primary-400 hover:underline"
                      disabled={restoreVersionMutation.isPending}
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Live Iframe Preview Panel */}
        <div className={`w-full md:w-1/2 bg-slate-800 flex flex-col overflow-hidden items-center justify-start p-4 md:p-8 ${activeTab === 'preview' ? 'block' : 'hidden md:flex'}`}>
          <div className="w-full max-w-[21cm] bg-white text-black shadow-2xl rounded border border-slate-300 overflow-y-auto h-full flex-grow relative">
            <TemplateRenderer slug={selectedTemplateSlug} resume={localResume} />
          </div>
        </div>
      </div>
    </div>
  );
}
