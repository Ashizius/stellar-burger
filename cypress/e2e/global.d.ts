namespace Cypress {
    interface Chainable {
        addIngredient(testId: string): Chainable<JQuery<HTMLElement>>;
        checkIsInConstructor(text: string): Chainable<void>;
        checkIsNotInConstructor(text: string): Chainable<void>;
    }
}
