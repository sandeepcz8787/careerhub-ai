import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { ProfileController } from '../controllers/profile.controller';
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

const router = Router();

// Apply auth middleware globally to profile routes
router.use(authenticate);

// Core profile
router.get('/me', ProfileController.getProfile);
router.put('/me', validate(updateProfileDetailsSchema), ProfileController.updateProfile);

// Images
router.post('/me/avatar', ProfileController.uploadAvatar);
router.post('/me/cover', ProfileController.uploadCover);

// Resumes
router.post('/me/resume', ProfileController.uploadResume);
router.patch('/me/resume/:resumeId/primary', ProfileController.setPrimaryResume);
router.delete('/me/resume/:resumeId', ProfileController.deleteResume);

// Completion & export & deactivation
router.get('/me/completion', ProfileController.getProfileCompletion);
router.get('/me/export', ProfileController.exportProfile);
router.delete('/me/account', ProfileController.deactivateAccount);

// Recruiter Search Profiles
router.get('/search', ProfileController.searchProfiles);

// Education CRUD
router.post('/me/education', validate(createEducationSchema), ProfileController.addEducation);
router.put('/me/education/:id', validate(updateEducationSchema), ProfileController.updateEducation);
router.delete('/me/education/:id', ProfileController.deleteEducation);

// Experience CRUD
router.post('/me/experience', validate(createExperienceSchema), ProfileController.addExperience);
router.put('/me/experience/:id', validate(updateExperienceSchema), ProfileController.updateExperience);
router.delete('/me/experience/:id', ProfileController.deleteExperience);

// Projects CRUD
router.post('/me/projects', validate(createProjectSchema), ProfileController.addProject);
router.put('/me/projects/:id', validate(updateProjectSchema), ProfileController.updateProject);
router.delete('/me/projects/:id', ProfileController.deleteProject);

// Certificates CRUD
router.post('/me/certificates', validate(createCertificateSchema), ProfileController.addCertificate);
router.put('/me/certificates/:id', validate(updateCertificateSchema), ProfileController.updateCertificate);
router.delete('/me/certificates/:id', ProfileController.deleteCertificate);

// Achievements CRUD
router.post('/me/achievements', validate(createAchievementSchema), ProfileController.addAchievement);
router.put('/me/achievements/:id', validate(updateAchievementSchema), ProfileController.updateAchievement);
router.delete('/me/achievements/:id', ProfileController.deleteAchievement);

// Languages CRUD
router.post('/me/languages', validate(createLanguageSchema), ProfileController.addLanguage);
router.put('/me/languages/:id', validate(updateLanguageSchema), ProfileController.updateLanguage);
router.delete('/me/languages/:id', ProfileController.deleteLanguage);

// Skills (embedded array)
router.post('/me/skills', validate(userSkillSchema), ProfileController.addSkill);
router.delete('/me/skills/:name', ProfileController.deleteSkill);

export default router;
