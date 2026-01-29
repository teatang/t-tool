/// <reference types="cypress" />

describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(500);
  });

  it('should load successfully', () => {
    cy.get('h2').should('exist');
  });

  it('should display all 9 tool cards', () => {
    cy.get('.ant-card').should('have.length', 9);
  });

  it('should navigate to tools', () => {
    const tools = [
      '/tools/base64',
      '/tools/url-encoder',
      '/tools/json-formatter',
      '/tools/html-formatter',
      '/tools/sql-formatter',
      '/tools/regex-tester',
      '/tools/mermaid',
      '/tools/timestamp',
      '/tools/uuid',
    ];

    tools.forEach((tool) => {
      cy.get(`a[href="${tool}"]`).click();
      cy.url().should('include', tool);
      cy.go('back');
      cy.wait(200);
    });
  });
});
