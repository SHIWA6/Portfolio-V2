import React from 'react';

const TerminalApp: React.FC = () => (
  <div className="bg-gray-900 text-green-400 p-4 font-mono text-sm h-full">
    <div>$ whoami</div>
    <div className="text-gray-400">typescript-developer</div>
    <div className="mt-4">$ ls skills/</div>
    <div className="text-gray-400">react.ts  node.ts  typescript.ts  aws.conf</div>
    <div className="mt-4">$ cat mission.txt</div>
    <div className="text-gray-400">Building exceptional web experiences with clean, type-safe code.</div>
    <div className="mt-4">$ █</div>
  </div>
);

export default TerminalApp;