import ingredients from '../fixtures/ingredients.json';
import user from '../fixtures/user.json';
import orderBurger from '../fixtures/orderBurger.json';
import { deleteCookie, setCookie } from '../../src/utils/cookie';
import { testURL, pages, elements } from '../fixtures/testConstants.json';

const burgerConstructorTestId = `[data-testid=${elements.burgerConstructorId}]`;
const modalWindowTestId = `[data-testId=${elements.modalWindowId}]`;

Cypress.Commands.add('addIngredient', (testId: string) =>
  cy.get(`[data-testid=${testId}]`).contains('Добавить').click()
);
Cypress.Commands.add('checkIsInConstructor', (text: string) => {
  cy.get(burgerConstructorTestId).contains(text).should('exist');
});
Cypress.Commands.add('checkIsNotInConstructor', (text: string) => {
  cy.get(burgerConstructorTestId).contains(text).should('not.exist');
});

beforeEach(() => {
  cy.intercept('GET', 'api/ingredients', {
    statusCode: 200,
    ok: true,
    body: ingredients
  });
});

describe('проверяем конструктор', () => {
  beforeEach(() => {
    cy.visit(testURL);
    cy.get(burgerConstructorTestId).as('burgerConstructor');
  });
  it('заменяет булку', () => {
    cy.addIngredient(ingredients.data[0]._id);
    cy.checkIsInConstructor(ingredients.data[0].name);
    cy.checkIsNotInConstructor(ingredients.data[7].name);
    cy.addIngredient(ingredients.data[7]._id);
    cy.checkIsInConstructor(ingredients.data[7].name);
    cy.checkIsNotInConstructor(ingredients.data[0].name);
  });

  it('добавляет ингредиенты в конструктор', () => {
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testURL);
    });
    cy.addIngredient(ingredients.data[0]._id);
    cy.checkIsInConstructor(ingredients.data[0].name);
    cy.addIngredient(ingredients.data[1]._id);
    cy.checkIsInConstructor(ingredients.data[1].name);
    cy.addIngredient(ingredients.data[2]._id);
    cy.checkIsInConstructor(ingredients.data[2].name);
    cy.addIngredient(ingredients.data[3]._id);
    cy.checkIsInConstructor(ingredients.data[3].name);
  });

  it('удаляет ингредиенты в конструкторе', () => {
    cy.addIngredient(ingredients.data[3]._id);
    cy.checkIsInConstructor(ingredients.data[3].name);
    cy.get(
      `[data-testid=${elements.constructorElementTagPrefix}${ingredients.data[3]._id}]`
    )
      .find(elements.constructorElementAction)
      .click();
    cy.checkIsNotInConstructor(ingredients.data[3].name);
  });

  it('двигает ингредиент в конструкторе', () => {
    cy.get(burgerConstructorTestId).as('burgerConstructor');
    cy.addIngredient(ingredients.data[0]._id);
    cy.addIngredient(ingredients.data[1]._id);
    cy.addIngredient(ingredients.data[2]._id);
    cy.addIngredient(ingredients.data[3]._id);
    cy.get(`@burgerConstructor`)
      .find(elements.constructorElementSelector)
      .eq(3)
      .contains(ingredients.data[3].name)
      .should('exist');
    cy.get(`[data-testid=move_buttons-${ingredients.data[2]._id}]`).within(
      () => {
        cy.get('button').last().click();
      }
    );
    cy.get(`@burgerConstructor`)
      .find(elements.constructorElementSelector)
      .eq(3)
      .contains(ingredients.data[2].name)
      .should('exist');
    cy.get(`[data-testid=move_buttons-${ingredients.data[2]._id}]`).within(
      () => {
        cy.get('button').first().click();
      }
    );
    cy.get(`@burgerConstructor`)
      .find(elements.constructorElementSelector)
      .eq(3)
      .contains(ingredients.data[3].name)
      .should('exist');
  });

  it('клик по модалке', () => {
    cy.get(`[data-testId=${ingredients.data[4]._id}]`)
      .get(`[src="${ingredients.data[4].image}"]`)
      .click();
  });
});

describe('проверяем модалки', () => {
  beforeEach(() => {
    cy.visit(testURL);
    cy.get(modalWindowTestId).should('not.exist');
    cy.get(`[data-testId=${ingredients.data[4]._id}]`)
      .get(`[src="${ingredients.data[4].image}"]`)
      .click();
    cy.get(modalWindowTestId).as('modalWindow');
  });

  it('наличие модалки', () => {
    cy.get(`@modalWindow`).should('exist');
  });

  it('наличие ингредиента в модалке', () => {
    cy.get(`@modalWindow`).contains(ingredients.data[4].name).should('exist');
  });

  it('клик по модалке', () => {
    cy.get(`@modalWindow`).click();
    cy.get(`@modalWindow`).should('exist');
  });

  it('клик по закрытию', () => {
    cy.get(`@modalWindow`).should('exist');
    cy.get(`[data-testId=${elements.modalCloseTag}`).click();
    cy.get(`@modalWindow`).should('not.exist');
  });

  it('клик по оверлею', () => {
    cy.get(`@modalWindow`).should('exist');
    cy.get(`[data-testId=${elements.modalOverlayTag}`).click({ force: true });
    cy.get(`@modalWindow`).should('not.exist');
  });
});

describe('проверяем создание заказа залогиненным', () => {
  beforeEach(() => {
    setCookie('accessToken', '123456');
    localStorage.setItem('refreshToken', '654321');
    cy.intercept('GET', 'api/auth/user', {
      statusCode: 200,
      ok: true,
      body: user.response
    });
    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      ok: true,
      body: orderBurger
    });
    cy.visit(testURL);
    cy.get(burgerConstructorTestId).as('burgerConstructor');
    cy.addIngredient(ingredients.data[0]._id);
    cy.addIngredient(ingredients.data[1]._id);
    cy.checkIsInConstructor(ingredients.data[0].name);
    cy.checkIsInConstructor(ingredients.data[1].name);
    cy.get(modalWindowTestId).should('not.exist');
    cy.contains('Оформить заказ').click();
  });

  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('открывает модалку', () => {
    cy.get(modalWindowTestId).should('exist');
  });

  it('выводит номер заказа', () => {
    cy.get(modalWindowTestId)
      .contains(String(orderBurger.order.number))
      .should('exist');
  });

  it('закрывает модалку', () => {
    cy.get(modalWindowTestId).should('exist');
    cy.get(`[data-testId=${elements.modalCloseTag}]`).click();
    cy.get(modalWindowTestId).should('not.exist');
  });

  it('сбрасывает конструктор бургера', () => {
    cy.get(`[data-testId=${elements.modalCloseTag}]`).click();
    cy.checkIsNotInConstructor(ingredients.data[0].name);
    cy.checkIsNotInConstructor(ingredients.data[1].name);
  });
});

describe('проверяем создание заказа незалогиненным', () => {
  beforeEach(() => {
    cy.intercept('POST', 'api/auth/login', {
      statusCode: 200,
      ok: true,
      body: user.response
    });
    cy.intercept('GET', 'api/auth/user', {
      statusCode: 200,
      ok: true,
      body: user.response
    });
    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      ok: true,
      body: orderBurger
    });
    cy.visit(testURL);
    cy.get(burgerConstructorTestId).as('burgerConstructor');
    cy.addIngredient(ingredients.data[0]._id);
    cy.addIngredient(ingredients.data[1]._id);
    cy.checkIsInConstructor(ingredients.data[0].name);
    cy.checkIsInConstructor(ingredients.data[1].name);
    cy.get(modalWindowTestId).should('not.exist');
    cy.contains('Оформить заказ').click();
  });

  it('перебрасывает на страницу логина', () => {
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testURL + pages.login);
    });
  });

  it('перебрасывает обратно после логина', () => {
    cy.contains('E-mail').type(user.login.email);
    cy.contains('Пароль').type(user.login.password);
    cy.contains('Войти').click();
    cy.location().should((loc) => {
      expect(loc.href).to.eq(testURL);
    });
  });

  it('успешно оформляется', () => {
    cy.contains('E-mail').type(user.login.email);
    cy.contains('Пароль').type(user.login.password);
    cy.contains('Войти').click();
    cy.contains('Оформить заказ').click();
    cy.get(modalWindowTestId)
      .contains(String(orderBurger.order.number))
      .should('exist');
  });
});
