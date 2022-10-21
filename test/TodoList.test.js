const TodoList = artifacts.require("./TodoList.sol");

contract("TodoList", (accounts) => {
  before(async () => {
    this.todoList = await TodoList.deployed();
  });

  it("deploy successfull", async () => {
    const address = await this.todoList.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, undefined);
    assert.notEqual(address, null);
  });

  it("init task", async () => {
    const taskCount = await this.todoList.taskCount();
    const task = await this.todoList.tasks(taskCount);

    assert.equal(task.id.toNumber(), taskCount.toNumber());
    assert.equal(task.content, "Tugas pertama");
    assert.equal(task.completed, false);
    assert.equal(taskCount, 1);
  });

  it("create new task", async () => {
    const result = await this.todoList.createTask("Tugas Kedua");
    const taskCount = await this.todoList.taskCount();

    assert.equal(taskCount, 2);
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), taskCount.toNumber());
    assert.equal(event.content, "Tugas Kedua");
    assert.equal(event.completed, false);
  });

  it("toggle task to complete", async () => {
    const result = await this.todoList.toggleCompleted(1);
    const task = await this.todoList.tasks(1);
    assert.equal(task.completed, true);

    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), 1);
    assert.equal(event.completed, true);
  });
});
