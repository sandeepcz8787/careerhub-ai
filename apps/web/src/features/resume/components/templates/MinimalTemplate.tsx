import { ClientResume } from '../../types/resume.types';

interface TemplateProps {
  resume: ClientResume;
}

export function MinimalTemplate({ resume }: TemplateProps) {
  const cust = resume.customization || {};
  const fontClass = `font-${(cust.font || 'Inter').toLowerCase().replace(/\s+/g, '-')}`;
  
  const sortedSections = [...(resume.sections || [])].sort((a, b) => a.order - b.order) as any[];
  const personalInfo = sortedSections.find((s) => s.type === 'personal_info');
  const otherSections = sortedSections.filter((s) => s.type !== 'personal_info');

  const customStyle = {
    fontFamily: cust.font ? `'${cust.font}', sans-serif` : 'inherit',
    fontSize: cust.fontSize || '10pt',
    lineHeight: cust.lineHeight || '1.5',
    color: '#334155',
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
        <div className="text-center mb-8">
          <h1 
            className="font-light text-slate-800 tracking-widest uppercase mb-2"
            style={{ fontSize: cust.headingSize ? `calc(${cust.headingSize} * 1.3)` : '16pt' }}
          >
            {`${personalInfo.content.firstName || ''} ${personalInfo.content.lastName || ''}`.trim() || 'Your Name'}
          </h1>
          <div className="text-[10px] text-slate-500 tracking-wider flex flex-wrap justify-center gap-x-3 gap-y-1">
            {personalInfo.content.email && <span>{personalInfo.content.email}</span>}
            {personalInfo.content.phone && (
              <>
                <span className="text-slate-300">/</span>
                <span>{personalInfo.content.phone}</span>
              </>
            )}
            {(personalInfo.content.city || personalInfo.content.country) && (
              <>
                <span className="text-slate-300">/</span>
                <span>
                  {[personalInfo.content.city, personalInfo.content.state, personalInfo.content.country]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex flex-wrap justify-center gap-x-4">
            {personalInfo.content.linkedin && (
              <a href={personalInfo.content.linkedin as string} target="_blank" rel="noreferrer" className="hover:text-slate-800 hover:underline">
                LinkedIn
              </a>
            )}
            {personalInfo.content.github && (
              <a href={personalInfo.content.github as string} target="_blank" rel="noreferrer" className="hover:text-slate-800 hover:underline">
                GitHub
              </a>
            )}
            {personalInfo.content.website && (
              <a href={personalInfo.content.website as string} target="_blank" rel="noreferrer" className="hover:text-slate-800 hover:underline">
                Website
              </a>
            )}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-6">
        {otherSections.map((sec) => {
          const content = sec.content || {};
          let hasContent = false;

          const renderBody = () => {
            switch (sec.type) {
              case 'summary':
              case 'objective':
                if (content.text) {
                  hasContent = true;
                  return <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed text-justify">{content.text}</p>;
                }
                break;

              case 'education':
                if (content.items && content.items.length > 0) {
                  hasContent = true;
                  return (
                    <div className="space-y-3">
                      {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="text-xs">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{item.degree} in {item.fieldOfStudy}</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {item.startDate} &ndash; {item.isCurrent ? 'Present' : item.endDate || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-500 mt-0.5">
                            <span>{item.institution}</span>
                            {item.grade && <span>GPA: {item.grade}</span>}
                          </div>
                          {item.activities && (
                            <p className="text-[10px] text-slate-400 mt-1 italic">Activities: {item.activities}</p>
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
                        <div key={idx} className="text-xs">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{item.jobTitle}</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {item.startDate} &ndash; {item.isCurrent ? 'Present' : item.endDate || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-500 mt-0.5 mb-1.5 font-medium">
                            <span>{item.company} {item.location ? `• ${item.location}` : ''}</span>
                            {item.employmentType && <span className="capitalize">({item.employmentType.replace('_', ' ')})</span>}
                          </div>
                          {item.description && <p className="text-slate-600 mb-1 leading-relaxed">{item.description}</p>}
                          {item.achievements && item.achievements.length > 0 && (
                            <ul className="list-disc list-inside text-slate-600 space-y-0.5 ml-1 leading-relaxed">
                              {item.achievements.map((ach: string, aIdx: number) => (
                                <li key={aIdx}>{ach}</li>
                              ))}
                            </ul>
                          )}
                          {item.technologies && item.technologies.length > 0 && (
                            <p className="text-[10px] text-slate-400 mt-1">
                              <em>Skills: {item.technologies.join(', ')}</em>
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
                              {item.projectName} {item.role ? `(${item.role})` : ''}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {item.startDate} &ndash; {item.isCurrent ? 'Present' : item.endDate || 'N/A'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex gap-2 font-medium">
                            {item.githubUrl && (
                              <a href={item.githubUrl} target="_blank" rel="noreferrer" className="hover:text-slate-800 hover:underline">
                                GitHub
                              </a>
                            )}
                            {item.liveUrl && (
                              <a href={item.liveUrl} target="_blank" rel="noreferrer" className="hover:text-slate-800 hover:underline">
                                Demo
                              </a>
                            )}
                          </div>
                          {item.description && <p className="text-slate-600 mt-1 leading-relaxed">{item.description}</p>}
                          {item.technologies && item.technologies.length > 0 && (
                            <p className="text-[10px] text-slate-400 mt-1">
                              <em>Tech: {item.technologies.join(', ')}</em>
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
                    <div className="space-y-1 text-xs text-slate-600">
                      {content.items.map((group: any, idx: number) => (
                        <div key={idx} className="flex">
                          <span className="font-bold text-slate-800 w-28 shrink-0">{group.category}:</span>
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
                  return <p className="text-xs text-slate-600">{content.items.join(', ')}</p>;
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
                            <span className="text-[10px] text-slate-400 font-medium">{item.issueDate}</span>
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
                        <li key={idx} className="leading-relaxed">
                          <strong>{item.title}</strong> {item.issuer ? `(${item.issuer})` : ''} {item.date ? `• ${item.date}` : ''}
                          {item.description && <p className="text-[10px] text-slate-400 ml-5">{item.description}</p>}
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
                      {content.items.map((item: any) => `${item.language} (${item.proficiency})`).join(', ')}
                    </p>
                  );
                }
                break;

              case 'custom':
                if (content.text) {
                  hasContent = true;
                  return <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{content.text}</div>;
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
                className="font-bold text-center tracking-widest uppercase border-b border-dashed border-slate-200 pb-1 mb-2 text-slate-700"
                style={{ fontSize: cust.headingSize || '10pt' }}
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
