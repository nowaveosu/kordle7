import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-400 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            x
          </button>
        </div>
        <div className="mt-2">
          <h2 className="text-xl font-bold mb-4">꼬들7 소개</h2>
          <p className="mb-2">꼬들7은 6번안에 맞춰야하는 한글 낱말퍼즐입니다!</p>
          <p className="mb-2">예를들어 {' '}
            <span className="bg-gray-200 px-1 rounded">ㅌㅗㅇㄴㅏㅁㅜ</span>를 입력시</p>
          <p className="mb-2">
            정답과 위치와 구성요소가 같다면 배경이{' '}<br />
            <span className="bg-green-400 px-1 rounded">초록색</span>으로 변하고,
          </p>
          <p className="mb-2">
            위치는 다르고 구성요소가 맞다면 배경이{' '}<br />
            <span className="bg-yellow-400 px-1 rounded">노란색</span>으로 변하고,
          </p>
          <p className="mb-2">
            위치도 다르고 포함도 안됐다면 배경이{' '}<br />
            <span className="bg-gray-400 px-1 rounded">회색</span>으로 변합니다.
          </p>
          <p>자음 모음으로 7칸을 꽉채워서 정답을 맞춰보세요!</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;