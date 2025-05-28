'use client'
import { useState } from 'react';

export default function Home() {
  const [grid, setGrid] = useState<string[][]>(Array(6).fill([]).map(() => new Array(7).fill('')));
  const [row, setRow] = useState(0);
  const [colors, setColors] = useState<string[][]>(Array(6).fill([]).map(() => new Array(7).fill('bg-gray-200')));
  const [keyboardColors, setKeyboardColors] = useState<{ [key: string]: string }>(
    ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ']
      .reduce((acc, key) => ({ ...acc, [key]: 'bg-white' }), {})
  );
  const answer = ['ㅈ', 'ㅜ', 'ㄹ', 'ㅌ', 'ㅏ', 'ㄱ', 'ㅣ'];

  const evaluateRow = (currentRow: number) => {
    const newColors = [...colors];
    const rowInput = grid[currentRow];
    const answerCopy = [...answer];
    const tempColors = new Array(7).fill('bg-gray-400'); 

    for (let i = 0; i < 7; i++) {
      if (rowInput[i] === answer[i]) {
        tempColors[i] = 'bg-green-400';
        answerCopy[i] = ''; 
      }
    }

    for (let i = 0; i < 7; i++) {
      if (tempColors[i] !== 'bg-green-400') {
        const answerIndex = answerCopy.indexOf(rowInput[i]);
        if (answerIndex !== -1) {
          tempColors[i] = 'bg-yellow-400';
          answerCopy[answerIndex] = ''; 
        }
      }
    }

    newColors[currentRow] = tempColors;
    setColors(newColors);

    const usedKeys = new Set(rowInput.filter(cell => cell));
    const newKeyboardColors = { ...keyboardColors };
    for (const key in newKeyboardColors) {
      if (!answer.includes(key) && usedKeys.has(key)) {
        newKeyboardColors[key] = 'bg-gray-400';
      }
    }
    setKeyboardColors(newKeyboardColors);
  };

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
      evaluateRow(row);
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
      <div className='text-xl mb-2'>kordle 7</div>
      {grid.map((rowData, i) => (
        <div key={i} className="flex space-x-2 mb-2">
          {rowData.map((cell, j) => (
            <div
              key={j}
              className={`w-18 h-18 flex items-center text-2xl justify-center border-2 rounded-sm border-gray-200 text-black ${
                i < row && cell ? colors[i][j] : i === row && cell ? 'bg-white' : 'bg-white'
              }`}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
      <div className="mt-4">
        {keyboardLayout.map((rowKeys, i) => (
          <div key={i} className="flex justify-center space-x-2 mb-2">
            {rowKeys.map((key) => (
              <button
                key={key}
                onClick={() => {
                  if (key === '입력') handleSubmitClick();
                  else if (key === '삭제') handleDeleteClick();
                  else handleKeyboardClick(key);
                }}
                className={`w-12 h-12 border-1 round-sm border-gray-200 ${keyboardColors[key] || 'bg-white'}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className='bg-gray-200 m-2 p-2 round-lg'> 매일 오전12시 초기화됩니다 </div>
    </div>
  );
}