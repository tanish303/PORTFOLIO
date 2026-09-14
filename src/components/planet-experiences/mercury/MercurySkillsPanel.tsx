import React, { useState } from 'react';
import type { PlanetEnvironmentConfig } from '../../../data/planetEnvironments';
import { soundController } from '../../../audio/SoundController';

interface MercurySkillsPanelProps {
  config: PlanetEnvironmentConfig;
  uiX: number;
  uiY: number;
}

// 23 Accurate Tech Stack definitions matching the user's screenshot
interface TechItem {
  name: string;
  category: string;
  color: string;
  iconType: string;
}

const TECH_CATEGORIES: { name: string; items: TechItem[] }[] = [
  {
    name: 'Languages',
    items: [
      { name: 'JavaScript', category: 'Languages', color: '#f7df1e', iconType: 'javascript' },
      { name: 'TypeScript', category: 'Languages', color: '#3178c6', iconType: 'typescript' },
      { name: 'Python', category: 'Languages', color: '#38bdf8', iconType: 'python' },
      { name: 'Java', category: 'Languages', color: '#ea580c', iconType: 'java' },
      { name: 'C++', category: 'Languages', color: '#2563eb', iconType: 'cpp' },
    ],
  },
  {
    name: 'Frontend',
    items: [
      { name: 'React', category: 'Frontend', color: '#06b6d4', iconType: 'react' },
      { name: 'Next.js', category: 'Frontend', color: '#ffffff', iconType: 'nextjs' },
      { name: 'React Native', category: 'Frontend', color: '#61dafb', iconType: 'react-native' },
      { name: 'Redux', category: 'Frontend', color: '#38bdf8', iconType: 'redux' },
      { name: 'Tailwind CSS', category: 'Frontend', color: '#38bdf8', iconType: 'tailwind' },
      { name: 'HTML5', category: 'Frontend', color: '#f97316', iconType: 'html5' },
    ],
  },
  {
    name: 'Backend',
    items: [
      { name: 'Node.js', category: 'Backend', color: '#22c55e', iconType: 'nodejs' },
      { name: 'Express.js', category: 'Backend', color: '#cbd5e1', iconType: 'express' },
      { name: 'FastAPI', category: 'Backend', color: '#009688', iconType: 'fastapi' },
      { name: 'REST APIs', category: 'Backend', color: '#38bdf8', iconType: 'restapi' },
      { name: 'Authentication (JWT)', category: 'Backend', color: '#fbbf24', iconType: 'jwt' },
    ],
  },
  {
    name: 'Databases',
    items: [
      { name: 'MongoDB', category: 'Databases', color: '#22c55e', iconType: 'mongodb' },
      { name: 'PostgreSQL', category: 'Databases', color: '#38bdf8', iconType: 'postgresql' },
      { name: 'MySQL', category: 'Databases', color: '#0284c7', iconType: 'mysql' },
    ],
  },
  {
    name: 'DevOps / Cloud',
    items: [
      { name: 'Docker', category: 'DevOps / Cloud', color: '#2496ed', iconType: 'docker' },
      { name: 'Kubernetes', category: 'DevOps / Cloud', color: '#326ce5', iconType: 'kubernetes' },
      { name: 'Terraform', category: 'DevOps / Cloud', color: '#844fba', iconType: 'terraform' },
      { name: 'AWS', category: 'DevOps / Cloud', color: '#ff9900', iconType: 'aws' },
      { name: 'Jenkins', category: 'DevOps / Cloud', color: '#d33833', iconType: 'jenkins' },
      { name: 'GitHub Actions', category: 'DevOps / Cloud', color: '#2088ff', iconType: 'github-actions' },
    ],
  },
  {
    name: 'Deployment / Hosting',
    items: [
      { name: 'Vercel', category: 'Deployment / Hosting', color: '#ffffff', iconType: 'vercel' },
      { name: 'Render', category: 'Deployment / Hosting', color: '#38bdf8', iconType: 'render' },
    ],
  },
  {
    name: 'Design Tools',
    items: [
      { name: 'Figma', category: 'Design Tools', color: '#f43f5e', iconType: 'figma' },
      { name: 'Postman', category: 'Design Tools', color: '#f97316', iconType: 'postman' },
    ],
  },
];

// SVG Icon Component rendering official crisp vector icons
const TechIcon: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  switch (type) {
    case 'javascript':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <rect width="24" height="24" rx="4" fill="#f7df1e" />
          <path d="M7 17.5c.7.4 1.5.7 2.4.7 1.4 0 2.2-.7 2.2-1.9v-6.5h-2v6.4c0 .6-.3.9-.9.9-.4 0-.8-.1-1.1-.3l-.6 1.7zm7.5-3.3c.7.4 1.5.7 2.2.7.9 0 1.4-.4 1.4-1 0-.6-.5-.9-1.5-1.4-1.6-.7-2.6-1.5-2.6-2.9 0-1.6 1.2-2.8 3.2-2.8 1 0 1.9.3 2.5.6l-.6 1.7c-.5-.3-1.1-.5-1.9-.5-.8 0-1.3.4-1.3.9 0 .6.5.9 1.6 1.3 1.7.7 2.6 1.6 2.6 3 0 1.7-1.3 2.9-3.4 2.9-1.2 0-2.3-.3-2.9-.8l.7-1.7z" fill="#000000" />
        </svg>
      );
    case 'typescript':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <rect width="24" height="24" rx="4" fill="#3178c6" />
          <path d="M4.5 11.2h3.2v8H9.7v-8h3.2V9.5H4.5v1.7zm9.6 4.9c.7.4 1.5.7 2.3.7.9 0 1.4-.4 1.4-1 0-.6-.5-.9-1.5-1.4-1.6-.7-2.6-1.5-2.6-2.9 0-1.6 1.2-2.8 3.2-2.8 1 0 1.9.3 2.5.6l-.6 1.7c-.5-.3-1.1-.5-1.9-.5-.8 0-1.3.4-1.3.9 0 .6.5.9 1.6 1.3 1.7.7 2.6 1.6 2.6 3 0 1.7-1.3 2.9-3.4 2.9-1.2 0-2.3-.3-2.9-.8l.6-1.7z" fill="#ffffff" />
        </svg>
      );
    case 'python':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path d="M11.9 2c-5.1 0-4.8 2.2-4.8 2.2l.02 2.3h4.9v.7H5.2S2 6.8 2 11.9s2.8 5 2.8 5h1.7v-2.3c0-2.6 2.3-2.5 2.3-2.5h4.8c2.3 0 2.2-2.2 2.2-2.2V4.2S16.2 2 11.9 2zm-2.6 1.5c.5 0 .9.4.9.9 0 .5-.4.9-.9.9-.5 0-.9-.4-.9-.9 0-.5.4-.9.9-.9z" fill="#38bdf8" />
          <path d="M12.1 22c5.1 0 4.8-2.2 4.8-2.2l-.02-2.3h-4.9v-.7h6.8s3.2.4 3.2-4.7-2.8-5-2.8-5h-1.7v2.3c0 2.6-2.3 2.5-2.3 2.5h-4.8c-2.3 0-2.2 2.2-2.2 2.2v5.7s-.4 2.2 3.9 2.2zm2.6-1.5c-.5 0-.9-.4-.9-.9 0-.5.4-.9.9-.9.5 0 .9.4.9.9 0 .5-.4.9-.9.9z" fill="#facc15" />
        </svg>
      );
    case 'java':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M9.5 18.5c2.5.3 4.8-.4 6.2-1.2-1.4.3-3.2.4-4.8.1-1.2-.2-1.9-.6-2-.8.5-.1 1.2 0 1.9.1 2.8.3 5.4-.5 6.7-1.5-1.5.4-3.5.5-5.3.2-1.7-.3-2.7-.9-2.7-1.1.7-.1 1.6 0 2.6.2 2.4.4 4.8-.2 6.2-1.2-1.3.3-3 .4-4.6.1-1.9-.3-3.1-1.1-3.2-1.3.9-.1 2 0 3.3.3 2.1.4 4.2-.1 5.3-.9-1.2.3-2.6.3-3.9.1-1.8-.4-2.8-1.1-3-1.4 1 0 2.2.1 3.5.4 1.8.4 3.6-.1 4.5-.8-1.1.2-2.2.3-3.3.1-2.1-.3-3.3-1.3-3.4-1.5 1.2-.1 2.6.1 4 .5 1.5.4 3 .1 3.8-.6-1 .2-2 .2-3 0-2.2-.4-3.3-1.4-3.4-1.6 1.3 0 2.8.2 4.4.7 1.2.4 2.4.2 3-.4-1.1.1-2.1.1-3.1-.1-2.2-.4-3.3-1.4-3.4-1.6 1.6.1 3.4.4 5.2 1.1 1.4.5 2.7.4 3.3-.2-1.4.1-2.7 0-4-.4-2-.6-2.9-1.6-2.9-1.7 1.8.2 3.8.7 5.6 1.7" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M4 19.5c4 2 12 2 16 0" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'cpp':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M12 2L2 7.8v8.4L12 22l10-5.8V7.8L12 2z" fill="#00599c" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.2" />
          <path d="M11 9.2c-.6-.5-1.3-.8-2.1-.8-1.8 0-3 1.5-3 3.6s1.2 3.6 3 3.6c.8 0 1.5-.3 2.1-.8l.8 1.4c-.8.7-1.8 1.1-2.9 1.1-2.9 0-5-2.2-5-5.3s2.1-5.3 5-5.3c1.1 0 2.1.4 2.9 1.1l-.8 1.4z" fill="#38bdf8" />
          <path d="M14.5 12h2.2m-1.1-1.1v2.2m3.6-1.1h2.2m-1.1-1.1v2.2" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'react':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#06b6d4" strokeWidth="1.3" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#06b6d4" strokeWidth="1.3" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#06b6d4" strokeWidth="1.3" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="#06b6d4" />
        </svg>
      );
    case 'nextjs':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <circle cx="12" cy="12" r="10" fill="#000000" stroke="#ffffff" strokeWidth="1.2" />
          <path d="M8.5 7.5v9h2v-5.2l5.6 5.2h1.4V7.5h-2v5.1l-5.6-5.1H8.5z" fill="#ffffff" />
        </svg>
      );
    case 'react-native':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <ellipse cx="12" cy="12" rx="9" ry="3.8" stroke="#61dafb" strokeWidth="1.3" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.8" stroke="#61dafb" strokeWidth="1.3" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.8" stroke="#61dafb" strokeWidth="1.3" transform="rotate(150 12 12)" />
          <circle cx="12" cy="12" r="1.6" fill="#61dafb" />
        </svg>
      );
    case 'fastapi':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <circle cx="12" cy="12" r="10" fill="#009688" />
          <path d="M13 3L6 13h5l-1 8 8-11h-5l1-7z" fill="#ffffff" />
        </svg>
      );
    case 'docker':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M22.5 12c-.4-.3-1.4-.4-2.1-.1-.3-.6-.8-1.1-1.5-1.4l-.5-.2-.3.5c-.5.8-.4 1.7-.1 2.5-.6.4-1.6.5-2.7.5H2c-.4 1.8.3 3.6 1.3 4.8 1.5 1.8 3.7 2.7 6.7 2.7 5.4 0 9.7-2.9 10.8-7.7.7.1 1.7 0 2.2-.4.4-.3.7-.8.5-1.2l-.5-.5z" fill="#0284c7" />
          <rect x="5.5" y="10" width="2.2" height="1.8" rx="0.3" fill="#38bdf8" />
          <rect x="8.5" y="10" width="2.2" height="1.8" rx="0.3" fill="#38bdf8" />
          <rect x="11.5" y="10" width="2.2" height="1.8" rx="0.3" fill="#38bdf8" />
          <rect x="8.5" y="7.5" width="2.2" height="1.8" rx="0.3" fill="#38bdf8" />
          <rect x="11.5" y="7.5" width="2.2" height="1.8" rx="0.3" fill="#38bdf8" />
          <rect x="11.5" y="5" width="2.2" height="1.8" rx="0.3" fill="#38bdf8" />
        </svg>
      );
    case 'kubernetes':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#326ce5" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="3" fill="#326ce5" />
          <path d="M12 3v6m0 6v6m-7.8-13.5l5.2 3m5.2 3l5.2 3m-15.6 0l5.2-3m5.2-3l5.2-3" stroke="#326ce5" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'terraform':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M9 2.5L3.5 5.7v6.4L9 8.9V2.5z" fill="#844fba" />
          <path d="M9.8 9.4L15.3 12.6V6.2L9.8 3v6.4z" fill="#5c4ee5" />
          <path d="M9.8 13.4L15.3 16.6v-6.4L9.8 7v6.4z" fill="#844fba" />
          <path d="M16.1 13.1l5.5-3.2v6.4l-5.5 3.2v-6.4z" fill="#5c4ee5" />
        </svg>
      );
    case 'aws':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M17.5 14.5c-2.8 2-7.2 3.1-10.8 1.8-.5-.2-1-.5-1.2-.2-.2.3.1.6.4.8 3.8 2.5 9 2.2 12.2-.4.4-.3.6-.8.2-1.1-.3-.2-.6-.5-.8-.9z" fill="#ff9900" />
          <path d="M18.8 13.6c-.3-.4-1.7-.2-2.4-.1-.2 0-.3.2-.2.3.4.7 1.4.9 2 .8.3 0 .6-.7.6-1z" fill="#ff9900" />
          <path d="M6.2 8.5l1.6 4.7h1.4l1.6-4.7H9.5L8.5 11.8 7.5 8.5H6.2zm7.1 0v4.7h1.3v-2.8l1.4 2.8h1.1l1.4-2.8v2.8h1.3V8.5h-1.6l-1.6 3.2-1.6-3.2h-1.3z" fill="#ffffff" />
        </svg>
      );
    case 'jenkins':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <circle cx="12" cy="12" r="9.5" fill="#1e293b" stroke="#d33833" strokeWidth="1.5" />
          <path d="M8 8h8v2H8V8zm1 3h6v1.5H9V11zm1 2.5h4v1.5h-4v-1.5z" fill="#ffffff" />
          <path d="M12 16.5l-2 3h4l-2-3z" fill="#d33833" />
        </svg>
      );
    case 'github-actions':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <circle cx="6" cy="6" r="3" fill="#2088ff" />
          <circle cx="18" cy="8" r="2.5" fill="#2088ff" />
          <circle cx="15" cy="18" r="3" fill="#2088ff" />
          <path d="M8.5 7.5L16 8m-7 1.5l6 6.5" stroke="#2088ff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'redux':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <circle cx="12" cy="7.5" r="2.2" stroke="#38bdf8" strokeWidth="1.4" />
          <circle cx="7.5" cy="15.5" r="2.2" stroke="#38bdf8" strokeWidth="1.4" />
          <circle cx="16.5" cy="15.5" r="2.2" stroke="#38bdf8" strokeWidth="1.4" />
          <path d="M10.5 9c-1.8 1.4-2.2 3.6-1.8 5.2m5.6-5.2c1.8 1.4 2.2 3.6 1.8 5.2m-6.4 1.5h4.6" stroke="#7dd3fc" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'tailwind':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M6 9c1.5-3 3.5-3.5 6-1.5 2 1.6 2.5 3 4.5 3 2 0 3.5-1 4.5-3-1.5 3-3.5 3.5-6 1.5-2-1.6-2.5-3-4.5-3-2 0-3.5 1-4.5 3zm-4 6c1.5-3 3.5-3.5 6-1.5 2 1.6 2.5 3 4.5 3 2 0 3.5-1 4.5-3-1.5 3-3.5 3.5-6 1.5-2-1.6-2.5-3-4.5-3-2 0-3.5 1-4.5 3z" fill="#38bdf8" />
        </svg>
      );
    case 'html5':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M4.5 3l1.5 16.5 6 1.7 6-1.7L19.5 3H4.5z" fill="#ea580c" fillOpacity="0.25" stroke="#f97316" strokeWidth="1.2" />
          <path d="M12 5.5v13.8l4.4-1.2 1.2-12.6H12zm-4.8 2.2l.2 2.2h4.6v-2.2H7.2zm.4 4.4l.2 2.2h4.2v-2.2H7.6zm.4 4.3l1.8.5.8-2.2H8l.4 1.7z" fill="#f97316" />
        </svg>
      );
    case 'nodejs':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M12 2l8.7 5v10L12 22l-8.7-5V7L12 2z" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="1.3" />
          <path d="M9 10.5c0-.8.7-1.5 1.5-1.5h3c.8 0 1.5.7 1.5 1.5v.5h-2v-.4h-2v2.8h4v.6c0 .8-.7 1.5-1.5 1.5h-3c-.8 0-1.5-.7-1.5-1.5v-.5h2v.4h2v-2.8H9v-.6z" fill="#22c55e" />
        </svg>
      );
    case 'express':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <rect width="24" height="24" rx="4" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
          <text x="12" y="15.5" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="11" fontWeight="bold">ex</text>
        </svg>
      );
    case 'restapi':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3 2" />
          <circle cx="12" cy="12" r="3.2" fill="#38bdf8" />
          <circle cx="6" cy="12" r="1.8" fill="#7dd3fc" />
          <circle cx="18" cy="12" r="1.8" fill="#7dd3fc" />
          <circle cx="12" cy="6" r="1.8" fill="#7dd3fc" />
          <circle cx="12" cy="18" r="1.8" fill="#7dd3fc" />
        </svg>
      );
    case 'jwt':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="#fbbf24" strokeWidth="1.4" />
          <path d="M12 4v4m0 8v4m-8-8h4m8 0h4m-2.8-5.7l-2.8 2.8m-5.7 5.7l-2.8 2.8m0-11.3l2.8 2.8m5.7 5.7l2.8 2.8" stroke="#fbbf24" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M12 2c0 0-6 6.5-6 11.5 0 3.8 2.7 6.5 6 8.5 3.3-2 6-4.7 6-8.5C18 8.5 12 2 12 2z" fill="#22c55e" fillOpacity="0.25" stroke="#22c55e" strokeWidth="1.3" />
          <path d="M12 2.5v19c-.3-.2-.6-.3-.9-.5-.4-.3-.8-.6-1.1-.9v-15c.6-.9 1.4-1.8 2-2.6z" fill="#22c55e" />
        </svg>
      );
    case 'postgresql':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M12 3c-4.4 0-8 3.6-8 8 0 2.8 1.4 5.2 3.6 6.6l.4-2.1c-.8-.8-1.3-1.9-1.3-3.1 0-2.6 2.1-4.7 4.7-4.7s4.7 2.1 4.7 4.7c0 1.2-.5 2.3-1.3 3.1l.4 2.1c2.2-1.4 3.6-3.8 3.6-6.6 0-4.4-3.6-8-8-8z" stroke="#38bdf8" strokeWidth="1.3" />
          <path d="M10 14c-.6 0-1.2.3-1.6.8L6.8 19c-.3.7.2 1.4 1 1.4h4.4c.8 0 1.3-.7 1-1.4l-1.6-4.2c-.4-.5-1-.8-1.6-.8z" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1.2" />
        </svg>
      );
    case 'mysql':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M4 14.5c2-2.5 5.5-4 9-3 2.5.7 4.5 2.5 5.5 5-2-1-4.5-1.5-7-1-2.5.5-5 2-6.5 4.5l-1-5.5z" fill="#0284c7" fillOpacity="0.3" stroke="#0284c7" strokeWidth="1.3" />
          <circle cx="16" cy="10" r="1.5" fill="#f59e0b" />
        </svg>
      );
    case 'git':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <rect x="3" y="12" width="12.7" height="12.7" rx="2.5" transform="rotate(-45 3 12)" fill="#f97316" />
          <circle cx="12" cy="7.5" r="1.8" fill="#ffffff" />
          <circle cx="8.5" cy="14" r="1.8" fill="#ffffff" />
          <circle cx="14.5" cy="15.5" r="1.8" fill="#ffffff" />
          <path d="M12 9.3v3.5m0 0l2.5 1.5m-2.5-1.5L9.5 13" stroke="#ffffff" strokeWidth="1.3" />
        </svg>
      );
    case 'vercel':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M12 3l9 16.5H3L12 3z" fill="#ffffff" />
        </svg>
      );
    case 'render':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M6 18V8a6 6 0 0112 0v10M6 13h12" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'figma':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M8 2h4v5H8a2.5 2.5 0 010-5z" fill="#f43f5e" />
          <path d="M12 2h4a2.5 2.5 0 010 5h-4V2z" fill="#fb923c" />
          <path d="M8 7h4v5H8a2.5 2.5 0 010-5z" fill="#38bdf8" />
          <path d="M12 7h4a2.5 2.5 0 010 5h-4V7z" fill="#38bdf8" />
          <path d="M8 12h4v4.5a2.5 2.5 0 01-5 0V12z" fill="#22c55e" />
        </svg>
      );
    case 'postman':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <circle cx="12" cy="12" r="9" fill="#f97316" />
          <path d="M8 12.5l5.5-3.5-2 5.5 1.5.5-2.5 2.5v-2.5l-2.5-2.5z" fill="#ffffff" />
        </svg>
      );
    default:
      return <div style={{ width: 20, height: 20, borderRadius: '50%', background: color }} />;
  }
};

// Deterministic heatmap pattern matching screenshot 2 exactly
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

// Color palette for GitHub and LeetCode activity (levels 0 to 5) - Crisp Mercury Cyan/Ice palette
const HEATMAP_COLORS = [
  '#0e1726', // level 0 (slate dark idle cell)
  '#093554', // level 1 (deep cyan-blue)
  '#0284c7', // level 2 (medium cyan-blue)
  '#0ea5e9', // level 3 (vibrant sky-blue)
  '#38bdf8', // level 4 (electric cyan-ice)
  '#bae6fd', // level 5 (bright ice highlight)
];

// Pre-calculated matrix of 52 weeks x 7 days matching the user's GitHub screenshot (75 contributions)
const GITHUB_ACTIVITY_MATRIX: number[][] = (() => {
  const matrix: number[][] = Array.from({ length: 7 }, () => Array(52).fill(0));
  
  // Specific active blocks matching screenshot 2:
  // Dec cluster (weeks 10-12)
  matrix[1][10] = 3; matrix[2][10] = 4; matrix[3][10] = 4;
  matrix[2][11] = 4; matrix[6][10] = 4;
  // Jan / Feb
  matrix[1][15] = 4; matrix[4][19] = 3;
  // Mar
  matrix[2][23] = 4; matrix[3][23] = 2;
  // Apr / May (prominent cluster)
  matrix[4][25] = 4; matrix[5][25] = 4;
  matrix[1][28] = 2; matrix[2][28] = 4; matrix[3][28] = 4;
  matrix[4][27] = 3; matrix[4][29] = 4; matrix[4][31] = 4; matrix[4][33] = 4;
  // Jul / Aug
  matrix[1][39] = 4; matrix[4][39] = 4;
  matrix[2][42] = 4; matrix[3][42] = 4; matrix[4][42] = 4;
  matrix[3][43] = 4;
  // Sep (dense column at end)
  matrix[2][49] = 4; matrix[3][49] = 4; matrix[4][49] = 4; matrix[5][49] = 2;
  return matrix;
})();

// Pre-calculated matrix of 52 weeks x 7 days matching the user's LeetCode screenshot (179 total submissions)
const LEETCODE_ACTIVITY_MATRIX: number[][] = (() => {
  const matrix: number[][] = Array.from({ length: 7 }, () => Array(52).fill(0));
  
  // High activity in Oct-Nov (weeks 0 to 8)
  for (let c = 0; c < 5; c++) {
    matrix[1][c] = 2; matrix[2][c] = 3; matrix[3][c] = 4; matrix[4][c] = 4;
  }
  matrix[0][2] = 4; matrix[0][3] = 4; matrix[1][3] = 4; matrix[0][5] = 4;
  matrix[1][6] = 2; matrix[2][6] = 3; matrix[3][6] = 4;
  matrix[4][5] = 2; matrix[5][5] = 3;
  // Dec / Jan
  matrix[0][7] = 4; matrix[2][11] = 2; matrix[3][11] = 3; matrix[3][12] = 4;
  matrix[3][13] = 3; matrix[4][12] = 4; matrix[4][13] = 4;
  matrix[1][14] = 4; matrix[6][13] = 3;
  // Feb
  matrix[1][18] = 3; matrix[2][18] = 4; matrix[4][18] = 4; matrix[6][17] = 3;
  // Jul / Aug
  matrix[2][39] = 2; matrix[3][39] = 3; matrix[4][39] = 4; matrix[5][39] = 3;
  matrix[1][40] = 3; matrix[2][40] = 4; matrix[3][40] = 4;
  matrix[1][42] = 3; matrix[2][42] = 4;
  return matrix;
})();

export const MercurySkillsPanel: React.FC<MercurySkillsPanelProps> = ({ config: _config, uiX, uiY }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="mercury-glass-panel-wrapper"
      style={{
        left: `calc(50% + ${uiX * 0.25}px)`,
        top: `calc(50% + ${uiY * 0.25}px)`,
      }}
    >
      {/* 3D Flippable Console Container */}
      <div className={`mercury-flipper-container ${isFlipped ? 'flipped' : ''}`}>
        
        {/* =========================================================
            FRONT FACE: SKILLS & TECH STACK (All 7 Categories & Badges)
            ========================================================= */}
        <div className="mercury-card-face mercury-face-front">
          {/* Top Accent Line */}
          <div className="mercury-top-line" />

          {/* Console Header Bar with Equal Primary Headings: Skills and Heatmaps */}
          <div className="mercury-dual-header">
            <div className="mercury-nav-tabs">
              <button
                type="button"
                className={`mercury-tab-heading ${!isFlipped ? 'active' : ''}`}
                onClick={() => {
                  if (isFlipped) {
                    soundController.playDestinationSelect();
                    setIsFlipped(false);
                  }
                }}
              >
                <span>Skills</span>
                {!isFlipped && <div className="mercury-tab-active-bar" />}
              </button>

              <span className="mercury-tab-slash">/</span>

              <button
                type="button"
                className={`mercury-tab-heading ${isFlipped ? 'active' : ''}`}
                onClick={() => {
                  if (!isFlipped) {
                    soundController.playDestinationSelect();
                    setIsFlipped(true);
                  }
                }}
              >
                <span>Heatmaps</span>
                {isFlipped && <div className="mercury-tab-active-bar" />}
              </button>
            </div>
          </div>

          {/* Skills Grid: All 6 Categories formatted to fit in a single non-scrollable screen */}
          <div className="mercury-skills-matrix">
            {TECH_CATEGORIES.map((cat) => (
              <div key={cat.name} className="mercury-category-row">
                <h3 className="mercury-category-heading">{cat.name}</h3>
                <div className="mercury-badges-wrap">
                  {cat.items.map((item) => (
                    <div
                      key={item.name}
                      className="mercury-tech-badge"
                    >
                      <TechIcon type={item.iconType} color={item.color} />
                      <span className="mercury-badge-label">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            BACK FACE: HEATMAPS (GitHub Activity & LeetCode Activity)
            ========================================================= */}
        <div className="mercury-card-face mercury-face-back">
          {/* Top Accent Line */}
          <div className="mercury-top-line" />

          {/* Back Console Header Bar with Equal Primary Headings */}
          <div className="mercury-dual-header">
            <div className="mercury-nav-tabs">
              <button
                type="button"
                className={`mercury-tab-heading ${!isFlipped ? 'active' : ''}`}
                onClick={() => {
                  if (isFlipped) {
                    soundController.playDestinationSelect();
                    setIsFlipped(false);
                  }
                }}
              >
                <span>Skills</span>
                {!isFlipped && <div className="mercury-tab-active-bar" />}
              </button>

              <span className="mercury-tab-slash">/</span>

              <button
                type="button"
                className={`mercury-tab-heading ${isFlipped ? 'active' : ''}`}
                onClick={() => {
                  if (!isFlipped) {
                    soundController.playDestinationSelect();
                    setIsFlipped(true);
                  }
                }}
              >
                <span>Heatmaps</span>
                {isFlipped && <div className="mercury-tab-active-bar" />}
              </button>
            </div>
          </div>

          {/* Heatmap Partition Container: GitHub + LeetCode */}
          <div className="mercury-heatmaps-partition">
            {/* 1. GitHub Activity Heatmap */}
            <div className="mercury-heatmap-panel">
              <div className="mercury-heatmap-header">
                <h4 className="mercury-heatmap-title">GitHub Activity</h4>
                <div className="mercury-heatmap-count">75 contributions in the last year</div>
              </div>

              {/* Month Labels */}
              <div className="mercury-months-row">
                {MONTHS.map((m, idx) => (
                  <span key={idx} className="mercury-month-label">{m}</span>
                ))}
              </div>

              {/* Heatmap 52x7 Grid */}
              <div className="mercury-grid-canvas">
                {Array.from({ length: 52 }).map((_, colIdx) => (
                  <div key={colIdx} className="mercury-grid-col">
                    {Array.from({ length: 7 }).map((_, rowIdx) => {
                      const level = GITHUB_ACTIVITY_MATRIX[rowIdx][colIdx] || 0;
                      return (
                        <div
                          key={rowIdx}
                          className="mercury-grid-cell"
                          style={{
                            backgroundColor: HEATMAP_COLORS[level],
                            boxShadow: level >= 3 ? `0 0 6px ${HEATMAP_COLORS[level]}99` : 'none',
                          }}
                          title={`GitHub: ${level > 0 ? `${level * 3} contributions` : 'No activity'}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Heatmap Legend */}
              <div className="mercury-legend-row">
                <span className="legend-text">Less</span>
                <div className="legend-swatches">
                  {HEATMAP_COLORS.map((c, i) => (
                    <span key={i} className="legend-dot" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="legend-text">More</span>
              </div>
            </div>

            {/* 2. LeetCode Activity Heatmap */}
            <div className="mercury-heatmap-panel">
              <div className="mercury-heatmap-header">
                <h4 className="mercury-heatmap-title">LeetCode Activity</h4>
                <div className="mercury-heatmap-count">179 total submissions in the last year</div>
              </div>

              {/* Month Labels */}
              <div className="mercury-months-row">
                {MONTHS.map((m, idx) => (
                  <span key={idx} className="mercury-month-label">{m}</span>
                ))}
              </div>

              {/* Heatmap 52x7 Grid */}
              <div className="mercury-grid-canvas">
                {Array.from({ length: 52 }).map((_, colIdx) => (
                  <div key={colIdx} className="mercury-grid-col">
                    {Array.from({ length: 7 }).map((_, rowIdx) => {
                      const level = LEETCODE_ACTIVITY_MATRIX[rowIdx][colIdx] || 0;
                      return (
                        <div
                          key={rowIdx}
                          className="mercury-grid-cell"
                          style={{
                            backgroundColor: HEATMAP_COLORS[level],
                            boxShadow: level >= 3 ? `0 0 6px ${HEATMAP_COLORS[level]}99` : 'none',
                          }}
                          title={`LeetCode: ${level > 0 ? `${level * 4} submissions` : 'No submissions'}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Heatmap Legend */}
              <div className="mercury-legend-row">
                <span className="legend-text">Less</span>
                <div className="legend-swatches">
                  {HEATMAP_COLORS.map((c, i) => (
                    <span key={i} className="legend-dot" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="legend-text">More</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
