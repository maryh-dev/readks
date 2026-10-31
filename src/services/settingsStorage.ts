import { UserSettings, ThemeMode } from '../types/book';

const SETTINGS_KEY = 'readks_user_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'auto',
  fontSize: 'md',
  reduceMotion: false,
  highContrast: false,
  viewMode: 'grid',
  sortBy: 'recent',
};

/**
 * Lê as configurações do localStorage
 */
export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch (e) {
    console.error('Erro ao ler configurações do usuário:', e);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Salva e persiste alterações nas configurações
 */
export function saveSettings(updates: Partial<UserSettings>): UserSettings {
  const current = getSettings();
  const next: UserSettings = {
    ...current,
    ...updates,
  };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  } catch (e) {
    console.error('Erro ao salvar configurações no localStorage:', e);
  }
  applySettingsToDOM(next);
  return next;
}

/**
 * Redefine para as configurações padrão
 */
export function resetSettings(): UserSettings {
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (e) {
    console.error('Erro ao redefinir configurações:', e);
  }
  applySettingsToDOM(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

/**
 * Aplica as preferências de acessibilidade e tema no DOM global
 */
export function applySettingsToDOM(settings: UserSettings): void {
  const root = document.documentElement;

  // 1. Aplica o Tema Claro / Escuro / Automático
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark =
    settings.theme === 'dark' || (settings.theme === 'auto' && prefersDark);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // 2. Aplica o Tamanho de Fonte
  root.setAttribute('data-font-size', settings.fontSize || 'md');

  // 3. Aplica Movimento Reduzido
  if (settings.reduceMotion) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }

  // 4. Aplica Alto Contraste
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
}
