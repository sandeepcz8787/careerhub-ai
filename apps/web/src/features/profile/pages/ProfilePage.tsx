import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@features/auth/hooks/useAuth';
import { Card } from '@shared/components/ui/Card';
import { Button } from '@shared/components/ui/Button';
import { Avatar } from '@shared/components/ui/Avatar';
import { Badge } from '@shared/components/ui/Badge';
import { Skeleton } from '@shared/components/ui/Skeleton';
import { EmptyState } from '@shared/components/ui/EmptyState';
import type {
  Education,
  Experience,
  Project,
  Certificate,
  Achievement,
  Language,
  Resume
} from '@careerhub/shared';

import {
  useProfileDetails,
  useProfileCompletion,
  useUpdateProfileDetails,
  useUploadAvatar,
  useUploadCover,
  useUploadResume,
  useSetPrimaryResume,
  useDeleteResume,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useCreateCertificate,
  useUpdateCertificate,
  useDeleteCertificate,
  useCreateAchievement,
  useUpdateAchievement,
  useDeleteAchievement,
  useCreateLanguage,
  useUpdateLanguage,
  useDeleteLanguage,
  useAddSkill,
  useDeleteSkill
} from '../hooks/useProfile';

import {
  PersonalDetailsModal,
  CareerDetailsModal,
  EducationModal,
  ExperienceModal,
  ProjectModal,
  CertificateModal,
  AchievementModal,
  LanguageModal,
  SkillModal
} from '../components/ProfileEditorForms';

export default function ProfilePage() {
  const { user } = useAuth();
  
  // Queries
  const { data: details, isLoading: isDetailsLoading, error: detailsError } = useProfileDetails();
  const { data: completion, isLoading: isCompletionLoading } = useProfileCompletion();

  // Mutations
  const updateProfileMutation = useUpdateProfileDetails();
  const uploadAvatarMutation = useUploadAvatar();
  const uploadCoverMutation = useUploadCover();
  const uploadResumeMutation = useUploadResume();
  const setPrimaryResumeMutation = useSetPrimaryResume();
  const deleteResumeMutation = useDeleteResume();

  const addEduMutation = useCreateEducation();
  const updateEduMutation = useUpdateEducation();
  const deleteEduMutation = useDeleteEducation();

  const addExpMutation = useCreateExperience();
  const updateExpMutation = useUpdateExperience();
  const deleteExpMutation = useDeleteExperience();

  const addProjMutation = useCreateProject();
  const updateProjMutation = useUpdateProject();
  const deleteProjMutation = useDeleteProject();

  const addCertMutation = useCreateCertificate();
  const updateCertMutation = useUpdateCertificate();
  const deleteCertMutation = useDeleteCertificate();

  const addAchMutation = useCreateAchievement();
  const updateAchMutation = useUpdateAchievement();
  const deleteAchMutation = useDeleteAchievement();

  const addLangMutation = useCreateLanguage();
  const updateLangMutation = useUpdateLanguage();
  const deleteLangMutation = useDeleteLanguage();

  const addSkillMutation = useAddSkill();
  const deleteSkillMutation = useDeleteSkill();

  // Modal Control States
  const [modalType, setModalType] = useState<string | null>(null);
  const [activeRecord, setActiveRecord] = useState<any>(null);

  // Hidden File Inputs Refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  if (isDetailsLoading) {
    return (
      <div className="space-y-6 sm:space-y-8 pb-10">
        <Card variant="bordered" className="relative overflow-hidden h-72">
          <Skeleton className="w-full h-40" />
          <div className="absolute left-6 bottom-4 flex items-end gap-4">
            <Skeleton className="w-24 h-24 rounded-full border-4 border-slate-900" />
            <div className="space-y-2 pb-2">
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-32 h-4" />
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="bordered" className="p-6 space-y-4">
              <Skeleton className="w-28 h-5" />
              <Skeleton className="w-full h-16" />
            </Card>
            <Card variant="bordered" className="p-6 space-y-4">
              <Skeleton className="w-36 h-5" />
              <Skeleton className="w-full h-32" />
            </Card>
          </div>
          <div className="space-y-6">
            <Card variant="bordered" className="p-6 space-y-4">
              <Skeleton className="w-32 h-5" />
              <Skeleton className="w-full h-24" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (detailsError || !details || !details.data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <EmptyState
          title="Failed to Load Profile"
          description="We encountered an error retrieving your professional details. Please try reloading."
          action={<Button onClick={() => window.location.reload()}>Reload Page</Button>}
        />
      </div>
    );
  }

  const {
    profile,
    education,
    experience,
    projects,
    certificates,
    achievements,
    languages,
    resumes
  } = details.data;

  // File Upload Handlers (converts file to base64)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      uploadAvatarMutation.mutate(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      uploadCoverMutation.mutate(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      uploadResumeMutation.mutate({
        base64Data: reader.result as string,
        title: file.name.replace(/\.[^/.]+$/, ''),
        isPrimary: resumes.length === 0
      });
    };
    reader.readAsDataURL(file);
  };

  // Export Data Handler
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(details.data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.firstName || 'user'}_careerhub_profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Render Section Helper
  const openModal = (type: string, record: any = null) => {
    setActiveRecord(record);
    setModalType(type);
  };

  const completionData = completion?.data;

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
      <input type="file" ref={coverInputRef} onChange={handleCoverChange} className="hidden" accept="image/*" />
      <input type="file" ref={resumeInputRef} onChange={handleResumeChange} className="hidden" accept=".pdf" />

      {/* ── PROFILE HEADER SECTION ── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card variant="bordered" className="relative overflow-hidden p-0 rounded-2xl border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)]">
          {/* Cover Photo */}
          <div
            className="w-full h-40 sm:h-48 bg-gradient-to-r from-primary-600 via-violet-600 to-indigo-700 relative cursor-pointer group"
            style={profile.coverImageUrl ? { backgroundImage: `url(${profile.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            onClick={() => coverInputRef.current?.click()}
          >
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
              📷 Click to change Cover Image
            </div>
            {uploadCoverMutation.isPending && (
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center text-white text-sm">
                Uploading Cover...
              </div>
            )}
          </div>

          {/* User Meta Row */}
          <div className="px-6 pb-6 pt-4 flex flex-col sm:flex-row sm:items-end justify-between relative gap-6">
            {/* Avatar overlapping cover */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[color:var(--bg-surface)] overflow-hidden relative cursor-pointer group shrink-0 bg-slate-100 dark:bg-slate-800"
                onClick={() => avatarInputRef.current?.click()}
              >
                <Avatar
                  src={profile.avatarUrl || user?.profile?.avatarUrl || ''}
                  name={`${profile.firstName || ''} ${profile.lastName || ''}`.trim() || user?.profile?.displayName}
                  className="w-full h-full text-2xl font-bold"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                  Change Photo
                </div>
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px]">
                    Saving...
                  </div>
                )}
              </div>

              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-[color:var(--text-primary)]">
                    {profile.firstName ? `${profile.firstName} ${profile.lastName}`.trim() : user?.profile?.displayName}
                  </h2>
                  {profile.isOpenToWork && (
                    <Badge variant="success" className="font-black tracking-wider uppercase text-[9px] py-0.5 px-2">
                      Open to Work
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                  {profile.headline || 'Add a professional headline'}
                </p>
                <p className="text-xs font-medium text-[color:var(--text-muted)] flex items-center gap-1">
                  <span>📍</span> {profile.city ? `${profile.city}, ${profile.country}` : 'Add location'}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex gap-2 flex-wrap shrink-0">
              <Button size="sm" variant="outline" className="font-bold text-xs" onClick={() => openModal('personal', profile)}>
                ✏️ Edit Profile Info
              </Button>
              <Button size="sm" variant="outline" className="font-bold text-xs" onClick={() => openModal('career', profile)}>
                ⚙️ Career Preferences
              </Button>
              <Button size="sm" variant="primary" className="font-bold text-xs bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90" onClick={handleExportJSON}>
                📥 Export Profile (JSON)
              </Button>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* ── PROFILE BODY GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* LEFT COLUMN: Timeline Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About / Bio */}
          <Card variant="bordered" padding="lg" className="rounded-xl space-y-3">
            <div className="flex justify-between items-center border-b border-[color:var(--border-subtle)] pb-2">
              <h3 className="text-md font-bold tracking-tight text-[color:var(--text-primary)]">About / Summary</h3>
              <button onClick={() => openModal('personal', profile)} className="text-xs font-semibold text-primary-500 hover:underline">
                Edit
              </button>
            </div>
            {profile.bio ? (
              <p className="text-sm text-[color:var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                {profile.bio}
              </p>
            ) : (
              <p className="text-xs text-[color:var(--text-muted)] italic py-2">
                No summary bio added. Click edit to introduce yourself to recruiters.
              </p>
            )}
          </Card>

          {/* Work Experience */}
          <Card variant="bordered" padding="lg" className="rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[color:var(--border-subtle)] pb-2">
              <h3 className="text-md font-bold tracking-tight text-[color:var(--text-primary)]">Work Experience</h3>
              <Button size="xs" variant="outline" className="font-bold" onClick={() => openModal('experience')}>
                ➕ Add Role
              </Button>
            </div>

            {experience.length > 0 ? (
              <div className="relative border-l border-[color:var(--border-subtle)] ml-3 pl-6 space-y-6">
                {experience.map((exp: Experience) => (
                  <div key={exp.id} className="relative group text-left">
                    {/* Circle timeline dot */}
                    <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-primary-500 border border-[color:var(--bg-surface)]" />
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-[color:var(--text-primary)]">{exp.role}</h4>
                        <p className="text-xs font-semibold text-[color:var(--text-secondary)]">
                          🏢 {exp.companyName} • <span className="capitalize">{exp.employmentType.replace('_', ' ')}</span>
                        </p>
                        <p className="text-[10px] text-[color:var(--text-muted)] font-semibold uppercase tracking-wider mt-0.5">
                          📅 {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                          {exp.location && ` • 📍 ${exp.location}`}
                        </p>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal('experience', exp)} className="text-xs text-primary-500 font-semibold hover:underline">
                          Edit
                        </button>
                        <button onClick={() => deleteExpMutation.mutate(exp.id)} className="text-xs text-error-500 font-semibold hover:underline">
                          Delete
                        </button>
                      </div>
                    </div>

                    {exp.description && (
                      <p className="text-xs text-[color:var(--text-secondary)] mt-2 leading-relaxed whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="mt-2 space-y-1 list-disc pl-4 text-xs text-[color:var(--text-secondary)]">
                        {exp.achievements.map((ach: string, idx: number) => (
                          <li key={idx}>{ach}</li>
                        ))}
                      </ul>
                    )}

                    {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.skillsUsed.map((sk: string) => (
                          <Badge key={sk} variant="outline" className="text-[9px] py-0.5 px-1.5 font-bold">
                            🔧 {sk}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[color:var(--text-muted)] italic text-center py-4">
                No work experience records listed yet. Add one to show your professional experience.
              </p>
            )}
          </Card>

          {/* Education */}
          <Card variant="bordered" padding="lg" className="rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[color:var(--border-subtle)] pb-2">
              <h3 className="text-md font-bold tracking-tight text-[color:var(--text-primary)]">Education</h3>
              <Button size="xs" variant="outline" className="font-bold" onClick={() => openModal('education')}>
                ➕ Add Degree
              </Button>
            </div>

            {education.length > 0 ? (
              <div className="space-y-4">
                {education.map((edu: Education) => (
                  <div key={edu.id} className="flex justify-between items-start border-b border-[color:var(--border-subtle)] last:border-b-0 pb-3 last:pb-0">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[color:var(--text-primary)]">{edu.degree}</h4>
                      <p className="text-xs font-semibold text-[color:var(--text-secondary)]">
                        🎓 {edu.institution} • {edu.fieldOfStudy}
                      </p>
                      <p className="text-[10px] text-[color:var(--text-muted)] font-semibold uppercase tracking-wider">
                        📅 {new Date(edu.startDate).getFullYear()} – {edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                        {edu.grade && ` • Grade: ${edu.grade}`}
                      </p>
                      {edu.activities && (
                        <p className="text-xs text-[color:var(--text-secondary)] italic mt-1">{edu.activities}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => openModal('education', edu)} className="text-xs text-primary-500 font-semibold hover:underline">
                        Edit
                      </button>
                      <button onClick={() => deleteEduMutation.mutate(edu.id)} className="text-xs text-error-500 font-semibold hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[color:var(--text-muted)] italic text-center py-4">
                No education records listed. Add your educational background.
              </p>
            )}
          </Card>

          {/* Projects */}
          <Card variant="bordered" padding="lg" className="rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[color:var(--border-subtle)] pb-2">
              <h3 className="text-md font-bold tracking-tight text-[color:var(--text-primary)]">Projects</h3>
              <Button size="xs" variant="outline" className="font-bold" onClick={() => openModal('project')}>
                ➕ Add Project
              </Button>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj: Project) => (
                  <Card key={proj.id} variant="bordered" className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative">
                    {proj.isFeatured && (
                      <span className="absolute top-2 right-2 text-xs">⭐ Featured</span>
                    )}
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-[color:var(--text-primary)] pr-12">{proj.title}</h4>
                      {proj.role && <p className="text-xs text-[color:var(--text-secondary)] font-semibold">Role: {proj.role}</p>}
                      <p className="text-xs text-[color:var(--text-muted)] leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.techStack.map((tech: string) => (
                          <Badge key={tech} variant="outline" className="text-[9px] py-0 px-1 font-bold">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 border-t border-[color:var(--border-subtle)] pt-2 text-xs">
                      <div className="flex gap-2">
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary-500 font-bold hover:underline">
                            GitHub
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-accent-500 font-bold hover:underline">
                            Live Demo
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openModal('project', proj)} className="text-xs text-primary-500 font-semibold hover:underline">
                          Edit
                        </button>
                        <button onClick={() => deleteProjMutation.mutate(proj.id)} className="text-xs text-error-500 font-semibold hover:underline">
                          Delete
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[color:var(--text-muted)] italic text-center py-4">
                No projects listed. Showcase your work by adding one.
              </p>
            )}
          </Card>

          {/* Technical Skills & Soft Skills */}
          <Card variant="bordered" padding="lg" className="rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[color:var(--border-subtle)] pb-2">
              <h3 className="text-md font-bold tracking-tight text-[color:var(--text-primary)]">Skills Portfolio</h3>
              <div className="flex gap-2">
                <Button size="xs" variant="outline" className="font-bold" onClick={() => openModal('skill')}>
                  🔧 Add Technical Skill
                </Button>
                <Button size="xs" variant="outline" className="font-bold" onClick={() => {
                  const val = prompt('Enter a soft skill name (e.g. Communication, Problem Solving):');
                  if (val) {
                    const updatedSoft = [...(profile.softSkills || []), val];
                    updateProfileMutation.mutate({ softSkills: updatedSoft });
                  }
                }}>
                  🤝 Add Soft Skill
                </Button>
              </div>
            </div>

            {/* Technical Skills grouped by Category */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[color:var(--text-primary)] uppercase tracking-wider">Technical Skills</h4>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from(new Set(profile.skills.map((s: any) => s.category))).map((category) => (
                    <div key={category} className="space-y-2 p-3 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)]">
                      <span className="text-xs font-black text-primary-500 font-heading">{category}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skills
                          .filter((s: any) => s.category === category)
                          .map((sk: any) => (
                            <div key={sk.name} className="flex items-center gap-1 bg-[color:var(--bg-surface)] border border-[color:var(--border-subtle)] rounded-full px-2.5 py-0.5 text-xs text-[color:var(--text-primary)] group">
                              <span className="font-bold">{sk.name}</span>
                              <span className="text-[9px] text-[color:var(--text-muted)] lowercase tracking-wide font-semibold">
                                ({sk.proficiency})
                              </span>
                              <button
                                onClick={() => deleteSkillMutation.mutate(sk.name)}
                                className="text-[10px] text-error-500 font-bold ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove skill"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[color:var(--text-muted)] italic py-1">No technical skills added yet.</p>
              )}
            </div>

            {/* Soft Skills */}
            <div className="space-y-2 border-t border-[color:var(--border-subtle)] pt-4">
              <h4 className="text-xs font-bold text-[color:var(--text-primary)] uppercase tracking-wider">Soft Skills</h4>
              {profile.softSkills && profile.softSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.softSkills.map((sk: string) => (
                    <div key={sk} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-[color:var(--border-subtle)] rounded-full px-3 py-1 text-xs text-[color:var(--text-primary)] group">
                      <span className="font-semibold">{sk}</span>
                      <button
                        onClick={() => {
                          const list = profile.softSkills.filter((x: string) => x !== sk);
                          updateProfileMutation.mutate({ softSkills: list });
                        }}
                        className="text-[9px] text-error-500 font-bold ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[color:var(--text-muted)] italic py-1">No soft skills added yet.</p>
              )}
            </div>
          </Card>

          {/* Certificates */}
          <Card variant="bordered" padding="lg" className="rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[color:var(--border-subtle)] pb-2">
              <h3 className="text-md font-bold tracking-tight text-[color:var(--text-primary)]">Certifications</h3>
              <Button size="xs" variant="outline" className="font-bold" onClick={() => openModal('certificate')}>
                ➕ Add Credentials
              </Button>
            </div>

            {certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map((cert: Certificate) => (
                  <div key={cert.id} className="flex justify-between items-start border-b border-[color:var(--border-subtle)] last:border-b-0 pb-3 last:pb-0">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-[color:var(--text-primary)]">{cert.title}</h4>
                      <p className="text-xs font-semibold text-[color:var(--text-secondary)]">🏢 {cert.issuer}</p>
                      <p className="text-[10px] text-[color:var(--text-muted)] font-semibold uppercase tracking-wider">
                        📅 Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {cert.expiryDate && ` – Expires: ${new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                      </p>
                      {cert.credentialId && (
                        <p className="text-[10px] text-[color:var(--text-muted)] font-mono font-semibold">Cred ID: {cert.credentialId}</p>
                      )}
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 font-bold hover:underline inline-block mt-1">
                          View Certification 🔗
                        </a>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => openModal('certificate', cert)} className="text-xs text-primary-500 font-semibold hover:underline">
                        Edit
                      </button>
                      <button onClick={() => deleteCertMutation.mutate(cert.id)} className="text-xs text-error-500 font-semibold hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[color:var(--text-muted)] italic text-center py-4">
                No certifications listed yet. Showcase your credentials.
              </p>
            )}
          </Card>

          {/* Achievements & Languages Sub-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Achievements */}
            <Card variant="bordered" padding="lg" className="rounded-xl space-y-4">
              <div className="flex justify-between items-center border-b border-[color:var(--border-subtle)] pb-2">
                <h3 className="text-md font-bold tracking-tight text-[color:var(--text-primary)]">Achievements</h3>
                <Button size="xs" variant="outline" className="font-bold" onClick={() => openModal('achievement')}>
                  ➕ Add Award
                </Button>
              </div>

              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.map((ach: Achievement) => (
                    <div key={ach.id} className="flex justify-between items-start border-b border-[color:var(--border-subtle)] last:border-b-0 pb-2 last:pb-0">
                      <div>
                        <h4 className="text-xs font-bold text-[color:var(--text-primary)]">{ach.title}</h4>
                        <p className="text-[10px] text-[color:var(--text-secondary)] font-semibold">{ach.issuer}</p>
                        <p className="text-[9px] text-[color:var(--text-muted)] font-semibold uppercase">{new Date(ach.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                        {ach.description && <p className="text-[11px] text-[color:var(--text-muted)] mt-1">{ach.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openModal('achievement', ach)} className="text-xs text-primary-500 font-semibold hover:underline">✏️</button>
                        <button onClick={() => deleteAchMutation.mutate(ach.id)} className="text-xs text-error-500 font-semibold hover:underline">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[color:var(--text-muted)] italic text-center py-4">No awards listed yet.</p>
              )}
            </Card>

            {/* Languages */}
            <Card variant="bordered" padding="lg" className="rounded-xl space-y-4">
              <div className="flex justify-between items-center border-b border-[color:var(--border-subtle)] pb-2">
                <h3 className="text-md font-bold tracking-tight text-[color:var(--text-primary)]">Languages</h3>
                <Button size="xs" variant="outline" className="font-bold" onClick={() => openModal('language')}>
                  ➕ Add Language
                </Button>
              </div>

              {languages.length > 0 ? (
                <div className="space-y-2">
                  {languages.map((lang: Language) => (
                    <div key={lang.id} className="flex justify-between items-center border-b border-[color:var(--border-subtle)] last:border-b-0 pb-2 last:pb-0">
                      <div>
                        <h4 className="text-xs font-bold text-[color:var(--text-primary)]">{lang.language}</h4>
                        <p className="text-[10px] text-[color:var(--text-secondary)] font-semibold capitalize">{lang.proficiency.replace(/_/g, ' ')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openModal('language', lang)} className="text-xs text-primary-500 font-semibold hover:underline">✏️</button>
                        <button onClick={() => deleteLangMutation.mutate(lang.id)} className="text-xs text-error-500 font-semibold hover:underline">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[color:var(--text-muted)] italic text-center py-4">No languages listed yet.</p>
              )}
            </Card>

          </div>

        </div>

        {/* RIGHT COLUMN: Engine widgets */}
        <div className="space-y-6">
          
          {/* Profile Completeness Engine */}
          <Card variant="bordered" padding="lg" className="rounded-xl space-y-4 border-primary-500/20 bg-primary-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-sm font-bold tracking-tight text-[color:var(--text-primary)] flex items-center gap-1.5">
              🎯 Profile Completion
            </h3>

            {/* Circular Progress & Percentage */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full border border-[color:var(--border-subtle)]">
                <span className="text-sm font-black text-primary-500">
                  {completionData?.completionPercentage || 0}%
                </span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[color:var(--text-primary)]">Overall Strength</h4>
                <p className="text-[10px] text-[color:var(--text-secondary)] font-medium">
                  {completionData && completionData.completionPercentage >= 80 ? 'Master Professional 🌟' : 'Keep building your profile to attract 5x more recruiter searches.'}
                </p>
              </div>
            </div>

            {/* Suggested Actions */}
            {completionData && completionData.suggestions && completionData.suggestions.length > 0 && (
              <div className="space-y-2 border-t border-[color:var(--border-subtle)] pt-3 text-left">
                <h5 className="text-[10px] font-bold text-[color:var(--text-secondary)] uppercase tracking-wider">Recommended Next Steps</h5>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {completionData.suggestions.slice(0, 4).map((sugg: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[color:var(--bg-surface)] border border-[color:var(--border-subtle)] text-[11px] leading-snug flex items-start gap-2 group cursor-pointer hover:border-primary-500 transition-colors"
                      onClick={() => {
                        if (sugg.section === 'Education') openModal('education');
                        else if (sugg.section === 'Work Experience') openModal('experience');
                        else if (sugg.section === 'Projects') openModal('project');
                        else if (sugg.section === 'Certificates') openModal('certificate');
                        else if (sugg.section === 'Technical Skills') openModal('skill');
                        else if (sugg.section === 'Career Information') openModal('career');
                        else openModal('personal');
                      }}
                    >
                      <span className="text-xs shrink-0 text-primary-500 font-bold">+{sugg.points}</span>
                      <div className="space-y-0.5">
                        <span className="font-bold text-[color:var(--text-primary)] block text-[10px]">{sugg.section}</span>
                        <p className="text-[10px] text-[color:var(--text-secondary)] font-medium">{sugg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Preferences Summary card */}
          <Card variant="bordered" padding="lg" className="rounded-xl space-y-3">
            <div className="flex justify-between items-center border-b border-[color:var(--border-subtle)] pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[color:var(--text-primary)]">Job Targeting Preferences</h3>
              <button onClick={() => openModal('career', profile)} className="text-[11px] font-semibold text-primary-500 hover:underline">Edit</button>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[color:var(--border-subtle)]/50 last:border-b-0">
                <span className="text-[color:var(--text-secondary)] font-medium">Notice Period</span>
                <span className="font-bold text-[color:var(--text-primary)]">{profile.noticePeriod || 'Not set'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[color:var(--border-subtle)]/50 last:border-b-0">
                <span className="text-[color:var(--text-secondary)] font-medium">Expected Salary</span>
                <span className="font-bold text-[color:var(--text-primary)]">
                  {profile.expectedSalary ? `$${profile.expectedSalary.toLocaleString()}/yr` : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[color:var(--border-subtle)]/50 last:border-b-0">
                <span className="text-[color:var(--text-secondary)] font-medium">Remote Preference</span>
                <span className="font-bold text-[color:var(--text-primary)] capitalize">{profile.remotePreference}</span>
              </div>
              
              {profile.preferredJobRole && profile.preferredJobRole.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[color:var(--text-secondary)] font-medium block">Job Roles</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.preferredJobRole.map((role: string) => (
                      <Badge key={role} variant="outline" className="text-[9px] font-bold py-0.5 px-1.5">
                        💼 {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.preferredLocation && profile.preferredLocation.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[color:var(--text-secondary)] font-medium block">Locations</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.preferredLocation.map((loc: string) => (
                      <Badge key={loc} variant="outline" className="text-[9px] font-bold py-0.5 px-1.5">
                        📍 {loc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Resume Center */}
          <Card variant="bordered" padding="lg" className="rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[color:var(--border-subtle)] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[color:var(--text-primary)]">Resume Management</h3>
              <button
                onClick={() => resumeInputRef.current?.click()}
                className="text-xs font-bold text-primary-500 hover:underline"
              >
                + Upload New
              </button>
            </div>

            {uploadResumeMutation.isPending && (
              <div className="p-3 text-center text-xs text-[color:var(--text-muted)] animate-pulse border border-[color:var(--border-subtle)] rounded-lg bg-[color:var(--bg-subtle)]">
                Uploading PDF document...
              </div>
            )}

            {resumes.length > 0 ? (
              <div className="space-y-2">
                {resumes.map((resFile: Resume) => (
                  <div key={resFile.id} className={`p-3 rounded-lg border text-xs flex justify-between items-center gap-2 transition-all ${resFile.isPrimary ? 'border-primary-500/40 bg-primary-500/5' : 'border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)]'}`}>
                    <div className="space-y-1 truncate text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">📄</span>
                        <h4 className="font-bold text-[color:var(--text-primary)] truncate">{resFile.title}</h4>
                      </div>
                      <p className="text-[9px] text-[color:var(--text-muted)] font-semibold uppercase">
                        📅 {new Date(resFile.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {resFile.isPrimary ? (
                        <span className="bg-primary-500 text-white dark:bg-primary-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                          Primary
                        </span>
                      ) : (
                        <button
                          onClick={() => setPrimaryResumeMutation.mutate(resFile.id)}
                          className="text-[10px] text-primary-500 font-bold hover:underline"
                        >
                          Make Primary
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteResumeMutation.mutate(resFile.id)}
                        className="text-[10px] text-error-500 font-bold hover:text-error-600"
                        title="Delete resume version"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-[color:var(--border-subtle)] rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-all"
                onClick={() => resumeInputRef.current?.click()}
              >
                <span className="text-2xl block mb-2">📁</span>
                <span className="text-xs font-bold text-[color:var(--text-primary)] block">No Resume Uploaded</span>
                <span className="text-[10px] text-[color:var(--text-muted)]">Upload a PDF to auto-match job posts</span>
              </div>
            )}
          </Card>

        </div>
      </div>

      {/* ── MODALS CONTAINER ── */}
      {modalType === 'personal' && (
        <PersonalDetailsModal
          isOpen={true}
          onClose={() => setModalType(null)}
          initialData={activeRecord}
          onSave={async (vals) => {
            await updateProfileMutation.mutateAsync(vals);
          }}
          isLoading={updateProfileMutation.isPending}
        />
      )}

      {modalType === 'career' && (
        <CareerDetailsModal
          isOpen={true}
          onClose={() => setModalType(null)}
          initialData={activeRecord}
          onSave={async (vals) => {
            await updateProfileMutation.mutateAsync(vals);
          }}
          isLoading={updateProfileMutation.isPending}
        />
      )}

      {modalType === 'education' && (
        <EducationModal
          isOpen={true}
          onClose={() => setModalType(null)}
          record={activeRecord}
          onSave={async (vals) => {
            if (activeRecord) {
              await updateEduMutation.mutateAsync({ id: activeRecord.id, data: vals });
            } else {
              await addEduMutation.mutateAsync(vals);
            }
          }}
          isLoading={addEduMutation.isPending || updateEduMutation.isPending}
        />
      )}

      {modalType === 'experience' && (
        <ExperienceModal
          isOpen={true}
          onClose={() => setModalType(null)}
          record={activeRecord}
          onSave={async (vals) => {
            if (activeRecord) {
              await updateExpMutation.mutateAsync({ id: activeRecord.id, data: vals });
            } else {
              await addExpMutation.mutateAsync(vals);
            }
          }}
          isLoading={addExpMutation.isPending || updateExpMutation.isPending}
        />
      )}

      {modalType === 'project' && (
        <ProjectModal
          isOpen={true}
          onClose={() => setModalType(null)}
          record={activeRecord}
          onSave={async (vals) => {
            if (activeRecord) {
              await updateProjMutation.mutateAsync({ id: activeRecord.id, data: vals });
            } else {
              await addProjMutation.mutateAsync(vals);
            }
          }}
          isLoading={addProjMutation.isPending || updateProjMutation.isPending}
        />
      )}

      {modalType === 'certificate' && (
        <CertificateModal
          isOpen={true}
          onClose={() => setModalType(null)}
          record={activeRecord}
          onSave={async (vals) => {
            if (activeRecord) {
              await updateCertMutation.mutateAsync({ id: activeRecord.id, data: vals });
            } else {
              await addCertMutation.mutateAsync(vals);
            }
          }}
          isLoading={addCertMutation.isPending || updateCertMutation.isPending}
        />
      )}

      {modalType === 'achievement' && (
        <AchievementModal
          isOpen={true}
          onClose={() => setModalType(null)}
          record={activeRecord}
          onSave={async (vals) => {
            if (activeRecord) {
              await updateAchMutation.mutateAsync({ id: activeRecord.id, data: vals });
            } else {
              await addAchMutation.mutateAsync(vals);
            }
          }}
          isLoading={addAchMutation.isPending || updateAchMutation.isPending}
        />
      )}

      {modalType === 'language' && (
        <LanguageModal
          isOpen={true}
          onClose={() => setModalType(null)}
          record={activeRecord}
          onSave={async (vals) => {
            if (activeRecord) {
              await updateLangMutation.mutateAsync({ id: activeRecord.id, data: vals });
            } else {
              await addLangMutation.mutateAsync(vals);
            }
          }}
          isLoading={addLangMutation.isPending || updateLangMutation.isPending}
        />
      )}

      {modalType === 'skill' && (
        <SkillModal
          isOpen={true}
          onClose={() => setModalType(null)}
          record={activeRecord}
          onSave={async (vals) => {
            await addSkillMutation.mutateAsync(vals);
          }}
          isLoading={addSkillMutation.isPending}
        />
      )}
    </div>
  );
}
