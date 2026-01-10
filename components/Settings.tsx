import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import {
  Palette,
  Type,
  Zap,
  Layout,
  Bell,
  Eye,
  Settings as SettingsIcon,
  RotateCcw,
  Check,
  Monitor,
  Sun,
  Moon,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  AlertCircle,
  Info,
} from 'lucide-react';

interface SettingsSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ icon: Icon, title, description, children }) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm hover:border-slate-700 transition-all duration-300">
    <div className="flex items-start gap-4 mb-6">
      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({ label, description, children }) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <div className="flex-1">
      <label className="text-sm font-medium text-slate-200 block mb-1">{label}</label>
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </div>
    <div className="flex-shrink-0">
      {children}
    </div>
  </div>
);

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
      checked ? 'bg-cyan-500' : 'bg-slate-700'
    }`}
  >
    <span
      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
        checked ? 'transform translate-x-6' : ''
      }`}
    />
  </button>
);

interface SelectProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ value, options, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all duration-200"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

interface ColorPickerProps {
  value: string;
  colors: string[];
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, colors, onChange }) => (
  <div className="flex gap-2">
    {colors.map((color) => (
      <button
        key={color}
        onClick={() => onChange(color)}
        className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
          value === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
        }`}
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
);

const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const accentColors = [
    '#06b6d4', // cyan
    '#8b5cf6', // purple
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#3b82f6', // blue
    '#ec4899', // pink
    '#f97316', // orange
  ];

  const handleUpdate = async (updates: any) => {
    setSaveStatus('saving');
    await updateSettings(updates);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      await resetSettings();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
          <p className="text-slate-400">Customize your Parallax experience</p>
        </div>
        <div className="flex gap-3">
          {saveStatus === 'saved' && (
            <div className="flex items-center gap-2 text-green-400 animate-fadeIn">
              <Check className="w-4 h-4" />
              <span className="text-sm">Saved</span>
            </div>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6">
        {/* API Keys Section */}
        <SettingsSection
          icon={Key}
          title="API Keys"
          description="Securely manage your API credentials (stored in encrypted storage)"
        >
          <SettingRow
            label="Gemini API Key"
            description="Required for AI-powered dork generation and analysis"
          >
            <div className="flex gap-2 items-center">
              <input
                type="password"
                value={settings.apiKeys.geminiApiKey}
                onChange={(e) => handleUpdate({ apiKeys: { ...settings.apiKeys, geminiApiKey: e.target.value } })}
                placeholder="Enter your Gemini API key..."
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all duration-200 w-64 font-mono"
              />
              {settings.apiKeys.geminiApiKey && (
                <Check className="w-4 h-4 text-green-400" />
              )}
            </div>
          </SettingRow>
          <div className="mt-4 p-3 bg-cyan-900/10 border border-cyan-700/20 rounded-lg">
            <p className="text-xs text-cyan-200/80 flex items-start gap-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-cyan-400">Get your free API key:</strong> Visit{' '}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-cyan-300"
                >
                  Google AI Studio
                </a>{' '}
                to create a free Gemini API key. Your key is encrypted and stored locally - it never leaves your device.
              </span>
            </p>
          </div>
        </SettingsSection>

        {/* Theme Settings */}
        <SettingsSection
          icon={Palette}
          title="Theme & Appearance"
          description="Customize the look and feel of your interface"
        >
          <SettingRow label="Theme Mode" description="Choose your preferred theme">
            <Select
              value={settings.theme.mode}
              options={[
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
                { value: 'auto', label: 'Auto' },
              ]}
              onChange={(value) => handleUpdate({ theme: { ...settings.theme, mode: value as any } })}
            />
          </SettingRow>

          <SettingRow label="Accent Color" description="Primary color throughout the app">
            <ColorPicker
              value={settings.theme.accentColor}
              colors={accentColors}
              onChange={(color) => handleUpdate({ theme: { ...settings.theme, accentColor: color } })}
            />
          </SettingRow>

          <SettingRow label="Border Radius" description="Roundness of UI elements">
            <Select
              value={settings.theme.borderRadius}
              options={[
                { value: 'none', label: 'None' },
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ]}
              onChange={(value) => handleUpdate({ theme: { ...settings.theme, borderRadius: value as any } })}
            />
          </SettingRow>

          <SettingRow label="Glass Effect" description="Enable glassmorphism backdrop blur">
            <ToggleSwitch
              checked={settings.theme.glassEffect}
              onChange={(checked) => handleUpdate({ theme: { ...settings.theme, glassEffect: checked } })}
            />
          </SettingRow>
        </SettingsSection>

        {/* Font Settings */}
        <SettingsSection
          icon={Type}
          title="Typography"
          description="Adjust text appearance and readability"
        >
          <SettingRow label="Font Size" description="Base text size across the app">
            <Select
              value={settings.font.size}
              options={[
                { value: 'xs', label: 'Extra Small' },
                { value: 'sm', label: 'Small' },
                { value: 'base', label: 'Medium' },
                { value: 'lg', label: 'Large' },
                { value: 'xl', label: 'Extra Large' },
              ]}
              onChange={(value) => handleUpdate({ font: { ...settings.font, size: value as any } })}
            />
          </SettingRow>

          <SettingRow label="Line Height" description="Spacing between lines of text">
            <Select
              value={settings.font.lineHeight}
              options={[
                { value: 'tight', label: 'Tight' },
                { value: 'normal', label: 'Normal' },
                { value: 'relaxed', label: 'Relaxed' },
              ]}
              onChange={(value) => handleUpdate({ font: { ...settings.font, lineHeight: value as any } })}
            />
          </SettingRow>
        </SettingsSection>

        {/* Animation Settings */}
        <SettingsSection
          icon={Zap}
          title="Animations & Effects"
          description="Control motion and visual effects"
        >
          <SettingRow label="Enable Animations" description="Turn animations on or off">
            <ToggleSwitch
              checked={settings.animations.enabled}
              onChange={(checked) => handleUpdate({ animations: { ...settings.animations, enabled: checked } })}
            />
          </SettingRow>

          <SettingRow label="Animation Speed" description="How fast animations play">
            <Select
              value={settings.animations.speed}
              options={[
                { value: 'slow', label: 'Slow (300ms)' },
                { value: 'normal', label: 'Normal (200ms)' },
                { value: 'fast', label: 'Fast (100ms)' },
              ]}
              onChange={(value) => handleUpdate({ animations: { ...settings.animations, speed: value as any } })}
            />
          </SettingRow>

          <SettingRow label="Reduce Motion" description="Minimize animations for accessibility">
            <ToggleSwitch
              checked={settings.animations.reduceMotion}
              onChange={(checked) => handleUpdate({ animations: { ...settings.animations, reduceMotion: checked } })}
            />
          </SettingRow>
        </SettingsSection>

        {/* Layout Settings */}
        <SettingsSection
          icon={Layout}
          title="Layout & Structure"
          description="Customize your workspace layout"
        >
          <SettingRow label="Compact Mode" description="Reduce spacing and padding">
            <ToggleSwitch
              checked={settings.layout.compactMode}
              onChange={(checked) => handleUpdate({ layout: { ...settings.layout, compactMode: checked } })}
            />
          </SettingRow>

          <SettingRow label="Show Footer" description="Display footer information">
            <ToggleSwitch
              checked={settings.layout.showFooter}
              onChange={(checked) => handleUpdate({ layout: { ...settings.layout, showFooter: checked } })}
            />
          </SettingRow>

          <SettingRow label="Max Width" description="Maximum content width">
            <Select
              value={settings.layout.maxWidth}
              options={[
                { value: '5xl', label: 'Small' },
                { value: '6xl', label: 'Medium' },
                { value: '7xl', label: 'Large' },
                { value: 'full', label: 'Full Width' },
              ]}
              onChange={(value) => handleUpdate({ layout: { ...settings.layout, maxWidth: value as any } })}
            />
          </SettingRow>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Manage notification preferences"
        >
          <SettingRow label="Enable Notifications" description="Show system notifications">
            <ToggleSwitch
              checked={settings.notifications.enabled}
              onChange={(checked) => handleUpdate({ notifications: { ...settings.notifications, enabled: checked } })}
            />
          </SettingRow>

          <SettingRow label="Sound Effects" description="Play sounds with notifications">
            <ToggleSwitch
              checked={settings.notifications.sound}
              onChange={(checked) => handleUpdate({ notifications: { ...settings.notifications, sound: checked } })}
            />
          </SettingRow>

          <SettingRow label="Position" description="Where notifications appear">
            <Select
              value={settings.notifications.position}
              options={[
                { value: 'top-right', label: 'Top Right' },
                { value: 'top-left', label: 'Top Left' },
                { value: 'bottom-right', label: 'Bottom Right' },
                { value: 'bottom-left', label: 'Bottom Left' },
              ]}
              onChange={(value) => handleUpdate({ notifications: { ...settings.notifications, position: value as any } })}
            />
          </SettingRow>
        </SettingsSection>

        {/* Accessibility Settings */}
        <SettingsSection
          icon={Eye}
          title="Accessibility"
          description="Make the app more accessible"
        >
          <SettingRow label="High Contrast" description="Increase contrast for better visibility">
            <ToggleSwitch
              checked={settings.accessibility.highContrast}
              onChange={(checked) => handleUpdate({ accessibility: { ...settings.accessibility, highContrast: checked } })}
            />
          </SettingRow>

          <SettingRow label="Focus Indicators" description="Show clear focus outlines">
            <ToggleSwitch
              checked={settings.accessibility.focusIndicator}
              onChange={(checked) => handleUpdate({ accessibility: { ...settings.accessibility, focusIndicator: checked } })}
            />
          </SettingRow>

          <SettingRow label="Screen Reader Mode" description="Optimize for screen readers">
            <ToggleSwitch
              checked={settings.accessibility.screenReaderOptimized}
              onChange={(checked) => handleUpdate({ accessibility: { ...settings.accessibility, screenReaderOptimized: checked } })}
            />
          </SettingRow>

          <SettingRow label="Keyboard Shortcuts" description="Enable keyboard navigation">
            <ToggleSwitch
              checked={settings.accessibility.keyboardShortcuts}
              onChange={(checked) => handleUpdate({ accessibility: { ...settings.accessibility, keyboardShortcuts: checked } })}
            />
          </SettingRow>
        </SettingsSection>

        {/* Advanced Settings */}
        <SettingsSection
          icon={SettingsIcon}
          title="Advanced"
          description="Power user options and experimental features"
        >
          <SettingRow label="Developer Mode" description="Enable advanced debugging features">
            <ToggleSwitch
              checked={settings.advanced.devMode}
              onChange={(checked) => handleUpdate({ advanced: { ...settings.advanced, devMode: checked } })}
            />
          </SettingRow>

          <SettingRow label="Auto-Save" description="Automatically save your work">
            <ToggleSwitch
              checked={settings.advanced.autoSave}
              onChange={(checked) => handleUpdate({ advanced: { ...settings.advanced, autoSave: checked } })}
            />
          </SettingRow>

          <SettingRow label="Max History Items" description="Number of items to keep in history">
            <Select
              value={settings.advanced.maxHistoryItems.toString()}
              options={[
                { value: '50', label: '50 items' },
                { value: '100', label: '100 items' },
                { value: '200', label: '200 items' },
                { value: '500', label: '500 items' },
              ]}
              onChange={(value) => handleUpdate({ advanced: { ...settings.advanced, maxHistoryItems: parseInt(value) } })}
            />
          </SettingRow>

          <SettingRow label="Analytics" description="Help improve Parallax">
            <ToggleSwitch
              checked={settings.advanced.enableAnalytics}
              onChange={(checked) => handleUpdate({ advanced: { ...settings.advanced, enableAnalytics: checked } })}
            />
          </SettingRow>
        </SettingsSection>

        {/* Info Box */}
        <div className="bg-blue-900/10 border border-blue-700/20 rounded-xl p-4 flex gap-3 items-start">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200/80">
            <strong className="block text-blue-400 mb-1">Settings Auto-Save</strong>
            All settings are automatically saved to your local device using encrypted storage. Your preferences will persist across sessions.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
