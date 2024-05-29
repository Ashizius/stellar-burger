import ingredients from '../fixtures/ingredients.json';
import user from '../fixtures/user.json';
import feeds from '../fixtures/feeds.json';
import { testURL, pages } from '../fixtures/testConstants.json';
import { deleteCookie } from '../../src/utils/cookie';

beforeEach(() => {
  cy.intercept('GET', 'api/ingredients', {
    statusCode: 200,
    ok: true,
    body: ingredients
  });
  cy.intercept('GET', 'api/orders/all', {
    statusCode: 200,
    ok: true,
    body: feeds
  });
});

describe('проверяем переброс на логин', () => {
  it('не перебрасывает со стартовой', () => {
    cy.visit(testURL);
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testURL);
    });
  });
  it('не перебрасывает с ленты заказов', () => {
    cy.visit(testURL + pages.feed);
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testURL + pages.feed);
    });
  });
  it('перебрасывает из личного кабинета', () => {
    cy.visit(testURL + pages.profile);
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testURL + pages.login);
    });
  });
});

describe('проверяем логин', () => {
  beforeEach(() => {
    cy.intercept('POST', 'api/auth/login', {
      statusCode: 200,
      ok: true,
      body: user.response
    });
  });
  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
  it('логин и проверка имени на главной', () => {
    cy.visit(testURL + pages.login);
    cy.get(`input[name=email]`).type(user.login.email);
    cy.get(`input[name=password]`).type(user.login.password);
    cy.contains('Войти').click();
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testURL);
    });
    cy.contains(user.user.name).should('exist');
  });
  it('логин и проверка со страницы профиля', () => {
    cy.visit(testURL + pages.profile);
    cy.get(`input[name=email]`).type(user.login.email);
    cy.get(`input[name=password]`).type(user.login.password);
    cy.contains('Войти').click();
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testURL + pages.profile);
    });
  });
  it('переходит на регистрацию', () => {
    cy.visit(testURL + pages.login);
    cy.contains('Зарегистрироваться').click();
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testURL + pages.register);
    });
  });
});
