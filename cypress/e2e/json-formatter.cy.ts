/// <reference types="cypress" />

describe('JSON Formatter Tool', () => {
  beforeEach(() => {
    cy.visit('/tools/json-formatter');
    cy.wait(500);
  });

  it('should load successfully', () => {
    cy.get('h3').should('exist');
  });

  it('should have input and output areas', () => {
    cy.get('textarea').should('have.length', 2);
  });

  it('should format compressed JSON', () => {
    const compactJson = '{"name":"test","value":123}';
    cy.get('textarea').eq(0).type(compactJson);
    cy.get('.ant-space').find('button').first().click();
    cy.get('textarea').eq(1).invoke('val').should('contain', '"name"');
  });

  it('should show error for invalid JSON', () => {
    cy.get('textarea').eq(0).type('{invalid json}');
    cy.get('.ant-space').find('button').first().click();
    cy.get('.ant-alert').should('exist');
  });
});
