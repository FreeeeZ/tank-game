import React from 'react';
import { useGame } from '@features/game-table/hooks/useGame';

const GameTable: React.FC = () => {
  const { canvasRef } = useGame();

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default GameTable;
