export interface DesignScheme {
  palette: { [key: string]: string }; // Changed from string[] to object
  features: string[];
  font: string[];
}

export const defaultDesignScheme: DesignScheme = {
  palette: {
    primary: '#6366F1',      // 现代靛蓝 - 科技感主色
    secondary: '#06B6D4',    // 青色 - 清新辅助色
    accent: '#A855F7',       // 紫罗兰 - 高端强调色
    background: '#0A0E27',   // 深邃蓝黑 - 奢华背景
    surface: '#1A1F3A',      // 深蓝灰 - 层次表面
    text: '#FFFFFF',         // 纯白 - 清晰文本
    textSecondary: '#94A3B8',// 石板灰 - 柔和次要文本
    border: '#2D3250',       // 深蓝灰 - 精致边框
    success: '#10B981',      // 翠绿 - 成功提示
    warning: '#F59E0B',      // 琥珀 - 警告提示
    error: '#EF4444',        // 珊瑚红 - 错误提示
  },
  features: ['rounded', 'gradient', 'shadow'],  // 圆角 + 渐变 + 阴影
  font: ['sans-serif'],
};

export const paletteRoles = [
  {
    key: 'primary',
    label: 'Primary',
    description: 'Main brand color - use for primary buttons, active links, and key interactive elements',
  },
  {
    key: 'secondary',
    label: 'Secondary',
    description: 'Supporting brand color - use for secondary buttons, inactive states, and complementary elements',
  },
  {
    key: 'accent',
    label: 'Accent',
    description: 'Highlight color - use for badges, notifications, focus states, and call-to-action elements',
  },
  {
    key: 'background',
    label: 'Background',
    description: 'Page backdrop - use for the main application/website background behind all content',
  },
  {
    key: 'surface',
    label: 'Surface',
    description: 'Elevated content areas - use for cards, modals, dropdowns, and panels that sit above the background',
  },
  { key: 'text', label: 'Text', description: 'Primary text - use for headings, body text, and main readable content' },
  {
    key: 'textSecondary',
    label: 'Text Secondary',
    description: 'Muted text - use for captions, placeholders, timestamps, and less important information',
  },
  {
    key: 'border',
    label: 'Border',
    description: 'Separators - use for input borders, dividers, table lines, and element outlines',
  },
  {
    key: 'success',
    label: 'Success',
    description: 'Positive feedback - use for success messages, completed states, and positive indicators',
  },
  {
    key: 'warning',
    label: 'Warning',
    description: 'Caution alerts - use for warning messages, pending states, and attention-needed indicators',
  },
  {
    key: 'error',
    label: 'Error',
    description: 'Error states - use for error messages, failed states, and destructive action indicators',
  },
];

export const designFeatures = [
  { key: 'rounded', label: 'Rounded Corners' },
  { key: 'border', label: 'Subtle Border' },
  { key: 'gradient', label: 'Gradient Accent' },
  { key: 'shadow', label: 'Soft Shadow' },
  { key: 'frosted-glass', label: 'Frosted Glass' },
];

export const designFonts = [
  { key: 'sans-serif', label: 'Sans Serif', preview: 'Aa' },
  { key: 'serif', label: 'Serif', preview: 'Aa' },
  { key: 'monospace', label: 'Monospace', preview: 'Aa' },
  { key: 'cursive', label: 'Cursive', preview: 'Aa' },
  { key: 'fantasy', label: 'Fantasy', preview: 'Aa' },
];
