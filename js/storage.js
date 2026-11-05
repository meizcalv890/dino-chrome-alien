import { STORAGE_KEYS } from "./config.js";

export const Storage = {
  getBest() {
    return Number(localStorage.getItem(STORAGE_KEYS.BEST)) || 0;
  },

  saveBest(score) {
    const current = this.getBest();

    if (score > current) {
      localStorage.setItem(STORAGE_KEYS.BEST, String(score));
      return score;
    }

    return current;
  },

  getSoundEnabled() {
    return localStorage.getItem(STORAGE_KEYS.SOUND) !== "false";
  },

  setSoundEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.SOUND, String(enabled));
  },
};
