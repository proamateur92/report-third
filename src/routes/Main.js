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
        <div onClick={() => navigate(`/${board.id}`, { state: board })} style={{ height: '100%' }} className='content-container'>
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
                <Content>내용: {board.content}</Content>
                <img src={board.imageFile} alt='게시글 이미지' />
              </>
            ) : (
              ''
            )}
            {board.layout === 'bottom' ? (
              <>
                <Content>내용: {board.content}</Content>
                <img src={board.imageFile} alt='게시글 이미지' />
              </>
            ) : (
              ''
            )}
          </Thumbnail>
          <div>좋아요 {board.like}개</div>
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
  background-color: red;
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
export default Main;
