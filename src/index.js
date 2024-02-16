let inputErrorBlock = false;
const btnDoneList = document.querySelectorAll(".btn__done");
const btnFilter = document.querySelectorAll(".btn__filter");
const tasksList = document.querySelectorAll(".tasks__item");
let currentFilter = "all";

// Filter switcher
function filterSwitcher(filterName) {
  const tasksList = document.querySelectorAll(".tasks__item");

  btnFilter.forEach((btn) => {
    if (btn.id != `filter-${filterName}`) {
      btn.classList.remove("btn__filter--active");
    } else {
      btn.classList.add("btn__filter--active");
    }
  });

  switch (filterName) {
    case "all":
      tasksList.forEach((task) => {
        task.classList.remove("hidden");
      });
      currentFilter = "all";
      return;

    case "active":
      tasksList.forEach((task) => {
        if (task.querySelector(".btn__done").classList.contains("btn__done--active")) {
          task.classList.add("hidden");
        } else {
          task.classList.remove("hidden");
        }
      });
      currentFilter = "active";
      return;

    case "finished":
      tasksList.forEach((task) => {
        if (!task.querySelector(".btn__done").classList.contains("btn__done--active")) {
          task.classList.add("hidden");
        } else {
          task.classList.remove("hidden");
        }
      });
      currentFilter = "finished";
      return;
  }
}

document.querySelector("#filter-all").addEventListener("click", (e) => {
  e.preventDefault();

  filterSwitcher("all");
});

document.querySelector("#filter-active").addEventListener("click", (e) => {
  e.preventDefault();

  filterSwitcher("active");
});

document.querySelector("#filter-finished").addEventListener("click", (e) => {
  e.preventDefault();

  filterSwitcher("finished");
});

// Form visibility listener
document.querySelector(".btn__add").addEventListener("click", (e) => {
  e.preventDefault();

  const form = document.querySelector(".form");

  form.classList.contains("hidden")
    ? form.classList.remove("hidden")
    : form.classList.add("hidden");
});

// Event listener for each btn__done (already existing on a page)
btnDoneList.forEach((btnDone) => {
  btnDone.addEventListener("click", (e) => {
    e.preventDefault();

    btnDone.classList.contains("btn__done--active")
      ? btnDone.classList.remove("btn__done--active")
      : btnDone.classList.add("btn__done--active");
  });
});

// Event listener for each task (already existing on a page)
tasksList.forEach((task) => {
  task.addEventListener("click", (e) => {
    e.preventDefault();

    // Turn off task visibility if it's state changes when filter is turned on
    if (
      e.target.classList.contains("btn__done") &&
      e.target.classList.contains("btn__done--active")
    ) {
      if (currentFilter === "active") {
        e.currentTarget.classList.add("hidden");
      }
    }

    if (
      e.target.classList.contains("btn__done") &&
      !e.target.classList.contains("btn__done--active")
    ) {
      if (currentFilter === "finished") {
        e.currentTarget.classList.add("hidden");
      }
    }

    // Delete task on btn__delete click
    if (e.target.classList.contains("btn__delete")) {
      document.querySelector(".tasks__inner").removeChild(e.currentTarget);
    }
  });
});

// Form submit listener
document.querySelector(".form__inner").addEventListener("submit", (e) => {
  e.preventDefault();

  const header = document.querySelector(".form__header");
  const text = document.querySelector(".form__text");
  const tasksList = document.querySelector(".tasks__inner");
  const allInputs = document.querySelectorAll("input[type=text]");
  const emptyInputs = [];

  // Looking for all empty inputs in the form
  allInputs.forEach((element) => {
    if (!element.value) emptyInputs.push(element);
  });

  // If no empty inputs found - adds new task on a page
  if (!emptyInputs.length) {
    const newTask = document.createElement("div");
    newTask.classList.add("tasks__item");
    newTask.innerHTML = `
    <div class="item__text">
        <h1>${header.value}</h1>
        <span>${text.value}</span>
    </div>
    <div class="item__buttons">
        <button class="btn btn__done"></button>
        <button class="btn btn__delete"></button>
    </div>
  `;

    // Event listener for btn__done click
    newTask.querySelector(".btn__done").addEventListener("click", (e) => {
      e.preventDefault();

      e.target.classList.contains("btn__done--active")
        ? e.target.classList.remove("btn__done--active")
        : e.target.classList.add("btn__done--active");
    });

    // Event listener for each task possible events (using bubbling)
    newTask.addEventListener("click", (e) => {
      e.preventDefault();

      // Turn off task visibility if it's state changes when filter is turned on
      if (
        e.target.classList.contains("btn__done") &&
        e.target.classList.contains("btn__done--active")
      ) {
        if (currentFilter === "active") {
          e.currentTarget.classList.add("hidden");
        }
      }

      if (
        e.target.classList.contains("btn__done") &&
        !e.target.classList.contains("btn__done--active")
      ) {
        if (currentFilter === "finished") {
          e.currentTarget.classList.add("hidden");
        }
      }

      if (e.target.classList.contains("btn__delete")) {
        document.querySelector(".tasks__inner").removeChild(e.currentTarget);
      }
    });

    // Turn off filters
    filterSwitcher("all");

    tasksList.appendChild(newTask);
    document.querySelector(".form__inner").reset();
  } else {
    // Each empty input is highlighted with pink color
    // inputErrorBlock prevents animation glitch from repeated button clicks
    if (!inputErrorBlock) {
      inputErrorBlock = true;
      emptyInputs.forEach((element) => {
        element.classList.add("form__inner--error");
      });

      // Removing error animation class from each empty input
      setTimeout(() => {
        emptyInputs.forEach((element) => {
          element.classList.remove("form__inner--error");
        });
        inputErrorBlock = false;
      }, 800);
    }
  }
});
