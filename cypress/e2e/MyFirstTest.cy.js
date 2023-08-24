/// <reference types="Cypress" />

describe("Checkers game", () => {


    /**
     * 1. Navigate to https://www.gamesforthebrain.com/game/checkers/
     * 2. Confirm that the site is up
     * 3. Make five legal moves as orange:
     *  a) Include taking a blue piece
     *  b) Use "Make a move" as confirmation that you can take the next step
     *  c) Restart the game after five moves
     *  d) Confirm that the restarting had been successful
     */
    
        it("Checkers game automation", () => {
    
            cy.visit("https://www.gamesforthebrain.com/game/checkers/");
    
            // Confirming site is up here
            cy.url().should("include", "/game/checkers/");
    
            // Since task requires to make 5 moves, I created an array of 5 legal moves so I can loop through them
            const moves = [
                { from: { x: 6, y: 2 }, to: { x: 5, y: 3 } },
                { from: { x: 2, y: 2 }, to: { x: 3, y: 3 } },
                { from: { x: 1, y: 1 }, to: { x: 2, y: 2 } },
                { from: { x: 2, y: 2 }, to: { x: 0, y: 4 } },
                { from: { x: 0, y: 2 }, to: { x: 2, y: 4 } },
            ];
    
            // Created counter here so it will dynamically count how many blue pieces were captured
            let capturedBluePiecesCount = 0;
    
            cy.get('img[src="me1.gif"]').then($bluePieces => {
    
                // Getting initial amount of bluepieces here so I can check if any captured later.
                const initialBluePiecesCount = $bluePieces.length;
    
                // And I'm passing those moves here. You see 2 clicks here
                // Because that how it works you click first, select the stone you will move, and select where you will move
                // So that's why I'm ysing "from" when I'm selecting the stone, and second one where I want to move
                moves.forEach(move => {
                    cy.get(`[name="space${move.from.x}${move.from.y}"]`).click();
                    cy.get(`[name="space${move.to.x}${move.to.y}"]`).click();
    
                    cy.wait(3000); // Give it time for the move to complete
    
                    cy.get('img[src="me1.gif"]').then($currentBluePieces => {
    
                        // In here, I'm getting the amount of current blue pieces
                        const currentBluePiecesCount = $currentBluePieces.length;
    
                        // inside the loop, if any iteration if currentBluePiecesCount length becomes less than the
                        // initial amount of blue pieces, it means we captured blue piece from the opponend
                        // And here, I'm using that counter I created and increasing it by 1
                        if (currentBluePiecesCount < initialBluePiecesCount) {
                            capturedBluePiecesCount++;
    
                            // In a normal move, stone can only move 1 square, but when it captures blue piece
                            // It means our stone moved more than 1 square.
                            // Validating here if it was a valid diagonal capture move with validating it inside expect()
                            let diffX = Math.abs(move.from.x - move.to.x);
                            let diffY = Math.abs(move.from.y - move.to.y);
    
                            expect(diffX === 2 && diffY === 2).to.be.true;
                        }
                    });
    
                    // Than after each move, I'm validating if we get e message "Make a move"
                    cy.get("#message").should("have.text", "Make a move.");
                });
    
                // After 5 iteration loop is done and we are resetting the board here
                cy.contains('Restart...').click();
    
                // Confirming here that the restarting had been successful by validating 2 things
                // 1. That the blue pieces count is the same as the initial count by adding the capturedBluePiecesCount to it so it must be 12
                cy.log(initialBluePiecesCount + ' AMOUNT OF BLUE PIECES HERE')
                cy.get('img[src="me1.gif"]').should("have.length", initialBluePiecesCount + capturedBluePiecesCount);
                // 2. That the message is "Select an orange piece to move."
                cy.get("#message").should("have.text", "Select an orange piece to move.");
            });
        });
    });