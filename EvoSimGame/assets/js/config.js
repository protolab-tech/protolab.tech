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
    resources: { min: 0, max: 1000, step: 20, default: 600 },
    temperature: { min: 0, max: 100, step: 1, default: 50 },
    stability: { min: 0, max: 100, step: 1, default: 60 },
    radiation: { min: 0, max: 8, step: 1, default: 2 },
    
    // Genome controls (3-bit: 0-7 per PRD, effects amplified via scaling)
    fertility: { min: 0, max: 7, step: 1, default: 3 },
    resistance: { min: 0, max: 7, step: 1, default: 3 },
    efficiency: { min: 0, max: 7, step: 1, default: 4 },
    aggressivity: { min: 0, max: 7, step: 1, default: 2 },
    infectivity: { min: 0, max: 7, step: 1, default: 0 },
    
    // Map zone controls (natural grid sizes)
    scatter: { 
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Natural grid sizes 1x1 to 10x10
      default: 1,
      labels: ['1x1', '2x2', '3x3', '4x4', '5x5', '6x6', '7x7', '8x8', '9x9', '10x10']
    },
    variance: { min: 5, max: 50, step: 5, default: 20 }
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
    maxFood: 6000, // Increased from 1500
    
    // Energy and health
    foodEnergy: 18,
    baseDrain: 0.65, // Energy drain per second (increased for more natural death cycles)
    healthDrainTemp: 8.0, // Health drain from temperature mismatch (increased)
    reproductionThreshold: 60, // Energy needed to reproduce
    reproductionCost: 35, // Energy cost to split
    
    // Movement physics
    baseJitter: { min: 16, max: 100 }, // Movement noise range (2x faster)
    baseWander: { min: 12, max: 50 }, // Base movement speed range (2x faster)
    baseFriction: { min: 0.85, max: 0.98 }, // Friction range
    
    // Spatial partitioning
    gridCellSize: 26, // Spatial hash grid size
    
    // Food spawning
    foodSpawnBase: 12, // Base food spawn rate (reduced for more competition)
    foodSpawnVariability: 0.4, // Random factor in food spawning (increased variability)
    stabilityFoodFactor: { min: 0.5, max: 1.3 } // Stability effect on food (reduced range)
  },

  // ========== GENETIC SYSTEM ==========
  genetics: {
    // Genome ranges (3-bit per PRD: 0-7, effects scaled via multipliers)
    genomeMin: 0,
    genomeMax: 7,
    
            // Mutation system
            mutationStrengthMax: 3, // Maximum mutation delta (increased from 2)
            mutationChanceRepro: 0.8, // Chance of mutation during reproduction (only time mutations occur)
    
            // Radiation effects
            radiationHealthDamage: 8, // Health damage per second at max radiation
            radiationDeathLevel: 12, // Radiation level that causes instant death (increased from 8)
    
    // Trait mappings (3-bit genome 0-7, but effects amplified) - INCREASED FOR BETTER VISIBILITY
    fertilityShapeRange: { min: 3, max: 20 }, // Polygon sides range (0->3, 7->20)
    efficiencyRadiusRange: { min: 5, max: 20 }, // Cell size range (0->5, 7->20) - INCREASED
    aggressivityHuntRange: { min: 4, max: 18 }, // Hunt radius range (0->4, 7->18)
    aggressivityThreshold: 3, // Minimum aggressivity to hunt (PRD spec)
    aggressivityGlowScale: 2.5, // Amplify glow effect (0-7 * 2.5 = 0-17.5 range)
    resistanceColorScale: 2.0, // Amplify color range (0-7 * 2.0 = 0-14 effective range)
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
            infectivityThreshold: 3, // Minimum infectivity to start plague timer (PRD spec)
    
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

  // ========== RESOURCE RECYCLING ==========
  recycling: {
    // Energy recovery rates
    baseRecyclingRate: 0.8, // Fraction of base biomass returned
    energyRecyclingRate: 0.7, // Fraction of remaining energy returned
    ageBonusRate: 2.0, // Energy bonus per second of age
    maxAgeBonus: 0.5, // Maximum age bonus as fraction of food energy
    
    // Proximity-based distribution (natural death site feeding)
    proximityRadius: { min: 0.2, max: 0.8 }, // Fraction of cell radius for tight clustering
    clusterTightness: 0.3, // Randomness in angle (lower = tighter cluster)
    freshCarrionBonus: 1.5, // Energy multiplier for immediate pickup food
    
    // Food particle generation
    sizeMultiplier: 1/6, // Cell size to food particle ratio
    energyMultiplier: 1/40, // Energy threshold for extra particles
    particleVariation: { min: 0.8, max: 1.2 }, // Random variation in particle count
    
    // Visual effects
    recycledFoodAlpha: { min: 0.8, max: 1.0 }, // More visible than regular food
    freshCarrionAlpha: 1.0, // Maximum visibility for immediate pickup
    logThreshold: { age: 20, energy: 60, particles: 2 }, // Log significant deaths
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
    // Skip validation for scatter control which uses values array instead of min/max
    if (key === 'scatter') {
      if (!control.values || !Array.isArray(control.values) || control.values.length === 0) {
        errors.push(`Control ${key}: must have a non-empty values array`);
      }
      if (control.default !== undefined && !control.values.includes(control.default)) {
        errors.push(`Control ${key}: default (${control.default}) must be one of the values: ${control.values.join(', ')}`);
      }
      continue;
    }
    
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
