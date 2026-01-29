/// <reference types="cypress" />

describe('Timestamp Tool', () => {
  beforeEach(() => {
    cy.visit('/tools/timestamp');
    cy.wait(500);
  });

  it('should load successfully', () => {
    cy.get('h3').should('exist');
  });

  it('should have Unix timestamp input field', () => {
    cy.get('input[placeholder*="时间戳"]').should('exist');
  });

  it('should have date string input field', () => {
    cy.get('input[placeholder*="日期"]').should('exist');
  });

  it('should convert Unix timestamp to date', () => {
    cy.get('input[placeholder*="时间戳"]').clear().type('1609459200000');
    cy.get('.ant-card').contains('结果').should('exist');
  });

  it('should show current time when clicked', () => {
    cy.get('.ant-btn').contains('获取当前时间戳').click();
    cy.get('input[placeholder*="时间戳"]').invoke('val').should('not.be.empty');
  });
});
