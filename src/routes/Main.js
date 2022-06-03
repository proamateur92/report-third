import { loadBoardFB } from '../redux/modules/board';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { faEllipsis, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { removeBoardFB } from '../redux/modules/board';

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector(state => state.board.list);

  let boardList = <div>게시글이 존재하지 않습니다.</div>;

  useEffect(() => {
    dispatch(loadBoardFB());
  }, []);

  const onRemove = targetId => {
    dispatch(removeBoardFB(targetId));
  };

  // store에 값이 존재하면 게시물 출력
  if (boards.length > 0) {
    boardList = boards.map(board => (
      <div key={board.id} style={{ width: 200, height: 150, backgroundColor: 'violet', marginBottom: 10 }}>
        <BoradHeader>
          <div>작성자: {board.author}</div>
          <FontAwesomeIcon onClick={() => onRemove(board.id)} icon={faTrashCan} />
        </BoradHeader>
        <div onClick={() => navigate(`/write/${board.id}`, { state: board })} style={{ height: '100%', backgroundColor: 'red' }} className='content-container'>
          <div>이미지주소: {board.imageFile}</div>
          <div>내용: {board.content}</div>
          <div>좋아요 {board.like}개</div>
        </div>
      </div>
    ));
  }
  return (
    <div>
      <h1>메인 페이지</h1>
      {boardList}
    </div>
  );
};

const BoradHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
export default Main;
