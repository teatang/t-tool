/// <reference types="cypress" />

describe('Tetris Game', () => {
  beforeEach(() => {
    cy.visit('/tools/games/tetris');
    cy.wait(500);
  });

  it('should load successfully', () => {
    cy.get('h1').should('exist');
  });

  it('should have game board', () => {
    cy.get('canvas').should('exist');
  });

  it('should have start button', () => {
    cy.get('.ant-btn').contains('开始').should('exist');
  });

  it('should start game when clicked', () => {
    cy.get('.ant-btn').contains('开始').click();
    cy.get('.ant-btn').contains('暂停').should('exist');
  });

  it('should have score display', () => {
    cy.contains('span', '分数').should('exist');
  });

  it('should have next piece preview', () => {
    cy.contains('span', '下一个').should('exist');
  });

  it('should have game controls info', () => {
    cy.contains('span', '游戏操作').should('exist');
  });
});
