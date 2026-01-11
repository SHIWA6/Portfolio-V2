import React from 'react';
    
const SkillsApp: React.FC = () => (
  <div className="p-8 space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Technical Skills</h2>
    {[
      { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Go'] },
      { category: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'Redux'] },
      { category: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB'] },
      { category: 'DevOps', items: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'] },
    ].map((skill, i) => (
      <div key={i}>
        <h3 className="font-semibold text-gray-700 mb-2">{skill.category}</h3>
        <div className="flex flex-wrap gap-2">
          {skill.items.map((item, j) => (
            <span key={j} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {item}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default SkillsApp;