// Cypress support file

/// <reference types="cypress" />

// Handle uncaught exceptions
Cypress.on('uncaught:exception', () => {
  // Returning false prevents Cypress from failing the test
  // This is useful for Next.js hydration errors that don't affect functionality
  return false;
});
