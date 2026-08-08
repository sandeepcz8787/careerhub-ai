import type { Request, Response, NextFunction } from 'express';
import { ResumeService } from '../services/resume.service';
import { PdfService } from '../services/pdf.service';
import { AiService } from '../services/ai.service';
import { AuthError } from '../errors/AuthError';
import { NotFoundError } from '../errors/NotFoundError';
import { ResumeTemplate } from '../models/ResumeTemplate.model';

export class ResumeController {
  /**
   * Fetch user's resumes
   */
  static async getUserResumes(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const resumes = await ResumeService.getUserResumes(userId.toString());
      return res.status(200).json({
        success: true,
        message: 'Resumes retrieved successfully',
        data: resumes
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch specific resume by ID
   */
  static async getResumeById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const { id } = req.params as { id: string };
      const resume = await ResumeService.getResumeById(userId.toString(), id);
      return res.status(200).json({
        success: true,
        message: 'Resume retrieved successfully',
        data: resume
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new resume version/copy
   */
  static async createResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const resume = await ResumeService.createResume(userId.toString(), req.body);
      return res.status(201).json({
        success: true,
        message: 'Resume created successfully',
        data: resume
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update resume content/configuration (Debounced / Autosave)
   */
  static async updateResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const { id } = req.params as { id: string };
      const resume = await ResumeService.updateResume(userId.toString(), id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Resume updated successfully',
        data: resume
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set primary/default resume
   */
  static async setDefaultResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const { id } = req.params as { id: string };
      const resume = await ResumeService.setDefaultResume(userId.toString(), id);
      return res.status(200).json({
        success: true,
        message: 'Default resume set successfully',
        data: resume
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clone/Duplicate resume
   */
  static async duplicateResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const { id } = req.params as { id: string };
      const resume = await ResumeService.duplicateResume(userId.toString(), id);
      return res.status(201).json({
        success: true,
        message: 'Resume duplicated successfully',
        data: resume
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Archive/delete resume
   */
  static async deleteResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const { id } = req.params as { id: string };
      const result = await ResumeService.deleteResume(userId.toString(), id);
      return res.status(200).json({
        success: true,
        message: 'Resume deleted successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish resume to public link
   */
  static async publishResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const { id } = req.params as { id: string };
      const { customSlug, privacy } = req.body;
      const resume = await ResumeService.publishResume(userId.toString(), id, customSlug, privacy);

      return res.status(200).json({
        success: true,
        message: 'Resume published successfully',
        data: resume
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unpublish resume
   */
  static async unpublishResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const { id } = req.params as { id: string };
      const resume = await ResumeService.unpublishResume(userId.toString(), id);

      return res.status(200).json({
        success: true,
        message: 'Resume unpublished successfully',
        data: resume
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get public resume copy
   */
  static async getPublicResume(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, resumeSlug } = req.params as { username: string; resumeSlug: string };
      const resume = await ResumeService.getPublicResume(username, resumeSlug);

      return res.status(200).json({
        success: true,
        message: 'Public resume retrieved successfully',
        data: resume
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get resume version snapshots list
   */
  static async getResumeVersions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const { id } = req.params as { id: string };
      const versions = await ResumeService.getResumeVersions(userId.toString(), id);

      return res.status(200).json({
        success: true,
        message: 'Resume versions retrieved successfully',
        data: versions
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Restore resume to version snapshot
   */
  static async restoreResumeVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const { id, versionId } = req.params as { id: string; versionId: string };
      const resume = await ResumeService.restoreResumeVersion(userId.toString(), id, versionId);

      return res.status(200).json({
        success: true,
        message: 'Resume restored to version successfully',
        data: resume
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export resume as PDF buffer
   */
  static async exportPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw AuthError.tokenMissing();

      const { id } = req.params as { id: string };
      const resume = await ResumeService.getResumeById(userId.toString(), id);

      // Fetch template slug
      let templateSlug = 'classic-ats';
      if (resume.templateId) {
        const template = await ResumeTemplate.findById(resume.templateId);
        if (template) {
          templateSlug = template.slug;
        }
      }

      const pdfBuffer = await PdfService.exportToPdf(resume, templateSlug);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${ResumeService.slugify(resume.title)}.pdf"`);
      return res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  // ── AI Helper Stubs ────────────────────────────────────────────────────────

  static async aiImprove(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AiService.improveText(req.body);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async aiGenerateSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AiService.generateSummary(req.body);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async aiGenerateBullet(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AiService.generateBullet(req.body);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async aiSuggestSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req.body;
      const result = await AiService.suggestSkills(role);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async aiSuggestKeywords(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AiService.suggestKeywords(req.body);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
