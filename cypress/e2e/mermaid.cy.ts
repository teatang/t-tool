/// <reference types="cypress" />

describe('Mermaid Tool', () => {
  beforeEach(() => {
    cy.visit('/tools/mermaid');
    cy.wait(500);
  });

  it('should load successfully', () => {
    cy.get('h3').should('exist');
  });

  it('should have template selector', () => {
    cy.get('.ant-select').should('exist');
  });

  it('should load default template', () => {
    cy.get('textarea').invoke('val').should('contain', 'graph TD');
  });

  it('should render chart preview', () => {
    cy.wait(1500);
    cy.get('.mermaid-preview svg', { timeout: 5000 }).should('exist');
  });

  it('should switch templates', () => {
    cy.get('.ant-select-selector').click();
    cy.contains('.ant-select-item', 'Flowchart').click();
    cy.get('textarea').invoke('val').should('contain', 'flowchart TD');
  });

  it('should show error for invalid syntax', () => {
    cy.get('textarea').clear().type('invalid syntax');
    cy.wait(600);
    cy.get('.ant-alert').should('exist');
  });
});
