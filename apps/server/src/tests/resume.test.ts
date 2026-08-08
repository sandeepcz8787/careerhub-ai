import { Resume } from '../models/Resume.model';
import { ResumeVersion } from '../models/ResumeVersion.model';
import { ResumeTemplate } from '../models/ResumeTemplate.model';
import { Profile } from '../models/Profile.model';
import { User } from '../models/User.model';
import { ResumeService } from '../services/resume.service';
import { PdfService } from '../services/pdf.service';
import mongoose from 'mongoose';
import { UserRole } from '@careerhub/shared';

/**
 * Reusable test cases suite for Resume Builder verification.
 * Run directly via npx tsx.
 */
export async function runResumeTestSuite(): Promise<void> {
  console.log('\n🧪 Running Resume Builder Test Suite...\n');

  try {
    // Setup Mock Users
    const userA = new User({
      email: 'userA@careerhub.ai',
      passwordHash: 'Password123!',
      role: UserRole.STUDENT,
      profile: { firstName: 'Alice', lastName: 'Developer' },
    });
    await userA.save();

    const userB = new User({
      email: 'userB@careerhub.ai',
      passwordHash: 'Password123!',
      role: UserRole.STUDENT,
      profile: { firstName: 'Bob', lastName: 'Recruiter' },
    });
    await userB.save();

    // Create primary Career Profile for User A
    const profileA = await Profile.create({
      userId: userA._id,
      experienceLevel: 'entry',
      firstName: 'Alice',
      lastName: 'Developer',
      bio: 'React and Node developer.',
      skills: [{ name: 'React', category: 'Frontend', proficiency: 'intermediate', yearsOfExperience: 2 }]
    });

    // 1. Create Template Seed
    console.log('  [1/6] Seeding default templates...');
    const template = await ResumeTemplate.create({
      name: 'Classic ATS',
      slug: 'classic-ats',
      thumbnailUrl: 'http://test.com/thumb.jpg',
      category: 'professional',
      layoutConfig: {}
    });
    console.assert(template.slug === 'classic-ats', 'Template seed failed');

    // 2. Resume Creation from Profile
    console.log('  [2/6] Testing Resume creation & import from Profile...');
    const resume = await ResumeService.createResume(userA._id.toString(), {
      title: 'Alice Resume v1',
      templateId: template._id.toString(),
      importFromProfile: true,
      selectedSections: ['personal_info', 'summary', 'skills']
    });

    console.assert(resume.title === 'Alice Resume v1', 'Resume title incorrect');
    console.assert(resume.sections.length === 3, 'Sections import failed');
    console.assert(resume.isPrimary === true, 'First resume must be set as primary default');
    
    // Check Profile reference sync
    const updatedProfileA = await Profile.findOne({ userId: userA._id });
    console.assert(updatedProfileA?.resumeReference?.toString() === resume._id.toString(), 'Profile resumeReference not synced');
    console.log('    ✓ Resume created and profile data imported.');

    // 3. Ownership Verification
    console.log('  [3/6] Testing Resume ownership rules...');
    let threwError = false;
    try {
      // User B tries to fetch User A's private resume
      await ResumeService.getResumeById(userB._id.toString(), resume._id.toString());
    } catch {
      threwError = true;
    }
    console.assert(threwError === true, 'Unauthorized access check failed; Bob accessed Alice\'s private resume');
    console.log('    ✓ Ownership validation passed.');

    // 4. Duplicate Resume
    console.log('  [4/6] Testing Resume duplication...');
    const duplicate = await ResumeService.duplicateResume(userA._id.toString(), resume._id.toString());
    console.assert(duplicate.title === 'Alice Resume v1 (Copy)', 'Duplicated title incorrect');
    console.assert(duplicate.isPrimary === false, 'Duplicate resume should not be primary');
    console.assert(duplicate.sections.length === resume.sections.length, 'Duplicate sections size mismatch');
    console.log('    ✓ Resume duplicated successfully.');

    // 5. Version History Snaps
    console.log('  [5/6] Testing version snapshots and restoration...');
    const versions = await ResumeService.getResumeVersions(userA._id.toString(), resume._id.toString());
    console.assert(versions.length > 0, 'Initial version not created');
    
    // Make a change and restore
    await ResumeService.updateResume(userA._id.toString(), resume._id.toString(), { title: 'Alice Edited Title' });
    const versionToRestore = versions[0]!;
    const restored = await ResumeService.restoreResumeVersion(userA._id.toString(), resume._id.toString(), versionToRestore._id.toString());
    console.assert(restored.title === 'Alice Resume v1', 'Restoring to version snapshot failed');
    console.log('    ✓ Version snapshot and restore working.');

    // 6. PDF Rendering
    console.log('  [6/6] Testing server-side HTML compiler...');
    const html = PdfService.generateHtml(resume, 'classic-ats');
    console.assert(html.includes('Alice Developer'), 'HTML generation missing name');
    console.assert(html.includes('React and Node developer'), 'HTML generation missing bio summary');
    console.log('    ✓ PDF HTML rendering validation passed.');

    console.log('\n🎉 Resume Builder Test Suite Passed Successfully!\n');
  } catch (error) {
    console.error('\n❌ Resume Builder Test Suite Failed:', error);
    throw error;
  }
}
