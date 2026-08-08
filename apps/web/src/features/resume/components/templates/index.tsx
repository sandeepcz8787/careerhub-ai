import { ClassicAtsTemplate } from './ClassicAtsTemplate';
import { ModernProfessionalTemplate } from './ModernProfessionalTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { SoftwareDeveloperTemplate } from './SoftwareDeveloperTemplate';
import { FreshGraduateTemplate } from './FreshGraduateTemplate';
import { ClientResume } from '../../types/resume.types';

export * from './ClassicAtsTemplate';
export * from './ModernProfessionalTemplate';
export * from './MinimalTemplate';
export * from './SoftwareDeveloperTemplate';
export * from './FreshGraduateTemplate';

export const TemplateRenderer = ({ 
  slug, 
  resume 
}: { 
  slug: string; 
  resume: ClientResume;
}) => {
  switch (slug) {
    case 'classic-ats':
      return <ClassicAtsTemplate resume={resume} />;
    case 'modern-professional':
      return <ModernProfessionalTemplate resume={resume} />;
    case 'minimal':
      return <MinimalTemplate resume={resume} />;
    case 'software-developer':
      return <SoftwareDeveloperTemplate resume={resume} />;
    case 'fresh-graduate':
      return <FreshGraduateTemplate resume={resume} />;
    default:
      return <ClassicAtsTemplate resume={resume} />;
  }
};
