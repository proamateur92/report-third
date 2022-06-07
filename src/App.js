import Router from './routes/Router';
import { Provider } from 'react-redux';
import store from './redux/configStore';
import styled from 'styled-components';

function App() {
  return (
    <Container>
      <Box>
        <Provider store={store}>
          <Router />
        </Provider>
      </Box>
    </Container>
  );
}

const Box = styled.div`
  width: 800px;
  margin: auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: yellow;
`;
export default App;
