import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { isEmail, isInt, isFloat } from 'validator';
import { useDispatch } from 'react-redux';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Title } from './styled';
import Loading from '../../components/Loading';
import api from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/action';

export default function Alunos({ match }) {
  const id = get(match, 'params.id', '');
  const dispatch = useDispatch();

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [foto, setFoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);

        const { data } = await api.get(`/alunos/${id}`);
        const Foto = get(data, 'Fotos[0].url', '');

        setFoto(Foto);

        setNome(data.nome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setIdade(data.idade);
        setPeso(data.peso);
        setAltura(data.altura);

        setIsLoading(false);
      } catch (err) {
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        if (status === 400) {
          errors.map((error) => toast.error(error));
          history.push('/');
        }

        setIsLoading(false);
      }
    }

    getData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    let fromErrors = false;

    if (nome.length < 3 || nome.length >= 255) {
      toast.error('Nome precisa ter entre 3 e 255 caracteres');
      fromErrors = true;
    }

    if (sobrenome.length < 3 || sobrenome.length >= 255) {
      toast.error('Sobrenome precisa ter entre 3 e 255 caracteres');
      fromErrors = true;
    }

    if (!isEmail(email)) {
      toast.error('E-mail Inválido');
      fromErrors = true;
    }

    if (!isInt(String(idade))) {
      toast.error('Idade Inválida');
      fromErrors = true;
    }

    if (!isFloat(String(peso))) {
      toast.error('Peso Inválido');
      fromErrors = true;
    }

    if (!isFloat(String(altura))) {
      toast.error('Altura Inválida');
      fromErrors = true;
    }

    if (fromErrors) return;

    try {
      setIsLoading(true);
      if (id) {
        await api.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });

        toast.success('Dados Atualizados com sucesso');
        history.push('/');
      } else {
        const { data } = await api.post(`/alunos`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });

        toast.success('Aluno(a) cadastrado com sucesso');
        history.push(`/aluno/${data.id}/edit`);
      }
      setIsLoading(false);
    } catch (err) {
      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Erro desconhecido');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  }

  return (
    <Container onSubmit={handleSubmit}>
      <Loading isLoading={isLoading} />
      <Title>{id ? 'Editar aluno' : 'Novo aluno'}</Title>

      {id && (
        <ProfilePicture>
          {foto ? <img src={foto} alt={nome} /> : <FaUserCircle size={180} />}
          <Link to={`/fotos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}

      <Form>
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>

        <label htmlFor="sobrenome">
          Sobrenome:
          <input
            type="text"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="idade">
          Idade:
          <input
            type="number"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
          />
        </label>
        <label htmlFor="peso">
          Peso:
          <input
            type="text"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
          />
        </label>
        <label htmlFor="altura">
          Altura:
          <input
            type="text"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
          />
        </label>

        <button type="submit">
          {id ? 'Salvar Alterações' : 'Criar Aluno'}
        </button>
      </Form>
    </Container>
  );
}

Alunos.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
