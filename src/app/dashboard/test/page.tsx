"use client"

// components/ShareButtons.js
import Script from 'next/script';
import { useEffect } from 'react';

export default function ShareButtons() {
  useEffect(() => {
    // Ensure a2a_config exists
    window.a2a_config = window.a2a_config || {};
    // Make sure callbacks array exists
    window.a2a_config.callbacks = window.a2a_config.callbacks || [];

    // Define our "share" callback handler
    function onAddToAnyShare(data) {
      // data.service is the human‐readable name, e.g. "Facebook", "Twitter", etc.
      // data.serviceCode is the code string, e.g. "facebook", "twitter", etc.
      // data.url is the URL being shared (usually window.location.href)
      // data.title is the page or image title
      // You can also inspect data.node, data.serviceCode, data.media, etc.

      // Build the payload you want to store (customize as needed)
      const payload = {
        platform: data.serviceCode,  // e.g. "facebook", "twitter", "linkedin"
        platformName: data.service,  // e.g. "Facebook", "Twitter", "LinkedIn"
        url: data.url,
        title: data.title,
        timestamp: new Date().toISOString(),
      };

      console.log(payload);
      
      // Fire-and-forget POST to our backend endpoint
    //   fetch('/api/save-share', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(payload),
    //   })
    //     .then((res) => {
    //       if (!res.ok) {
    //         console.error('Error saving share to DB:', res.statusText);
    //       }
    //     })
    //     .catch((err) => {
    //       console.error('Network error while saving share:', err);
    //     });
    }

    // Push our callback into a2a_config.callbacks
    window.a2a_config.callbacks.push({
      share: onAddToAnyShare,
    });
  }, []);

  return (
    <>
      {/* Load the AddToAny script after the page is interactive */}
      <Script
        src="https://static.addtoany.com/menu/page.js"
        strategy="afterInteractive"
      />

      {/* AddToAny buttons markup */}
      <div className="a2a_kit a2a_kit_size_32 a2a_default_style">
        <a className="a2a_button_facebook"></a>
        <a className="a2a_button_twitter"></a>
        <a className="a2a_button_linkedin"></a>
        <a className="a2a_button_pinterest"></a>
        <a className="a2a_button_more">Share</a>
      </div>
    </>
  );
}