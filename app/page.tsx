'use client'
import { useState, useEffect } from 'react';
import Modal from './components/Modal';

export default function Home() {
  const [grid, setGrid] = useState<string[][]>(Array(6).fill([]).map(() => new Array(7).fill('')));
  const [row, setRow] = useState(0);
  const [colors, setColors] = useState<string[][]>(Array(6).fill([]).map(() => new Array(7).fill('bg-gray-200')));
  const [keyboardColors, setKeyboardColors] = useState<{ [key: string]: string }>(
    ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ', 'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ']
      .reduce((acc, key) => ({ ...acc, [key]: 'bg-white' }), {})
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const answer = ['ㅇ', 'ㅜ', 'ㅊ', 'ㅔ', 'ㄱ', 'ㅜ', 'ㄱ'];

  const allowedKeys = new Set(['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ', 'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ']);
  const consonants = new Set(['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ']);
  const vowels = new Set(['ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ', 'ㅠ', 'ㅜ', 'ㅡ']);

  // 영어 키를 한글로 매핑하는 테이블
  const keyMapping: { [key: string]: string } = {
    'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ',
    'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ',
    'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ', 'y':'ㅛ', 'u': 'ㅕ',
    'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ', 'h': 'ㅗ', 'j': 'ㅓ',
    'k': 'ㅏ', 'l': 'ㅣ', 'b': 'ㅠ', 'n': 'ㅜ', 'm': 'ㅡ',
  };

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedKordle7');
    if (!hasVisited) {
      setIsModalOpen(true);
      localStorage.setItem('hasVisitedKordle7', 'true');
    }
  }, []);

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
    if (allowedKeys.has(key) && grid[row].filter(cell => cell !== '').length < 7) {
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

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key;

    // 모달이 열려 있을 때는 키보드 입력 무시
    if (isModalOpen) return;

    // Enter와 Backspace는 별도로 처리
    if (key === 'Enter') {
      handleSubmitClick();
      return;
    }
    if (key === 'Backspace') {
      handleDeleteClick();
      return;
    }

    // 나머지 키는 영어 키를 한글로 매핑
    const lowerKey = key.toLowerCase();
    const mappedKey = keyMapping[lowerKey] || key;

    if (allowedKeys.has(mappedKey)) {
      handleKeyboardClick(mappedKey);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [row, grid, keyboardColors, isModalOpen]); // isModalOpen 추가

  const keyboardLayout = [
    ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
    ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
    ['입력', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', '삭제'],
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">꼬들7 소개</h2>
        <p className="mb-2">꼬들7은 6번안에 맞춰야하는 한글 낱말퍼즐입니다!</p>
        <p className="mb-2">예를들어 {' '}
          <span className="bg-gray-200 px-1 rounded">ㅌㅗㅇㄴㅏㅁㅜ</span>를 입력시</p>
        <p className="mb-2">
          정답과 위치와 구성요소가 같다면 배경이{' '}
          <span className="bg-green-400 px-1 rounded">초록색</span>으로 변하고,
        </p>
        <p className="mb-2">
          위치는 다르고 구성요소가 맞다면 배경이{' '}
          <span className="bg-yellow-400 px-1 rounded">노란색</span>으로 변하고,
        </p>
        <p className="mb-2">
          위치도 다르고 포함도 안됐다면 배경이{' '}
          <span className="bg-gray-400 px-1 rounded">회색</span>으로 변합니다.
        </p>
        <p>자음 모음으로 7칸을 꽉채워서 오늘의 단어를 맞춰보세요!</p>
      </Modal>
      <div className="text-xl mb-2">kordle 7</div>
      {grid.map((rowData, i) => (
        <div key={i} className="flex space-x-1 mb-2">
          {rowData.map((cell, j) => (
            <div
              key={j}
              className={`max-lg:w-10 max-lg:h-12 w-[66px] h-[66px] max-lg:text-lg flex items-center text-2xl justify-center border-2 rounded-md border-gray-200 text-black ${
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
                className={`max-lg:w-7.5 max-lg:h-10 max-lg:text-sm w-10 h-12 border rounded-sm text-lg border-gray-200 ${keyboardColors[key] || 'bg-white'} ${
                  keyboardColors[key] === 'bg-gray-400' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
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