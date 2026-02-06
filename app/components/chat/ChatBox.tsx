import React, { useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';
import { ModelSelector } from '~/components/chat/ModelSelector';
import { APIKeyManager } from './APIKeyManager';
import { LOCAL_PROVIDERS } from '~/lib/stores/settings';
import FilePreview from './FilePreview';
import { ScreenshotStateManager } from './ScreenshotStateManager';
import { SendButton } from './SendButton.client';
import { toast } from 'react-toastify';
import { SpeechRecognitionButton } from '~/components/chat/SpeechRecognition';
import { SupabaseConnection } from './SupabaseConnection';
import { ExpoQrModal } from '~/components/workbench/ExpoQrModal';
import type { ProviderInfo } from '~/types/model';
import { ColorSchemeDialog } from '~/components/ui/ColorSchemeDialog';
import type { DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';
import { McpTools } from './MCPTools';
import * as Dialog from '@radix-ui/react-dialog';
import { FiSettings } from 'react-icons/fi';

// Predefined website themes
const websiteThemes = [
  {
    name: '极简主义',
    subtitle: '永恒黑白',
    id: 'minimal',
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

const handleThemeSelect = (
  themeId: string,
  setDesignScheme?: (scheme: DesignScheme) => void,
  setSelectedTheme?: (id: string) => void
) => {
  localStorage.setItem('bolt_website_theme', themeId);
  setSelectedTheme?.(themeId);

  const theme = websiteThemes.find((t) => t.id === themeId);
  if (theme && setDesignScheme) {
    const designScheme: DesignScheme = {
      palette: theme.palette,
      features: ['rounded', 'gradient', 'shadow'],
      font: ['sans-serif'],
    };
    setDesignScheme(designScheme);
    localStorage.setItem('bolt_design_scheme', JSON.stringify(designScheme));
    toast.success(`主题已切换至 ${theme.name}`);
  }
};

interface ChatBoxProps {
  isModelSettingsCollapsed: boolean;
  setIsModelSettingsCollapsed: (collapsed: boolean) => void;
  provider: any;
  providerList: any[];
  modelList: any[];
  apiKeys: Record<string, string>;
  isModelLoading: string | undefined;
  onApiKeysChange: (providerName: string, apiKey: string) => void;
  uploadedFiles: File[];
  imageDataList: string[];
  textareaRef: React.RefObject<HTMLTextAreaElement> | undefined;
  input: string;
  handlePaste: (e: React.ClipboardEvent) => void;
  TEXTAREA_MIN_HEIGHT: number;
  TEXTAREA_MAX_HEIGHT: number;
  isStreaming: boolean;
  handleSendMessage: (event: React.UIEvent, messageInput?: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  chatStarted: boolean;
  exportChat?: () => void;
  qrModalOpen: boolean;
  setQrModalOpen: (open: boolean) => void;
  handleFileUpload: () => void;
  setProvider?: ((provider: ProviderInfo) => void) | undefined;
  model?: string | undefined;
  setModel?: ((model: string) => void) | undefined;
  setUploadedFiles?: ((files: File[]) => void) | undefined;
  setImageDataList?: ((dataList: string[]) => void) | undefined;
  handleInputChange?: ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | undefined;
  handleStop?: (() => void) | undefined;
  enhancingPrompt?: boolean | undefined;
  enhancePrompt?: (() => void) | undefined;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: ((element: ElementInfo | null) => void) | undefined;
}

// Settings Dialog Component
const SettingsDialog = ({
  provider,
  setProvider,
  model,
  setModel,
  providerList,
  modelList,
  apiKeys,
  onApiKeysChange,
  modelLoading,
  chatMode,
  setChatMode,
  designScheme,
  setDesignScheme,
}: {
  provider: any;
  setProvider: any;
  model: any;
  setModel: any;
  providerList: any[];
  modelList: any[];
  apiKeys: Record<string, string>;
  onApiKeysChange: (providerName: string, apiKey: string) => void;
  modelLoading?: string;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    return localStorage.getItem('bolt_website_theme') || 'minimal';
  });

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]" />
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[85vh] overflow-auto z-[201]">
        <div className="bg-bolt-elements-background-depth-2 rounded-2xl border border-bolt-elements-borderColor shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-bolt-elements-textPrimary">
              Settings
            </Dialog.Title>
            <Dialog.Close className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bolt-elements-item-backgroundActive transition-colors">
              <div className="i-ph:x text-lg text-bolt-elements-textSecondary" />
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            {/* Provider & Model Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-bolt-elements-textSecondary">Model</label>
              <ModelSelector
                key={provider?.name + ':' + modelList.length}
                model={model}
                setModel={setModel}
                modelList={modelList}
                provider={provider}
                setProvider={setProvider}
                providerList={providerList || (PROVIDER_LIST as ProviderInfo[])}
                apiKeys={apiKeys}
                modelLoading={modelLoading}
              />
              {(providerList || []).length > 0 &&
                provider &&
                !LOCAL_PROVIDERS.includes(provider.name) && (
                  <APIKeyManager
                    provider={provider}
                    apiKey={apiKeys[provider.name] || ''}
                    setApiKey={(key) => {
                      onApiKeysChange(provider.name, key);
                    }}
                  />
                )}
            </div>

            {/* Chat Mode */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-bolt-elements-textSecondary">Mode</label>
              <div className="flex gap-2 p-1 bg-bolt-elements-background-depth-1 rounded-full border border-bolt-elements-borderColor">
                <button
                  onClick={() => setChatMode?.('build')}
                  className={classNames(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                    chatMode === 'build'
                      ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text'
                      : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
                  )}
                >
                  <div className="i-ph:hammer text-base" />
                  Build
                </button>
                <button
                  onClick={() => setChatMode?.('discuss')}
                  className={classNames(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                    chatMode === 'discuss'
                      ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text'
                      : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
                  )}
                >
                  <div className="i-ph:chat-circle text-base" />
                  Discuss
                </button>
              </div>
            </div>

            {/* Design Scheme */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-bolt-elements-textSecondary">网站主题</label>
              <div className="text-xs text-bolt-elements-textSecondary mb-3">
                选择预设主题，AI 将使用该配色方案生成网站
              </div>

              {/* Theme Presets */}
              <div className="grid grid-cols-1 gap-2 mb-4">
                {websiteThemes.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id, setDesignScheme, setSelectedTheme)}
                      className={classNames(
                        'relative p-3 rounded-lg text-left transition-all duration-200 border',
                        isSelected
                          ? 'border-bolt-elements-item-contentAccent bg-bolt-elements-item-backgroundAccent'
                          : 'border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive'
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-bolt-elements-item-contentAccent rounded-full flex items-center justify-center">
                          <div className="i-ph:check w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-md flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${theme.palette.primary}, ${theme.palette.secondary})`,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-bolt-elements-textPrimary">
                            {theme.name} · {theme.subtitle}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {Object.values(theme.palette).slice(0, 6).map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Picker */}
              <div className="pt-3 border-t border-bolt-elements-borderColor">
                <label className="text-sm font-medium text-bolt-elements-textSecondary mb-2 block">自定义配色</label>
                <ColorSchemeDialog designScheme={designScheme} setDesignScheme={setDesignScheme} />
              </div>
            </div>

            {/* Supabase Connection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-bolt-elements-textSecondary">数据库</label>
              <SupabaseConnection />
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export const ChatBox: React.FC<ChatBoxProps> = (props) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div
      className={classNames(
        'relative bg-bolt-elements-background-depth-2 rounded-xl border border-bolt-elements-borderColor w-full max-w-chat mx-auto z-prompt overflow-hidden shadow-sm'
      )}
    >
      {/* Top Bar - Provider & Model Info */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-bolt-elements-borderColor">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-bolt-elements-textPrimary">
              {props.provider?.name || 'Select Provider'}
            </span>
            <span className="text-bolt-elements-textTertiary">/</span>
            <span className="text-sm text-bolt-elements-textSecondary">
              {props.modelList.find((m) => m.name === props.model)?.label || 'Select Model'}
            </span>
          </div>
        </div>

        {/* Settings Button */}
        <Dialog.Root open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md hover:bg-bolt-elements-item-backgroundActive/50 transition-all text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary">
              <FiSettings className="text-sm" />
              Settings
            </button>
          </Dialog.Trigger>
          <SettingsDialog
            provider={props.provider}
            setProvider={props.setProvider}
            model={props.model}
            setModel={props.setModel}
            providerList={props.providerList || []}
            modelList={props.modelList}
            apiKeys={props.apiKeys}
            onApiKeysChange={props.onApiKeysChange}
            modelLoading={props.isModelLoading}
            chatMode={props.chatMode}
            setChatMode={props.setChatMode}
            designScheme={props.designScheme}
            setDesignScheme={props.setDesignScheme}
          />
        </Dialog.Root>
      </div>

      {/* File Preview */}
      <FilePreview
        files={props.uploadedFiles}
        imageDataList={props.imageDataList}
        onRemove={(index) => {
          props.setUploadedFiles?.(props.uploadedFiles.filter((_, i) => i !== index));
          props.setImageDataList?.(props.imageDataList.filter((_, i) => i !== index));
        }}
      />

      <ClientOnly>
        {() => (
          <ScreenshotStateManager
            setUploadedFiles={props.setUploadedFiles}
            setImageDataList={props.setImageDataList}
            uploadedFiles={props.uploadedFiles}
            imageDataList={props.imageDataList}
          />
        )}
      </ClientOnly>

      {/* Selected Element Indicator */}
      {props.selectedElement && (
        <div className="flex mx-4 mt-3 gap-2 items-center justify-between rounded-lg border border-bolt-elements-borderColor text-bolt-elements-textPrimary py-2 px-3 text-xs">
          <div className="flex gap-2 items-center">
            <code className="bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text rounded px-1.5 py-0.5 font-medium">
              {props?.selectedElement?.tagName?.toLowerCase()}
            </code>
            <span className="text-bolt-elements-textSecondary">selected for inspection</span>
          </div>
          <button
            className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors"
            onClick={() => props.setSelectedElement?.(null)}
          >
            Clear
          </button>
        </div>
      )}

      {/* Text Input Area */}
      <div className="p-4">
        <textarea
          ref={props.textareaRef}
          className={classNames(
            'w-full outline-none resize-none text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent text-sm',
            'min-h-[60px] max-h-[200px]'
          )}
          onDragEnter={(e) => {
            e.preventDefault();
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            files.forEach((file) => {
              if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const base64Image = e.target?.result as string;
                  props.setUploadedFiles?.([...props.uploadedFiles, file]);
                  props.setImageDataList?.([...props.imageDataList, base64Image]);
                };
                reader.readAsDataURL(file);
              }
            });
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              if (event.shiftKey) {
                return;
              }
              event.preventDefault();
              if (props.isStreaming) {
                props.handleStop?.();
                return;
              }
              if (event.nativeEvent.isComposing) {
                return;
              }
              props.handleSendMessage?.(event);
            }
          }}
          value={props.input}
          onChange={(event) => {
            props.handleInputChange?.(event);
          }}
          onPaste={props.handlePaste}
          style={{
            minHeight: 56,
            maxHeight: 160,
          }}
          placeholder=""
          translate="no"
        />
      </div>

      {/* Bottom Toolbar */}
      <div className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center gap-1">
          {/* File Upload */}
          <button
            title="Upload file"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bolt-elements-item-backgroundActive transition-all text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary"
            onClick={() => props.handleFileUpload()}
          >
            <div className="i-ph:paperclip text-lg"></div>
          </button>

          {/* Build/Discuss Mode Toggle */}
          {props.chatStarted && (
            <button
              title="Toggle Mode"
              onClick={() => props.setChatMode?.(props.chatMode === 'discuss' ? 'build' : 'discuss')}
              className={classNames(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                props.chatMode === 'discuss'
                  ? 'bg-bolt-elements-item-backgroundActive/50 text-bolt-elements-textPrimary'
                  : 'text-bolt-elements-textSecondary hover:bg-bolt-elements-item-backgroundActive/50 hover:text-bolt-elements-textPrimary'
              )}
            >
              <div className={`i-ph:${props.chatMode === 'discuss' ? 'chat-circle' : 'hammer'} text-sm`} />
              {props.chatMode === 'discuss' ? 'Discuss' : 'Build'}
            </button>
          )}
        </div>

        {/* Right Side - Send Button & Info */}
        <div className="flex items-center gap-3">
          <ClientOnly>
            {() => (
              <SendButton
                show={true}
                isStreaming={props.isStreaming}
                disabled={!props.providerList || props.providerList.length === 0}
                onClick={(event) => {
                  if (props.isStreaming) {
                    props.handleStop?.();
                    return;
                  }
                  if (props.input.length > 0 || props.uploadedFiles.length > 0) {
                    props.handleSendMessage?.(event);
                  }
                }}
              />
            )}
          </ClientOnly>
        </div>
      </div>

      <ExpoQrModal open={props.qrModalOpen} onClose={() => props.setQrModalOpen(false)} />
    </div>
  );
};
