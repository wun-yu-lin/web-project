let add = document.querySelector("form button");
let section = document.querySelector("body section");

add.addEventListener("click", (e) => {
  //prevent form from being submitted
  e.preventDefault();
  //get the input value
  let form = e.target.parentElement;
  let textTodo = form.children[0].value;
  let textMonth = form.children[1].value;
  let textDay = form.children[2].value;

  //if input is nan do nothing, 直接return
  if (
    form.children[0].value === "" ||
    form.children[1].value === "" ||
    form.children[2].value === ""
  ) {
    return;
  }

  //create todo item
  let todo = document.createElement("div");
  todo.classList.add("todo");

  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = textTodo;

  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = textMonth + " / " + textDay;

  todo.appendChild(text);
  todo.appendChild(time);

  //creat check and trash
  let finishButton = document.createElement("button");
  finishButton.classList.add("finish");
  finishButton.innerHTML = '<i class="fa-regular fa-square-check"></i>';
  finishButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    //todoItem.classList.add("done"); //新增done class
    todoItem.classList.toggle("done"); //新增or刪除 done class 好用
    console.log(e.target.parentElement);
  });

  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  trashButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend", () => {
      //偵測到animation動畫時，啟動todoItem.remove() methods，可等待動畫結束後再移除todoItem
      todoItem.remove();
    });
    todoItem.style.animation = "scaleDown 0.3s forwards";
    //todoItem.remove(); 無法等動畫結束再執行
  });

  todo.appendChild(finishButton);
  todo.appendChild(trashButton);
  todo.style.animation = "scaleUp 0.3s forwards";
  form.children[0].value = "";
  section.appendChild(todo);
});
