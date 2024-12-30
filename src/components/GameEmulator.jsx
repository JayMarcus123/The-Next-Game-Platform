'use client';
import React, { useEffect } from 'react';

export default function GameEmulator({ game }) {
  useEffect(() => {
    if (game && game.game_url && game.categories.length > 0) {
      window.EJS_player = '#game';
      window.EJS_gameUrl = `/${game.game_url}`;
      window.EJS_core = `${game.categories[0]?.core}`;
      window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';

      const script = document.createElement('script');
      script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
      script.async = true;
      script.onload = () => console.log('Emulator script loaded');
      document.body.appendChild(script);

      return () => {
        // Cleanup the script on component unmount
        document.body.removeChild(script);
      };
    }
  }, [game]); // Re-run effect when game prop changes

  if (!game || !game.game_url) {
    return <div>Game data is missing or invalid.</div>;
  }

  return (
    <div className="bg-main flex justify-center rounded-xl">
      <div style={{ width: '640px', height: '480px', maxWidth: '100%' }}>
        <div id="game"></div>
      </div>
    </div>
  );
}
