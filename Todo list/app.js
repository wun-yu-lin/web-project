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
  let status = "";

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

    //store status data into localstorge

    let mydataArray = JSON.parse(localStorage.getItem("List"));
    mydataArray.forEach((item, index) => {
      let myRemoveText = todoItem.children[0].innerText;
      let myRemoveTime = todoItem.children[1].innerText;
      let time = item.textMonth + " / " + item.textDay;
      if (item.textTodo == myRemoveText && myRemoveTime == time) {
        if (todoItem.classList.contains("done")) {
          item.status = "done";
        } else {
          item.status = "";
        }
      }
    });
    localStorage.setItem("List", JSON.stringify(mydataArray));
  });

  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  trashButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend", () => {
      //remove item from localStorage
      let myRemoveText = todoItem.children[0].innerText;
      let mydataArray = JSON.parse(localStorage.getItem("List"));
      mydataArray.forEach((item, index) => {
        if (item.textTodo == myRemoveText) {
          mydataArray.splice(index, 1);
          localStorage.setItem("List", JSON.stringify(mydataArray));
        }
      });

      //偵測到animation動畫時，啟動todoItem.remove() methods，可等待動畫結束後再移除todoItem
      todoItem.remove();
    });
    todoItem.style.animation = "scaleDown 0.3s forwards";
    //todoItem.remove(); 無法等動畫結束再執行
  });

  todo.appendChild(finishButton);
  todo.appendChild(trashButton);
  todo.style.animation = "scaleUp 0.3s forwards";

  //creat object
  let myTodo = {
    textTodo: textTodo,
    textMonth: textMonth,
    textDay: textDay,
    status: status,
  };

  //store data into array of objects
  let myList = localStorage.getItem("List");

  if (myList == null) {
    localStorage.setItem("List", JSON.stringify([myTodo]));
  } else {
    let myTodoArray = JSON.parse(myList);
    myTodoArray.push(myTodo);
    localStorage.setItem("List", JSON.stringify(myTodoArray));
  }
  form.children[0].value = "";
  section.appendChild(todo);
});

//load data
loadData();
//merge sort
function mergeTime(arr1, arr2) {
  let results = [];
  let i = 0;
  let j = 0;
  while ((i < arr1.length) & (j < arr2.length)) {
    if (Number(arr1[i].textMonth) > Number(arr2[j].textMonth)) {
      results.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].textMonth) < Number(arr2[j].textMonth)) {
      results.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].textMonth) == Number(arr2[j].textMonth)) {
      if (Number(arr1[i].textDay) > Number(arr2[j].textDay)) {
        results.push(arr2[j]);
        j++;
      } else {
        results.push(arr1[i]);
        i++;
      }
    }
  }
  //將沒有比較到的element 放入 results 內
  while (i < arr1.length) {
    results.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    results.push(arr2[j]);
    j++;
  }
  return results;
}
//function of merge sort
function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

//validation
console.log(mergeSort(JSON.parse(localStorage.getItem("List"))));

//sort buton
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  //sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("List")));
  localStorage.setItem("List", JSON.stringify(sortedArray));

  //remove html element of todolist data
  let todoDataLen = document.querySelectorAll("section div.todo");
  todoDataLen.forEach(() => {
    section.children[0].remove();
  });

  //loadData
  loadData();
});

function loadData() {
  let mydataString = localStorage.getItem("List");
  if (mydataString !== null) {
    let mydataArray = JSON.parse(mydataString);
    mydataArray.forEach((e) => {
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = e.textTodo;
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerHTML = e.textMonth + " / " + e.textDay;
      todo.appendChild(text);
      todo.appendChild(time);
      //set status as class
      if (e.status == "done") {
        todo.classList.add("done");
      }

      //creat check and trash
      let finishButton = document.createElement("button");
      finishButton.classList.add("finish");
      finishButton.innerHTML = '<i class="fa-regular fa-square-check"></i>';

      finishButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        //todoItem.classList.add("done"); //新增done class
        todoItem.classList.toggle("done"); //新增or刪除 done class 好用

        //store status data into localstorge

        let mydataArray = JSON.parse(localStorage.getItem("List"));
        mydataArray.forEach((item, index) => {
          let myRemoveText = todoItem.children[0].innerText;
          let myRemoveTime = todoItem.children[1].innerText;
          let time = item.textMonth + " / " + item.textDay;
          if (item.textTodo == myRemoveText && myRemoveTime == time) {
            if (todoItem.classList.contains("done")) {
              item.status = "done";
            } else {
              item.status = "";
            }
          }
        });
        localStorage.setItem("List", JSON.stringify(mydataArray));
      });

      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", () => {
          //remove item from localStorage
          let myRemoveText = todoItem.children[0].innerText;
          let mydataArray = JSON.parse(localStorage.getItem("List"));
          mydataArray.forEach((item, index) => {
            if (item.textTodo == myRemoveText) {
              mydataArray.splice(index, 1);
              localStorage.setItem("List", JSON.stringify(mydataArray));
            }
          });

          //偵測到animation動畫時，啟動todoItem.remove() methods，可等待動畫結束後再移除todoItem
          todoItem.remove();
        });
        todoItem.style.animation = "scaleDown 0.3s forwards";
        //todoItem.remove(); 無法等動畫結束再執行
      });
      todo.appendChild(finishButton);
      todo.appendChild(trashButton);
      todo.style.animation = "scaleUp 0.3s forwards";
      section.appendChild(todo);
    });
  }
}
