// Import Cypress API
/// <reference types="cypress" />

describe('Deck of Cards API Exercise', () => {
  let deckId;

  it('Navigate to Deck of Cards API', () => {
    // Step 1: Navigate to the website
    cy.visit('https://deckofcardsapi.com/');

    // Step 2: Confirm the site is up
    cy.url().should('include', 'deckofcardsapi.com');
  });

  it('Get a new deck and shuffle it', () => {
    // Step 3: Get a new deck
    cy.request('GET', 'https://deckofcardsapi.com/api/deck/new/').then((response) => {
      expect(response.status).to.eq(200);
      deckId = response.body.deck_id;

      // Step 4: Shuffle the deck
      cy.request('GET', `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.shuffled).to.be.true;
      });
    });
  });

  it('Deal cards and check for Blackjack', () => {
    // Step 5: Deal three cards to each of two players
    cy.request('GET', `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=6`).then((response) => {
      expect(response.status).to.eq(200);

      const cards = response.body.cards;
      const player1Cards = cards.slice(0, 3);
      const player2Cards = cards.slice(3, 6);

      // Step 6: Check whether either has blackjack
      const checkBlackjack = (playerCards) => {
        let totalValue = 0;
        playerCards.forEach((card) => {
          if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
            totalValue += 10;
          } else if (card.value === 'ACE') {
            totalValue += 11;
          } else {
            totalValue += parseInt(card.value);
          }
        });
        return totalValue === 21;
      };

      const player1HasBlackjack = checkBlackjack(player1Cards);
      const player2HasBlackjack = checkBlackjack(player2Cards);

      // Step 7: If either has, write out which one does
      if (player1HasBlackjack && player2HasBlackjack) {
        cy.log('Both Player 1 and Player 2 have Blackjack!');
      } else if (player1HasBlackjack) {
        cy.log('Player 1 has Blackjack!');
      } else if (player2HasBlackjack) {
        cy.log('Player 2 has Blackjack!');
      } else {
        cy.log('Neither player has Blackjack.');
      }
    });
  });
});