import mongoose from 'mongoose';
import {
  User,
  Profile,
  Education,
  Experience,
  Project,
  Certificate,
  Achievement,
  Language,
  Resume,
  NotificationPreferences
} from '../models';
import { StorageService, FileUploadPayload } from './storage.service';
import { NotFoundError } from '../errors/NotFoundError';
import { ExperienceLevel, SkillProficiency } from '@careerhub/shared';

export class ProfileService {
  /**
   * Fetch consolidate profile data for a user
   */
  static async getConsolidatedProfile(userId: string) {
    const user = await User.findById(userId).populate('createdBy updatedBy');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    let profile = await Profile.findOne({ userId });
    if (!profile) {
      // Create empty profile if not exists
      profile = await Profile.create({
        userId,
        experienceLevel: ExperienceLevel.ENTRY,
        isOpenToWork: false,
        skills: [],
        softSkills: [],
        portfolioTheme: 'modern',
        portfolioVisibility: 'public',
        privacySettings: {
          profileVisibility: 'public',
          searchVisibility: true,
          emailVisibility: true,
          phoneVisibility: false
        }
      });
    }

    const education = await Education.find({ userId }).sort({ startDate: -1 });
    const experience = await Experience.find({ userId }).sort({ startDate: -1 });
    const projects = await Project.find({ userId }).sort({ startDate: -1 });
    const certificates = await Certificate.find({ userId }).sort({ issueDate: -1 });
    const achievements = await Achievement.find({ userId }).sort({ date: -1 });
    const languages = await Language.find({ userId });
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    const notifications = await NotificationPreferences.findOne({ userId });

    return {
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
        timezone: user.timezone,
        language: user.language,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: user.profile,
        oauthProviders: user.oauthProviders
      },
      profile: {
        id: profile._id,
        userId: profile.userId,
        headline: profile.headline || user.profile.headline || '',
        bio: profile.bio || user.profile.bio || '',
        firstName: profile.firstName || user.profile.firstName || '',
        lastName: profile.lastName || user.profile.lastName || '',
        dob: profile.dob,
        gender: profile.gender,
        phone: profile.phone || user.phone || '',
        country: profile.country || '',
        state: profile.state || '',
        city: profile.city || '',
        timezone: profile.timezone || user.timezone || 'UTC',
        language: profile.language || user.language || 'en',
        coverImageUrl: profile.coverImageUrl || '',
        coverImagePublicId: profile.coverImagePublicId || '',
        currentCompany: profile.currentCompany || '',
        currentDesignation: profile.currentDesignation || '',
        experienceLevel: profile.experienceLevel,
        noticePeriod: profile.noticePeriod || '',
        expectedSalary: profile.expectedSalary,
        currentSalary: profile.currentSalary,
        preferredJobRole: profile.preferredJobRole || [],
        preferredJobType: profile.preferredJobType || [],
        preferredLocation: profile.preferredLocation || [],
        remotePreference: profile.remotePreference || 'remote',
        isOpenToWork: profile.isOpenToWork || false,
        skills: profile.skills || [],
        softSkills: profile.softSkills || [],
        portfolioTheme: profile.portfolioTheme || 'modern',
        portfolioVisibility: profile.portfolioVisibility || 'public',
        featuredProjects: profile.featuredProjects || [],
        privacySettings: profile.privacySettings || {
          profileVisibility: 'public',
          searchVisibility: true,
          emailVisibility: true,
          phoneVisibility: false
        }
      },
      education,
      experience,
      projects,
      certificates,
      achievements,
      languages,
      resumes,
      notificationPreferences: notifications
    };
  }

  /**
   * Update core profile and sync back key fields to User model
   */
  static async updateProfile(userId: string, data: any) {
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
    }

    // List of keys to update directly on profile
    const profileKeys = [
      'headline',
      'bio',
      'firstName',
      'lastName',
      'dob',
      'gender',
      'phone',
      'country',
      'state',
      'city',
      'timezone',
      'language',
      'currentCompany',
      'currentDesignation',
      'experienceLevel',
      'noticePeriod',
      'expectedSalary',
      'currentSalary',
      'preferredJobRole',
      'preferredJobType',
      'preferredLocation',
      'remotePreference',
      'isOpenToWork',
      'skills',
      'softSkills',
      'portfolioTheme',
      'portfolioVisibility',
      'featuredProjects',
      'privacySettings'
    ];

    profileKeys.forEach((key) => {
      if (data[key] !== undefined) {
        (profile as any)[key] = data[key];
      }
    });

    await profile.save();

    // Sync to User's profile subdocument
    const user = await User.findById(userId);
    if (user) {
      if (data.firstName) { user.profile.firstName = data.firstName; }
      if (data.lastName) { user.profile.lastName = data.lastName; }
      if (data.bio) { user.profile.bio = data.bio; }
      if (data.headline) { user.profile.headline = data.headline; }
      if (data.phone) { user.phone = data.phone; }
      if (data.timezone) { user.timezone = data.timezone; }
      if (data.language) { user.language = data.language; }
      if (data.city || data.country) {
        user.profile.location = `${data.city || profile.city || ''}, ${data.country || profile.country || ''}`.trim().replace(/^,\s*|,\s*$/, '');
      }
      
      // Update display name
      user.profile.displayName = `${user.profile.firstName} ${user.profile.lastName}`.trim();
      await user.save();
    }

    return this.getConsolidatedProfile(userId);
  }

  /**
   * Upload profile avatar
   */
  static async uploadAvatar(userId: string, filePayload: FileUploadPayload) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Delete existing avatar if exists
    if (user.profile.avatarPublicId) {
      try {
        await StorageService.deleteFile(user.profile.avatarPublicId);
      } catch {
        // Suppress deletion errors
      }
    }

    // Upload new image
    const uploadRes = await StorageService.uploadImage(filePayload, 'avatars');
    
    // Save to user
    user.profile.avatarUrl = uploadRes.url;
    user.profile.avatarPublicId = uploadRes.publicId;
    await user.save();

    // Sync to profile cover/avatar (if we want, or keep User model as authority for avatar)
    await Profile.updateOne(
      { userId },
      { $set: { avatarUrl: uploadRes.url } }
    );

    return { avatarUrl: uploadRes.url };
  }

  /**
   * Upload cover image
   */
  static async uploadCoverImage(userId: string, filePayload: FileUploadPayload) {
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    // Delete existing cover if exists
    if (profile.coverImagePublicId) {
      try {
        await StorageService.deleteFile(profile.coverImagePublicId);
      } catch {
        // Suppress errors
      }
    }

    const uploadRes = await StorageService.uploadImage(filePayload, 'covers');
    profile.coverImageUrl = uploadRes.url;
    profile.coverImagePublicId = uploadRes.publicId;
    await profile.save();

    return { coverImageUrl: uploadRes.url };
  }

  /**
   * Upload resume document
   */
  static async uploadResume(userId: string, filePayload: FileUploadPayload, title: string, isPrimary = false) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const uploadRes = await StorageService.uploadDocument(filePayload, 'resumes');

    // If isPrimary is true, we reset other resumes' isPrimary to false
    if (isPrimary) {
      await Resume.updateMany({ userId }, { $set: { isPrimary: false } });
    }

    // Check if user has no resumes yet, make this one primary automatically
    const count = await Resume.countDocuments({ userId });
    const primaryStatus = count === 0 ? true : isPrimary;

    const resume = await Resume.create({
      userId,
      title: title || filePayload.originalName.replace(/\.[^/.]+$/, ''),
      fileUrl: uploadRes.url,
      isPrimary: primaryStatus,
      status: 'active',
      sections: [],
      downloadCount: 0
    });

    if (primaryStatus) {
      await Profile.updateOne({ userId }, { $set: { resumeReference: resume._id } });
    }

    return resume;
  }

  /**
   * Set primary resume
   */
  static async setPrimaryResume(userId: string, resumeId: string) {
    const resume = await Resume.findOne({ _id: resumeId, userId });
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
   * Delete resume
   */
  static async deleteResume(userId: string, resumeId: string) {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }

    await resume.deleteOne();

    // If we deleted the primary resume, make another resume primary (if any exists)
    if (resume.isPrimary) {
      const nextResume = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
      if (nextResume) {
        nextResume.isPrimary = true;
        await nextResume.save();
        await Profile.updateOne({ userId }, { $set: { resumeReference: nextResume._id } });
      } else {
        await Profile.updateOne({ userId }, { $unset: { resumeReference: 1 } });
      }
    }

    return { success: true };
  }

  /**
   * Calculate Profile Completion Score & Suggestions
   */
  static async calculateCompletion(userId: string) {
    const profile = await Profile.findOne({ userId });
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const eduCount = await Education.countDocuments({ userId });
    const expCount = await Experience.countDocuments({ userId });
    const projCount = await Project.countDocuments({ userId });
    const certCount = await Certificate.countDocuments({ userId });
    const achCount = await Achievement.countDocuments({ userId });
    const langCount = await Language.countDocuments({ userId });

    let score = 0;
    const missingSections: string[] = [];
    const suggestions: Array<{ section: string; message: string; points: number }> = [];

    // 1. Personal Information (Max 20 pts)
    const hasFirstName = !!(user.profile.firstName || (profile && profile.firstName));
    const hasLastName = !!(user.profile.lastName || (profile && profile.lastName));
    const hasAvatar = !!user.profile.avatarUrl;
    const hasHeadline = !!(profile && profile.headline);
    const hasBio = !!(profile && profile.bio);
    const hasLocation = !!(profile && (profile.city || profile.country));

    let personalScore = 0;
    if (hasFirstName) personalScore += 3;
    if (hasLastName) personalScore += 3;
    if (hasAvatar) personalScore += 4;
    if (hasHeadline) personalScore += 4;
    if (hasBio) personalScore += 3;
    if (hasLocation) personalScore += 3;

    score += personalScore;

    if (!hasAvatar) {
      suggestions.push({ section: 'Personal Information', message: 'Upload a professional profile picture to increase visibility', points: 4 });
    }
    if (!hasHeadline) {
      suggestions.push({ section: 'Personal Information', message: 'Add a headline (e.g. "Junior Frontend Developer") to summarize your career', points: 4 });
    }
    if (!hasBio) {
      suggestions.push({ section: 'Personal Information', message: 'Write a brief professional summary/bio detailing your expertise', points: 3 });
    }
    if (!hasLocation) {
      suggestions.push({ section: 'Personal Information', message: 'Specify your city and country for local job targeting', points: 3 });
    }

    // 2. Career Information (Max 15 pts)
    let careerScore = 0;
    const hasNoticePeriod = !!(profile && profile.noticePeriod);
    const hasExpectedSalary = !!(profile && profile.expectedSalary);
    const hasPreferredJob = !!(profile && profile.preferredJobRole && profile.preferredJobRole.length > 0);
    const isOpenToWork = !!(profile && profile.isOpenToWork);

    if (hasNoticePeriod) careerScore += 4;
    if (hasExpectedSalary) careerScore += 4;
    if (hasPreferredJob) careerScore += 4;
    if (isOpenToWork) careerScore += 3;

    score += careerScore;

    if (!hasNoticePeriod) {
      suggestions.push({ section: 'Career Information', message: 'Add notice period preferences so recruiters know your availability', points: 4 });
    }
    if (!hasPreferredJob) {
      suggestions.push({ section: 'Career Information', message: 'Specify preferred job roles (e.g. Node Engineer) for AI matching', points: 4 });
    }
    if (!isOpenToWork) {
      suggestions.push({ section: 'Career Information', message: 'Toggle "Open to work" to appear in active recruiter candidate lists', points: 3 });
    }

    // 3. Education (Max 10 pts)
    if (eduCount > 0) {
      score += 10;
    } else {
      missingSections.push('Education');
      suggestions.push({ section: 'Education', message: 'Add at least one educational degree or certification', points: 10 });
    }

    // 4. Work Experience (Max 15 pts)
    if (expCount > 0) {
      score += 15;
    } else {
      missingSections.push('Work Experience');
      suggestions.push({ section: 'Work Experience', message: 'List your past and current professional roles', points: 15 });
    }

    // 5. Projects (Max 10 pts)
    if (projCount > 0) {
      score += 10;
    } else {
      missingSections.push('Projects');
      suggestions.push({ section: 'Projects', message: 'Add a project demonstrating your skills in action with live URL/Github link', points: 10 });
    }

    // 6. Technical Skills (Max 10 pts)
    const skillsCount = profile ? (profile.skills || []).length : 0;
    if (skillsCount >= 3) {
      score += 10;
    } else {
      const remainingPoints = 10 - (skillsCount * 3);
      suggestions.push({ section: 'Technical Skills', message: `Add at least 3 skills to demonstrate your capabilities (current: ${skillsCount}/3)`, points: remainingPoints > 0 ? remainingPoints : 1 });
      score += Math.min(10, skillsCount * 3);
    }

    // 7. Soft Skills (Max 5 pts)
    const softCount = profile ? (profile.softSkills || []).length : 0;
    if (softCount >= 2) {
      score += 5;
    } else {
      suggestions.push({ section: 'Soft Skills', message: `Add at least 2 soft skills (current: ${softCount}/2)`, points: 5 - (softCount * 2) });
      score += Math.min(5, softCount * 2);
    }

    // 8. Certificates (Max 5 pts)
    if (certCount > 0) {
      score += 5;
    } else {
      missingSections.push('Certificates');
      suggestions.push({ section: 'Certificates', message: 'List industry-recognized certs (e.g. AWS Certified, Udemy)', points: 5 });
    }

    // 9. Achievements (Max 5 pts)
    if (achCount > 0) {
      score += 5;
    } else {
      suggestions.push({ section: 'Achievements', message: 'Detail key career achievements or awards', points: 5 });
    }

    // 10. Languages (Max 5 pts)
    if (langCount > 0) {
      score += 5;
    } else {
      suggestions.push({ section: 'Languages', message: 'Specify the languages you speak to matching global workspaces', points: 5 });
    }

    // Update user profile completion state
    if (user.profileCompletion !== score) {
      user.profileCompletion = score;
      await user.save();
    }

    return {
      completionPercentage: score,
      missingSections,
      suggestions: suggestions.sort((a, b) => b.points - a.points)
    };
  }

  /**
   * Recruiter Search Profiles
   */
  static async searchProfiles(
    filters: {
      skills?: string;
      experienceLevel?: string;
      location?: string;
      availability?: string;
      keywords?: string;
    },
    pagination: {
      page: number;
      limit: number;
    }
  ) {
    const query: any = {};

    if (filters.skills) {
      // filters.skills can be a comma-separated string
      const skillsArray = filters.skills.split(',').map((s) => s.trim());
      query['skills.name'] = { $in: skillsArray.map((s) => new RegExp(s, 'i')) };
    }

    if (filters.experienceLevel) {
      query.experienceLevel = filters.experienceLevel;
    }

    if (filters.location) {
      query.$or = [
        { city: new RegExp(filters.location, 'i') },
        { country: new RegExp(filters.location, 'i') },
        { state: new RegExp(filters.location, 'i') }
      ];
    }

    if (filters.availability === 'open_to_work') {
      query.isOpenToWork = true;
    }

    if (filters.keywords) {
      const keywordRegex = new RegExp(filters.keywords, 'i');
      const textMatch = [
        { headline: keywordRegex },
        { bio: keywordRegex },
        { currentDesignation: keywordRegex },
        { currentCompany: keywordRegex },
        { firstName: keywordRegex },
        { lastName: keywordRegex }
      ];
      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          { $or: textMatch }
        ];
        delete query.$or;
      } else {
        query.$or = textMatch;
      }
    }

    // Pagination
    const skip = (pagination.page - 1) * pagination.limit;
    const limit = pagination.limit;

    const total = await Profile.countDocuments(query);
    const profiles = await Profile.find(query)
      .skip(skip)
      .limit(limit)
      .populate('userId');

    // Consolidated summaries of searched profiles
    const results = await Promise.all(
      profiles.map(async (p) => {
        const userId = p.userId ? (p.userId as any)._id : null;
        if (!userId) return null;

        const edu = await Education.find({ userId }).limit(2);
        const exp = await Experience.find({ userId }).limit(2);
        const cert = await Certificate.find({ userId }).limit(2);

        return {
          profile: p,
          user: p.userId,
          education: edu,
          experience: exp,
          certificates: cert
        };
      })
    );

    return {
      total,
      page: pagination.page,
      limit: pagination.limit,
      results: results.filter(Boolean)
    };
  }

  /**
   * Export all user profile data as JSON
   */
  static async exportProfileData(userId: string) {
    const data = await this.getConsolidatedProfile(userId);
    return data;
  }

  /**
   * Soft delete/deactivate user account
   */
  static async deactivateAccount(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.status = 'deactivated' as any; // Cast status
    await user.save();

    // Revoke all sessions
    const { Session } = await import('../models/Session.model');
    await Session.revokeAllForUser(userId);

    return { success: true };
  }
}
