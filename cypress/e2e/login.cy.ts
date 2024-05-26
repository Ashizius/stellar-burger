import ingredients from '../fixtures/ingredients.json';
import user from '../fixtures/user.json';
import orderBurger from '../fixtures/orderBurger.json';
import feeds from '../fixtures/feeds.json';
import { deleteCookie, getCookie, setCookie } from '../../src/utils/cookie';

const newUser = { name: 'nameNameName', email: 'PasswordPassword987654321' };
beforeEach(() => {
  cy.intercept('GET', 'api/ingredients', {
    statusCode: 200,
    ok: true,
    body: ingredients
  });
  cy.intercept('GET', 'api/auth/user', {
    statusCode: 200,
    ok: true,
    body: user.response
  });
  cy.intercept('POST', 'api/auth/register', {
    statusCode: 200,
    ok: true,
    body: user.response
  });
  cy.intercept('POST', 'api/auth/login', {
    statusCode: 200,
    ok: true,
    body: user.response
  });
  cy.intercept('POST', 'api/auth/logout', {
    statusCode: 200,
    ok: true,
    body: user.response
  });
  cy.intercept('PATCH', 'api/auth/PATCH', {
    statusCode: 200,
    ok: true,
    body: {...user.response, user: newUser}
  });
  cy.intercept('POST', 'api/orders', {
    statusCode: 200,
    ok: true,
    body: orderBurger
  });
  cy.intercept('GET', 'api/orders/all', {
    statusCode: 200,
    ok: true,
    body: feeds
  });
  cy.intercept('GET', 'api/orders/*', {
    statusCode: 200,
    ok: true,
    body: feeds
  });
});

describe('проверяем переброс на логин', () => {
  it('не перебрасывает со стартовой', () => {
    cy.visit('http://localhost:4000');
    cy.location().should((loc) => {
      expect(loc.href).to.eq('http://localhost:4000/');
    });
  });
  it('не перебрасывает с ленты заказов', () => {
    cy.visit('http://localhost:4000/feed');
    cy.location().should((loc) => {
      expect(loc.href).to.eq('http://localhost:4000/feed');
    });
  });
  it('перебрасывает из личного кабинета', () => {
    cy.visit('http://localhost:4000/profile');
    cy.location().should((loc) => {
      expect(loc.href).to.eq('http://localhost:4000/login');
    });
  });
});

describe('проверяем логин', () => {
  it('логин и проверка имени на главной', () => {
    cy.visit('http://localhost:4000/login');
    cy.get(`input[name=email]`).type(user.login.email);
    cy.get(`input[name=password]`).type(user.login.password);
    cy.contains('Войти').click();
    cy.location().should((loc) => {
      expect(loc.href).to.eq('http://localhost:4000/');
    });
    cy.contains(user.user.name).should('exist');
  });
  it('логин и проверка со страницы профиля', () => {
    cy.visit('http://localhost:4000/profile');
    cy.get(`input[name=email]`).type(user.login.email);
    cy.get(`input[name=password]`).type(user.login.password);
    cy.contains('Войти').click();
    cy.location().should((loc) => {
      expect(loc.href).to.eq('http://localhost:4000/profile');
    });
  });
  it('переходит на регистрацию', () => {
    cy.visit('http://localhost:4000/login');
    cy.contains('Зарегистрироваться').click();
    cy.location().should((loc) => {
      expect(loc.href).to.eq('http://localhost:4000/register');
    });
  });
});
