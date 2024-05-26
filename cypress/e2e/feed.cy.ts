import ingredients from '../fixtures/ingredients.json';
import user from '../fixtures/user.json';
import orderBurger from '../fixtures/orderBurger.json';
import feeds from '../fixtures/feeds.json';
import { deleteCookie, getCookie, setCookie } from '../../src/utils/cookie';

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
    body: user.response
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
  cy.intercept('GET', 'api/orders', {
    statusCode: 200,
    ok: true,
    body: feeds
  });
});

describe('проверка ленты заказов', () => {
  beforeEach(() => {
    setCookie('accessToken', '123456');
    localStorage.setItem('refreshToken', '654321');
    cy.visit('http://localhost:4000/feed');
  });

  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('проверяем, что есть лента', () => {
    feeds.orders.forEach((order) => {
      cy.contains(order.name).should('exist');
    });
  });

  it('кликаем по заказу', () => {
    cy.contains(feeds.orders[0].name).click();
    cy.get(`[data-testId=modal_window]`).should('exist');
    cy.get(`[data-testId=modal_window]`).contains(feeds.orders[0].name);
  });

  it('закрывает модалку по кнопке', () => {
    cy.contains(feeds.orders[0].name).click();
    cy.get(`[data-testId=modal_window]`).should('exist');
    cy.get(`[data-testId=modal_window-close_button]`).click();
    cy.get(`[data-testId=modal_window]`).should('not.exist');
  });

  it('закрывает модалку по оверлею', () => {
    cy.contains(feeds.orders[0].name).click();
    cy.get(`[data-testId=modal_window]`).should('exist');
    cy.get(`[data-testId=modal_window-overlay]`).click({ force: true });
    cy.get(`[data-testId=modal_window]`).should('not.exist');
  });

  it('наличие количества заказов', () => {
    cy.contains(feeds.total).should('exist');
    cy.contains(feeds.totalToday).should('exist');
  });
});
