/// <reference types="cypress" />

describe('UUID Tool', () => {
  beforeEach(() => {
    cy.visit('/tools/uuid');
    cy.wait(500);
  });

  it('should load successfully', () => {
    cy.get('h3').should('exist');
  });

  it('should have version selector', () => {
    cy.get('.ant-select').should('exist');
  });

  it('should generate UUID', () => {
    cy.get('button').filter(':visible').contains('生成').click();
    cy.get('.ant-table-tbody', { timeout: 5000 }).should('exist');
    cy.get('.ant-table-tbody tr').should('have.length.at.least', 1);
  });

  it('should have valid UUID format', () => {
    cy.get('button').filter(':visible').contains('生成').click();
    cy.get('.font-mono').first().invoke('text').should('match', /[0-9a-f]{8}-[0-9a-f]{4}/);
  });

  it('should copy UUID', () => {
    cy.get('button').filter(':visible').contains('生成').click();
    cy.get('.ant-table-tbody').find('.anticon-copy').first().click();
  });
});
