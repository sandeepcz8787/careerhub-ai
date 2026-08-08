import { Resume, ResumeVersion, Profile, User, ResumeTemplate } from '../models';
import { ProfileService } from './profile.service';
import { NotFoundError } from '../errors/NotFoundError';
import { AuthError } from '../errors/AuthError';
import { ValidationError } from '../errors/ValidationError';
import mongoose from 'mongoose';

export class ResumeService {
  /**
   * Get all active resumes for a user
   */
  static async getUserResumes(userId: string) {
    return Resume.find({ userId, status: 'active' }).sort({ updatedAt: -1 }).populate('templateId');
  }

  /**
   * Get resume by ID with ownership check
   */
  static async getResumeById(userId: string, resumeId: string) {
    const resume = await Resume.findOne({ _id: resumeId, userId, status: 'active' }).populate('templateId');
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }
    return resume;
  }

  /**
   * Helper to slugify text
   */
  static slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Generate initial resume sections using existing Career Profile data
   */
  static async buildInitialSections(userId: string, selectedSectionTypes: string[]) {
    const consolidated = await ProfileService.getConsolidatedProfile(userId);
    const sections: any[] = [];
    let order = 0;

    const addSection = (type: string, name: string, content: any) => {
      if (selectedSectionTypes.includes(type)) {
        sections.push({
          id: new mongoose.Types.ObjectId().toString(),
          name,
          type,
          content,
          order: order++
        });
      }
    };

    // 1. Personal Info
    const prof = consolidated.profile as any;
    const usr = consolidated.user as any;
    const personalInfoContent = {
      firstName: prof.firstName || usr.profile?.firstName || '',
      lastName: prof.lastName || usr.profile?.lastName || '',
      email: usr.email || '',
      phone: prof.phone || usr.phone || '',
      city: prof.city || '',
      state: prof.state || '',
      country: prof.country || '',
      linkedin: prof.socialLinks?.linkedin || prof.linkedin || '',
      github: prof.socialLinks?.github || prof.github || '',
      website: prof.socialLinks?.portfolio || prof.website || ''
    };
    addSection('personal_info', 'Personal Information', personalInfoContent);

    // 2. Professional Summary
    addSection('summary', 'Professional Summary', {
      text: consolidated.profile.bio || consolidated.user.profile.bio || ''
    });

    // 3. Career Objective
    addSection('objective', 'Career Objective', {
      text: consolidated.profile.headline || consolidated.user.profile.headline || ''
    });

    // 4. Education
    const educationList = (consolidated.education || []).map((edu: any) => ({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      grade: edu.grade || '',
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
      isCurrent: edu.isCurrent || false,
      activities: edu.activities || ''
    }));
    addSection('education', 'Education', { items: educationList });

    // 5. Experience
    const experienceList = (consolidated.experience || []).map((exp: any) => ({
      company: exp.companyName,
      jobTitle: exp.role,
      location: exp.location || '',
      employmentType: exp.employmentType || 'full_time',
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      isCurrent: exp.isCurrent || false,
      description: exp.description || '',
      achievements: exp.achievements || [],
      technologies: exp.skillsUsed || []
    }));
    addSection('experience', 'Work Experience', { items: experienceList });

    // 6. Projects
    const projectList = (consolidated.projects || []).map((proj: any) => ({
      projectName: proj.title,
      description: proj.description,
      role: proj.role || '',
      technologies: proj.techStack || [],
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      startDate: proj.startDate ? new Date(proj.startDate).toISOString().split('T')[0] : '',
      endDate: proj.endDate ? new Date(proj.endDate).toISOString().split('T')[0] : '',
      isCurrent: proj.isCurrent || false,
      isFeatured: proj.isFeatured || false
    }));
    addSection('projects', 'Key Projects', { items: projectList });

    // 7. Technical Skills (Grouped by Category)
    const skillsGrouped: Record<string, string[]> = {};
    (consolidated.profile.skills || []).forEach((skill: any) => {
      const cat = skill.category || 'General';
      if (!skillsGrouped[cat]) skillsGrouped[cat] = [];
      skillsGrouped[cat].push(skill.name);
    });
    const skillsList = Object.entries(skillsGrouped).map(([category, names]) => ({
      category,
      skills: names
    }));
    addSection('skills', 'Technical Skills', { items: skillsList });

    // 8. Soft Skills
    addSection('soft_skills', 'Soft Skills', {
      items: consolidated.profile.softSkills || []
    });

    // 9. Certifications
    const certList = (consolidated.certificates || []).map((cert: any) => ({
      certificateName: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
      expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || ''
    }));
    addSection('certifications', 'Certifications', { items: certList });

    // 10. Achievements
    const achList = (consolidated.achievements || []).map((ach: any) => ({
      title: ach.title,
      issuer: ach.issuer || '',
      date: ach.date ? new Date(ach.date).toISOString().split('T')[0] : '',
      description: ach.description || ''
    }));
    addSection('achievements', 'Achievements', { items: achList });

    // 11. Languages
    const langList = (consolidated.languages || []).map((lang: any) => ({
      language: lang.language,
      proficiency: lang.proficiency
    }));
    addSection('languages', 'Languages', { items: langList });

    // 12. Social Links
    const socialLinks = consolidated.user.profile.socialLinks || [];
    const socialMap: Record<string, string> = {};
    socialLinks.forEach((link: any) => {
      socialMap[link.platform] = link.url;
    });
    addSection('social_links', 'Social Links', socialMap);

    return sections;
  }

  /**
   * Create a new resume
   */
  static async createResume(userId: string, data: any) {
    const defaultCustomization = {
      font: 'Inter',
      fontSize: '10pt',
      headingSize: '14pt',
      lineHeight: '1.5',
      margins: '0.75in',
      spacing: '0.5rem',
      accentColor: '#0284c7',
      pageSize: 'A4'
    };

    let templateId = data.templateId;
    if (!templateId) {
      const defaultTemplate = await ResumeTemplate.findOne({ slug: 'classic-ats' });
      if (defaultTemplate) {
        templateId = defaultTemplate._id.toString();
      }
    }

    let initialSections = data.sections || [];
    if (data.importFromProfile && initialSections.length === 0) {
      const selectedSectionTypes = data.selectedSections || [
        'personal_info',
        'summary',
        'education',
        'experience',
        'skills',
        'projects'
      ];
      initialSections = await this.buildInitialSections(userId, selectedSectionTypes);
    }

    const count = await Resume.countDocuments({ userId, status: 'active' });
    const isPrimary = count === 0 ? true : !!data.isPrimary;

    if (isPrimary) {
      await Resume.updateMany({ userId }, { $set: { isPrimary: false } });
    }

    // Generate unique slug
    const baseSlug = this.slugify(data.title || 'untitled-resume');
    const slugSalt = Math.random().toString(36).substring(2, 7);
    const slug = `${baseSlug}-${slugSalt}`;

    const resume = await Resume.create({
      userId,
      title: data.title || 'Untitled Resume',
      templateId,
      sections: initialSections,
      customization: data.customization || defaultCustomization,
      privacy: data.privacy || 'private',
      isPrimary,
      slug,
      status: 'active',
      downloadCount: 0
    });

    if (isPrimary) {
      await Profile.updateOne({ userId }, { $set: { resumeReference: resume._id } });
    }

    // Save initial version snapshot
    await this.createResumeVersion(userId, resume._id.toString(), 'Initial creation');

    return resume;
  }

  /**
   * Update resume details with debounce saving simulation
   */
  static async updateResume(userId: string, resumeId: string, data: any) {
    const resume = await Resume.findOne({ _id: resumeId, userId, status: 'active' });
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }

    if (data.title !== undefined) resume.title = data.title;
    if (data.templateId !== undefined) resume.templateId = data.templateId;
    if (data.sections !== undefined) resume.sections = data.sections;
    if (data.customization !== undefined) resume.customization = data.customization;
    if (data.privacy !== undefined) resume.privacy = data.privacy;
    if (data.atsScore !== undefined) resume.atsScore = data.atsScore;

    if (data.isPrimary === true && !resume.isPrimary) {
      await Resume.updateMany({ userId }, { $set: { isPrimary: false } });
      resume.isPrimary = true;
      await Profile.updateOne({ userId }, { $set: { resumeReference: resume._id } });
    }

    await resume.save();

    // Auto-create snapshot history on significant structural updates
    if (data.sections !== undefined) {
      const lastVersion = await ResumeVersion.findOne({ resumeId }).sort({ versionNumber: -1 });
      const versionTimeLimit = 5 * 60 * 1000; // Snapshot at most every 5 minutes
      if (!lastVersion || Date.now() - new Date(lastVersion.createdAt).getTime() > versionTimeLimit) {
        await this.createResumeVersion(userId, resumeId, 'Auto-saved changes');
      }
    }

    return resume;
  }

  /**
   * Set primary/default resume
   */
  static async setDefaultResume(userId: string, resumeId: string) {
    const resume = await Resume.findOne({ _id: resumeId, userId, status: 'active' });
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }

    await Resume.updateMany({ userId }, { $set: { isPrimary: false } });
    resume.isPrimary = true;
    await resume.save();

    await Profile.updateOne({ userId }, { $set: { resumeReference: resume._id } });
    return resume;
  }

  /**
   * Duplicate a resume (clones independent content)
   */
  static async duplicateResume(userId: string, resumeId: string) {
    const original = await Resume.findOne({ _id: resumeId, userId, status: 'active' });
    if (!original) {
      throw new NotFoundError('Original resume not found');
    }

    const baseSlug = this.slugify(`${original.title}-copy`);
    const slugSalt = Math.random().toString(36).substring(2, 7);
    const slug = `${baseSlug}-${slugSalt}`;

    const duplicate = await Resume.create({
      userId,
      title: `${original.title} (Copy)`,
      templateId: original.templateId,
      sections: original.sections,
      customization: original.customization,
      privacy: 'private',
      isPrimary: false,
      slug,
      status: 'active',
      downloadCount: 0
    });

    await this.createResumeVersion(userId, duplicate._id.toString(), 'Initial duplication');

    return duplicate;
  }

  /**
   * Delete resume
   */
  static async deleteResume(userId: string, resumeId: string) {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }

    resume.status = 'archived';
    await resume.save();

    // If we deleted the primary resume, make the next updated active resume primary
    if (resume.isPrimary) {
      const nextPrimary = await Resume.findOne({ userId, status: 'active' }).sort({ updatedAt: -1 });
      if (nextPrimary) {
        nextPrimary.isPrimary = true;
        await nextPrimary.save();
        await Profile.updateOne({ userId }, { $set: { resumeReference: nextPrimary._id } });
      } else {
        await Profile.updateOne({ userId }, { $unset: { resumeReference: 1 } });
      }
    }

    return { success: true };
  }

  /**
   * Toggle publish state
   */
  static async publishResume(userId: string, resumeId: string, customSlug?: string, privacy: 'public' | 'unlisted' = 'public') {
    const resume = await Resume.findOne({ _id: resumeId, userId, status: 'active' });
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }

    let slug = resume.slug;
    if (customSlug) {
      const cleanSlug = this.slugify(customSlug);
      // Check duplicate slug
      const existing = await Resume.findOne({ slug: cleanSlug, _id: { $ne: resume._id } });
      if (existing) {
        throw new ValidationError('Custom share slug already exists. Please choose a different one.');
      }
      slug = cleanSlug;
    } else if (!slug) {
      const baseSlug = this.slugify(resume.title);
      slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const user = await User.findById(userId);
    const username = this.slugify(`${user?.profile.firstName}-${user?.profile.lastName}`);
    const publicShareLink = `/resume/public/${username}/${slug}`;

    resume.privacy = privacy;
    resume.slug = slug;
    resume.publicShareLink = publicShareLink;
    await resume.save();

    return resume;
  }

  /**
   * Unpublish resume
   */
  static async unpublishResume(userId: string, resumeId: string) {
    const resume = await Resume.findOne({ _id: resumeId, userId, status: 'active' });
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }

    resume.privacy = 'private';
    resume.publicShareLink = undefined;
    await resume.save();

    return resume;
  }

  /**
   * Fetch public resume mapping by username and slug
   */
  static async getPublicResume(username: string, resumeSlug: string) {
    const resume = await Resume.findOne({ slug: resumeSlug, status: 'active' });
    if (!resume || resume.privacy === 'private') {
      throw new NotFoundError('Resume not found or is private');
    }

    // Load owner user profile
    const owner = await User.findById(resume.userId);
    if (!owner) {
      throw new NotFoundError('Resume owner user not found');
    }

    const ownerNameSlug = this.slugify(`${owner.profile.firstName}-${owner.profile.lastName}`);
    if (ownerNameSlug !== username) {
      throw new NotFoundError('Resume link invalid');
    }

    // Mask sensitive info for public viewing
    const publicSections = resume.sections.map((section: any) => {
      if (section.type === 'personal_info') {
        const maskedContent = { ...section.content };
        delete maskedContent.phone;
        delete maskedContent.dob;
        // Keep name, location, and links
        return {
          ...section,
          content: maskedContent
        };
      }
      return section;
    });

    return {
      title: resume.title,
      templateId: resume.templateId,
      customization: resume.customization,
      sections: publicSections,
      updatedAt: resume.updatedAt,
      owner: {
        firstName: owner.profile.firstName,
        lastName: owner.profile.lastName,
        headline: owner.profile.headline,
        avatarUrl: owner.profile.avatarUrl
      }
    };
  }

  /**
   * Snapshot a historical version
   */
  static async createResumeVersion(userId: string, resumeId: string, createdReason?: string) {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }

    const lastVer = await ResumeVersion.findOne({ resumeId }).sort({ versionNumber: -1 });
    const nextVerNumber = lastVer ? lastVer.versionNumber + 1 : 1;

    return ResumeVersion.create({
      resumeId: resume._id,
      versionNumber: nextVerNumber,
      title: resume.title,
      templateId: resume.templateId,
      sections: resume.sections,
      customization: resume.customization,
      createdReason: createdReason || `Version ${nextVerNumber}`
    });
  }

  /**
   * Get historical versions list
   */
  static async getResumeVersions(userId: string, resumeId: string) {
    // Check ownership
    await this.getResumeById(userId, resumeId);
    return ResumeVersion.find({ resumeId }).sort({ versionNumber: -1 });
  }

  /**
   * Restore a historical version
   */
  static async restoreResumeVersion(userId: string, resumeId: string, versionId: string) {
    const resume = await Resume.findOne({ _id: resumeId, userId, status: 'active' });
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }

    const version = await ResumeVersion.findOne({ _id: versionId, resumeId });
    if (!version) {
      throw new NotFoundError('Version snapshot not found');
    }

    // Save a backup of the current state first
    await this.createResumeVersion(userId, resumeId, `Backup before restoring v${version.versionNumber}`);

    resume.title = version.title;
    resume.templateId = version.templateId;
    resume.sections = version.sections;
    resume.customization = version.customization;
    await resume.save();

    return resume;
  }
}
