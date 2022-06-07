import { doc, collection, addDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

// Actions
const LOAD = 'board/LOAD';
const CREATE = 'board/CREATE';
const UPDATE = 'board/UPDATE';
const REMOVE = 'board/REMOVE';

const initialValue = [
  { id: 0, title: '제목1', content: '내용1', like: '1' },
  { id: 1, title: '제목2', content: '내용2', like: '0' },
  { id: 2, title: '제목3', content: '내용3', like: '2' },
];

// Firebase로부터 데이터 가져오기
export const loadBoardFB = () => {
  return async function (dispatch) {
    const boards = await getDocs(collection(db, 'board'));
    let boardList = [];
    boards.forEach(board => {
      boardList.push({ id: board.id, ...board.data() });
    });
    dispatch(loadBoard(boardList));
  };
};

export const addBoardFB = newBoard => {
  return async function (dispatch) {
    newBoard = { ...newBoard, like: 0 };
    const docRef = await addDoc(collection(db, 'board'), newBoard);
    const boardData = { id: docRef.id, ...newBoard };
    dispatch(createBoard(boardData));
  };
};

export const updateBoardFB = (targetId, newBoard) => {
  return async function (dispatch) {
    const docRef = doc(collection(db, 'board'), targetId);
    await updateDoc(docRef, { ...newBoard });
    dispatch(updateBoard(targetId, newBoard));
  };
};

export const removeBoardFB = targetId => {
  return async function (dispatch) {
    const docRef = doc(collection(db, 'board'), targetId);
    await deleteDoc(docRef);
    dispatch(removeBoard(targetId));
  };
};

// Reducer
export default function reducer(state = { list: initialValue }, action = {}) {
  switch (action.type) {
    // do reducer stuff
    case 'board/LOAD': {
      return { list: action.board };
    }
    case 'board/CREATE': {
      // return { list: [action.board, ...state.list] };
    }
    case 'board/UPDATE': {
      console.log(action.targetId);
      console.log(action.board);
      return { list: state.list.map(board => (board.id === action.targetId ? { ...board, ...action.board } : board)) };
    }
    case 'board/REMOVE': {
      return { list: state.list.filter(board => board.id !== action.targetId) };
    }
    default:
      return state;
  }
}

// Action Creators
export function loadBoard(board) {
  return { type: LOAD, board };
}

export function createBoard(board) {
  return { type: CREATE, board };
}

export function updateBoard(targetId, board) {
  return { type: UPDATE, targetId, board };
}

export function removeBoard(targetId) {
  return { type: REMOVE, targetId };
}
