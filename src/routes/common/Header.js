import { faSquarePlus, faHeart, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 onClick={() => navigate('/')}>Instagram</h1>
      <FontAwesomeIcon onClick={() => navigate('/write')} icon={faSquarePlus} size='2x' />
      <FontAwesomeIcon onClick={() => navigate('/like')} icon={faHeart} size='2x' />
      <FontAwesomeIcon onClick={() => navigate('/notice')} icon={faPaperPlane} size='2x' />
    </div>
  );
};

export default Header;
