import React, { useState, useEffect, useCallback } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import type { ProviderInfo } from '~/types/model';
import Cookies from 'js-cookie';

interface APIKeyManagerProps {
  provider: ProviderInfo;
  apiKey: string;
  setApiKey: (key: string) => void;
  getApiKeyLink?: string;
  labelForGetApiKey?: string;
}

// cache which stores whether the provider's API key is set via environment variable
const providerEnvKeyStatusCache: Record<string, boolean> = {};

const apiKeyMemoizeCache: { [k: string]: Record<string, string> } = {};

export function getApiKeysFromCookies() {
  const storedApiKeys = Cookies.get('apiKeys');
  let parsedKeys: Record<string, string> = {};

  if (storedApiKeys) {
    parsedKeys = apiKeyMemoizeCache[storedApiKeys];

    if (!parsedKeys) {
      parsedKeys = apiKeyMemoizeCache[storedApiKeys] = JSON.parse(storedApiKeys);
    }
  }

  return parsedKeys;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const APIKeyManager: React.FC<APIKeyManagerProps> = ({ provider, apiKey, setApiKey }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [isEnvKeySet, setIsEnvKeySet] = useState(false);

  // Reset states and load saved key when provider changes
  useEffect(() => {
    // Load saved API key from cookies for this provider
    const savedKeys = getApiKeysFromCookies();
    const savedKey = savedKeys[provider.name] || '';

    setTempKey(savedKey);
    setApiKey(savedKey);
    setIsEditing(false);
  }, [provider.name]);

  const checkEnvApiKey = useCallback(async () => {
    // Check cache first
    if (providerEnvKeyStatusCache[provider.name] !== undefined) {
      setIsEnvKeySet(providerEnvKeyStatusCache[provider.name]);
      return;
    }

    try {
      const response = await fetch(`/api/check-env-key?provider=${encodeURIComponent(provider.name)}`);
      const data = await response.json();
      const isSet = (data as { isSet: boolean }).isSet;

      // Cache the result
      providerEnvKeyStatusCache[provider.name] = isSet;
      setIsEnvKeySet(isSet);
    } catch (error) {
      console.error('Failed to check environment API key:', error);
      setIsEnvKeySet(false);
    }
  }, [provider.name]);

  useEffect(() => {
    checkEnvApiKey();
  }, [checkEnvApiKey]);

  const handleSave = () => {
    // Save to parent state
    setApiKey(tempKey);

    // Save to cookies
    const currentKeys = getApiKeysFromCookies();
    const newKeys = { ...currentKeys, [provider.name]: tempKey };
    Cookies.set('apiKeys', JSON.stringify(newKeys));

    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      {!isEditing ? (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-bolt-elements-textSecondary">{provider?.name} API Key:</span>
          {apiKey || isEnvKeySet ? (
            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
              <div className="i-ph:check-circle text-sm" />
              {isEnvKeySet ? 'Set via environment' : 'Ready'}
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <div className="i-ph:warning-circle text-sm" />
              Not configured
            </span>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="ml-2 p-1 rounded-full hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-all"
            title="Edit API Key"
          >
            <div className="i-ph:pencil-simple w-3.5 h-3.5" />
          </button>
          {provider?.getApiKeyLink && !apiKey && (
            <button
              onClick={() => window.open(provider?.getApiKeyLink)}
              className="flex items-center gap-1 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors"
            >
              <span>Get Key</span>
              <div className="i-ph:arrow-up-right w-3 h-3" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 w-full">
          <input
            type="password"
            value={tempKey}
            placeholder={`Enter ${provider?.name} API Key`}
            onChange={(e) => setTempKey(e.target.value)}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-bolt-elements-borderColor 
                      bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary 
                      focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
          />
          <button
            onClick={handleSave}
            className="px-3 py-2 text-sm font-medium rounded-lg bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover transition-all"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-bolt-elements-borderColor text-bolt-elements-textSecondary hover:bg-bolt-elements-item-backgroundActive transition-all"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
