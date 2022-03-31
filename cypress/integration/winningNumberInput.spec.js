import {
  LOTTO_MAX_NUMBER,
  LOTTO_PRICE,
  WINNING_NUMBER_CHECK_MESSAGE,
} from "../../src/js/utils/constants";

describe("당첨 번호 입력 검사", () => {
  const MIN = 1;
  const MAX = 100;
  const validPurchaseAmount =
    (Math.floor(Math.random() * (MAX - MIN)) + MIN) * LOTTO_PRICE;
  const inValidPurchaseAmount = Math.floor(Math.random() * 1000);
  const inputPurchaseAmount = (bool) => {
    if (bool) {
      cy.get("[data-purchase-form='input']")
        .type(validPurchaseAmount)
        .type("{enter}");
    } else {
      cy.get("[data-purchase-form='input']")
        .type(inValidPurchaseAmount)
        .type("{enter}");
    }
  };
  Cypress.Commands.add("submitValue", (bool) => inputPurchaseAmount(bool));
  beforeEach(() => {
    cy.visit("/");
    cy.submitValue(true);
  });

  it("로또를 구매하면 당첨번호를 입력할 수 있는 창이 나타난다.", () => {
    cy.get("[data-winning-number='form']").should("be.visible");
  });

  it("당첨번호를 입혁할 수 있는 창이 나타날 경우, 결과 확인 버튼이 비활성화 되어 있다.", () => {
    cy.get('[data-button="modal-open-button"]').should("be.disabled");
  });

  it("당첨번호를 2자리 이상 입력할 경우 마지막 input을 제외하고 다음 input으로 이동한다.", () => {
    const inValidWinningNumberList = [12, 22, 23, 25, 26];
    cy.get('[data-input="winning-number-input"]')
      .then(($inputList) => {
        return $inputList.slice(0, 4);
      })
      .each(($el, index) => {
        cy.wrap($el).type(inValidWinningNumberList[index]);
        cy.wrap($el).next().should("have.focus");
      });
  });

  it("6개의 당첨번호와 1개의 보너스 번호가 모두 정상 입력되어야 결과 확인 버튼이 활성화된다.", () => {
    const winningNumberList = [1, 2, 3, 4, 5, 6];
    const inValidBonusNumber = 7;
    const { LESS_THEN_LENGTH } = WINNING_NUMBER_CHECK_MESSAGE;

    cy.get('[data-input="winning-number-input"]').each(($el, index) => {
      cy.wrap($el).type(winningNumberList[index]);
      cy.get('[data-button="modal-open-button"]').should("be.disabled");
      cy.get('[data-winning-number="check-message"]').should(
        "have.text",
        LESS_THEN_LENGTH
      );
      cy.get('[data-winning-number="check-message"]').should(
        "have.class",
        "text-red"
      );
    });
    cy.get('[data-winning-number="bonus-number"]').type(inValidBonusNumber);
    cy.get('[data-button="modal-open-button"]').should("not.be.disabled");
  });
  

});

function shuffle(array) {
  for (let index = array.length - 1; index > 0; index--) {
    const randomPosition = Math.floor(Math.random() * (index + 1));
    const temporary = array[index];
    array[index] = array[randomPosition];
    array[randomPosition] = temporary;
  }
  return array;
}
