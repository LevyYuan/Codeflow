import { classNames } from '~/utils/classNames';
import React from 'react';

export const SpeechRecognitionButton = ({
  isListening,
  onStart,
  onStop,
  disabled,
}: {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled: boolean;
}) => {
  return (
    <button
      title={isListening ? 'Stop listening' : 'Start speech recognition'}
      disabled={disabled}
      className={classNames(
        'w-8 h-8 flex items-center justify-center rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed',
        isListening
          ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text'
          : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive'
      )}
      onClick={isListening ? onStop : onStart}
    >
      {isListening ? <div className="i-ph:microphone-slash text-lg" /> : <div className="i-ph:microphone text-lg" />}
    </button>
  );
};
