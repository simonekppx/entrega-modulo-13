/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  it.only('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })
    
    cy.log(response.body)
  });

  it('Deve listar usuários cadastrados', () => {
    //TODO: 12/03/24
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    //TODO: 12/03/24
  });

  it('Deve validar um usuário com email inválido', () => {
    //TODO: 12/03/24
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    //TODO: 12/03/24
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    //TODO: 12/03/24
  });


});
