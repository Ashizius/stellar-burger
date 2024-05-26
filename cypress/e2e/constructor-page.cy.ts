
import ingredients from '../fixtures/ingredients.json';
import user from '../fixtures/user.json';
import orderBurger from '../fixtures/orderBurger.json';
import { deleteCookie, setCookie } from '../../src/utils/cookie';

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
});


describe('проверяем конструктор', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4000/');
  });
  it('заменяет булку', () => {
    cy.get(`[data-testid=${ingredients.data[0]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[0].name}`)
      .should('exist');
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[7].name}`)
      .should('not.exist');
    cy.get(`[data-testid=${ingredients.data[7]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[7].name}`)
      .should('exist');
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[0].name}`)
      .should('not.exist');
  });

  it('добавляет ингредиенты в конструктор', () => {
    cy.location().should((loc) => {
      expect(loc.href).to.eq('http://localhost:4000/');
    });
    cy.get(`[data-testid=${ingredients.data[0]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[0].name}`)
      .should('exist');
    cy.get(`[data-testid=${ingredients.data[1]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[1].name}`)
      .should('exist');
    cy.get(`[data-testid=${ingredients.data[2]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[2].name}`)
      .should('exist');
    cy.get(`[data-testid=${ingredients.data[3]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[3].name}`)
      .should('exist');
  });

  it('удаляет ингредиенты в конструкторе', () => {
    cy.get(`[data-testid=${ingredients.data[3]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[3].name}`)
      .should('exist');
    cy.get(`[data-testid=constructorElement-${ingredients.data[3]._id}]`)
      .find('.constructor-element__action')
      .click();
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[3].name}`)
      .should('not.exist');
  });

  it('двигает ингредиент в конструкторе', () => {
    cy.get(`[data-testid=${ingredients.data[0]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=${ingredients.data[1]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=${ingredients.data[2]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=${ingredients.data[3]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=burger_constructor_id]`)
      .find('.constructor-element')
      .eq(3)
      .contains(ingredients.data[3].name)
      .should('exist');
    cy.get(`[data-testid=move_buttons-${ingredients.data[2]._id}]`).within(
      () => {
        cy.get('button').last().click();
      }
    );
    cy.get(`[data-testid=burger_constructor_id]`)
      .find('.constructor-element')
      .eq(3)
      .contains(ingredients.data[2].name)
      .should('exist');
    cy.get(`[data-testid=move_buttons-${ingredients.data[2]._id}]`).within(
      () => {
        cy.get('button').first().click();
      }
    );
    cy.get(`[data-testid=burger_constructor_id]`)
      .find('.constructor-element')
      .eq(3)
      .contains(ingredients.data[3].name)
      .should('exist');
  });

  it('открывает модалку', () => {
    cy.get(`[data-testId=${ingredients.data[4]._id}]`)
      .get(`[src="${ingredients.data[4].image}"]`)
      .click();
  });
});

describe('проверяем модалки', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
    cy.get(`[data-testId=modal_window]`).should('not.exist');
    cy.get(`[data-testId=${ingredients.data[4]._id}]`)
      .get(`[src="${ingredients.data[4].image}"]`)
      .click();
  });

  it('наличие модалки', () => {
    cy.get(`[data-testId=modal_window]`).should('exist');
  });

  it('наличие ингредиента в модалке', () => {
    cy.get(`[data-testId=modal_window]`).contains(ingredients.data[4].name).should('exist');
  });

  it('клик по модалке', () => {
    cy.get(`[data-testId=modal_window]`).click();
    cy.get(`[data-testId=modal_window]`).should('exist');
  });

  it('клик по закрытию', () => {
    cy.get(`[data-testId=modal_window]`).should('exist');
    cy.get(`[data-testId=modal_window-close_button]`).click();
    cy.get(`[data-testId=modal_window]`).should('not.exist');
  });

  it('клик по оверлею', () => {
    cy.get(`[data-testId=modal_window]`).should('exist');
    cy.get(`[data-testId=modal_window-overlay]`).click({force:true});
    cy.get(`[data-testId=modal_window]`).should('not.exist');
  });
});

describe('проверяем создание заказа залогиненным', () => {
  beforeEach(() => {
    setCookie('accessToken', '123456');
    localStorage.setItem('refreshToken', '654321');
    cy.visit('http://localhost:4000');
    cy.get(`[data-testid=${ingredients.data[0]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=${ingredients.data[1]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[0].name}`)
      .should('exist');
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[1].name}`)
      .should('exist');
    cy.get(`[data-testId=modal_window]`).should('not.exist');
    cy.contains('Оформить заказ').click();
  });

  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('открывает модалку', () => {
    cy.get(`[data-testId=modal_window]`).should('exist');
  });

  it('выводит номер заказа', () => {
    cy.get(`[data-testId=modal_window]`)
      .contains(String(orderBurger.order.number))
      .should('exist');
  });

  it('закрывает модалку', () => {
    cy.get(`[data-testId=modal_window]`).should('exist');
    cy.get(`[data-testId=modal_window-close_button]`).click();
    cy.get(`[data-testId=modal_window]`).should('not.exist');
  });

  it('сбрасывает конструктор бургера', () => {
    cy.get(`[data-testId=modal_window-close_button]`).click();
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[0].name}`)
      .should('not.exist');
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[1].name}`)
      .should('not.exist');
  });
});


describe('проверяем создание заказа незалогиненным', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000');
    cy.get(`[data-testid=${ingredients.data[0]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=${ingredients.data[1]._id}]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[0].name}`)
      .should('exist');
    cy.get(`[data-testid=burger_constructor_id]`)
      .contains(`${ingredients.data[1].name}`)
      .should('exist');
    cy.get(`[data-testId=modal_window]`).should('not.exist');
    cy.contains('Оформить заказ').click();
  });

  it('перебрасывает на страницу логина', () => {
    cy.location().should((loc) => {
      expect(loc.href).to.eq('http://localhost:4000/login');
    });
  });

  it('перебрасывает обратно после логина',()=>{
    cy.get(`input[name=email]`).type(user.login.email);
    cy.get(`input[name=password]`).type(user.login.password);
    cy.contains('Войти').click();
    cy.location().should((loc) => {
      expect(loc.href).to.eq('http://localhost:4000/');
    });
  });

  it('успешно оформляется',()=>{
    cy.get(`input[name=email]`).type(user.login.email);
    cy.get(`input[name=password]`).type(user.login.password);
    cy.contains('Войти').click();
    cy.contains('Оформить заказ').click();
    cy.get(`[data-testId=modal_window]`)
    .contains(String(orderBurger.order.number))
    .should('exist');
  });  
});
