/// <reference types="cypress" />

describe('URL Encoder Tool', () => {
  beforeEach(() => {
    cy.visit('/tools/url-encoder');
    cy.wait(500);
  });

  it('should load successfully', () => {
    cy.get('h3').should('exist');
  });

  it('should have encode/decode segmented control', () => {
    cy.get('.ant-segmented').should('exist');
  });

  it('should encode URL', () => {
    cy.get('textarea').eq(0).type('Hello World');
    cy.get('.ant-space').find('button').first().click();
    cy.get('textarea').eq(1).should('have.value', 'Hello%20World');
  });

  it('should decode URL', () => {
    cy.get('.ant-segmented-item').eq(1).click();
    cy.get('textarea').eq(0).type('Hello%20World');
    cy.get('.ant-space').find('button').first().click();
    cy.get('textarea').eq(1).should('have.value', 'Hello World');
  });
});
