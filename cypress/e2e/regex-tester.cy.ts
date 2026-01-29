/// <reference types="cypress" />

describe('Regex Tester Tool', () => {
  beforeEach(() => {
    cy.visit('/tools/regex-tester');
    cy.wait(500);
  });

  it('should load successfully', () => {
    cy.get('h3').should('exist');
  });

  it('should have test/replace segmented control', () => {
    cy.get('.ant-segmented').should('exist');
  });

  it('should find matches for regex pattern', () => {
    cy.get('input[placeholder*="正则"]').clear().type('\\d+');
    cy.get('textarea').eq(0).clear().type('Hello 123 World 456');
    cy.get('.ant-table-row', { timeout: 5000 }).should('have.length.at.least', 1);
  });

  it('should switch to replace mode', () => {
    cy.get('.ant-segmented-item').eq(1).click();
    cy.get('input[placeholder*="替换"]').should('exist');
  });

  it('should perform replace operation', () => {
    cy.get('.ant-segmented-item').eq(1).click();
    cy.get('input[placeholder*="正则"]').clear().type('\\d+');
    cy.get('textarea').eq(0).clear().type('123 abc 456');
    cy.get('input[placeholder*="替换"]').clear().type('[$&]');
    cy.get('.ant-card').contains('结果').should('exist');
  });
});
