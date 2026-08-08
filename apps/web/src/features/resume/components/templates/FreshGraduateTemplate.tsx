import { ClientResume } from '../../types/resume.types';

interface TemplateProps {
  resume: ClientResume;
}

export function FreshGraduateTemplate({ resume }: TemplateProps) {
  const cust = resume.customization || {};
  const fontClass = `font-${(cust.font || 'Inter').toLowerCase().replace(/\s+/g, '-')}`;
  const accentColor = cust.accentColor || '#0284c7';

  // Sort sections
  const sortedSections = [...(resume.sections || [])].sort((a, b) => a.order - b.order) as any[];
  
  // Reorder sections dynamically for a fresh graduate!
  // We want to highlight Education and Projects first, and Experience later.
  const personalInfo = sortedSections.find((s) => s.type === 'personal_info');
  
  const reorderSections = () => {
    const list = sortedSections.filter((s) => s.type !== 'personal_info');
    const edu = list.find((s) => s.type === 'education');
    const proj = list.find((s) => s.type === 'projects');
    const skills = list.find((s) => s.type === 'skills');
    const exp = list.find((s) => s.type === 'experience' || s.type === 'internships');
    
    const others = list.filter((s) => 
      s.type !== 'education' && 
      s.type !== 'projects' && 
      s.type !== 'skills' && 
      s.type !== 'experience' && 
      s.type !== 'internships'
    );
    
    return [
      edu,
      skills,
      proj,
      exp,
      ...others
    ].filter(Boolean);
  };

  const prioritizedSections = reorderSections();

  const customStyle = {
    fontFamily: cust.font ? `'${cust.font}', sans-serif` : 'inherit',
    fontSize: cust.fontSize || '10pt',
    lineHeight: cust.lineHeight || '1.4',
    color: '#0f172a',
  };

  return (
    <div 
      className={`bg-white w-full min-h-full print:p-0 ${fontClass}`} 
      style={{
        ...customStyle,
        padding: cust.margins || '0.5in',
      }}
    >
      {/* Header */}
      {personalInfo && (
        <div className="bg-slate-50 border-t-4 rounded-b p-5 mb-5 flex justify-between items-center" style={{ borderTopColor: accentColor }}>
          <div>
            <h1 
              className="font-extrabold text-slate-800 tracking-tight"
              style={{ fontSize: cust.headingSize ? `calc(${cust.headingSize} * 1.35)` : '18pt' }}
            >
              {`${personalInfo.content.firstName || ''} ${personalInfo.content.lastName || ''}`.trim() || 'Graduate Name'}
            </h1>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
              {personalInfo.content.email && <span>{personalInfo.content.email}</span>}
              {personalInfo.content.phone && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{personalInfo.content.phone}</span>
                </>
              )}
              {(personalInfo.content.city || personalInfo.content.country) && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>
                    {[personalInfo.content.city, personalInfo.content.state, personalInfo.content.country]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="text-xs flex flex-col items-end gap-1 font-bold">
            {personalInfo.content.linkedin && (
              <a href={personalInfo.content.linkedin as string} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                LinkedIn Profile
              </a>
            )}
            {personalInfo.content.github && (
              <a href={personalInfo.content.github as string} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                GitHub Repos
              </a>
            )}
            {personalInfo.content.website && (
              <a href={personalInfo.content.website as string} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                Portfolio Website
              </a>
            )}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {prioritizedSections.map((sec) => {
          const content = sec.content || {};
          let hasContent = false;

          const renderBody = () => {
            switch (sec.type) {
              case 'summary':
              case 'objective':
                if (content.text) {
                  hasContent = true;
                  return <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{content.text}</p>;
                }
                break;

              case 'education':
                if (content.items && content.items.length > 0) {
                  hasContent = true;
                  return (
                    <div className="space-y-3">
                      {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="text-sm">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{item.degree} in {item.fieldOfStudy}</span>
                            <span className="text-xs text-slate-500 font-medium">
                              {item.startDate} &ndash; {item.isCurrent ? 'Present' : item.endDate || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-600 mt-0.5">
                            <span className="font-semibold text-slate-700">{item.institution}</span>
                            {item.grade && <span className="font-bold text-slate-700">GPA: {item.grade}</span>}
                          </div>
                          {item.activities && (
                            <p className="text-xs text-slate-500 mt-1">
                              <strong>Relevant Coursework / Activities:</strong> {item.activities}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }
                break;

              case 'experience':
              case 'internships':
                if (content.items && content.items.length > 0) {
                  hasContent = true;
                  return (
                    <div className="space-y-3">
                      {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="text-sm">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{item.jobTitle}</span>
                            <span className="text-xs text-slate-500 font-medium">
                              {item.startDate} &ndash; {item.isCurrent ? 'Present' : item.endDate || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold mb-1" style={{ color: accentColor }}>
                            <span>{item.company} {item.location ? `• ${item.location}` : ''}</span>
                            {item.employmentType && <span className="capitalize">({item.employmentType.replace('_', ' ')})</span>}
                          </div>
                          {item.description && <p className="text-xs text-slate-600 mb-1 leading-relaxed">{item.description}</p>}
                          {item.achievements && item.achievements.length > 0 && (
                            <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5 ml-1 leading-relaxed">
                              {item.achievements.map((ach: string, aIdx: number) => (
                                <li key={aIdx}>{ach}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }
                break;

              case 'projects':
                if (content.items && content.items.length > 0) {
                  hasContent = true;
                  return (
                    <div className="space-y-3">
                      {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="text-sm">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>
                              {item.projectName} {item.role ? `(${item.role})` : ''}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {item.startDate} &ndash; {item.isCurrent ? 'Present' : item.endDate || 'N/A'}
                            </span>
                          </div>
                          <div className="text-xs flex gap-2 font-bold mb-1">
                            {item.githubUrl && (
                              <a href={item.githubUrl} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                                GitHub
                              </a>
                            )}
                            {item.liveUrl && (
                              <a href={item.liveUrl} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                                Demo Link
                              </a>
                            )}
                          </div>
                          {item.description && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>}
                          {item.technologies && item.technologies.length > 0 && (
                            <p className="text-xs text-slate-500 mt-1">
                              <strong>Key Tech:</strong> {item.technologies.join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }
                break;

              case 'skills':
                if (content.items && content.items.length > 0) {
                  hasContent = true;
                  return (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                      {content.items.map((group: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 flex items-center gap-2">
                          <strong className="text-slate-800">{group.category}:</strong>
                          <span>{group.skills.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                break;

              case 'soft_skills':
                if (content.items && content.items.length > 0) {
                  hasContent = true;
                  return <p className="text-sm text-slate-600">{content.items.join(', ')}</p>;
                }
                break;

              case 'certifications':
                if (content.items && content.items.length > 0) {
                  hasContent = true;
                  return (
                    <div className="space-y-2">
                      {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="text-sm">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{item.certificateName}</span>
                            <span className="text-xs text-slate-500 font-medium">{item.issueDate}</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-600">
                            <span className="font-semibold">{item.issuer} {item.expiryDate ? `• Expires: ${item.expiryDate}` : ''}</span>
                            {item.credentialId && <span>ID: {item.credentialId}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }
                break;

              case 'achievements':
                if (content.items && content.items.length > 0) {
                  hasContent = true;
                  return (
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {content.items.map((item: any, idx: number) => (
                        <li key={idx}>
                          <strong>{item.title}</strong> {item.issuer ? `(${item.issuer})` : ''} {item.date ? `• ${item.date}` : ''}
                          {item.description && <p className="text-xs text-slate-500 ml-5">{item.description}</p>}
                        </li>
                      ))}
                    </ul>
                  );
                }
                break;

              case 'languages':
                if (content.items && content.items.length > 0) {
                  hasContent = true;
                  return (
                    <p className="text-sm text-slate-600">
                      {content.items.map((item: any) => `${item.language} (${item.proficiency})`).join(', ')}
                    </p>
                  );
                }
                break;

              case 'custom':
                if (content.text) {
                  hasContent = true;
                  return <div className="text-sm text-slate-600 whitespace-pre-line">{content.text}</div>;
                }
                break;

              default:
                break;
            }
            return null;
          };

          const body = renderBody();
          if (!hasContent) return null;

          return (
            <div key={sec.id} className="relative pb-1">
              <h2 
                className="font-bold text-slate-800 border-b-2 pb-0.5 mb-2"
                style={{ fontSize: cust.headingSize || '11pt', borderBottomColor: accentColor }}
              >
                {sec.name}
              </h2>
              <div>{body}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
