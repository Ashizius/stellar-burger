import ingredients from '../fixtures/ingredients.json';
import user from '../fixtures/user.json';
import orderBurger from '../fixtures/orderBurger.json';
import feeds from '../fixtures/feeds.json';
import { testURL, pages, elements } from '../fixtures/testConstants.json';
import { deleteCookie, setCookie } from '../../src/utils/cookie';

const newUser = {
  name: 'nameNameName',
  email: 'newmail@newmail.com',
  password: 'PasswordPassword987654321'
};
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
});

describe('проверка профиля', () => {
  beforeEach(() => {
    cy.intercept('PATCH', 'api/auth/user', {
      statusCode: 200,
      ok: true,
      body: { ...user.response, user: newUser }
    });
    setCookie('accessToken', '123456');
    localStorage.setItem('refreshToken', '654321');
    cy.visit(testURL + pages.profile);
  });

  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
  it('проверяет заполненность профиля', () => {
    cy.get(`input[name=name]`).should('have.value', user.user.name);
    cy.get(`input[name=email]`).should('have.value', user.user.email);
  });
  it('меняет профиль', () => {
    cy.get(`input[name=name]`).clear().type(newUser.name);
    cy.get(`input[name=email]`).clear().type(newUser.email);
    cy.contains('Сохранить').click();
    cy.get(`input[name=name]`).should('have.value', newUser.name);
    cy.get(`input[name=email]`).should('have.value', newUser.email);
  });
});

describe('проверка списка заказов', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/orders', {
      statusCode: 200,
      ok: true,
      body: feeds
    });
    cy.intercept('GET', 'api/orders/408702', {
      statusCode: 200,
      ok: true,
      body: feeds
    });
    setCookie('accessToken', '123456');
    localStorage.setItem('refreshToken', '654321');
    cy.visit(testURL + pages.orders);
  });

  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('проверяем, что есть список', () => {
    feeds.orders.forEach((order) => {
      cy.contains(order.name).should('exist');
    });
  });

  it('кликаем по заказу', () => {
    cy.contains(feeds.orders[0].name).click();
    cy.get(`[data-testId=${elements.modalWindowId}]`).should('exist');
    cy.get(`[data-testId=${elements.modalWindowId}]`).contains(
      feeds.orders[0].name
    );
  });

  it('закрывает модалку по кнопке', () => {
    cy.contains(feeds.orders[0].name).click();
    cy.get(`[data-testId=${elements.modalWindowId}]`).should('exist');
    cy.get(`[data-testId=${elements.modalCloseTag}]`).click();
    cy.get(`[data-testId=${elements.modalWindowId}]`).should('not.exist');
  });

  it('закрывает модалку по оверлею', () => {
    cy.contains(feeds.orders[0].name).click();
    cy.get(`[data-testId=${elements.modalWindowId}]`).should('exist');
    cy.get(`[data-testId=${elements.modalOverlayTag}]`).click({ force: true });
    cy.get(`[data-testId=${elements.modalWindowId}]`).should('not.exist');
  });
});
