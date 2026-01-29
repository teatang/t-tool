/// <reference types="cypress" />

describe('Base64 Tool', () => {
  beforeEach(() => {
    cy.visit('/tools/base64');
    cy.wait(500);
  });

  it('should load successfully', () => {
    cy.get('h3').should('exist');
  });

  it('should have input and output areas', () => {
    cy.get('textarea').should('have.length', 2);
  });

  it('should encode text to Base64', () => {
    cy.get('textarea').eq(0).type('Hello');
    cy.get('.ant-space').find('button').first().click();
    cy.get('textarea').eq(1).should('have.value', 'SGVsbG8=');
  });

  it('should decode Base64 to text', () => {
    cy.get('.ant-segmented-item').eq(1).click();
    cy.get('textarea').eq(0).type('SGVsbG8=');
    cy.get('.ant-space').find('button').first().click();
    cy.get('textarea').eq(1).should('have.value', 'Hello');
  });

  it('should show error for invalid Base64 decode', () => {
    cy.get('.ant-segmented-item').eq(1).click();
    cy.get('textarea').eq(0).type('!!!invalid!!!');
    cy.get('.ant-space').find('button').first().click();
    cy.get('.ant-alert').should('exist');
  });
});
