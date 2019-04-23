const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data);

const attrsToString = (obj = {}) =>
  Object.keys(obj)
    .map(attr => `${attr}="${obj[attr]}"`)
    .join(" ");

const tagAttrs = obj => (content = "") =>
  `<${obj.tag}${obj.attrs ? " " : ""}${attrsToString(obj.attrs)}>${content}</${
    obj.tag
  }>`;

const tag = t => (typeof t === "string" ? tagAttrs({ tag: t }) : tagAttrs(t));

const trashIcon = tag({ tag: "i", attrs: { class: "fas fa-trash-alt" } })("");

const tableRowTag = tag("tr");
const tableCell = tag("td");
const tableCells = items => items.map(tableCell).join("");

const tableRow = items =>
  compose(
    tableRowTag,
    tableCells
  )(items);

let description = document.getElementById("description");
let calories = document.getElementById("calories");
let carbs = document.getElementById("carbs");
let protein = document.getElementById("protein");

let list = [];

const validateInputs = () => {
  description.value ? "" : description.classList.add("is-invalid");
  calories.value ? "" : calories.classList.add("is-invalid");
  carbs.value ? "" : carbs.classList.add("is-invalid");
  protein.value ? "" : protein.classList.add("is-invalid");

  if (description.value && calories.value && carbs.value && protein.value) {
    add();
  }
};

const cleanInputs = () => {
  description.value = "";
  calories.value = "";
  carbs.value = "";
  protein.value = "";
};

const add = () => {
  const newItem = {
    description: description.value,
    calories: parseInt(calories.value),
    carbs: parseInt(carbs.value),
    protein: parseInt(protein.value)
  };
  list.push(newItem);
  cleanInputs();
  updateTotals();
  renderItems();
};

const updateTotals = () => {
  let calories = 0,
    carbs = 0,
    protein = 0;

  list.map(item => {
    (calories += item.calories),
      (carbs += item.carbs),
      (protein += item.protein);
  });

  document.getElementById("totalCalories").textContent = calories;
  document.getElementById("totalProtein").textContent = protein;
  document.getElementById("totalCarbs").textContent = carbs;
};

description.addEventListener("keydown", () =>
  description.classList.remove("is-invalid")
);
calories.addEventListener("keydown", () =>
  calories.classList.remove("is-invalid")
);
carbs.addEventListener("keydown", () => carbs.classList.remove("is-invalid"));
protein.addEventListener("keydown", () =>
  protein.classList.remove("is-invalid")
);

const removeItem = index => {
  list.splice(index, 1);

  updateTotals();
  renderItems();
};

const renderItems = () => {
  const $CONTAINER = document.getElementsByTagName("tbody")[0];
  $CONTAINER.innerHTML = "";
  const ROWS = list.map((item, index) => {
    const removeButton = tag({
      tag: "button",
      attrs: {
        class: "btn btn-outline-danger",
        onclick: `removeItem(${index})`
      }
    })(trashIcon);
    const { calories, description, carbs, protein } = item;
    return tableRow([description, calories, carbs, protein, removeButton]);
  });
  $CONTAINER.innerHTML = ROWS.join("");
};
