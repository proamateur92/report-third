import { loadBoardFB, removeBoardFB } from '../redux/modules/board';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import Header from './common/Header';
import styled from 'styled-components';

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector(state => state.board.list);

  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState('');

  const loginCheck = async user => {
    if (user) {
      setIsLogin(true);
      setUserId(user.email);
    } else {
      setIsLogin(false);
      setUserId('');
    }
  };

  useEffect(() => {
    dispatch(loadBoardFB());
    onAuthStateChanged(auth, loginCheck);
  }, []);

  let boardList = <div>게시글이 존재하지 않습니다.</div>;

  const onRemove = targetId => {
    dispatch(removeBoardFB(targetId));
  };

  // store에 값이 존재하면 게시물 출력
  if (boards.length > 0) {
    boardList = boards.map(board => (
      <Board key={board.id}>
        <BoradHeader>
          <span style={{ display: 'inline-block', fontSize: 20, marginBottom: 15 }}>
            <strong style={{ fontFamily: 'Robota', fontSize: '26px' }}>{board.userId}</strong>
          </span>
          <div>
            <span style={{ color: '#333', fontSize: '20px' }}>{new Date(board.createdDate).toLocaleString()}</span>
            {userId === board.userId ? (
              <>
                <FontAwesomeIcon
                  style={{ marginLeft: 10, cursor: 'pointer' }}
                  onClick={() => navigate(`/write/${board.id}`, { state: board })}
                  icon={faPencil}
                  size='xl'
                />
                <FontAwesomeIcon style={{ marginLeft: 10, cursor: 'pointer' }} onClick={() => onRemove(board.id)} icon={faTrashCan} size='xl' />
              </>
            ) : (
              ''
            )}
          </div>
        </BoradHeader>
        <div onClick={() => navigate(`/${board.id}`, { state: board })} style={{ height: '100%' }} className='content-container'>
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
        </div>
      </Board>
    ));
  }

  return (
    <>
      <Header isLogin={isLogin} />
      <div>{boardList}</div>
    </>
  );
};

const BoradHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Board = styled.div`
  width: 100%;
  margin: 30px auto 80px;
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

export default Main;
