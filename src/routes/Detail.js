import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeBoardFB } from '../redux/modules/board';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from './common/Header';
import styled from 'styled-components';

const Detail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState('');
  const board = location.state;

  useEffect(() => {
    onAuthStateChanged(auth, loginCheck);
  }, []);

  const loginCheck = async user => {
    if (user) {
      setIsLogin(true);
      setUserId(user.email);
    }
  };

  const onRemove = targetId => {
    dispatch(removeBoardFB(targetId));
    navigate('/');
  };

  return (
    <>
      <Header isLogin={isLogin} />
      {!board && (
        <Board style={{ textAlign: 'center' }}>
          <h1>죄송합니다. 페이지를 사용할 수 없습니다.</h1>
          <span>
            클릭하신 링크가 잘못되었거나 페이지가 삭제되었습니다.{' '}
            <a href='/' style={{ textDecoration: 'none', color: '#333' }}>
              Instagram으로 돌아가기.
            </a>
          </span>
        </Board>
      )}
      {board && (
        <Board>
          <BoradHeader>
            <span style={{ display: 'inline-block', fontSize: 20, marginBottom: 15 }}>
              <strong style={{ fontFamily: 'Robota', fontSize: '26px' }}>{board.userId}</strong>
            </span>
            <div>
              <span style={{ color: '#333', fontSize: '20px' }}>{new Date(board.createdDate).toLocaleString()}</span>
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
          <Thumbnail align={board.layout}>
            {board.layout === 'left' ? (
              <>
                <img src={board.imageFile} alt='게시글 이미지' />
                <p>{board.content}</p>
              </>
            ) : (
              ''
            )}
            {board.layout === 'right' ? (
              <>
                <p>{board.content}</p>
                <img src={board.imageFile} alt='게시글 이미지' />
              </>
            ) : (
              ''
            )}
            {board.layout === 'bottom' ? (
              <>
                <p>{board.content}</p>
                <img src={board.imageFile} alt='게시글 이미지' />
              </>
            ) : (
              ''
            )}
          </Thumbnail>
          <Like>좋아요 {board.like}개</Like>
        </Board>
      )}
    </>
  );
};

const BoradHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Board = styled.div`
  width: 100%;
  margin: 30px auto;
`;

const Thumbnail = styled.div`
  display: flex;
  flex-direction: ${props => (props.align === 'bottom' ? 'column' : 'flex-start')};
  width: 100%;
  height: 50vh;
  p {
    width: ${props => (props.align === 'bottom' ? '100%' : '50%')};
    word-wrap: break-word;
    height: 70%;
  }
  img {
    width: ${props => (props.align === 'bottom' ? '100%' : '50%')};
    height: 70%;
    border-radius: 15px;
  }
`;

const Like = styled.div`
  margin: 10px 0;
`;
export default Detail;
