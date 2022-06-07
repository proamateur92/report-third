import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeBoardFB } from '../redux/modules/board';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, storage } from '../firebase/firebase';
import { doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addBoardFB, updateBoardFB } from '../redux/modules/board';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from './common/Header';
import styled from 'styled-components';

const Detail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [mode, setMode] = useState(true);
  const [data, setData] = useState({ userId: '', content: '', imageFile: '', createdDate: '' });
  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState('');

  const { id } = useParams();
  const board = location.state;

  // console.log(board);

  // 수정 로직
  const loginCheck = async user => {
    if (user) {
      setIsLogin(true);
      setUserId(user.email);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, loginCheck);
  }, []);

  const handleData = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onRemove = targetId => {
    dispatch(removeBoardFB(targetId));
    navigate('/');
  };

  return (
    <>
      <Header isLogin={isLogin} />
      <BoradHeader>
        <span style={{ display: 'inline-block', fontSize: 20, marginBottom: 15 }}>
          <strong>{board.userId}</strong>
        </span>
        <div>
          {new Date(board.createdDate).toLocaleString()}
          {userId === board.userId ? (
            <>
              <FontAwesomeIcon
                style={{ marginLeft: 8, cursor: 'pointer' }}
                onClick={() => navigate(`/write/${board.id}`, { state: board })}
                icon={faPencil}
                size='lg'
              />
              <FontAwesomeIcon style={{ marginLeft: 8, cursor: 'pointer' }} onClick={() => onRemove(board.id)} icon={faTrashCan} size='lg' />
            </>
          ) : (
            ''
          )}
        </div>
      </BoradHeader>
      <div onClick={() => navigate(`/${board.id}`, { state: board })} style={{ height: '100%', backgroundColor: 'red' }} className='content-container'>
        <Thumbnail align={board.layout}>
          {board.layout === 'left' ? (
            <>
              <img src={board.imageFile} alt='게시글 이미지' />
              <Content>{board.content}</Content>
            </>
          ) : (
            ''
          )}
          {board.layout === 'right' ? (
            <>
              <Content>{board.content}</Content>
              <img src={board.imageFile} alt='게시글 이미지' />
            </>
          ) : (
            ''
          )}
          {board.layout === 'bottom' ? (
            <>
              <Content>{board.content}</Content>
              <img src={board.imageFile} alt='게시글 이미지' />
            </>
          ) : (
            ''
          )}
        </Thumbnail>
        <div>좋아요 {board.like}개</div>
      </div>
    </>
  );
};

const BoradHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Board = styled.div`
  width: 100%;
  margin: 70px auto;
`;

const Thumbnail = styled.div`
  display: flex;
  flex-direction: ${props => (props.align === 'bottom' ? 'column' : 'flex-start')};
  width: 100%;
  div {
    width: ${props => (props.align === 'bottom' ? '100%' : '50%')};
    height: 100%;
  }
  img {
    width: ${props => (props.align === 'bottom' ? '100%' : '50%')};
    height: 100%;
  }
`;

const Content = styled.p`
  word-wrap: break-word;
  width: 50%;
`;
export default Detail;
