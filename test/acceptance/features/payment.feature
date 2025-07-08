@Payment
Feature: Payment Checkout
  Allows customers to execute payment instructions to buy products from Fiap Food.

  Scenario: 
    Given a payment was requested
    When customer executes the payment instruction
    Then the payment gets approved

  Scenario: 
    Given a payment was requested
    When the payment instruction is rejected
    Then the payment gets rejected