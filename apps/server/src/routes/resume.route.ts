import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { ResumeController } from '../controllers/resume.controller';
import { createResumeSchema, updateResumeSchema } from '@careerhub/shared';

const router = Router();

// Public route for viewing shared resumes anonymously
router.get('/public/:username/:resumeSlug', ResumeController.getPublicResume);

// All subsequent routes require user authentication
router.use(authenticate);

// Core Resumes REST endpoints
router.get('/', ResumeController.getUserResumes);
router.post('/', validate(createResumeSchema), ResumeController.createResume);
router.get('/:id', ResumeController.getResumeById);
router.patch('/:id', validate(updateResumeSchema), ResumeController.updateResume);
router.delete('/:id', ResumeController.deleteResume);

// Operations
router.post('/:id/default', ResumeController.setDefaultResume);
router.post('/:id/duplicate', ResumeController.duplicateResume);
router.post('/:id/publish', ResumeController.publishResume);
router.post('/:id/unpublish', ResumeController.unpublishResume);
router.post('/:id/export/pdf', ResumeController.exportPdf);

// Version history
router.get('/:id/versions', ResumeController.getResumeVersions);
router.post('/:id/versions/:versionId/restore', ResumeController.restoreResumeVersion);

// Future AI integration points (stubs)
router.post('/ai/improve', ResumeController.aiImprove);
router.post('/ai/summary', ResumeController.aiGenerateSummary);
router.post('/ai/bullet', ResumeController.aiGenerateBullet);
router.post('/ai/suggest-skills', ResumeController.aiSuggestSkills);
router.post('/ai/suggest-keywords', ResumeController.aiSuggestKeywords);

export default router;
