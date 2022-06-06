import { loadBoardFB } from '../redux/modules/board';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { faEllipsis, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import Header from './common/Header';
import styled from 'styled-components';
import { removeBoardFB } from '../redux/modules/board';

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector(state => state.board.list);

  const [isLogin, setIsLogin] = useState(false);

  const loginCheck = async user => {
    if (user) {
      setIsLogin(true);
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
      <div key={board.id} style={{ width: 200, height: 150, backgroundColor: 'violet', marginBottom: 10 }}>
        <BoradHeader>
          <div>
            작성자: {board.userId} {new Date(board.createdDate).toLocaleString()}
          </div>
          <FontAwesomeIcon onClick={() => onRemove(board.id)} icon={faTrashCan} />
        </BoradHeader>
        <div onClick={() => navigate(`/${board.id}`, { state: board })} style={{ height: '100%', backgroundColor: 'red' }} className='content-container'>
          <div>내용: {board.content}</div>
          <Thumbnail>
            <img src={board.imageFile} alt='게시글 이미지' />
          </Thumbnail>
          <div>좋아요 {board.like}개</div>
        </div>
      </div>
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
  width: 300px;
`;

const Thumbnail = styled.div`
  width: 300px;
  height: 300px;
  img {
    width: 100%;
    height: 100%;
  }
`;
export default Main;
