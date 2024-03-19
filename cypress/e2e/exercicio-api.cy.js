/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
const faker = require('faker')

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })

  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) => {
      //expect(response.body.produtos[9].nome).to.equal('Produto EBAC 436746')
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.duration).to.be.lessThan(30)
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    const email = faker.internet.email();
    cy.request({
      method: 'POST',
      url: 'usuarios',
      failOnStatusCode: false,
      body: {
        "nome": "Simone Kovalenkinas",
        "email": email,
        "password": "teste",
        "administrador": "true"
      },
    }).then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')

      // Verificar se o ID existe e é do tipo correto (número ou string)
      expect(response.body).to.have.property('_id')
      expect(response.body._id).to.be.a('string') // ou 'number' se o ID for um número

      // Armazenar o ID em uma constante
      const id = response.body._id

      // Validar o ID na resposta
      expect(response.body._id).to.equal(id)
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      failOnStatusCode: false,
      body: {
        "nome": "Simone Kovalenkinas 112",
        "email": "aaaaaaaaaa",
        "password": "teste",
        "administrador": "true"
      },
    }).then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.email).to.equal('email deve ser um email válido')

    })

  });

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.request({
      method: 'PUT',
      url: 'usuarios/2HysNR4MAjUbyqWy',
      failOnStatusCode: false,
      body: {
        "nome": "Simone Kovalenkinas 333",
        "email": "simone.qa2362@gmail.com",
        "password": "teste31",
        "administrador": "true"
      },
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.message).to.equal('Registro alterado com sucesso')
    });

    it('Deve excluir um usuário previamente cadastrado', () => {
      cy.request({
        method: 'DELETE',
        url: 'usuarios/PJWj2hM3s6bReNPs',

      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      });
    });
  });
});
