export const CONFIG = {
  WIDTH: 960,
  HEIGHT: 360,

  GROUND_Y: 292,

  PLAYER: {
    X: 105,
    WIDTH: 48,
    HEIGHT: 48,
    DUCK_HEIGHT: 30,
    GRAVITY: 1850,
    JUMP_FORCE: -660,
    DUCK_FALL_MULTIPLIER: 2.1,
  },

  DIFFICULTY: {
    START_SPEED: 360,
    MAX_SPEED: 720,
    SPEED_INCREASE: 8,
    INCREASE_INTERVAL: 10,
  },

  OBSTACLES: {
    MIN_GAP: 300,
    MAX_GAP: 490,
    SPAWN_MARGIN: 80,
  },

  COLORS: {
    background: "#101810",
    dark: "#080d09",
    green: "#75d64b",
    lime: "#c5ff76",
    forest: "#263c27",
    stone: "#657b67",
    mist: "#a4d9b5",
    highlight: "#d8f5d0",
  },
};

export const STORAGE_KEYS = {
  BEST: "dinoChromeAlienBest",
  SOUND: "dinoChromeAlienSound",
};
