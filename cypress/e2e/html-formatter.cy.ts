/// <reference types="cypress" />

describe('HTML Formatter Tool', () => {
  beforeEach(() => {
    cy.visit('/tools/html-formatter');
    cy.wait(500);
  });

  it('should load successfully', () => {
    cy.get('h3').should('exist');
  });

  it('should have input and output areas', () => {
    cy.get('textarea').should('have.length', 2);
  });

  it('should format HTML', () => {
    const compactHtml = '<html><body><div>test</div></body></html>';
    cy.get('textarea').eq(0).type(compactHtml);
    cy.get('button').filter(':visible').first().click();
    cy.get('textarea').eq(1).invoke('val').should('contain', '<div>');
  });
});
