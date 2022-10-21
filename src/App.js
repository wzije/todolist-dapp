import React from "react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import TodoList from "Contracts/TodoList.json";

const App = () => {
  const [greet, setGreet] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [task, setTask] = useState("");
  const [account, setAccount] = useState(0x0);
  const [balance, setBalance] = useState(0);

  //connect to metamask
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contractAddress = "0x1c10Ac80c63112b8A253d963A7486035d9F263b0";
  const signer = provider.getSigner();
  // console.info(signer, "signer");
  const contract = new ethers.Contract(contractAddress, TodoList.abi, signer);

  const connectWallet = async () => {
    const accounts = await provider.send("eth_requestAccounts");
    setAccount(accounts[0]);

    const balance = await provider.getBalance(accounts[0]);
    const balanceFormated = ethers.utils.formatEther(balance);
    setBalance(balanceFormated);
  };

  const loadTaskList = async () => {
    const tasks = [];
    const taskCount = await contract.taskCount();

    for (let i = 1; i <= parseInt(taskCount); i++) {
      const task = await contract.tasks(i);
      tasks.push({
        id: parseInt(task.id),
        content: task.content,
        completed: task.completed,
      });
    }

    setTaskList(tasks);
  };

  useEffect(() => {
    setGreet("DApp TodoList");
    connectWallet().catch(console.error);
    loadTaskList().catch(console.error);
  }, []);

  const _handleCreateTask = async (e) => {
    if (e.key === "Enter") {
      try {
        const result = await contract.createTask(e.target.value);
        //penggunaan wait akan memastikan task dibuat baru melanjutkan eksekusi kode
        await result.wait();

        //digunakan untuk eksekusi event
        contract.on("taskCreated", (id, content, completed) => {
          console.log(id, content, completed);
          const newTask = {
            id: parseInt(id),
            content: content,
            completed: completed,
          };

          setTaskList([...taskList, newTask]);
          setTask("");
        });
      } catch (ex) {
        console.log(ex);
      }
    }
  };

  const _handleToggleCompleted = async (e) => {
    try {
      let id = e.target.value;
      const result = await contract.toggleCompleted(id);
      await result.wait();

      contract.on("taskCompleted", (id, completed) => {
        const newTaskList = taskList.map((task) => {
          if (task.id == id) task.completed = completed;
          return task;
        });

        setTaskList(newTaskList);
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  const _handleRemoveTask = (e) => {
    let id = e.target.value;
    const newTaskList = taskList.filter((task) => task.id != id);
    setTaskList(newTaskList);
  };

  return (
    <div className="container mt-5">
      <h2>{greet}</h2>
      <p>Address: {contractAddress}</p>
      <p>Account: {account}</p>
      <p>Balance: {balance} ETH</p>

      <div className="row">
        <div className="col-md-12">
          <div className="card card-white">
            <div className="card-body">
              <form action="#">
                <input
                  type="text"
                  className="form-control add-task"
                  placeholder="New Task..."
                  value={task}
                  onChange={(event) => setTask(event.target.value)}
                  onKeyDown={_handleCreateTask}
                />
              </form>
              <div className="todo-list">
                {taskList.map((task) => (
                  <div id={task.id} key={task.id} className="todo-item">
                    <div className="checker">
                      <span className="">
                        <input
                          type="checkbox"
                          value={task.id}
                          defaultChecked={task.completed}
                          onChange={_handleToggleCompleted}
                        />
                      </span>
                    </div>
                    <span>{task.content}</span>
                    <button
                      onClick={_handleRemoveTask}
                      value={task.id}
                      className="btn btn-link text-danger btn-sm float-end"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
