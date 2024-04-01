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

  it('Deve cadastrar um usuário com sucesso usando comando customizado', () => {
    cy.cadastrarUsuario("Simone Kovalenkinas", "simone@example.com", "teste", true).then((response) => {
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

  it('Deve editar um usuário cadastrado', () => {
    // Chamar o comando customizado para cadastrar um usuário
    cy.cadastrarUsuario().then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')

      // Armazenar o ID do usuário
      const id = response.body._id

      // Gerar um email aleatório
      const email = faker.internet.email();

      // Editar o usuário usando o ID e email gerado
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body: {
          "nome": "Nome Editado",
          "email": email,
          "password": "senhaeditada",
          "administrador": "true"
        },
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  });

  it('Deve excluir um usuário previamente cadastrado', () => {
    // Chamar o comando customizado para cadastrar um usuário
    cy.cadastrarUsuario().then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')

      // Armazenar o ID do usuário
      const id = response.body._id

      // Excluir o usuário usando o ID gerado 

      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`,

      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      });
    });
  });

});