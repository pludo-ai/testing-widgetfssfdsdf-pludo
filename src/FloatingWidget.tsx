import React, { useState } from 'react';
import { ChatWidget } from './components/ChatWidget';
import { FloatingButton } from './components/FloatingButton';

function FloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2147483647,
          pointerEvents: 'auto',
        }}
      >
        <FloatingButton onClick={() => setIsOpen(true)} config={{"name":"Testing widget","brandName":"Testing widget","websiteName":"Testing widget","agentType":"customer-support","roleDescription":"Testing widget","services":["Testing widget"],"faqs":[],"primaryColor":"#eab308","tone":"professional","avatarUrl":"Testing widget","subdomain":"testing-widgetfssfdsdf","officeHours":"","knowledge":"Testing widget","apiProvider":"openrouter","apiKey":"Testing widget","model":"deepseek/deepseek-r1"}} />
      </div>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            zIndex: 2147483647,
            pointerEvents: 'auto',
          }}
        >
          <ChatWidget
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            config={{"name":"Testing widget","brandName":"Testing widget","websiteName":"Testing widget","agentType":"customer-support","roleDescription":"Testing widget","services":["Testing widget"],"faqs":[],"primaryColor":"#eab308","tone":"professional","avatarUrl":"Testing widget","subdomain":"testing-widgetfssfdsdf","officeHours":"","knowledge":"Testing widget","apiProvider":"openrouter","apiKey":"Testing widget","model":"deepseek/deepseek-r1"}}
          />
        </div>
      )}
    </>
  );
}

export default FloatingWidget;