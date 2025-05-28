'use client'
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState<string[]>(new Array(7).fill(''));
  const [row, setRow] = useState(0);

  const handleKeyboardClick = (key: string) => {
    if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(key) && input.filter(cell => cell !== '').length < 7) {
      const newInput = [...input];
      const emptyIndex = newInput.indexOf('');
      if (emptyIndex !== -1) {
        newInput[emptyIndex] = key;
        setInput(newInput);
      }
    }
  };

  const handleSubmitClick = () => {
    if (input.every(cell => cell !== '')) {
      setRow(row + 1);
      setInput(new Array(7).fill(''));
    }
  };

  const handleDeleteClick = () => {
    const newInput = [...input];
    const lastIndex = newInput.lastIndexOf(newInput.filter(cell => cell !== '').pop() || '');
    if (lastIndex !== -1) {
      newInput[lastIndex] = '';
      setInput(newInput);
    }
  };

  const keyboardLayout = [
    ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ'],
    ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
    ['입력','ㅋ','ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ','ㅡ','삭제'],
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex space-x-2 mb-2">
          {Array.from({ length: 7 }, (_, j) => (
            <div
              key={j}
              className={`w-12 h-12 flex items-center justify-center border-2 ${
                i < row || (i === row && input[j])
                  ? 'bg-white'
                  : 'bg-gray-200'
              }`}
            >
              {i === row ? input[j] : ''}
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