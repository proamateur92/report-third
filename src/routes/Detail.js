import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, storage } from '../firebase/firebase';
import { doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addBoardFB, updateBoardFB } from '../redux/modules/board';
import Header from './common/Header';
import styled from 'styled-components';

const Detail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [mode, setMode] = useState(true);
  const [data, setData] = useState({ userId: '', content: '', imageFile: '', createdDate: '' });
  const [isLogin, setIsLogin] = useState(false);

  const { id } = useParams();
  const board = location.state;

  console.log(board);
  // 수정 로직

  const loginCheck = async user => {
    if (user) {
      setIsLogin(true);
      setData({ ...data, userId: user.email });
    } else {
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, loginCheck);
  }, []);

  const handleData = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // 데이터 잘 넘어가는지 콘솔 테스트
  console.log(board.createdDate);
  console.log(typeof board.createdDate);
  return (
    <>
      <Header isLogin={isLogin} />
      <WriteFrom>
        <h1>상세 페이지</h1>
        <div>
          <span>{board.userId}</span>
          <span>{new Date(board.createdDate).toLocaleString()}</span>
        </div>
        <div>
          <span>{board.content}</span>
        </div>
        <Thumbnail>
          <img src={board.imageFile} />
        </Thumbnail>
      </WriteFrom>
    </>
  );
};

const WriteFrom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Thumbnail = styled.div`
  width: 300px;
  height: 300px;
  img {
    width: 100%;
    height: 100%;
  }
`;

export default Detail;
