import type { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service';
import {
  Education,
  Experience,
  Project,
  Certificate,
  Achievement,
  Language,
  Profile
} from '../models';
import { NotFoundError } from '../errors/NotFoundError';
import { AuthError } from '../errors/AuthError';
import { FileUploadPayload } from '../services/storage.service';

/**
 * Helper to decode base64 file payloads (images or pdfs)
 */
function parseBase64File(base64Data: string, defaultName = 'file'): FileUploadPayload {
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (matches && matches[1] && matches[2]) {
    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = mimeType.split('/')[1] || '';
    return {
      buffer,
      originalName: `${defaultName}.${ext}`,
      mimeType
    };
  }
  
  const buffer = Buffer.from(base64Data, 'base64');
  return {
    buffer,
    originalName: defaultName,
    mimeType: 'application/octet-stream'
  };
}

export class ProfileController {
  /**
   * Get consolidated user profile
   */
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw AuthError.tokenMissing();
      }

      const consolidated = await ProfileService.getConsolidatedProfile(userId.toString());
      return res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: consolidated
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update core profile
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw AuthError.tokenMissing();
      }

      const updated = await ProfileService.updateProfile(userId.toString(), req.body);
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload user avatar (handles file or base64)
   */
  static async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw AuthError.tokenMissing();
      }

      let payload: FileUploadPayload;

      const anyReq = req as any;
      if (anyReq.file) {
        payload = {
          buffer: anyReq.file.buffer,
          originalName: anyReq.file.originalname,
          mimeType: anyReq.file.mimetype
        };
      } else if (req.body.file) {
        payload = parseBase64File(req.body.file, 'avatar');
      } else {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const result = await ProfileService.uploadAvatar(userId.toString(), payload);
      return res.status(200).json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload cover image
   */
  static async uploadCover(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw AuthError.tokenMissing();
      }

      let payload: FileUploadPayload;

      const anyReq = req as any;
      if (anyReq.file) {
        payload = {
          buffer: anyReq.file.buffer,
          originalName: anyReq.file.originalname,
          mimeType: anyReq.file.mimetype
        };
      } else if (req.body.file) {
        payload = parseBase64File(req.body.file, 'cover');
      } else {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const result = await ProfileService.uploadCoverImage(userId.toString(), payload);
      return res.status(200).json({
        success: true,
        message: 'Cover image uploaded successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload resume document
   */
  static async uploadResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw AuthError.tokenMissing();
      }

      let payload: FileUploadPayload;
      const title = req.body.title;
      const isPrimary = req.body.isPrimary === 'true' || req.body.isPrimary === true;

      const anyReq = req as any;
      if (anyReq.file) {
        payload = {
          buffer: anyReq.file.buffer,
          originalName: anyReq.file.originalname,
          mimeType: anyReq.file.mimetype
        };
      } else if (req.body.file) {
        payload = parseBase64File(req.body.file, 'resume');
      } else {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const result = await ProfileService.uploadResume(userId.toString(), payload, title, isPrimary);
      return res.status(201).json({
        success: true,
        message: 'Resume uploaded successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set primary default resume
   */
  static async setPrimaryResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { resumeId } = req.params;
      if (!userId) {
        throw AuthError.tokenMissing();
      }

      const result = await ProfileService.setPrimaryResume(userId.toString(), resumeId as string);
      return res.status(200).json({
        success: true,
        message: 'Primary resume updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete resume
   */
  static async deleteResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { resumeId } = req.params;
      if (!userId) {
        throw AuthError.tokenMissing();
      }

      await ProfileService.deleteResume(userId.toString(), resumeId as string);
      return res.status(200).json({
        success: true,
        message: 'Resume deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get completion analysis
   */
  static async getProfileCompletion(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw AuthError.tokenMissing();
      }

      const analysis = await ProfileService.calculateCompletion(userId.toString());
      return res.status(200).json({
        success: true,
        message: 'Profile completion analysis generated',
        data: analysis
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export all data
   */
  static async exportProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw AuthError.tokenMissing();
      }

      const data = await ProfileService.exportProfileData(userId.toString());
      return res.status(200).json({
        success: true,
        message: 'Data exported successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate account
   */
  static async deactivateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw AuthError.tokenMissing();
      }

      await ProfileService.deactivateAccount(userId.toString());
      return res.status(200).json({
        success: true,
        message: 'Account deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Recruiter Search
   */
  static async searchProfiles(req: Request, res: Response, next: NextFunction) {
    try {
      const { skills, experienceLevel, location, availability, keywords, page = 1, limit = 10 } = req.query;

      const pagination = {
        page: Number(page),
        limit: Number(limit)
      };

      const filters = {
        skills: skills?.toString(),
        experienceLevel: experienceLevel?.toString(),
        location: location?.toString(),
        availability: availability?.toString(),
        keywords: keywords?.toString()
      };

      const results = await ProfileService.searchProfiles(filters, pagination);
      return res.status(200).json({
        success: true,
        message: 'Profiles matching search criteria retrieved',
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sub-record CRUD (Education)
  // ─────────────────────────────────────────────────────────────────────────────

  static async addEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const edu = await Education.create({
        ...req.body,
        userId
      });

      return res.status(201).json({
        success: true,
        message: 'Education record added successfully',
        data: edu
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const edu = await Education.findOneAndUpdate(
        { _id: id, userId },
        { $set: req.body },
        { new: true }
      );

      if (!edu) throw new NotFoundError('Education record not found');

      return res.status(200).json({
        success: true,
        message: 'Education record updated successfully',
        data: edu
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const edu = await Education.findOneAndDelete({ _id: id, userId });
      if (!edu) throw new NotFoundError('Education record not found');

      return res.status(200).json({
        success: true,
        message: 'Education record deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sub-record CRUD (Experience)
  // ─────────────────────────────────────────────────────────────────────────────

  static async addExperience(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const exp = await Experience.create({
        ...req.body,
        userId
      });

      return res.status(201).json({
        success: true,
        message: 'Experience record added successfully',
        data: exp
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateExperience(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const exp = await Experience.findOneAndUpdate(
        { _id: id, userId },
        { $set: req.body },
        { new: true }
      );

      if (!exp) throw new NotFoundError('Experience record not found');

      return res.status(200).json({
        success: true,
        message: 'Experience record updated successfully',
        data: exp
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteExperience(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const exp = await Experience.findOneAndDelete({ _id: id, userId });
      if (!exp) throw new NotFoundError('Experience record not found');

      return res.status(200).json({
        success: true,
        message: 'Experience record deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sub-record CRUD (Projects)
  // ─────────────────────────────────────────────────────────────────────────────

  static async addProject(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const proj = await Project.create({
        ...req.body,
        userId
      });

      return res.status(201).json({
        success: true,
        message: 'Project record added successfully',
        data: proj
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const proj = await Project.findOneAndUpdate(
        { _id: id, userId },
        { $set: req.body },
        { new: true }
      );

      if (!proj) throw new NotFoundError('Project record not found');

      return res.status(200).json({
        success: true,
        message: 'Project record updated successfully',
        data: proj
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const proj = await Project.findOneAndDelete({ _id: id, userId });
      if (!proj) throw new NotFoundError('Project record not found');

      return res.status(200).json({
        success: true,
        message: 'Project record deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sub-record CRUD (Certificates)
  // ─────────────────────────────────────────────────────────────────────────────

  static async addCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const cert = await Certificate.create({
        ...req.body,
        userId
      });

      return res.status(201).json({
        success: true,
        message: 'Certificate record added successfully',
        data: cert
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const cert = await Certificate.findOneAndUpdate(
        { _id: id, userId },
        { $set: req.body },
        { new: true }
      );

      if (!cert) throw new NotFoundError('Certificate record not found');

      return res.status(200).json({
        success: true,
        message: 'Certificate record updated successfully',
        data: cert
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const cert = await Certificate.findOneAndDelete({ _id: id, userId });
      if (!cert) throw new NotFoundError('Certificate record not found');

      return res.status(200).json({
        success: true,
        message: 'Certificate record deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sub-record CRUD (Achievements)
  // ─────────────────────────────────────────────────────────────────────────────

  static async addAchievement(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const ach = await Achievement.create({
        ...req.body,
        userId
      });

      return res.status(201).json({
        success: true,
        message: 'Achievement record added successfully',
        data: ach
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateAchievement(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const ach = await Achievement.findOneAndUpdate(
        { _id: id, userId },
        { $set: req.body },
        { new: true }
      );

      if (!ach) throw new NotFoundError('Achievement record not found');

      return res.status(200).json({
        success: true,
        message: 'Achievement record updated successfully',
        data: ach
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAchievement(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const ach = await Achievement.findOneAndDelete({ _id: id, userId });
      if (!ach) throw new NotFoundError('Achievement record not found');

      return res.status(200).json({
        success: true,
        message: 'Achievement record deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sub-record CRUD (Languages)
  // ─────────────────────────────────────────────────────────────────────────────

  static async addLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const lang = await Language.create({
        ...req.body,
        userId
      });

      return res.status(201).json({
        success: true,
        message: 'Language record added successfully',
        data: lang
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const lang = await Language.findOneAndUpdate(
        { _id: id, userId },
        { $set: req.body },
        { new: true }
      );

      if (!lang) throw new NotFoundError('Language record not found');

      return res.status(200).json({
        success: true,
        message: 'Language record updated successfully',
        data: lang
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const lang = await Language.findOneAndDelete({ _id: id, userId });
      if (!lang) throw new NotFoundError('Language record not found');

      return res.status(200).json({
        success: true,
        message: 'Language record deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sub-record CRUD (Technical Skills array inside Profile)
  // ─────────────────────────────────────────────────────────────────────────────

  static async addSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const { name, category, proficiency, yearsOfExperience } = req.body;

      const profile = await Profile.findOne({ userId });
      if (!profile) throw new NotFoundError('Profile not found');

      // Check if skill already exists, if so we update it
      const skillIdx = profile.skills.findIndex((s) => s.name.toLowerCase() === name.toLowerCase());

      if (skillIdx > -1) {
        const skill = profile.skills[skillIdx];
        if (skill) {
          skill.proficiency = proficiency;
          skill.yearsOfExperience = yearsOfExperience;
          skill.category = category;
        }
      } else {
        profile.skills.push({ name, category, proficiency, yearsOfExperience });
      }

      await profile.save();

      return res.status(200).json({
        success: true,
        message: 'Skill added/updated successfully',
        data: profile.skills
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { name } = req.params;
      if (!userId) throw AuthError.tokenMissing();

      const profile = await Profile.findOne({ userId });
      if (!profile) throw new NotFoundError('Profile not found');

      profile.skills = profile.skills.filter((s) => s.name.toLowerCase() !== decodeURIComponent(name as string).toLowerCase());
      await profile.save();

      return res.status(200).json({
        success: true,
        message: 'Skill deleted successfully',
        data: profile.skills
      });
    } catch (error) {
      next(error);
    }
  }
}
