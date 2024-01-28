const dayDropdown = document.getElementById("day");
for (let i = 1; i <= 31; i++) {
  let option = document.createElement("option");
  option.value = i;
  option.text = i;
  dayDropdown.add(option);
}

// const textarea = document.getElementById('topic');

// textarea.addEventListener('input', function () {
//   textarea.style.height = 'auto';
//   textarea.style.height = (textarea.scrollHeight) + 'px';
// });

const form = document.forms.topicForm;
const dayIn = form.elements.day;
const timeIn = form.elements.time;
const colorIn = form.elements.color;
const topicIn = form.elements.topic;
const tBody = document.querySelector('#topic-table tbody');

function getStoredData() {
  const storedData = localStorage.getItem('topics');
  return storedData ? JSON.parse(storedData) : [];
}

function updateLocalStorage(data) {
  localStorage.setItem('topics', JSON.stringify(data));
}

document.addEventListener('DOMContentLoaded', function() {
  const storedData = getStoredData();
  for (const item of storedData) {
    addRowToTable(item);
  }
});

function addRowToTable(item) {
  const newRow = document.createElement('tr');
  newRow.className = `topic-line ${item.color} ${item.selected ? 'selected' : ''}`;
  newRow.innerHTML = `
    <td><input class="option-input checkbox" type="checkbox" onchange="handleCheckboxChange(this)" ${item.selected ? 'checked' : ''}></td>
    <td><p>${item.day}</p></td>
    <td><p>${item.time}</p></td>
    <td><p>${item.topic}</p></td>
    <td><button class="btn-del" onclick="deleteRow(this)">Delete</button></td>
  `;

  if (item.selected) {
    tBody.appendChild(newRow);
  } else {
    tBody.insertBefore(newRow, tBody.firstChild);
  }
}


form.onsubmit = function(e) {
  e.preventDefault();

  const item = {
    day: dayIn.value,
    time: timeIn.value,
    color: colorIn.value,
    topic: topicIn.value,
    selected: false
  }

  addRowToTable(item);

  const storedData = getStoredData();
  storedData.push(item);
  updateLocalStorage(storedData);

  dayIn.value = '';
  timeIn.value = '';
  colorIn.value = '';
  topicIn.value = '';
}

function handleCheckboxChange(checkbox) {
  const row = checkbox.closest('tr');
  const dayValue = row.querySelector('td:nth-child(2) p').innerText;
  const storedData = getStoredData();

  const updatedData = storedData.map(item => {
    if (item.day === dayValue) {
      if (checkbox.checked) {
        item.selected = true;
        row.classList.add('selected');
      } else {
        item.selected = false;
        row.classList.remove('selected');
      }
    }
    return item;
  });

  updateLocalStorage(updatedData);

  if (checkbox.checked) {
    tBody.appendChild(row);
  }
}


function deleteRow(button) {
  const row = button.closest('tr');
  const dayValue = row.querySelector('td:nth-child(2) p').innerText;
  const storedData = getStoredData();

  const updatedData = storedData.filter(item => item.day !== dayValue);
  updateLocalStorage(updatedData);
  row.remove();
}
