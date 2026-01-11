import React from "react";


const ResumeApp: React.FC = () => (
  <div className="p-8 space-y-4">
    <h2 className="text-2xl font-bold text-gray-800">Resume</h2>
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg text-gray-800">Senior TypeScript Developer</h3>
        <p className="text-gray-600">Tech Corp • 2022 - Present</p>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
          <li>Led development of microservices architecture</li>
          <li>Mentored junior developers in TypeScript best practices</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-lg text-gray-800">Full Stack Developer</h3>
        <p className="text-gray-600">Startup Inc • 2020 - 2022</p>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
          <li>Built responsive web applications with React</li>
          <li>Implemented RESTful APIs with Node.js</li>
        </ul>
      </div>
    </div>
  </div>
);
 export default ResumeApp;