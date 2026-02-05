import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { DeployButton } from '~/components/deploy/DeployButton';
import { ThemeSwitch } from '~/components/ui/ThemeSwitch';
import { FiFileText } from 'react-icons/fi';

interface HeaderActionButtonsProps {
  chatStarted: boolean;
}

export function HeaderActionButtons({ chatStarted }: HeaderActionButtonsProps) {
  const [activePreviewIndex] = useState(0);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[activePreviewIndex];

  const shouldShowButtons = activePreview;

  return (
    <div className="flex items-center gap-2">
      {/* Theme Switch */}
      <ThemeSwitch />

      {/* Download ZIP Button - Only show when chat started */}
      {chatStarted && (
        <button
          onClick={() => {
            workbenchStore.downloadZip();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover transition-colors"
        >
          <FiFileText className="text-base" />
          Download ZIP
        </button>
      )}
    </div>
  );
}
