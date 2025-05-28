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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const answer = ['ㅈ', 'ㅜ', 'ㄹ', 'ㅌ', 'ㅏ', 'ㄱ', 'ㅣ'];

  const consonants = new Set(['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ']);
  const vowels = new Set(['ㅛ', 'ㅕ', 'ㅑ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ', 'ㅠ', 'ㅜ', 'ㅡ']);

  const checkConsecutive = (input: string[]) => {
    let conCount = 0;
    let vowCount = 0;

    for (let i = 0; i < input.length - 1; i++) {
      if (consonants.has(input[i]) && consonants.has(input[i + 1])) {
        conCount++;
        if (conCount >= 2) return true; // 세 번 연속 자음
      } else {
        conCount = 0; // 다른 문자로 바뀌면 초기화
      }
      if (vowels.has(input[i]) && vowels.has(input[i + 1])) {
        vowCount++;
        if (vowCount >= 1) return true; // 두 번 연속 모음
      } else {
        vowCount = 0; // 다른 문자로 바뀌면 초기화
      }
    }
    return false;
  };

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
      const hasConsecutive = checkConsecutive(grid[row]);
      if (hasConsecutive) {
        setErrorMessage('등록되지 않은 단어입니다!');
        const newGrid = [...grid];
        newGrid[row] = new Array(7).fill('');
        setGrid(newGrid);
        setTimeout(() => setErrorMessage(''), 1000);
      } else {
        evaluateRow(row);
        const isCorrect = grid[row].every((cell, i) => cell === answer[i]);
        if (isCorrect) {
          alert('오늘의 kordle 7 성공!');
        } else if (row === 5) {
          alert('오늘의 kordle 7 실패ㅜㅜ');
        } else {
          setRow(row + 1);
        }
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
        <div key={i} className="flex space-x-1 mb-2">
          {rowData.map((cell, j) => (
            <div
              key={j}
              className={`max-lg:w-12 max-lg:h-12 w-[66px] h-[66px] flex items-center text-2xl justify-center border-2 rounded-md border-gray-200 text-black ${
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
          <div key={i} className="flex justify-center space-x-2 max-lg:space-x-1 mb-2">
            {rowKeys.map((key) => (
              <button
                key={key}
                onClick={() => {
                  if (key === '입력') handleSubmitClick();
                  else if (key === '삭제') handleDeleteClick();
                  else handleKeyboardClick(key);
                }}
                className={`max-lg:w-9 max-lg:h-11 w-10 h-12 border rounded-sm text-lg border-gray-200 ${keyboardColors[key] || 'bg-white'}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
      {errorMessage && (
        <div className="mt-2 p-2 bg-red-200 text-red-800 rounded-lg">
          {errorMessage}
        </div>
      )}
      <div className='bg-gray-200 m-2 p-2 rounded-lg'> 매일 오전12시 초기화됩니다 </div>
    </div>
  );
}