(function() {
  'use strict';
  
  // Prevent multiple instances
  if (window.pludoAILoaded) return;
  window.pludoAILoaded = true;

  // Configuration
  const config = {"name":"Testing widget","brandName":"Testing widget","websiteName":"Testing widget","agentType":"customer-support","roleDescription":"Testing widget","services":["Testing widget"],"faqs":[],"primaryColor":"#eab308","tone":"professional","avatarUrl":"Testing widget","subdomain":"testing-widgetfssfdsdf","officeHours":"","knowledge":"Testing widget","apiProvider":"openrouter","apiKey":"Testing widget","model":"deepseek/deepseek-r1"};
  
  // Get the base URL for the widget
  const getWidgetBaseUrl = () => {
    // If we have a hardcoded vercel URL, use it
    const hardcodedUrl = '{{VERCEL_URL}}';
    if (hardcodedUrl && hardcodedUrl !== '{{VERCEL_URL}}') {
      return hardcodedUrl;
    }
    
    // Fallback: try to determine from script src
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
      if (script.src && script.src.includes('widget.js')) {
        const url = new URL(script.src);
        return url.origin;
      }
    }
    
    // Last resort: use current origin (this will likely fail for embedded widgets)
    console.warn('Could not determine widget base URL, using current origin');
    return window.location.origin;
  };
  
  // Create iframe for floating widget
  function createFloatingWidget() {
    const iframe = document.createElement('iframe');
    iframe.id = 'pludo-ai-widget';
    iframe.src = getWidgetBaseUrl() + '/widget.html';
    iframe.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      border: none !important;
      z-index: 2147483647 !important;
      pointer-events: none !important;
      background: transparent !important;
    `;
    
    // Override pointer events for the iframe content after load
    iframe.addEventListener('load', function() {
      // Set pointer events to auto for the iframe itself when needed
      iframe.style.pointerEvents = 'auto';
      
      // Add message listener for iframe communication
      window.addEventListener('message', function(event) {
        if (event.source === iframe.contentWindow) {
          if (event.data.type === 'WIDGET_BUTTON_CLICK') {
            // Ensure iframe can receive clicks
            iframe.style.pointerEvents = 'auto';
          } else if (event.data.type === 'WIDGET_CLOSED') {
            // Reset pointer events when widget is closed
            iframe.style.pointerEvents = 'none';
          }
        }
      });
    });

    return iframe;
  }

  // Initialize when DOM is ready
  function init() {
    const widget = createFloatingWidget();
    document.body.appendChild(widget);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();