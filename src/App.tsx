import React from 'react';
import GameTable from '@features/game-table/GameTable';

const App: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Танчики</h1>
      <GameTable />
    </div>
  );
};

export default App;
