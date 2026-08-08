import puppeteer from 'puppeteer';
import { ResumeTemplate } from '../models/ResumeTemplate.model';
import { logger } from '../utils/logger.util';

export class PdfService {
  /**
   * Render resume to HTML based on template and customization options
   */
  static generateHtml(resume: any, templateSlug: string): string {
    const cust = resume.customization || {};
    const font = cust.font || 'Inter';
    const fontSize = cust.fontSize || '10pt';
    const headingSize = cust.headingSize || '14pt';
    const lineHeight = cust.lineHeight || '1.4';
    const margins = cust.margins || '0.5in';
    const spacing = cust.spacing || '0.5rem';
    const accentColor = cust.accentColor || '#0284c7';

    // Sort sections by order
    const sortedSections = [...(resume.sections || [])].sort((a, b) => a.order - b.order);

    // Helpers to render sections
    let headerHtml = '';
    let sectionsHtml = '';

    // Separate personal info from standard sections (it always goes first in templates)
    const personalInfoSection = sortedSections.find((s) => s.type === 'personal_info');
    const otherSections = sortedSections.filter((s) => s.type !== 'personal_info');

    if (personalInfoSection) {
      const c = personalInfoSection.content || {};
      const fullName = `${c.firstName || ''} ${c.lastName || ''}`.trim();
      const location = [c.city, c.state, c.country].filter(Boolean).join(', ');
      const links = [
        c.linkedin ? `<a href="${c.linkedin}" target="_blank">LinkedIn</a>` : '',
        c.github ? `<a href="${c.github}" target="_blank">GitHub</a>` : '',
        c.website ? `<a href="${c.website}" target="_blank">Website</a>` : ''
      ].filter(Boolean).join(' | ');

      headerHtml = `
        <div class="resume-header">
          <h1>${fullName || 'Resume'}</h1>
          <div class="contact-info">
            ${c.email ? `<span>${c.email}</span>` : ''}
            ${c.phone ? `<span>${c.phone}</span>` : ''}
            ${location ? `<span>${location}</span>` : ''}
          </div>
          ${links ? `<div class="social-links">${links}</div>` : ''}
        </div>
      `;
    }

    // Render other sections
    otherSections.forEach((sec) => {
      const content = sec.content || {};
      let bodyHtml = '';

      switch (sec.type) {
        case 'summary':
        case 'objective':
          if (content.text) {
            bodyHtml = `<p class="summary-text">${content.text}</p>`;
          }
          break;

        case 'education':
          if (content.items && content.items.length > 0) {
            bodyHtml = content.items
              .map(
                (item: any) => `
              <div class="resume-item">
                <div class="item-header">
                  <div class="item-title"><strong>${item.degree || ''}</strong> in ${item.fieldOfStudy || ''}</div>
                  <div class="item-date">${item.startDate || ''} &ndash; ${item.isCurrent ? 'Present' : item.endDate || ''}</div>
                </div>
                <div class="item-subheader">
                  <span class="institution">${item.institution || ''}</span>
                  ${item.grade ? `<span class="grade">CGPA/Percentage: ${item.grade}</span>` : ''}
                </div>
                ${item.activities ? `<p class="activities"><em>Activities:</em> ${item.activities}</p>` : ''}
              </div>
            `
              )
              .join('');
          }
          break;

        case 'experience':
        case 'internships':
          if (content.items && content.items.length > 0) {
            bodyHtml = content.items
              .map(
                (item: any) => `
              <div class="resume-item">
                <div class="item-header">
                  <div class="item-title"><strong>${item.jobTitle || ''}</strong></div>
                  <div class="item-date">${item.startDate || ''} &ndash; ${item.isCurrent ? 'Present' : item.endDate || ''}</div>
                </div>
                <div class="item-subheader">
                  <span class="company">${item.company || ''}</span>
                  ${item.location ? `<span class="location">${item.location}</span>` : ''}
                  ${item.employmentType ? `<span class="emp-type">(${item.employmentType})</span>` : ''}
                </div>
                ${item.description ? `<p class="description">${item.description}</p>` : ''}
                ${
                  item.achievements && item.achievements.length > 0
                    ? `<ul class="bullets">
                      ${item.achievements.map((ach: string) => `<li>${ach}</li>`).join('')}
                    </ul>`
                    : ''
                }
                ${
                  item.technologies && item.technologies.length > 0
                    ? `<p class="tech-used"><strong>Skills used:</strong> ${item.technologies.join(', ')}</p>`
                    : ''
                }
              </div>
            `
              )
              .join('');
          }
          break;

        case 'projects':
          if (content.items && content.items.length > 0) {
            bodyHtml = content.items
              .map(
                (item: any) => `
              <div class="resume-item">
                <div class="item-header">
                  <div class="item-title"><strong>${item.projectName || ''}</strong> ${item.role ? `&ndash; <em>${item.role}</em>` : ''}</div>
                  <div class="item-date">${item.startDate || ''} &ndash; ${item.isCurrent ? 'Present' : item.endDate || ''}</div>
                </div>
                <div class="item-subheader">
                  <div class="project-links">
                    ${item.githubUrl ? `<a href="${item.githubUrl}" target="_blank">GitHub</a>` : ''}
                    ${item.liveUrl ? `<a href="${item.liveUrl}" target="_blank">Demo</a>` : ''}
                  </div>
                </div>
                ${item.description ? `<p class="description">${item.description}</p>` : ''}
                ${
                  item.technologies && item.technologies.length > 0
                    ? `<p class="tech-used"><strong>Tech:</strong> ${item.technologies.join(', ')}</p>`
                    : ''
                }
              </div>
            `
              )
              .join('');
          }
          break;

        case 'skills':
          if (content.items && content.items.length > 0) {
            bodyHtml = `
              <div class="skills-grid">
                ${content.items
                  .map(
                    (group: any) => `
                  <div class="skill-group">
                    <span class="skill-cat"><strong>${group.category}:</strong></span>
                    <span class="skill-names">${(group.skills || []).join(', ')}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            `;
          }
          break;

        case 'soft_skills':
          if (content.items && content.items.length > 0) {
            bodyHtml = `<p class="soft-skills">${content.items.join(', ')}</p>`;
          }
          break;

        case 'certifications':
          if (content.items && content.items.length > 0) {
            bodyHtml = content.items
              .map(
                (item: any) => `
              <div class="resume-item">
                <div class="item-header">
                  <div class="item-title"><strong>${item.certificateName || ''}</strong> &ndash; <em>${item.issuer || ''}</em></div>
                  <div class="item-date">${item.issueDate || ''} ${item.expiryDate ? `(Expires: ${item.expiryDate})` : ''}</div>
                </div>
                ${item.credentialId ? `<p class="credential-id">Credential ID: ${item.credentialId}</p>` : ''}
                ${item.credentialUrl ? `<p class="credential-url"><a href="${item.credentialUrl}" target="_blank">Verify Credential</a></p>` : ''}
              </div>
            `
              )
              .join('');
          }
          break;

        case 'achievements':
          if (content.items && content.items.length > 0) {
            bodyHtml = `
              <ul class="bullets">
                ${content.items
                  .map(
                    (item: any) => `
                  <li>
                    <strong>${item.title || ''}</strong> ${item.issuer ? `(${item.issuer})` : ''} ${item.date ? `&ndash; ${item.date}` : ''}
                    ${item.description ? `<p class="bullet-desc">${item.description}</p>` : ''}
                  </li>
                `
                  )
                  .join('')}
              </ul>
            `;
          }
          break;

        case 'languages':
          if (content.items && content.items.length > 0) {
            bodyHtml = `<p class="languages">${content.items.map((item: any) => `${item.language} (${item.proficiency})`).join(', ')}</p>`;
          }
          break;

        case 'custom':
          if (content.text) {
            bodyHtml = `<div class="custom-section-body">${content.text}</div>`;
          }
          break;

        default:
          break;
      }

      if (bodyHtml) {
        sectionsHtml += `
          <div class="resume-section" id="section-${sec.id}">
            <h2>${sec.name}</h2>
            <div class="section-divider"></div>
            <div class="section-content">${bodyHtml}</div>
          </div>
        `;
      }
    });

    // CSS styling presets for each template slug
    let templateCss = '';

    if (templateSlug === 'classic-ats') {
      templateCss = `
        .resume-header { text-align: center; margin-bottom: 1.5rem; }
        .resume-header h1 { font-size: 20pt; font-weight: bold; margin-bottom: 0.25rem; letter-spacing: -0.5px; }
        .contact-info { font-size: 9pt; color: #4b5563; margin-bottom: 0.25rem; }
        .contact-info span:not(:last-child)::after { content: " | "; padding: 0 4px; color: #d1d5db; }
        .social-links { font-size: 9pt; }
        .social-links a { color: #3b82f6; text-decoration: none; }
        h2 { font-size: 11pt; text-transform: uppercase; color: #111827; letter-spacing: 0.5px; margin: 0; padding-bottom: 2px; }
        .section-divider { border-bottom: 1px solid #111827; margin-bottom: 0.5rem; }
      `;
    } else if (templateSlug === 'modern-professional') {
      templateCss = `
        .resume-header { display: flex; flex-direction: column; align-items: flex-start; border-left: 4px solid var(--accent-color); padding-left: 12px; margin-bottom: 1.5rem; }
        .resume-header h1 { font-size: 22pt; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem; text-transform: uppercase; }
        .contact-info { font-size: 9.5pt; color: #64748b; margin-bottom: 0.25rem; display: flex; gap: 12px; flex-wrap: wrap; }
        .contact-info span:not(:last-child)::after { content: " •"; margin-left: 12px; color: var(--accent-color); }
        .social-links { font-size: 9.5pt; }
        .social-links a { color: var(--accent-color); text-decoration: none; font-weight: 600; }
        h2 { font-size: 12pt; color: var(--accent-color); font-weight: 700; margin: 0; }
        .section-divider { border-bottom: 2px solid #e2e8f0; margin-bottom: 0.5rem; margin-top: 2px; }
      `;
    } else if (templateSlug === 'minimal') {
      templateCss = `
        .resume-header { text-align: center; margin-bottom: 2rem; }
        .resume-header h1 { font-size: 18pt; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.5rem; }
        .contact-info { font-size: 8.5pt; color: #475569; letter-spacing: 0.5px; }
        .contact-info span:not(:last-child)::after { content: "  /  "; padding: 0 6px; color: #94a3b8; }
        .social-links { font-size: 8.5pt; margin-top: 0.25rem; letter-spacing: 0.5px; }
        .social-links a { color: #000; text-decoration: none; border-bottom: 1px solid #cbd5e1; }
        h2 { font-size: 10pt; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #334155; margin: 0; }
        .section-divider { border-bottom: 1px dashed #cbd5e1; margin-bottom: 0.5rem; margin-top: 3px; }
      `;
    } else if (templateSlug === 'software-developer') {
      templateCss = `
        .resume-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px double var(--accent-color); padding-bottom: 12px; margin-bottom: 1.5rem; }
        .resume-header h1 { font-size: 22pt; font-weight: 900; color: #0f172a; margin: 0; font-family: monospace, Courier, monospace; }
        .contact-info { font-size: 9pt; color: #475569; text-align: right; }
        .contact-info span { display: block; margin-bottom: 2px; }
        .social-links { font-size: 9pt; text-align: right; margin-top: 4px; }
        .social-links a { color: var(--accent-color); text-decoration: underline; }
        h2 { font-size: 11pt; color: #0f172a; font-family: monospace, Courier, monospace; margin: 0; display: inline-block; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; }
        .section-divider { border-bottom: 1px solid #e2e8f0; margin-bottom: 0.5rem; margin-top: 4px; }
        .skill-group { display: flex; flex-wrap: wrap; margin-bottom: 0.25rem; }
        .skill-cat { min-width: 120px; font-weight: bold; }
      `;
    } else {
      // fresh-graduate
      templateCss = `
        .resume-header { text-align: left; margin-bottom: 1.5rem; background: #f8fafc; padding: 16px; border-radius: 8px; border-top: 4px solid var(--accent-color); }
        .resume-header h1 { font-size: 20pt; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; }
        .contact-info { font-size: 9.5pt; color: #475569; display: flex; flex-wrap: wrap; gap: 8px; }
        .contact-info span:not(:last-child)::after { content: " | "; margin-left: 8px; color: #cbd5e1; }
        .social-links { font-size: 9.5pt; margin-top: 4px; }
        .social-links a { color: var(--accent-color); text-decoration: none; }
        h2 { font-size: 12pt; color: #1e293b; font-weight: 700; margin: 0; }
        .section-divider { border-bottom: 2px solid var(--accent-color); opacity: 0.3; margin-bottom: 0.5rem; margin-top: 2px; }
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@400;700&family=Roboto:wght@300;400;500;700&family=Fira+Code:wght@400;600&display=swap');
            
            :root {
              --accent-color: ${accentColor};
            }

            * {
              box-sizing: border-box;
            }

            body {
              font-family: '${font}', sans-serif;
              font-size: ${fontSize};
              line-height: ${lineHeight};
              color: #111827;
              margin: 0;
              padding: ${margins};
              background: #fff;
              -webkit-print-color-adjust: exact;
            }

            h1, h2, h3, h4 {
              margin: 0;
              font-family: '${font}', sans-serif;
            }

            a {
              color: var(--accent-color);
              text-decoration: none;
            }

            .resume-section {
              margin-bottom: ${spacing};
              page-break-inside: avoid;
            }

            .section-content {
              margin-top: 0.25rem;
            }

            .resume-item {
              margin-bottom: 0.5rem;
              page-break-inside: avoid;
            }

            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
            }

            .item-title {
              font-size: 10pt;
              color: #111827;
            }

            .item-date {
              font-size: 9pt;
              color: #4b5563;
              font-weight: 500;
            }

            .item-subheader {
              display: flex;
              justify-content: space-between;
              font-size: 9pt;
              color: #4b5563;
              margin-bottom: 0.25rem;
            }

            .bullets {
              margin: 0.2rem 0;
              padding-left: 1.2rem;
              font-size: 9pt;
              color: #374151;
            }

            .bullets li {
              margin-bottom: 0.15rem;
            }

            .tech-used, .description, .activities {
              font-size: 9pt;
              color: #374151;
              margin: 0.15rem 0;
            }

            .skills-grid {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }

            .skill-group {
              font-size: 9pt;
              color: #374151;
            }

            .bullet-desc {
              margin: 0;
              font-size: 8.5pt;
              color: #4b5563;
            }

            .summary-text, .soft-skills, .languages, .custom-section-body {
              font-size: 9.5pt;
              color: #374151;
              margin: 0;
              white-space: pre-line;
            }

            /* Print/Page specific CSS overrides */
            @media print {
              html, body {
                width: 100%;
                background: #fff;
              }
              a {
                text-decoration: none;
                color: #000;
              }
            }

            ${templateCss}
          </style>
        </head>
        <body>
          ${headerHtml}
          ${sectionsHtml}
        </body>
      </html>
    `;
  }

  /**
   * Compile HTML using Puppeteer headless to selectable-text PDF
   */
  static async exportToPdf(resume: any, templateSlug: string): Promise<Buffer> {
    const htmlContent = this.generateHtml(resume, templateSlug);
    let browser;

    try {
      logger.info('Launching puppeteer browser to generate PDF...');
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' as any });

      const pageSize = resume.customization?.pageSize || 'A4';
      const pdfBuffer = await page.pdf({
        format: pageSize as any,
        printBackground: true,
        margin: {
          top: '0.4in',
          bottom: '0.4in',
          left: '0.4in',
          right: '0.4in'
        }
      });

      logger.info('PDF generated successfully by Puppeteer.');
      return Buffer.from(pdfBuffer);
    } catch (error) {
      logger.error('Error generating PDF with Puppeteer:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
