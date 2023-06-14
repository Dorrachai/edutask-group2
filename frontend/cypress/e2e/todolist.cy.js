import "./login.cy"; // Import the login functionality

// Define a constant for the maximum length text.
const MAX_LENGTH_TEXT = new Array(257).join("a");

// Test suite for creating to-do items
describe("R8UC1: Create To-Do Items", () => {
  // Log in before each test case
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.viewport(1920, 1080);
    cy.contains("div", "Email Address")
      .find("input[type=text]")
      .type("mon.doe@gmail.com");

    cy.get("form").submit();
    cy.get(".container-element a").last().click();
  });

  it("TC1.1: Enter a valid text in the input field and click on the Add button", () => {
    cy.get(".inline-form").within(() => {
      cy.get("input[type=text]").type("Task 1");
      cy.get("input[type=submit]").click();
    });

    cy.get("li.todo-item").last().contains("span", "Task 1");
  });

  it("TC1.2: Enter a minimum length (empty) text and click on the Add button", () => {
    cy.get(".inline-form").within(() => {
      cy.get("input[type=submit]").should("be.disabled");
    });
  });

  it("TC1.3: Enter a maximum length text and click on the Add button", () => {
    cy.get(".inline-form").within(() => {
      cy.get("input[type=text]").type(MAX_LENGTH_TEXT);
      cy.get("input[type=submit]").click();
    });

    cy.get("li.todo-item").last().contains("span", MAX_LENGTH_TEXT);
  });
});

// Test suite for toggling the completion status of a to-do item
describe("R8UC2: Toggle the completion status of a to-do item", () => {
  // Log in before each test case
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.viewport(1920, 1080);
    cy.contains("div", "Email Address")
      .find("input[type=text]")
      .type("mon.doe@gmail.com");

    cy.get("form").submit();
    cy.get(".container-element a").last().click();
  });

  it("TC2.1: Click on the checkbox of an incomplete to-do item", () => {
    cy.get("li.todo-item").last().within(() => {
      cy.get("span").first().click(); // Click on the first span (when it's unchecked)
    });
  });

  it("TC2.2: Click on the checkbox of a completed to-do item", () => {
    cy.get("li.todo-item").last().within(() => {
      cy.get("span").first().click(); // Click on the first span (when it's unchecked)
      cy.get("span").first().click(); // Click on the first span (when it's checked)
    });
  });

  it("TC2.3: Try to toggle the status of a to-do item that doesn't exist", () => {
    cy.get('li.todo-item').its('length').then(initialCount => {
      cy.get('li.todo-item').eq(initialCount).click({ force: true }).then(($el) => {
        expect($el).to.not.exist;
      });
      cy.get('li.todo-item').its('length').should('eq', initialCount);
    });
  });

});

// Test suite for deleting a to-do item
describe("R8UC3: Delete a to-do item", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.viewport(1920, 1080);
    cy.contains("div", "Email Address")
      .find("input[type=text]")
      .type("mon.doe@gmail.com");

    cy.get("form").submit();
    cy.get(".container-element a").last().click();
  });

  it("TC3.1: Click on the delete button of a to-do item", () => {
    cy.get("li.todo-item").last().within(() => {
      cy.get("span").last().click(); 
    });
  });

  it("TC3.2: Try to delete a to-do item that doesn't exist", () => {
    cy.get('li.todo-item').its('length').then(initialCount => {
      cy.get('li.todo-item').eq(initialCount).find('span').last().click({ force: true }).then(($el) => {
        expect($el).to.not.exist;
      });
      cy.get('li.todo-item').its('length').should('eq', initialCount);
    });
  });

});
