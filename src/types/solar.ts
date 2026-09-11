export type CelestialBodyType = 'star' | 'planet' | 'home';

export type SurfaceShaderTheme =
  | 'sun'
  | 'mercury'   // Resume
  | 'venus'     // Skills
  | 'earth'     // Earth
  | 'mars'      // Projects
  | 'jupiter'   // Experience
  | 'saturn'    // About Me
  | 'uranus'    // Guestbook
  | 'neptune';  // Contact

export interface RingConfig {
  innerRadius: number;
  outerRadius: number;
  color: string;
  opacity: number;
  tilt?: number;
}

export interface CelestialBodyData {
  id: string;
  name: string;
  label: string;
  tagline: string;
  type: CelestialBodyType;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number; // orbital angular velocity (rad/s factor)
  inclination: number; // orbital tilt in radians
  eccentricity: number; // 0 = circular, 0.05 - 0.15 = organic ellipse
  initialAngle: number;
  rotationSpeed: number; // self-rotation speed
  axialTilt?: number; // planetary axial tilt in radians
  color: string;
  emissiveColor?: string;
  surfaceTheme: SurfaceShaderTheme;
  rings?: RingConfig;
  hasMoons?: boolean;
  atmosphereColor?: string;
  atmosphereScale?: number;
  atmosphereOpacity?: number;
  discovered?: boolean;
}

export type FlightPhase =
  | 'IDLE'
  | 'FOCUS_DEPARTURE'
  | 'HOLD_DEPARTURE'
  | 'VERTICAL_ASCENT'
  | 'TRANSITION_TURN'
  | 'DIRECT_CRUISE'
  | 'APPROACH_DOCK';

export type FlightStatus =
  | 'DOCKED'
  | 'LAUNCHING'
  | 'CRUISING'
  | 'BRAKING'
  | 'ARRIVED'
  | 'SUPERNOVA_WARN'
  | 'SUPERNOVA_EXPLODING'
  | 'SUPERNOVA_RESETTING';

export interface FlightTelemetry {
  status: FlightStatus;
  originId: string;
  targetId: string | null;
  progress: number; // 0 to 1
  currentSpeedKmS: number;
  distanceToTargetKm: number;
  gForce: number;
}

export interface TargetLock {
  id: string;
  name: string;
  label: string;
  distance: number;
  isSun: boolean;
}
