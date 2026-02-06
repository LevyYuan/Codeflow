import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { classNames } from '~/utils/classNames';
import { Switch } from '~/components/ui/Switch';
import type { UserProfile } from '~/components/@settings/core/types';
import { isMac } from '~/utils/os';
import type { DesignScheme } from '~/types/design-scheme';

// Helper to get modifier key symbols/text
const getModifierSymbol = (modifier: string): string => {
  switch (modifier) {
    case 'meta':
      return isMac ? '⌘' : 'Win';
    case 'alt':
      return isMac ? '⌥' : 'Alt';
    case 'shift':
      return '⇧';
    default:
      return modifier;
  }
};

// Predefined website themes from theme.html
const websiteThemes = [
  {
    name: '极简主义',
    subtitle: '永恒黑白',
    id: 'minimal',
    desc: 'Apple/Notion 风格，最适合内容密集型应用',
    palette: {
      primary: '#000000',
      secondary: '#6B7280',
      accent: '#3B82F6',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#DC2626',
    },
  },
  {
    name: '深邃',
    subtitle: '午夜深海',
    id: 'midnight',
    desc: 'Linear/Raycast 风格，高端 SaaS 首选',
    palette: {
      primary: '#818CF8',
      secondary: '#38BDF8',
      accent: '#F472B6',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: '#334155',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
    },
  },
  {
    name: '大地',
    subtitle: '暖调陶土',
    id: 'earth',
    desc: 'Notion/Dropbox 风格，有机温暖，适合创意类',
    palette: {
      primary: '#92400E',
      secondary: '#B45309',
      accent: '#E11D48',
      background: '#FFFBF7',
      surface: '#FEF3C7',
      text: '#292524',
      textSecondary: '#78716C',
      border: '#E7E5E4',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
    },
  },
  {
    name: '赛博',
    subtitle: '石墨霓虹',
    id: 'cyber',
    desc: 'Vercel/GitHub Dark 风格，开发者工具首选',
    palette: {
      primary: '#E2E8F0',
      secondary: '#64748B',
      accent: '#22D3EE',
      background: '#0A0A0A',
      surface: '#171717',
      text: '#FAFAFA',
      textSecondary: '#525252',
      border: '#262626',
      success: '#4ADE80',
      warning: '#FACC15',
      error: '#FB7185',
    },
  },
  {
    name: '冰川',
    subtitle: '冷调蓝灰',
    id: 'glacier',
    desc: 'Figma/Stripe 风格，专业冷静，适合 B2B',
    palette: {
      primary: '#0EA5E9',
      secondary: '#6366F1',
      accent: '#F43F5E',
      background: '#F0F9FF',
      surface: '#FFFFFF',
      text: '#0F172A',
      textSecondary: '#64748B',
      border: '#CBD5E1',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },
];

export default function SettingsTab() {
  const [currentTimezone, setCurrentTimezone] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    const saved = localStorage.getItem('bolt_website_theme');
    return saved || 'minimal';
  });
  const [settings, setSettings] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bolt_user_profile');
    return saved
      ? JSON.parse(saved)
      : {
          notifications: true,
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
  });

  useEffect(() => {
    setCurrentTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem('bolt_website_theme', themeId);

    // Update designScheme in localStorage for AI to use
    const theme = websiteThemes.find((t) => t.id === themeId);
    if (theme) {
      const designScheme: DesignScheme = {
        palette: theme.palette,
        features: ['rounded', 'gradient', 'shadow'],
        font: ['sans-serif'],
      };
      localStorage.setItem('bolt_design_scheme', JSON.stringify(designScheme));

      // Dispatch event for other components to update
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'bolt_design_scheme',
          newValue: JSON.stringify(designScheme),
        })
      );

      toast.success(`主题已切换至 ${theme.name}`);
    }
  };

  // Save settings automatically when they change
  useEffect(() => {
    try {
      // Get existing profile data
      const existingProfile = JSON.parse(localStorage.getItem('bolt_user_profile') || '{}');

      // Merge with new settings
      const updatedProfile = {
        ...existingProfile,
        notifications: settings.notifications,
        language: settings.language,
        timezone: settings.timezone,
      };

      localStorage.setItem('bolt_user_profile', JSON.stringify(updatedProfile));
      toast.success('Settings updated');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to update settings');
    }
  }, [settings]);

  return (
    <div className="space-y-4">
      {/* Website Theme Selector */}
      <motion.div
        className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow-sm dark:shadow-none p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="i-ph:palette-fill w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-bolt-elements-textPrimary">网站主题配色</span>
        </div>
        <p className="text-xs text-bolt-elements-textSecondary mb-4">
          选择预设主题，AI 将使用该配色方案生成网站
        </p>

        <div className="grid grid-cols-1 gap-3">
          {websiteThemes.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            const isDark = ['midnight', 'cyber'].includes(theme.id);

            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={classNames(
                  'relative p-4 rounded-xl text-left transition-all duration-200',
                  'border-2',
                  isSelected
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'border-[#E5E5E5] dark:border-[#1A1A1A] hover:border-purple-300 dark:hover:border-purple-700',
                )}
                style={{
                  backgroundColor: theme.palette.surface,
                }}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="i-ph:check w-3 h-3 text-white" />
                  </div>
                )}

                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-lg flex-shrink-0 shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${theme.palette.primary}, ${theme.palette.secondary})`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3
                        className="font-bold text-base"
                        style={{ color: theme.palette.text }}
                      >
                        {theme.name}
                      </h3>
                      <span
                        className="text-sm"
                        style={{ color: theme.palette.textSecondary }}
                      >
                        · {theme.subtitle}
                      </span>
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: theme.palette.textSecondary }}
                    >
                      {theme.desc}
                    </p>
                  </div>
                </div>

                {/* Color Preview */}
                <div className="flex gap-1.5">
                  {Object.entries(theme.palette)
                    .slice(0, 6)
                    .map(([key, color]) => (
                      <div
                        key={key}
                        className="w-6 h-6 rounded-md shadow-sm flex-shrink-0"
                        style={{ backgroundColor: color }}
                        title={key}
                      />
                    ))}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Language & Notifications */}
      <motion.div
        className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow-sm dark:shadow-none p-4 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="i-ph:palette-fill w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-bolt-elements-textPrimary">Preferences</span>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="i-ph:translate-fill w-4 h-4 text-bolt-elements-textSecondary" />
            <label className="block text-sm text-bolt-elements-textSecondary">Language</label>
          </div>
          <select
            value={settings.language}
            onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value }))}
            className={classNames(
              'w-full px-3 py-2 rounded-lg text-sm',
              'bg-[#FAFAFA] dark:bg-[#0A0A0A]',
              'border border-[#E5E5E5] dark:border-[#1A1A1A]',
              'text-bolt-elements-textPrimary',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/30',
              'transition-all duration-200',
            )}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
            <option value="ru">Русский</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="i-ph:bell-fill w-4 h-4 text-bolt-elements-textSecondary" />
            <label className="block text-sm text-bolt-elements-textSecondary">Notifications</label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-bolt-elements-textSecondary">
              {settings.notifications ? 'Notifications are enabled' : 'Notifications are disabled'}
            </span>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => {
                // Update local state
                setSettings((prev) => ({ ...prev, notifications: checked }));

                // Update localStorage immediately
                const existingProfile = JSON.parse(localStorage.getItem('bolt_user_profile') || '{}');
                const updatedProfile = {
                  ...existingProfile,
                  notifications: checked,
                };
                localStorage.setItem('bolt_user_profile', JSON.stringify(updatedProfile));

                // Dispatch storage event for other components
                window.dispatchEvent(
                  new StorageEvent('storage', {
                    key: 'bolt_user_profile',
                    newValue: JSON.stringify(updatedProfile),
                  }),
                );

                toast.success(`Notifications ${checked ? 'enabled' : 'disabled'}`);
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Timezone */}
      <motion.div
        className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow-sm dark:shadow-none p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="i-ph:clock-fill w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-bolt-elements-textPrimary">Time Settings</span>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="i-ph:globe-fill w-4 h-4 text-bolt-elements-textSecondary" />
            <label className="block text-sm text-bolt-elements-textSecondary">Timezone</label>
          </div>
          <select
            value={settings.timezone}
            onChange={(e) => setSettings((prev) => ({ ...prev, timezone: e.target.value }))}
            className={classNames(
              'w-full px-3 py-2 rounded-lg text-sm',
              'bg-[#FAFAFA] dark:bg-[#0A0A0A]',
              'border border-[#E5E5E5] dark:border-[#1A1A1A]',
              'text-bolt-elements-textPrimary',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/30',
              'transition-all duration-200',
            )}
          >
            <option value={currentTimezone}>{currentTimezone}</option>
          </select>
        </div>
      </motion.div>

      {/* Simplified Keyboard Shortcuts */}
      <motion.div
        className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow-sm dark:shadow-none p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="i-ph:keyboard-fill w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-bolt-elements-textPrimary">Keyboard Shortcuts</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#1A1A1A]">
            <div className="flex flex-col">
              <span className="text-sm text-bolt-elements-textPrimary">Toggle Theme</span>
              <span className="text-xs text-bolt-elements-textSecondary">Switch between light and dark mode</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 text-xs font-semibold text-bolt-elements-textSecondary bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#1A1A1A] rounded shadow-sm">
                {getModifierSymbol('meta')}
              </kbd>
              <kbd className="px-2 py-1 text-xs font-semibold text-bolt-elements-textSecondary bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#1A1A1A] rounded shadow-sm">
                {getModifierSymbol('alt')}
              </kbd>
              <kbd className="px-2 py-1 text-xs font-semibold text-bolt-elements-textSecondary bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#1A1A1A] rounded shadow-sm">
                {getModifierSymbol('shift')}
              </kbd>
              <kbd className="px-2 py-1 text-xs font-semibold text-bolt-elements-textSecondary bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#1A1A1A] rounded shadow-sm">
                D
              </kbd>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
