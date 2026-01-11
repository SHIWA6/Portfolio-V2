import React from "react"
import {Github, Linkedin} from "lucide-react";

const AboutApp: React.FC = () => (
  <div className="p-8 space-y-4">
    <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
    <p className="text-gray-600 leading-relaxed">
      TypeScript developer specializing in modern web applications with React, Node.js, and cloud-native architectures.
    </p>
    <div className="flex gap-4 mt-6">
      <div className="flex items-center gap-2 text-gray-700">
        <Github className="w-5 h-5" />
        <span>github.com/yourname</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <Linkedin className="w-5 h-5" />
        <span>linkedin.com/in/yourname</span>
      </div>
    </div>
  </div>
);

export default AboutApp;