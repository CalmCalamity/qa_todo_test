import {
  Builder,
  By,
  Capabilities,
  until,
  WebDriver,
} from "selenium-webdriver";

const chromedriver = require("chromedriver");

const driver: WebDriver = new Builder()
  .withCapabilities(Capabilities.chrome())
  .build();

class TodoPage {
  url: string = "https://devmountain.github.io/qa_todos/";

  todoInput: By = By.className("new-todo");
  todos: By = By.css("li.todo");
  todoLabel: By = By.css("label");
  todoComplete: By = By.css("input.toggle");
  clearCompletedButton: By = By.css("button.clear-completed");

  todoStarUnselected: By = By.className("star");
  todoStarSelected: By = By.className("starred");
  todoCount: By = By.className("todo-count");
}

const page = new TodoPage;

describe("the todo app", () => {

  // goes to url befefore tests
  beforeEach(async () => {
    await driver.get(page.url);
  });
  // clean up
  afterAll(async () => {
    await driver.quit();
  });

  // test to add a todo
  it("can add a todo", async () => {

    await driver.wait(until.elementLocated(page.todoInput));
    await driver.findElement(page.todoInput).sendKeys("Test Added\n");

    let myTodos = await driver.findElements(page.todos);

    // let myTodo = myTodos.filter(async (todo) => {
    //   (await (await todo.findElement(page.todoLabel)).getText()) == "Test Added";
    // });

    // expect(myTodo.length).toEqual(1);
  });

  // test to remove a todo
  it("can remove a todo", async () => {
  let myTodos = await driver.findElements(page.todos);

  await myTodos.filter(async (todo) => {
    (await (await todo.findElement(page.todoLabel)).getText()) == "Test Added";
  })[0].findElement(page.todoComplete).click();

  await (await driver.findElement(page.clearCompletedButton)).click();
  myTodos = await driver.findElements(page.todos);
  let myTodo = myTodos.filter(async (todo) => {
    (await (await todo.findElement(page.todoLabel)).getText()) == "Test Added";
  });

  expect(myTodo.length).toEqual(0);
  });

  // test to star a todo
  it("can mark a todo with a star", async () => {
    await driver.wait(until.elementLocated(page.todoInput));
    let startStarCount = (await driver.findElements(page.todoStarSelected)).length;

    await driver.findElement(page.todoInput).sendKeys("Star Test\n");
    await (await driver.findElements(page.todos))
      .filter(async (todo) => {
        (await (await todo.findElement(page.todoLabel)).getText()) ==
          "Star Test";
      })[0]
      .findElement(page.todoStarUnselected)
      .click();
    let endingStars = (await driver.findElements(page.todoStarSelected)).length;
    expect(endingStars).toBeGreaterThan(startStarCount);
  });

  // test to list new todos
  it("has the right number of todos listed", async () => {
    await driver.wait(until.elementLocated(page.todoInput));

    let startCount = (await driver.findElements(page.todos)).length;

    await driver.findElement(page.todoInput).sendKeys("Clean House\n");
    await driver.findElement(page.todoInput).sendKeys("Buy Groceries\n");
    await driver.findElement(page.todoInput).sendKeys("Pay Bills\n");

    let endCount = (await driver.findElements(page.todos)).length;
    expect(endCount - startCount).toBe(3);
  });
});
