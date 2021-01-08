import * as types from '../types';

export function botaoClicadoSuccess() {
  return {
    type: types.BOTAO_CLICADO_SUCCESS,
  };
}
export function botaoClicadoRequest() {
  return {
    type: types.BOTAO_CLICADO_REQUEST,
  };
}

export function botaoClicadoFailure() {
  return {
    type: types.BOTAO_CLICADO_FAILURE,
  };
}
