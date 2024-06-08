import ingredients from '../fixtures/ingredients.json';
import user from '../fixtures/user.json';
import { testURL, pages } from '../fixtures/testConstants.json';
import { deleteCookie } from '../../src/utils/cookie';

beforeEach(() => {
  cy.intercept('GET', 'api/ingredients', {
    statusCode: 200,
    ok: true,
    body: ingredients
  });
});

describe('проверяем регистрацию', () => {
  beforeEach(() => {
    cy.intercept('POST', 'api/auth/register', {
      statusCode: 200,
      ok: true,
      body: user.response
    });
  });
  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
  it('регистрация и проверка имени на главной', () => {
    cy.visit(testURL + pages.register);
    cy.get(`input[name=name]`).type(user.login.name);
    cy.get(`input[name=email]`).type(user.login.email);
    cy.get(`input[name=password]`).type(user.login.password);
    cy.contains('Зарегистрироваться').click();
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testURL);
    });
    cy.contains(user.user.name).should('exist');
  });
  it('переходит на логин', () => {
    cy.visit(testURL + pages.register);
    cy.contains('Войти').click();
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testURL + pages.login);
    });
  });
  it('регистрация со страницы профиля', () => {
    cy.visit(testURL + pages.profile);
    cy.contains('Зарегистрироваться').click();
    cy.get(`input[name=name]`).type(user.login.name);
    cy.get(`input[name=email]`).type(user.login.email);
    cy.get(`input[name=password]`).type(user.login.password);
    cy.contains('Зарегистрироваться').click();
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testURL + pages.profile);
    });
  });
});
