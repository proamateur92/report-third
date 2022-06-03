import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addBoardFB, updateBoardFB } from '../redux/modules/board';

const Write = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [mode, setMode] = useState(true);
  const [data, setData] = useState({ content: '', imageFile: '' });

  const { id } = useParams();
  const board = location.state;

  useEffect(() => {
    id && setMode(false);
    if (board) {
      setData({ content: board.content, imageFile: board.imageFile });
    }
  }, [id, board]);

  const handleData = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleWrite = e => {
    e.preventDefault();
    mode ? dispatch(addBoardFB(data)) : dispatch(updateBoardFB(id, data));
    setData({ content: '', imageFile: '' });
    navigate('/');
  };

  return (
    <WriteFrom onSubmit={handleWrite}>
      <h1>{mode ? '글 작성 페이지' : '글 수정 페이지'}</h1>
      {/* <input name='imageFile' value={data.imageFile} onChange={handleData} type='file' /> */}
      <input name='imageFile' value={data.imageFile} onChange={handleData} type='text' />
      <textarea name='content' value={data.content} onChange={handleData}></textarea>
      <button>{mode ? '글 작성하기' : '글 수정하기'}</button>
    </WriteFrom>
  );
};

const WriteFrom = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Write;
