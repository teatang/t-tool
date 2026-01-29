/// <reference types="cypress" />

describe('SQL Formatter Tool', () => {
  beforeEach(() => {
    cy.visit('/tools/sql-formatter');
    cy.wait(500);
  });

  it('should load successfully', () => {
    cy.get('h3').should('exist');
  });

  it('should have input and output areas', () => {
    cy.get('textarea').should('have.length', 2);
  });

  it('should format SQL', () => {
    const compactSql = 'SELECT id,name FROM users WHERE id=1';
    cy.get('textarea').eq(0).type(compactSql);
    cy.get('button').filter(':visible').first().click();
    cy.get('textarea').eq(1).invoke('val').should('contain', 'SELECT');
  });
});
