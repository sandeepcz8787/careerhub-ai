import { ClientResume } from '../../types/resume.types';

interface TemplateProps {
  resume: ClientResume;
}

export function ModernProfessionalTemplate({ resume }: TemplateProps) {
  const cust = resume.customization || {};
  const fontClass = `font-${(cust.font || 'Inter').toLowerCase().replace(/\s+/g, '-')}`;
  const accentColor = cust.accentColor || '#0284c7';

  const sortedSections = [...(resume.sections || [])].sort((a, b) => a.order - b.order) as any[];
  const personalInfo = sortedSections.find((s) => s.type === 'personal_info');
  const otherSections = sortedSections.filter((s) => s.type !== 'personal_info');

  const customStyle = {
    fontFamily: cust.font ? `'${cust.font}', sans-serif` : 'inherit',
    fontSize: cust.fontSize || '10pt',
    lineHeight: cust.lineHeight || '1.4',
    color: '#1e293b',
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
        <div 
          className="border-l-4 pl-4 mb-6"
          style={{ borderColor: accentColor }}
        >
          <h1 
            className="font-extrabold text-slate-800 tracking-tight uppercase"
            style={{ fontSize: cust.headingSize ? `calc(${cust.headingSize} * 1.4)` : '20pt' }}
          >
            {`${personalInfo.content.firstName || ''} ${personalInfo.content.lastName || ''}`.trim() || 'Your Name'}
          </h1>
          <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {personalInfo.content.email && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                {personalInfo.content.email}
              </span>
            )}
            {personalInfo.content.phone && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                {personalInfo.content.phone}
              </span>
            )}
            {(personalInfo.content.city || personalInfo.content.country) && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                {[personalInfo.content.city, personalInfo.content.state, personalInfo.content.country]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            )}
          </div>
          <div className="text-xs mt-1.5 flex gap-4 font-bold">
            {personalInfo.content.linkedin && (
              <a href={personalInfo.content.linkedin as string} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                LinkedIn
              </a>
            )}
            {personalInfo.content.github && (
              <a href={personalInfo.content.github as string} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                GitHub
              </a>
            )}
            {personalInfo.content.website && (
              <a href={personalInfo.content.website as string} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                Website
              </a>
            )}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-5">
        {otherSections.map((sec) => {
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
                          <div className="flex justify-between text-xs text-slate-600">
                            <span className="font-semibold">{item.institution}</span>
                            {item.grade && <span>GPA: {item.grade}</span>}
                          </div>
                          {item.activities && (
                            <p className="text-xs text-slate-500 mt-0.5 italic">Activities: {item.activities}</p>
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
                    <div className="space-y-4">
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
                          {item.technologies && item.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {item.technologies.map((tech: string, tIdx: number) => (
                                <span 
                                  key={tIdx} 
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
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
                          <div className="text-xs flex gap-2.5 font-bold mb-1">
                            {item.githubUrl && (
                              <a href={item.githubUrl} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                                GitHub
                              </a>
                            )}
                            {item.liveUrl && (
                              <a href={item.liveUrl} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                                Live Demo
                              </a>
                            )}
                          </div>
                          {item.description && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>}
                          {item.technologies && item.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.technologies.map((tech: string, tIdx: number) => (
                                <span 
                                  key={tIdx} 
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600">
                      {content.items.map((group: any, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <span className="font-bold text-slate-800 shrink-0 w-24 border-r border-slate-200 pr-2">{group.category}</span>
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
                    <div className="space-y-2.5">
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
                        <li key={idx} className="leading-relaxed">
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
                  return <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{content.text}</div>;
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
                className="font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 border-slate-100"
                style={{ fontSize: cust.headingSize || '11pt', color: accentColor }}
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
