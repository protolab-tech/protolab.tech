/**
 * EvoSimGame Configuration
 * 
 * This file contains all configurable parameters for the evolution simulation.
 * Modify these values to adjust simulation behavior, limits, and performance.
 */

const EvoSimConfig = {
  // ========== UI CONTROL LIMITS ==========
  controls: {
    // Environment controls
    resources: { min: 0, max: 200, step: 1, default: 50 },
    temperature: { min: 0, max: 100, step: 1, default: 50 },
    stability: { min: 0, max: 100, step: 1, default: 60 },
    radiation: { min: 0, max: 15, step: 1, default: 2 },
    
    // Genome controls (0-15 for more variety)
    fertility: { min: 0, max: 15, step: 1, default: 3 },
    resistance: { min: 0, max: 15, step: 1, default: 3 },
    efficiency: { min: 0, max: 15, step: 1, default: 4 },
    aggressivity: { min: 0, max: 15, step: 1, default: 2 },
    infectivity: { min: 0, max: 15, step: 1, default: 0 }
  },

  // ========== SIMULATION PARAMETERS ==========
  simulation: {
    // Performance settings
    maxFPS: 60,
    maxDeltaTime: 0.033, // Cap frame time for stability
    devicePixelRatioMax: 2, // Cap DPR for performance
    
    // Population limits
    maxCellsSoft: 1500, // Increased from 700
    maxCellsHard: 2500, // Hard limit before forced culling
    maxFood: 3000, // Increased from 1500
    
    // Energy and health
    foodEnergy: 18,
    baseDrain: 0.9, // Energy drain per second
    healthDrainTemp: 6.0, // Health drain from temperature mismatch
    reproductionThreshold: 60, // Energy needed to reproduce
    reproductionCost: 35, // Energy cost to split
    
    // Movement physics
    baseJitter: { min: 8, max: 50 }, // Movement noise range
    baseWander: { min: 6, max: 25 }, // Base movement speed range
    baseFriction: { min: 0.85, max: 0.98 }, // Friction range
    
    // Spatial partitioning
    gridCellSize: 26, // Spatial hash grid size
    
    // Food spawning
    foodSpawnBase: 15, // Base food spawn rate (increased from 10)
    foodSpawnVariability: 0.3, // Random factor in food spawning
    stabilityFoodFactor: { min: 0.6, max: 1.5 } // Stability effect on food
  },

  // ========== GENETIC SYSTEM ==========
  genetics: {
    // Genome ranges (now supports 0-15 instead of 0-7)
    genomeMin: 0,
    genomeMax: 15,
    
    // Mutation system
    mutationStrengthMax: 3, // Maximum mutation delta (increased from 2)
    mutationChanceLive: 0.03, // Chance of live mutation per frame (increased)
    mutationChanceRepro: 0.8, // Chance of mutation during reproduction
    
    // Radiation effects
    radiationMutationScale: 12, // Radiation scaling factor (increased from 8)
    radiationDeathLevel: 12, // Radiation level that causes instant death (increased from 8)
    
    // Trait mappings
    fertilityShapeRange: { min: 3, max: 20 }, // Polygon sides range
    efficiencyRadiusRange: { min: 3.5, max: 15 }, // Cell size range
    aggressivityHuntRange: { min: 4, max: 18 }, // Hunt radius range
    aggressivityThreshold: 5, // Minimum aggressivity to hunt (increased from 3)
  },

  // ========== PLAGUE SYSTEM ==========
  plague: {
    // Density triggers
    densityTrigger: 0.00012, // Cells per pixel² to trigger plague (decreased for easier triggering)
    densityScale: 1.5, // Scaling factor for density calculations
    
    // Plague timers
    timerBase: 6.0, // Base plague timer in seconds (increased)
    timerMin: 0.8, // Minimum plague timer (decreased)
    timerPressureScale: 1.5, // How much density affects timer
    
    // Spread mechanics
    spreadBase: 12, // Base spread radius (increased from 10)
    spreadPerLevel: 8, // Additional radius per infectivity level (increased from 6)
    infectivityThreshold: 5, // Minimum infectivity to start plague timer (increased from 3)
    
    // Transmission
    transmissionChance: 0.3, // Base chance to transmit infection
    transmissionBonus: 0.15, // Bonus per infectivity level
  },

  // ========== PREDATION SYSTEM ==========
  predation: {
    // Energy gains
    baseEnergyGain: 30, // Base energy from killing (increased from 25)
    energyGainFactor: 0.4, // Fraction of victim's energy gained (increased from 0.35)
    
    // Size requirements
    minSizeDifference: 0.8, // Minimum size ratio to hunt (predator/prey)
    huntRadiusBase: 6, // Base hunt radius addition
    huntRadiusScale: 12, // Scale factor for aggressivity
  },

  // ========== REPRODUCTION SYSTEM ==========
  reproduction: {
    // Rate controls
    baseRate: { min: 0.08, max: 1.2 }, // Fertility rate range (increased max from 0.75)
    stabilityPenalty: 0.2, // How much instability reduces reproduction
    crowdingFactor: 1.0, // How much crowding reduces reproduction
    
    // Inheritance
    energyInheritance: 0.5, // Fraction of parent energy inherited (increased from 0.45)
    healthInheritance: { min: -8, max: 5 }, // Health variation range
    healthInheritanceBase: { min: 45, max: 100 }, // Health range for offspring
    
    // Positioning
    spawnRadius: 2.5, // Multiplier for spawn distance from parent
  },

  // ========== VISUAL SETTINGS ==========
  visuals: {
    // Colors (RGB arrays)
    coldColor: [37, 99, 235], // Blue for cold resistance
    hotColor: [239, 68, 68], // Red for hot resistance
    
    // Rendering
    glowThreshold: 0.5, // Aggressivity level for glow effect
    maxGlowBlur: 20, // Maximum glow blur radius
    
    // Health bars
    healthBarWidth: 2.2, // Health bar width multiplier
    healthBarOffset: 4, // Distance from cell center
    
    // HUD
    hudPillOpacity: 0.28, // HUD pill background opacity
    hudOffset: 12, // HUD distance from edge
    
    // Temperature visualization
    tempGreenZone: { min: 35, max: 65 }, // Optimal temperature range
    tempMarkerSize: 2, // Temperature marker width
  },

  // ========== PERFORMANCE TUNING ==========
  performance: {
    // Culling thresholds
    cullWhenOverPopulated: true,
    cullHealthThreshold: -50, // Health below which cells are culled
    cullEnergyThreshold: -20, // Energy below which cells are culled
    
    // Update frequencies
    spatialHashUpdatesPerFrame: 1, // How often to rebuild spatial hash
    hudUpdateFrequency: 3, // Update HUD every N frames
    
    // Memory management
    maxFoodHistory: 100, // Maximum food items to track
    maxCellHistory: 50, // Maximum cells to track for statistics
    
    // Rendering optimizations
    skipRenderWhenFast: false, // Skip rendering when simulation is too fast
    maxRenderObjects: 5000, // Maximum objects to render per frame
  },

  // ========== EXPERIMENTAL FEATURES ==========
  experimental: {
    // Advanced genetics
    enableEpigenetics: false, // Environmental trait modifications
    enableHybridization: false, // Cross-species breeding
    enableSpeciation: false, // Automatic species classification
    
    // Advanced physics
    enableGravity: false, // Gravitational attraction between cells
    enableFlocking: false, // Flocking behavior for similar cells
    enableTerrain: false, // Terrain effects on movement
    
    // Advanced ecology
    enableSeasons: false, // Seasonal environmental changes
    enableMigration: false, // Long-distance movement patterns
    enableSymbiosis: false, // Beneficial relationships between cells
    
    // Performance features
    enableMultithreading: false, // Web Workers for calculations
    enableGPUAcceleration: false, // WebGL for rendering
  }
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Get a configuration value with fallback
 */
EvoSimConfig.get = function(path, fallback = null) {
  const keys = path.split('.');
  let current = this;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return fallback;
    }
  }
  
  return current;
};

/**
 * Set a configuration value
 */
EvoSimConfig.set = function(path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = this;
  
  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
};

/**
 * Validate configuration values
 */
EvoSimConfig.validate = function() {
  const errors = [];
  
  // Check control ranges
  for (const [key, control] of Object.entries(this.controls)) {
    if (control.min >= control.max) {
      errors.push(`Control ${key}: min (${control.min}) must be less than max (${control.max})`);
    }
    if (control.default < control.min || control.default > control.max) {
      errors.push(`Control ${key}: default (${control.default}) must be between min and max`);
    }
  }
  
  // Check simulation parameters
  if (this.simulation.maxCellsSoft >= this.simulation.maxCellsHard) {
    errors.push('maxCellsSoft must be less than maxCellsHard');
  }
  
  if (this.genetics.genomeMin >= this.genetics.genomeMax) {
    errors.push('genomeMin must be less than genomeMax');
  }
  
  return errors;
};

/**
 * Export configuration for use in main simulation
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EvoSimConfig;
} else if (typeof window !== 'undefined') {
  window.EvoSimConfig = EvoSimConfig;
}
