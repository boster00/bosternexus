/**
 * Iframe Bridge Utilities
 * Handles communication between parent window and iframe preview
 */

/**
 * Message types for postMessage communication
 */
export const MessageTypes = {
  SECTION_HOVER: 'section:hover',
  SECTION_SELECT: 'section:select',
  SECTION_DESELECT: 'section:deselect',
  UPDATE_SECTION: 'section:update',
  INSERT_SECTION: 'section:insert',
  REMOVE_SECTION: 'section:remove',
  DUPLICATE_SECTION: 'section:duplicate',
  FORMAT_COMMAND: 'format:command',
  GET_SELECTED_SECTION: 'section:getSelected',
  SET_CONTENT: 'content:set',
  GET_CONTENT: 'content:get',
};

/**
 * Send message to iframe
 */
export function sendToIframe(iframe, type, data = {}) {
  if (!iframe || !iframe.contentWindow) {
    console.warn('Iframe not ready for message');
    return;
  }
  
  iframe.contentWindow.postMessage(
    { type, data },
    window.location.origin
  );
}

/**
 * Create message listener for iframe communication
 */
export function createMessageListener(handlers) {
  return (event) => {
    // Verify origin for security
    if (event.origin !== window.location.origin) {
      return;
    }
    
    const { type, data } = event.data;
    
    if (handlers[type]) {
      handlers[type](data, event);
    }
  };
}

/**
 * Setup iframe message listener
 */
export function setupMessageListener(handlers) {
  const listener = createMessageListener(handlers);
  window.addEventListener('message', listener);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('message', listener);
  };
}
