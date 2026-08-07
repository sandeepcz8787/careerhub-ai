import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ExperienceLevel,
  SkillProficiency,
  LanguageProficiency
} from '@careerhub/shared';
import {
  updateProfileDetailsSchema,
  createEducationSchema,
  updateEducationSchema,
  createExperienceSchema,
  updateExperienceSchema,
  createProjectSchema,
  updateProjectSchema,
  createCertificateSchema,
  updateCertificateSchema,
  createAchievementSchema,
  updateAchievementSchema,
  createLanguageSchema,
  updateLanguageSchema,
  userSkillSchema
} from '@careerhub/shared';

import { Modal } from '@shared/components/ui/Modal';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';

// Utility to safely format Date to YYYY-MM-DD
function formatDateForInput(dateVal: any): string {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0] || '';
  } catch {
    return '';
  }
}

// Utility to convert YYYY-MM-DD input string back to ISO date string
function formatInputForSave(dateStr: string): string | undefined {
  if (!dateStr) return undefined;
  try {
    return new Date(dateStr).toISOString();
  } catch {
    return undefined;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Personal Details Form Modal
// ─────────────────────────────────────────────────────────────────────────────
interface PersonalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function PersonalDetailsModal({ isOpen, onClose, initialData, onSave, isLoading }: PersonalDetailsModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateProfileDetailsSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      headline: initialData?.headline || '',
      bio: initialData?.bio || '',
      phone: initialData?.phone || '',
      dob: formatDateForInput(initialData?.dob),
      gender: initialData?.gender || '',
      country: initialData?.country || '',
      state: initialData?.state || '',
      city: initialData?.city || '',
      timezone: initialData?.timezone || 'UTC',
      language: initialData?.language || 'en'
    }
  });

  const onSubmit = async (values: any) => {
    const formatted = {
      ...values,
      dob: formatInputForSave(values.dob)
    };
    await onSave(formatted);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Personal Information" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" isRequired errorText={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last Name" isRequired errorText={errors.lastName?.message} {...register('lastName')} />
        </div>

        <Input label="Headline" errorText={errors.headline?.message} placeholder="e.g. Lead Software Architect | Ex-Google" {...register('headline')} />

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-sm font-semibold text-[color:var(--text-secondary)]">About / Bio</label>
          <textarea
            className="w-full min-h-[100px] p-3 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            placeholder="Tell us about your professional story..."
            {...register('bio')}
          />
          {errors.bio?.message && <span className="text-xs text-error-500">{String(errors.bio.message)}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Phone Number" errorText={errors.phone?.message} {...register('phone')} />
          <Input label="Date of Birth" type="date" errorText={errors.dob?.message} {...register('dob')} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input label="City" errorText={errors.city?.message} {...register('city')} />
          <Input label="State/Region" errorText={errors.state?.message} {...register('state')} />
          <Input label="Country" errorText={errors.country?.message} {...register('country')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Gender</label>
            <select
              className="w-full p-2.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              {...register('gender')}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Primary Language</label>
            <Input errorText={errors.language?.message} {...register('language')} />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Save Details</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Career Details Form Modal
// ─────────────────────────────────────────────────────────────────────────────
interface CareerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function CareerDetailsModal({ isOpen, onClose, initialData, onSave, isLoading }: CareerDetailsModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      currentCompany: initialData?.currentCompany || '',
      currentDesignation: initialData?.currentDesignation || '',
      experienceLevel: initialData?.experienceLevel || ExperienceLevel.ENTRY,
      noticePeriod: initialData?.noticePeriod || '',
      expectedSalary: initialData?.expectedSalary || 0,
      currentSalary: initialData?.currentSalary || 0,
      preferredJobRole: initialData?.preferredJobRole || [],
      preferredJobType: initialData?.preferredJobType || [],
      preferredLocation: initialData?.preferredLocation || [],
      remotePreference: initialData?.remotePreference || 'remote',
      isOpenToWork: !!initialData?.isOpenToWork
    }
  });

  const preferredJobRoleValue = watch('preferredJobRole');
  const preferredLocationValue = watch('preferredLocation');

  const onSubmit = async (values: any) => {
    await onSave(values);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Career Information & Preferences" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Current Company" errorText={errors.currentCompany?.message} {...register('currentCompany')} />
          <Input label="Current Designation" errorText={errors.currentDesignation?.message} {...register('currentDesignation')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Experience Level</label>
            <select
              className="w-full p-2.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              {...register('experienceLevel')}
            >
              {Object.values(ExperienceLevel).map((lvl) => (
                <option key={lvl} value={lvl}>{lvl.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <Input label="Notice Period" placeholder="e.g. 30 days, Immediate" errorText={errors.noticePeriod?.message} {...register('noticePeriod')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Current Salary (Annual, USD/INR)" type="number" errorText={errors.currentSalary?.message} {...register('currentSalary', { valueAsNumber: true })} />
          <Input label="Expected Salary (Annual, USD/INR)" type="number" errorText={errors.expectedSalary?.message} {...register('expectedSalary', { valueAsNumber: true })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Remote Preference</label>
            <select
              className="w-full p-2.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              {...register('remotePreference')}
            >
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 justify-center pl-2 pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[color:var(--text-primary)] select-none">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 h-4 w-4"
                {...register('isOpenToWork')}
              />
              Open to Work (Display candidate banner)
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Input
            label="Preferred Job Roles (Comma separated)"
            placeholder="e.g. Frontend Engineer, Fullstack Developer"
            value={preferredJobRoleValue.join(', ')}
            onChange={(e) => {
              const array = e.target.value.split(',').map((x) => x.trim()).filter(Boolean);
              setValue('preferredJobRole', array);
            }}
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Preferred Job Locations (Comma separated)"
            placeholder="e.g. Bangalore, San Francisco, Remote"
            value={preferredLocationValue.join(', ')}
            onChange={(e) => {
              const array = e.target.value.split(',').map((x) => x.trim()).filter(Boolean);
              setValue('preferredLocation', array);
            }}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Save Preferences</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Education Form Modal (Supports Multiple)
// ─────────────────────────────────────────────────────────────────────────────
interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any; // null if adding
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function EducationModal({ isOpen, onClose, record, onSave, isLoading }: EducationModalProps) {
  const isEdit = !!record;
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(isEdit ? updateEducationSchema : createEducationSchema),
    defaultValues: {
      institution: record?.institution || '',
      degree: record?.degree || '',
      fieldOfStudy: record?.fieldOfStudy || '',
      grade: record?.grade || '',
      startDate: formatDateForInput(record?.startDate),
      endDate: formatDateForInput(record?.endDate),
      isCurrent: !!record?.isCurrent,
      activities: record?.activities || ''
    }
  });

  const onSubmit = async (values: any) => {
    const formatted = {
      ...values,
      startDate: formatInputForSave(values.startDate),
      endDate: values.isCurrent ? undefined : formatInputForSave(values.endDate)
    };
    await onSave(formatted);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Education' : 'Add Education'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="School / Institution" isRequired errorText={errors.institution?.message} {...register('institution')} />
        <Input label="Degree" isRequired errorText={errors.degree?.message} placeholder="e.g. Bachelor of Technology (B.Tech)" {...register('degree')} />
        <Input label="Field of Study" isRequired errorText={errors.fieldOfStudy?.message} placeholder="e.g. Computer Science" {...register('fieldOfStudy')} />
        <Input label="Grade / CGPA / Percentage" errorText={errors.grade?.message} placeholder="e.g. 9.2 CGPA or 85%" {...register('grade')} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Date" type="date" isRequired errorText={errors.startDate?.message} {...register('startDate')} />
          <Input label="End Date" type="date" errorText={errors.endDate?.message} {...register('endDate')} />
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-sm text-[color:var(--text-secondary)] select-none">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            {...register('isCurrent')}
          />
          Currently studying here
        </label>

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Activities & Achievements</label>
          <textarea
            className="w-full min-h-[80px] p-3 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            placeholder="e.g. Key projects, sports, societies, honors..."
            {...register('activities')}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{isEdit ? 'Update Record' : 'Add Record'}</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Experience Form Modal (Supports Multiple)
// ─────────────────────────────────────────────────────────────────────────────
interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function ExperienceModal({ isOpen, onClose, record, onSave, isLoading }: ExperienceModalProps) {
  const isEdit = !!record;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(isEdit ? updateExperienceSchema : createExperienceSchema),
    defaultValues: {
      companyName: record?.companyName || '',
      role: record?.role || '',
      location: record?.location || '',
      employmentType: record?.employmentType || 'full_time',
      startDate: formatDateForInput(record?.startDate),
      endDate: formatDateForInput(record?.endDate),
      isCurrent: !!record?.isCurrent,
      achievements: record?.achievements || [],
      skillsUsed: record?.skillsUsed || [],
      description: record?.description || ''
    }
  });

  const achievementsValue = watch('achievements');
  const skillsUsedValue = watch('skillsUsed');

  const onSubmit = async (values: any) => {
    const formatted = {
      ...values,
      startDate: formatInputForSave(values.startDate),
      endDate: values.isCurrent ? undefined : formatInputForSave(values.endDate)
    };
    await onSave(formatted);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Work Experience' : 'Add Work Experience'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Company Name" isRequired errorText={errors.companyName?.message} {...register('companyName')} />
          <Input label="Role" isRequired errorText={errors.role?.message} placeholder="e.g. Senior Frontend Developer" {...register('role')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Location (City, Country or Remote)" errorText={errors.location?.message} placeholder="e.g. San Francisco, CA" {...register('location')} />
          
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Employment Type</label>
            <select
              className="w-full p-2.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              {...register('employmentType')}
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Date" type="date" isRequired errorText={errors.startDate?.message} {...register('startDate')} />
          <Input label="End Date" type="date" errorText={errors.endDate?.message} {...register('endDate')} disabled={watch('isCurrent')} />
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-sm text-[color:var(--text-secondary)] select-none">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            {...register('isCurrent')}
          />
          I am currently working in this role
        </label>

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Job Description</label>
          <textarea
            className="w-full min-h-[100px] p-3 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            placeholder="Outline your primary duties and responsibilities..."
            {...register('description')}
          />
        </div>

        <Input
          label="Key Achievements (Comma separated)"
          placeholder="e.g. Delivered 40% speed optimization, Managed team of 5 devs"
          value={achievementsValue.join(', ')}
          onChange={(e) => {
            const list = e.target.value.split(',').map((x) => x.trim()).filter(Boolean);
            setValue('achievements', list);
          }}
        />

        <Input
          label="Skills Used (Comma separated)"
          placeholder="e.g. React, Node.js, Webpack, Redux"
          value={skillsUsedValue.join(', ')}
          onChange={(e) => {
            const list = e.target.value.split(',').map((x) => x.trim()).filter(Boolean);
            setValue('skillsUsed', list);
          }}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{isEdit ? 'Update Record' : 'Add Record'}</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Project Form Modal (Supports Unlimited)
// ─────────────────────────────────────────────────────────────────────────────
interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function ProjectModal({ isOpen, onClose, record, onSave, isLoading }: ProjectModalProps) {
  const isEdit = !!record;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(isEdit ? updateProjectSchema : createProjectSchema),
    defaultValues: {
      title: record?.title || '',
      description: record?.description || '',
      role: record?.role || '',
      techStack: record?.techStack || [],
      githubUrl: record?.githubUrl || '',
      liveUrl: record?.liveUrl || '',
      startDate: formatDateForInput(record?.startDate),
      endDate: formatDateForInput(record?.endDate),
      isCurrent: !!record?.isCurrent,
      isFeatured: !!record?.isFeatured
    }
  });

  const techStackValue = watch('techStack');

  const onSubmit = async (values: any) => {
    const formatted = {
      ...values,
      startDate: formatInputForSave(values.startDate),
      endDate: values.isCurrent ? undefined : formatInputForSave(values.endDate)
    };
    await onSave(formatted);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Project' : 'Add Project'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Project Title" isRequired errorText={errors.title?.message} {...register('title')} />
        <Input label="Your Role in Project" placeholder="e.g. Lead Frontend Engineer, Solo Builder" errorText={errors.role?.message} {...register('role')} />

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Description</label>
          <textarea
            className="w-full min-h-[100px] p-3 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            placeholder="Provide a detailed explanation of what this project accomplished..."
            {...register('description')}
          />
          {errors.description?.message && <span className="text-xs text-error-500">{String(errors.description.message)}</span>}
        </div>

        <Input
          label="Tech Stack (Comma separated)"
          placeholder="e.g. Vue.js, Firebase, Tailwind CSS"
          isRequired
          value={techStackValue.join(', ')}
          onChange={(e) => {
            const list = e.target.value.split(',').map((x) => x.trim()).filter(Boolean);
            setValue('techStack', list);
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Github URL" errorText={errors.githubUrl?.message} {...register('githubUrl')} />
          <Input label="Live Demo URL" errorText={errors.liveUrl?.message} {...register('liveUrl')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Date" type="date" isRequired errorText={errors.startDate?.message} {...register('startDate')} />
          <Input label="End Date" type="date" errorText={errors.endDate?.message} {...register('endDate')} disabled={watch('isCurrent')} />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-[color:var(--text-secondary)] select-none">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              {...register('isCurrent')}
            />
            Still working on this project
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-[color:var(--text-secondary)] select-none">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              {...register('isFeatured')}
            />
            Pin to Featured Projects
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{isEdit ? 'Update Record' : 'Add Record'}</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Certificate Form Modal
// ─────────────────────────────────────────────────────────────────────────────
interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function CertificateModal({ isOpen, onClose, record, onSave, isLoading }: CertificateModalProps) {
  const isEdit = !!record;
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(isEdit ? updateCertificateSchema : createCertificateSchema),
    defaultValues: {
      title: record?.title || '',
      issuer: record?.issuer || '',
      issueDate: formatDateForInput(record?.issueDate),
      expiryDate: formatDateForInput(record?.expiryDate),
      credentialId: record?.credentialId || '',
      credentialUrl: record?.credentialUrl || ''
    }
  });

  const onSubmit = async (values: any) => {
    const formatted = {
      ...values,
      issueDate: formatInputForSave(values.issueDate),
      expiryDate: formatInputForSave(values.expiryDate)
    };
    await onSave(formatted);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Certificate' : 'Add Certificate'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Certificate Name" isRequired errorText={errors.title?.message} {...register('title')} />
        <Input label="Issuing Organization" isRequired errorText={errors.issuer?.message} placeholder="e.g. AWS, Microsoft, Coursera" {...register('issuer')} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Issue Date" type="date" isRequired errorText={errors.issueDate?.message} {...register('issueDate')} />
          <Input label="Expiry Date (optional)" type="date" errorText={errors.expiryDate?.message} {...register('expiryDate')} />
        </div>

        <Input label="Credential ID" errorText={errors.credentialId?.message} {...register('credentialId')} />
        <Input label="Credential URL" errorText={errors.credentialUrl?.message} placeholder="https://..." {...register('credentialUrl')} />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{isEdit ? 'Update Certificate' : 'Add Certificate'}</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Achievement Form Modal
// ─────────────────────────────────────────────────────────────────────────────
interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function AchievementModal({ isOpen, onClose, record, onSave, isLoading }: AchievementModalProps) {
  const isEdit = !!record;
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(isEdit ? updateAchievementSchema : createAchievementSchema),
    defaultValues: {
      title: record?.title || '',
      issuer: record?.issuer || '',
      date: formatDateForInput(record?.date),
      description: record?.description || '',
      certificateUrl: record?.certificateUrl || ''
    }
  });

  const onSubmit = async (values: any) => {
    const formatted = {
      ...values,
      date: formatInputForSave(values.date)
    };
    await onSave(formatted);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Achievement / Award' : 'Add Achievement / Award'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Achievement Title" isRequired errorText={errors.title?.message} placeholder="e.g. Hackathon Winner, Employee of the Month" {...register('title')} />
        <Input label="Issuing Organization" isRequired errorText={errors.issuer?.message} {...register('issuer')} />
        <Input label="Date Received" type="date" isRequired errorText={errors.date?.message} {...register('date')} />

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Description</label>
          <textarea
            className="w-full min-h-[80px] p-3 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            placeholder="Briefly describe what this honor was awarded for..."
            {...register('description')}
          />
        </div>

        <Input label="Supporting Link / Doc URL" errorText={errors.certificateUrl?.message} placeholder="https://..." {...register('certificateUrl')} />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{isEdit ? 'Update Achievement' : 'Add Achievement'}</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Language Form Modal
// ─────────────────────────────────────────────────────────────────────────────
interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function LanguageModal({ isOpen, onClose, record, onSave, isLoading }: LanguageModalProps) {
  const isEdit = !!record;
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(isEdit ? updateLanguageSchema : createLanguageSchema),
    defaultValues: {
      language: record?.language || '',
      proficiency: record?.proficiency || LanguageProficiency.PROFESSIONAL_WORKING
    }
  });

  const onSubmit = async (values: any) => {
    await onSave(values);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Language' : 'Add Language'} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Language Name" isRequired errorText={errors.language?.message} placeholder="e.g. English, Spanish, Japanese" {...register('language')} />

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Proficiency Level</label>
          <select
            className="w-full p-2.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            {...register('proficiency')}
          >
            <option value={LanguageProficiency.ELEMENTARY}>Elementary</option>
            <option value={LanguageProficiency.LIMITED_WORKING}>Limited Working</option>
            <option value={LanguageProficiency.PROFESSIONAL_WORKING}>Professional Working</option>
            <option value={LanguageProficiency.FULL_PROFESSIONAL}>Full Professional</option>
            <option value={LanguageProficiency.NATIVE_BILINGUAL}>Native / Bilingual</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{isEdit ? 'Save Language' : 'Add Language'}</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. Technical Skill Form Modal
// ─────────────────────────────────────────────────────────────────────────────
interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any; // null if adding
  onSave: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function SkillModal({ isOpen, onClose, record, onSave, isLoading }: SkillModalProps) {
  const isEdit = !!record;
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(userSkillSchema),
    defaultValues: {
      name: record?.name || '',
      category: record?.category || 'Programming Languages',
      proficiency: record?.proficiency || SkillProficiency.INTERMEDIATE,
      yearsOfExperience: record?.yearsOfExperience || 0
    }
  });

  const onSubmit = async (values: any) => {
    await onSave(values);
    onClose();
  };

  const categories = [
    'Programming Languages',
    'Frontend',
    'Backend',
    'Database',
    'Cloud',
    'DevOps',
    'Testing',
    'AI',
    'Mobile',
    'UI/UX',
    'Tools'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Skill Details' : 'Add Technical Skill'} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Skill Name" isRequired errorText={errors.name?.message} placeholder="e.g. React, Docker, Python" disabled={isEdit} {...register('name')} />

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Category</label>
          <select
            className="w-full p-2.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            {...register('category')}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Proficiency Level</label>
          <select
            className="w-full p-2.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            {...register('proficiency')}
          >
            <option value={SkillProficiency.BEGINNER}>Beginner</option>
            <option value={SkillProficiency.INTERMEDIATE}>Intermediate</option>
            <option value={SkillProficiency.ADVANCED}>Advanced</option>
            <option value={SkillProficiency.EXPERT}>Expert</option>
          </select>
        </div>

        <Input label="Years of Experience" type="number" isRequired errorText={errors.yearsOfExperience?.message} {...register('yearsOfExperience', { valueAsNumber: true })} />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Save Skill</Button>
        </div>
      </form>
    </Modal>
  );
}
