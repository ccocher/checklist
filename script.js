const factory = document.getElementById('factory');
const board = document.getElementById('board');
const removeButton = document.getElementById('remove');
let checkedItems = 0;

loadLocalData();

factory.addEventListener('submit', event => {
  const content = factory.elements.content.value.trim();
  if (content.length > 0) {
    addItem(content);
    factory.elements.content.value = '';
    backupToLocal();
  }
  event.preventDefault();
});

removeButton.addEventListener('click', () => {
  const checkedBoxes = Array.from(board.querySelectorAll('input:checked'));
  for (const checkbox of checkedBoxes) {
    checkbox.parentNode.remove();
  }

  checkedItems = 0;
  removeButton.style.visibility = 'hidden';

  if (board.children.length === 0) {
    clearLocalData();
  } else {
    backupToLocal();
  }
});

function loadLocalData() {
  if (localStorage.length > 0) {
    const itemList = Array.from(JSON.parse(localStorage.getItem('itemList')));
    for (const item of itemList) {
      const { content, checked } = item;
      addItem(content, checked);
    }
    checkedItems = Number(localStorage.getItem('checkedItems'));
  }

  if (checkedItems === 0) {
    removeButton.style.visibility = 'hidden';
  }
}

function backupToLocal() {
  const itemList = Array.from(board.children).map(p => ({
    content: p.textContent,
    checked: p.firstChild.checked
  }));

  localStorage.setItem('itemList', JSON.stringify(itemList));
  localStorage.setItem('checkedItems', checkedItems);
}

function clearLocalData() {
  localStorage.clear();
}

function addItem(content, checked = false) {
  const item = document.createElement('p');
  item.className = checked ? 'checked' : '';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = checked;

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      checkedItems++;
      checkbox.parentNode.className = 'checked';
    } else {
      checkedItems--;
      checkbox.parentNode.className = '';
    }
    removeButton.style.visibility = checkedItems === 0 ? 'hidden' : '';
    backupToLocal();
  });

  item.appendChild(checkbox);
  item.appendChild(document.createTextNode(content));
  board.appendChild(item);
}