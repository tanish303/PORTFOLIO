import type { CelestialBodyData } from '../types/solar';

export const SUN_DATA: CelestialBodyData = {
  id: 'sun',
  name: 'Sun // Helios Core',
  label: 'SUN',
  tagline: 'SOLAR DYNAMO // GRAVITATIONAL ANCHOR',
  type: 'star',
  radius: 6.8,
  orbitRadius: 0,
  orbitSpeed: 0,
  inclination: 0,
  eccentricity: 0,
  initialAngle: 0,
  rotationSpeed: 0.03,
  color: '#ffaa00',
  emissiveColor: '#ff5500',
  surfaceTheme: 'sun',
  atmosphereColor: '#ffaa00',
  atmosphereScale: 1.3,
  atmosphereOpacity: 0.75,
};

export const MERCURY_DATA: CelestialBodyData = {
  id: 'skills',
  name: 'Mercury // Skills',
  label: 'SKILLS',
  tagline: 'MERCURY // TECH STACK & LANGUAGES',
  type: 'planet',
  radius: 1.8,
  orbitRadius: 18,
  orbitSpeed: 0.20,
  inclination: 0.06,
  eccentricity: 0.05,
  initialAngle: 0.5,
  rotationSpeed: 0.25,
  axialTilt: 0.01,
  color: '#94a3b8',
  surfaceTheme: 'mercury',
  atmosphereColor: '#64748b',
  atmosphereScale: 1.08,
  atmosphereOpacity: 0.2,
};

export const VENUS_DATA: CelestialBodyData = {
  id: 'experience',
  name: 'Venus // Experience',
  label: 'EXPERIENCE',
  tagline: 'VENUS // WORK & INTERNSHIPS',
  type: 'planet',
  radius: 2.4,
  orbitRadius: 31,
  orbitSpeed: 0.15,
  inclination: -0.04,
  eccentricity: 0.02,
  initialAngle: 2.3,
  rotationSpeed: -0.15,
  axialTilt: 3.1,
  color: '#facc15',
  surfaceTheme: 'venus',
  atmosphereColor: '#fef08a',
  atmosphereScale: 1.15,
  atmosphereOpacity: 0.55,
};

export const EARTH_DATA: CelestialBodyData = {
  id: 'earth',
  name: 'Earth // Terra Base',
  label: 'EARTH',
  tagline: 'STARTING POINT // MISSION CONTROL',
  type: 'home',
  radius: 2.7,
  orbitRadius: 46,
  orbitSpeed: 0.11,
  inclination: 0.03,
  eccentricity: 0.02,
  initialAngle: 4.1,
  rotationSpeed: 0.35,
  axialTilt: 0.41,
  color: '#2563eb',
  surfaceTheme: 'earth',
  atmosphereColor: '#38bdf8',
  atmosphereScale: 1.18,
  atmosphereOpacity: 0.55,
};

export const PROJECTS_DATA: CelestialBodyData = {
  id: 'projects',
  name: 'Mars // Projects',
  label: 'PROJECTS',
  tagline: 'MARS // EXPEDITIONS & SHIPPED WORK',
  type: 'planet',
  radius: 2.1,
  orbitRadius: 63,
  orbitSpeed: 0.09,
  inclination: 0.07,
  eccentricity: 0.045,
  initialAngle: 0.9,
  rotationSpeed: 0.3,
  axialTilt: 0.44,
  color: '#ef4444',
  surfaceTheme: 'mars',
  atmosphereColor: '#f87171',
  atmosphereScale: 1.12,
  atmosphereOpacity: 0.35,
};

export const JUPITER_DATA: CelestialBodyData = {
  id: 'education',
  name: 'Jupiter // Education',
  label: 'EDUCATION',
  tagline: 'JUPITER // ACADEMIC JOURNEY & DEGREES',
  type: 'planet',
  radius: 4.6,
  orbitRadius: 84,
  orbitSpeed: 0.065,
  inclination: -0.05,
  eccentricity: 0.03,
  initialAngle: 3.1,
  rotationSpeed: 0.45,
  axialTilt: 0.05,
  color: '#f59e0b',
  surfaceTheme: 'jupiter',
  atmosphereColor: '#fde68a',
  atmosphereScale: 1.12,
  atmosphereOpacity: 0.38,
};

export const SATURN_DATA: CelestialBodyData = {
  id: 'guestbook',
  name: 'Saturn // Guestbook',
  label: 'GUESTBOOK',
  tagline: 'SATURN // VISITOR TRANSMISSIONS',
  type: 'planet',
  radius: 3.8,
  orbitRadius: 110,
  orbitSpeed: 0.048,
  inclination: 0.05,
  eccentricity: 0.04,
  initialAngle: 5.2,
  rotationSpeed: 0.4,
  axialTilt: 0.47,
  color: '#fde047',
  surfaceTheme: 'saturn',
  rings: {
    innerRadius: 4.8,
    outerRadius: 8.8,
    color: '#fef08a',
    opacity: 0.92,
    tilt: 0.47,
  },
  atmosphereColor: '#fef08a',
  atmosphereScale: 1.12,
  atmosphereOpacity: 0.35,
};

export const URANUS_DATA: CelestialBodyData = {
  id: 'contact',
  name: 'Uranus // Contact',
  label: 'CONTACT',
  tagline: 'URANUS // GET IN TOUCH',
  type: 'planet',
  radius: 3.1,
  orbitRadius: 136,
  orbitSpeed: 0.035,
  inclination: -0.05,
  eccentricity: 0.03,
  initialAngle: 1.8,
  rotationSpeed: 0.28,
  axialTilt: 1.7,
  color: '#67e8f9',
  surfaceTheme: 'uranus',
  hasMoons: true,
  atmosphereColor: '#a5f3fc',
  atmosphereScale: 1.14,
  atmosphereOpacity: 0.4,
};

export const NEPTUNE_DATA: CelestialBodyData = {
  id: 'askai',
  name: 'Neptune // Ask AI',
  label: 'ASK AI',
  tagline: 'NEPTUNE // AI ASSISTANT',
  type: 'planet',
  radius: 3.0,
  orbitRadius: 162,
  orbitSpeed: 0.026,
  inclination: 0.08,
  eccentricity: 0.04,
  initialAngle: 3.7,
  rotationSpeed: 0.3,
  axialTilt: 0.49,
  color: '#2563eb',
  surfaceTheme: 'neptune',
  atmosphereColor: '#60a5fa',
  atmosphereScale: 1.16,
  atmosphereOpacity: 0.45,
};

export const SECTION_PLANETS: CelestialBodyData[] = [
  MERCURY_DATA,
  VENUS_DATA,
  PROJECTS_DATA,
  JUPITER_DATA,
  SATURN_DATA,
  URANUS_DATA,
  NEPTUNE_DATA,
];

export const ALL_CELESTIAL_BODIES: CelestialBodyData[] = [
  SUN_DATA,
  MERCURY_DATA,
  VENUS_DATA,
  EARTH_DATA,
  PROJECTS_DATA,
  JUPITER_DATA,
  SATURN_DATA,
  URANUS_DATA,
  NEPTUNE_DATA,
];

// Calculate orbital position at any time t
export function calculateOrbitalPosition(
  body: CelestialBodyData,
  elapsedTime: number
): [number, number, number] {
  if (body.orbitRadius === 0) {
    return [0, 0, 0];
  }

  const theta = body.initialAngle + elapsedTime * body.orbitSpeed;
  const r = body.orbitRadius * (1 - body.eccentricity * Math.sin(theta));

  const x = r * Math.cos(theta);
  const z = r * Math.sin(theta);
  const y = z * Math.sin(body.inclination);
  const adjustedZ = z * Math.cos(body.inclination);

  return [x, y, adjustedZ];
}
