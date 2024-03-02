import { FC } from 'react';
import { Provider } from "react-redux";

import { store } from "store";
import { Main } from 'pages/Main';

export const App: FC = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
