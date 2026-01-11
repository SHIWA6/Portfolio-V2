import React from 'react';


const ProjectsApp: React.FC = () => (
  <div className="p-8 space-y-4">
    <h2 className="text-2xl font-bold text-gray-800">Featured Projects</h2>
    {[
      { name: 'E-Commerce Platform', tech: 'React, TypeScript, Node.js', desc: 'Full-stack marketplace' },
      { name: 'Analytics Dashboard', tech: 'React, D3.js, WebSocket', desc: 'Real-time visualization' },
      { name: 'DevOps Pipeline', tech: 'Docker, K8s, GitHub Actions', desc: 'Automated CI/CD' },
    ].map((project, i) => (
      <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800">{project.name}</h3>
        <p className="text-sm text-blue-600 mt-1">{project.tech}</p>
        <p className="text-sm text-gray-600 mt-2">{project.desc}</p>
      </div>
    ))}
  </div>
);

export default ProjectsApp;