import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames('flex items-center px-4 border-b border-transparent h-[var(--header-height)]')}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <a href="/" className="flex items-center gap-2 group">
          <span className="font-semibold text-xl tracking-tight text-bolt-elements-textPrimary">Codeflow</span>
        </a>
      </div>
      <div className="flex-1"></div>
      {chat.started && (
        <ClientOnly>
          {() => (
            <div className="">
              <HeaderActionButtons chatStarted={chat.started} />
            </div>
          )}
        </ClientOnly>
      )}
    </header>
  );
}
