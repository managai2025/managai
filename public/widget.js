/* ManagAI Widget - Event Tracking & UI */
(function(){
  const params = document.currentScript?.dataset || {};
  const org = params.org || 'org_demo';
  const baseUrl = params.base || 'https://managai.hu';
  
  // Track page view
  function trackEvent(type, payload = {}) {
    const event = {
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: type,
      ts: Math.floor(Date.now() / 1000),
      source: 'widget',
      org_id: org,
      payload: payload,
      keys: { url: window.location.href, referrer: document.referrer }
    };
    
    fetch(`${baseUrl}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(console.warn);
  }
  
  // Track initial page view
  trackEvent('page_view', { 
    title: document.title,
    path: window.location.pathname 
  });
  
  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      trackEvent('scroll_depth', { depth: scrollPercent });
    }
  });
  
  // Free shipping nudger
  const showNudger = params.nudger !== 'false';
  if (showNudger) {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
      padding: 12px; background: linear-gradient(90deg, #111, #333);
      color: #fff; text-align: center; font-family: system-ui, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    bar.innerHTML = '🚚 <strong>Ingyenes szállításhoz még 2 500 Ft hiányzik</strong> – <a href="#" style="color:#fff;text-decoration:underline">töltsd ki a kosarat!</a>';
    document.body.appendChild(bar);
    
    // Track nudger view
    trackEvent('nudger_shown', { type: 'free_shipping' });
  }
  
  // Chatbot button
  const btn = document.createElement('button');
  btn.innerHTML = '💬 <span style="margin-left:4px">Kérdezz ManagAI-tól</span>';
  btn.style.cssText = `
    position: fixed; right: 20px; bottom: 20px; z-index: 99999;
    padding: 12px 16px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #111, #333); color: #fff;
    font-family: system-ui, sans-serif; font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer;
    transition: transform 0.2s;
  `;
  btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
  btn.onmouseleave = () => btn.style.transform = 'scale(1)';
  btn.onclick = () => {
    trackEvent('chatbot_clicked');
    alert('Chatbot demo – ide jön az on-site bot');
  };
  document.body.appendChild(btn);
  
  // Track time on page
  let startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    if (timeSpent > 5) {
      trackEvent('page_exit', { time_spent: timeSpent });
    }
  });
})();