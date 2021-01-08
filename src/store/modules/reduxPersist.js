// Configuração do Redux Persist para salvar os dados do token na aplicação
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default (reducers) => {
  const persistedReducers = persistReducer(
    {
      key: 'cad_alunos',
      storage,
      whitelist: ['auth'],
    },
    reducers
  );

  return persistedReducers;
};
