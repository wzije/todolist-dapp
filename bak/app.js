const App = {
  contractAddress: "0x08F579D6AFAbCE5A878A40d2B9AB8Fc2A03Fd282",
  loading: false,
  contracts: {},
  load: async () => {
    await App.loadWeb3();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    if (typeof window.ethereum != "undefined") {
      App.provider = new ethers.providers.Web3Provider(window.ethereum);
      App.signer = App.provider.getSigner();
      App.address = await App.signer.getAddress();
      const accounts = await App.provider.send("eth_requestAccounts");
      App.account = accounts[0];
    }

    if (window.ethereum) {
      console.log("metamask connected");
      try {
        console.log("metamask ready to exec");
      } catch (e) {
        console.log("error connecting");
      }
    } else {
      alert("You have to install MetaMask !");
    }

    return false;
  },
  loadContract: async () => {
    const todolist = await $.getJSON("TodoList.json");
    App.todoList = new ethers.Contract(
      App.contractAddress,
      todolist.abi,
      App.provider
    );
  },
  getBalance: async () => {
    const balance = await App.provider.getBalance(App.address);
    return ethers.utils.formatEther(balance);
  },
  render: async () => {
    $("#account").html(App.account);
    App.renderTasks();
  },
  renderTasks: async () => {
    let tasks = [];
    const taskCount = await App.todoList.taskCount();

    for (var i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i);
      tasks.push(task);
    }

    console.info(tasks);
  },
};

$(() => {
  $(window).on("load", () => {
    App.load();
  });
});
