import React from 'react';

const EXAMPLE_PROMPTS = [
  { text: '开发一个电商网站，包含商品展示和购物车功能', icon: 'i-ph:shopping-cart' },
  { text: '创建一个待办事项管理应用，支持添加、编辑和删除任务', icon: 'i-ph:list-checks' },
  { text: '制作一个天气查询应用，可以查看不同城市的天气信息', icon: 'i-ph:cloud-sun' },
];

export function ExamplePrompts(sendMessage?: { (event: React.UIEvent, messageInput?: string): void | undefined }) {
  return (
    <div id="examples" className="relative flex flex-col gap-9 w-full max-w-3xl mx-auto flex justify-center mt-2">
      <div
        className="flex flex-wrap justify-center gap-3"
        style={{
          animation: '.25s ease-out 0s 1 _fade-and-move-in_g2ptj_1 forwards',
        }}
      >
        {EXAMPLE_PROMPTS.map((examplePrompt, index: number) => {
          return (
            <button
              key={index}
              onClick={(event) => {
                sendMessage?.(event, examplePrompt.text);
              }}
              className="flex items-center gap-2 rounded-md bg-bolt-elements-item-backgroundActive/30 hover:bg-bolt-elements-item-backgroundActive/50 text-bolt-elements-textPrimary px-4 py-2 text-xs transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`${examplePrompt.icon} text-base`}></div>
              {examplePrompt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
