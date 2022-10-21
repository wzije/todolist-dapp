// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract TodoList {
    uint256 public taskCount = 0;

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;

    event taskCreated(uint256 id, string content, bool completed);
    event taskCompleted(uint256 id, bool completed);
    event taskDeleted(uint256 id);

    constructor() {
        createTask("Tugas pertama");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit taskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint256 _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit taskCompleted(_task.id, _task.completed);
    }

    function removeTask(uint256 _id) public {
        delete tasks[_id];
        taskCount--;
        emit taskDeleted(_id);
    }
}
