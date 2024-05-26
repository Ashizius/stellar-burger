import ingredients from '../fixtures/ingredients.json';
import user from '../fixtures/user.json';
import orderBurger from '../fixtures/orderBurger.json';
import feeds from '../fixtures/feeds.json'
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
});



describe('проверяем регистрацию', () => {
  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });  
    it('регистрация и проверка имени на главной',()=>{
        cy.visit('http://localhost:4000/register');        
        cy.get(`input[name=name]`).type(user.login.name);
        cy.get(`input[name=email]`).type(user.login.email);
        cy.get(`input[name=password]`).type(user.login.password);
        cy.contains('Зарегистрироваться').click();
        cy.location().should((loc) => {
            expect(loc.href).to.eq('http://localhost:4000/');
          });        
        cy.contains(user.user.name).should('exist');
      });
      it('переходит на логин',()=>{
        cy.visit('http://localhost:4000/register');        
        cy.contains('Войти').click();
        cy.location().should((loc) => {
            expect(loc.href).to.eq('http://localhost:4000/login');
          });        
      });       
      it('регистрация со страницы профиля',()=>{
        cy.visit('http://localhost:4000/profile');        
        cy.contains('Зарегистрироваться').click();
        cy.get(`input[name=name]`).type(user.login.name);
        cy.get(`input[name=email]`).type(user.login.email);
        cy.get(`input[name=password]`).type(user.login.password);
        cy.contains('Зарегистрироваться').click();
        cy.location().should((loc) => {
            expect(loc.href).to.eq('http://localhost:4000/profile');
          });        
      });      
  });
