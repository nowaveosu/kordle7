'use client'
import { useState } from 'react';

export default function Home() {
  const [grid, setGrid] = useState<string[][]>(Array(6).fill([]).map(() => new Array(7).fill('')));
  const [row, setRow] = useState(0);

  const handleKeyboardClick = (key: string) => {
    if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(key) && grid[row].filter(cell => cell !== '').length < 7) {
      const newGrid = [...grid];
      const emptyIndex = newGrid[row].indexOf('');
      if (emptyIndex !== -1) {
        newGrid[row][emptyIndex] = key;
        setGrid(newGrid);
      }
    }
  };

  const handleSubmitClick = () => {
    if (grid[row].every(cell => cell !== '')) {
      if (row < 5) {
        setRow(row + 1);
      }
    }
  };

  const handleDeleteClick = () => {
    const newGrid = [...grid];
    const lastIndex = newGrid[row].lastIndexOf(newGrid[row].filter(cell => cell !== '').pop() || '');
    if (lastIndex !== -1) {
      newGrid[row][lastIndex] = '';
      setGrid(newGrid);
    }
  };

  const keyboardLayout = [
    ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ'],
    ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
    ['입력', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', '삭제'],
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {grid.map((rowData, i) => (
        <div key={i} className="flex space-x-2 mb-2">
          {rowData.map((cell, j) => (
            <div
              key={j}
              className={`w-12 h-12 flex items-center justify-center border-2 ${
                i <= row && cell ? 'bg-white' : 'bg-gray-200'
              }`}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
      <div className="mt-4">
        {keyboardLayout.map((rowKeys, i) => (
          <div key={i} className="flex space-x-2 mb-2">
            {rowKeys.map((key) => (
              <button
                key={key}
                onClick={() => {
                  if (key === '입력') handleSubmitClick();
                  else if (key === '삭제') handleDeleteClick();
                  else handleKeyboardClick(key);
                }}
                className="w-12 h-12 bg-white border-2 hover:bg-gray-200"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}