import { ClientResume } from '../../types/resume.types';

interface TemplateProps {
  resume: ClientResume;
}

export function SoftwareDeveloperTemplate({ resume }: TemplateProps) {
  const cust = resume.customization || {};
  const fontClass = `font-${(cust.font || 'Fira Code').toLowerCase().replace(/\s+/g, '-')}`;
  const accentColor = cust.accentColor || '#0284c7';

  const sortedSections = [...(resume.sections || [])].sort((a, b) => a.order - b.order) as any[];
  const personalInfo = sortedSections.find((s) => s.type === 'personal_info');
  const otherSections = sortedSections.filter((s) => s.type !== 'personal_info');

  const customStyle = {
    fontFamily: cust.font ? `'${cust.font}', monospace` : 'monospace, Courier',
    fontSize: cust.fontSize || '9pt',
    lineHeight: cust.lineHeight || '1.3',
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
        <div className="flex justify-between items-start border-b-2 pb-4 mb-5" style={{ borderBottomColor: accentColor }}>
          <div>
            <h1 
              className="font-black text-slate-900 tracking-tighter"
              style={{ fontSize: cust.headingSize ? `calc(${cust.headingSize} * 1.3)` : '18pt' }}
            >
              {`${personalInfo.content.firstName || ''} ${personalInfo.content.lastName || ''}`.trim() || 'Developer Name'}
            </h1>
            <p className="text-xs text-slate-500 font-bold mt-0.5">~/software-engineer</p>
          </div>
          <div className="text-right text-[10px] text-slate-600">
            {personalInfo.content.email && <div>{personalInfo.content.email}</div>}
            {personalInfo.content.phone && <div>{personalInfo.content.phone}</div>}
            {(personalInfo.content.city || personalInfo.content.country) && (
              <div>
                {[personalInfo.content.city, personalInfo.content.state, personalInfo.content.country]
                  .filter(Boolean)
                  .join(', ')}
              </div>
            )}
            <div className="mt-1.5 flex gap-2 justify-end font-bold">
              {personalInfo.content.linkedin && (
                <a href={personalInfo.content.linkedin as string} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                  [linkedin]
                </a>
              )}
              {personalInfo.content.github && (
                <a href={personalInfo.content.github as string} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                  [github]
                </a>
              )}
              {personalInfo.content.website && (
                <a href={personalInfo.content.website as string} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                  [portfolio]
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {otherSections.map((sec) => {
          const content = sec.content || {};
          let hasContent = false;

          const renderBody = () => {
            switch (sec.type) {
              case 'summary':
              case 'objective':
                if (content.text) {
                  hasContent = true;
                  return <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{content.text}</p>;
                }
                break;

              case 'education':
                if (content.items && content.items.length > 0) {
                  hasContent = true;
                  return (
                    <div className="space-y-2">
                      {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="text-xs">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>&gt; {item.degree} - {item.fieldOfStudy}</span>
                            <span className="text-[10px] text-slate-500">
                              {item.startDate} - {item.isCurrent ? 'Present' : item.endDate || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                            <span>{item.institution}</span>
                            {item.grade && <span>GPA: {item.grade}</span>}
                          </div>
                          {item.activities && (
                            <p className="text-[9px] text-slate-400 mt-0.5 italic">Activities: {item.activities}</p>
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
                        <div key={idx} className="text-xs">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>&gt; {item.jobTitle}</span>
                            <span className="text-[10px] text-slate-500">
                              {item.startDate} - {item.isCurrent ? 'Present' : item.endDate || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px] mb-1 font-bold" style={{ color: accentColor }}>
                            <span>{item.company} {item.location ? `(${item.location})` : ''}</span>
                            {item.employmentType && <span>#{item.employmentType}</span>}
                          </div>
                          {item.description && <p className="text-slate-600 mb-1 leading-normal">{item.description}</p>}
                          {item.achievements && item.achievements.length > 0 && (
                            <ul className="list-disc list-inside text-slate-600 space-y-0.5 ml-1 leading-normal">
                              {item.achievements.map((ach: string, aIdx: number) => (
                                <li key={aIdx}>{ach}</li>
                              ))}
                            </ul>
                          )}
                          {item.technologies && item.technologies.length > 0 && (
                            <p className="text-[10px] mt-1 font-bold text-slate-500">
                              Skills: <span className="font-normal text-slate-700">[{item.technologies.join(', ')}]</span>
                            </p>
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
                        <div key={idx} className="text-xs">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>
                              &gt; {item.projectName} {item.role ? `(${item.role})` : ''}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {item.startDate} - {item.isCurrent ? 'Present' : item.endDate || 'N/A'}
                            </span>
                          </div>
                          <div className="text-[10px] flex gap-2 font-bold mb-1">
                            {item.githubUrl && (
                              <a href={item.githubUrl} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                                [src]
                              </a>
                            )}
                            {item.liveUrl && (
                              <a href={item.liveUrl} target="_blank" rel="noreferrer" style={{ color: accentColor }} className="hover:underline">
                                [demo]
                              </a>
                            )}
                          </div>
                          {item.description && <p className="text-slate-600 mt-1 leading-normal">{item.description}</p>}
                          {item.technologies && item.technologies.length > 0 && (
                            <p className="text-[10px] mt-1 font-bold text-slate-500">
                              Tech: <span className="font-normal text-slate-700">[{item.technologies.join(', ')}]</span>
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
                    <div className="space-y-1 text-xs text-slate-700">
                      {content.items.map((group: any, idx: number) => (
                        <div key={idx} className="flex">
                          <span className="font-bold text-slate-800 w-32 shrink-0">&gt; {group.category}:</span>
                          <span>[{group.skills.join(', ')}]</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                break;

              case 'soft_skills':
                if (content.items && content.items.length > 0) {
                  hasContent = true;
                  return <p className="text-xs text-slate-700">[{content.items.join(', ')}]</p>;
                }
                break;

              case 'certifications':
                if (content.items && content.items.length > 0) {
                  hasContent = true;
                  return (
                    <div className="space-y-2">
                      {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="text-xs">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{item.certificateName}</span>
                            <span className="text-[10px] text-slate-500">{item.issueDate}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>{item.issuer} {item.expiryDate ? `• Expires: ${item.expiryDate}` : ''}</span>
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
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                      {content.items.map((item: any, idx: number) => (
                        <li key={idx}>
                          <strong>{item.title}</strong> {item.issuer ? `(${item.issuer})` : ''} {item.date ? `• ${item.date}` : ''}
                          {item.description && <p className="text-[10px] text-slate-500 ml-5">{item.description}</p>}
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
                    <p className="text-xs text-slate-600">
                      [{content.items.map((item: any) => `${item.language} (${item.proficiency})`).join(', ')}]
                    </p>
                  );
                }
                break;

              case 'custom':
                if (content.text) {
                  hasContent = true;
                  return <div className="text-xs text-slate-600 whitespace-pre-line leading-normal">{content.text}</div>;
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
                className="font-bold text-slate-900 border-l-4 pl-2 mb-2 uppercase"
                style={{ fontSize: cust.headingSize || '10pt', borderLeftColor: accentColor }}
              >
                {sec.name}
              </h2>
              <div className="pl-3">{body}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
