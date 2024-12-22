// العناصر الرئيسية
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const currentDay = document.getElementById('current-day');
let tasks = {}; // لتخزين المهام لكل يوم
let currentDate = new Date(); // التاريخ الحالي

// تحديث التاريخ
function updateDate() {
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    const [day, month, dayNumber, year] = formattedDate.split(' ');
    currentDay.querySelector('h1').textContent = day; // اسم اليوم
    currentDay.querySelector('p').textContent = `${month} ${dayNumber}, ${year}`; // التاريخ
    loadTasks();
}

// تحميل المهام من Local Storage
function loadTasks() {
    taskList.innerHTML = ''; // تنظيف القائمة
    const key = currentDate.toDateString();
    if (tasks[key]) {
        tasks[key].forEach(task => addTaskToDOM(task.text, task.completed, false));
    }
}

// حفظ المهام في Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// إضافة مهمة جديدة
function addTask() {
    const text = taskInput.value.trim(); // إزالة المسافات
    if (text === '') return; // إذا كان الحقل فارغًا، لا يتم إضافة شيء

    const key = currentDate.toDateString();
    if (!tasks[key]) tasks[key] = []; // إذا لم تكن هناك مهام لهذا اليوم، أنشئ قائمة جديدة
    tasks[key].push({ text, completed: false }); // أضف المهمة الجديدة إلى القائمة

    addTaskToDOM(text, false, true); // أضف المهمة إلى واجهة المستخدم
    taskInput.value = ''; // امسح الحقل بعد الإضافة
}

// إضافة المهمة إلى DOM
function addTaskToDOM(text, completed, save = true) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${text}</span>
        <div class="task-options">
            <button onclick="toggleComplete(this)">✔</button>
            <button onclick="deleteTask(this)">🗑</button>
        </div>
    `;
    if (completed) listItem.classList.add('completed'); // إذا كانت المهمة مكتملة
    taskList.appendChild(listItem);

    if (save) saveTasks(); // حفظ المهام إذا لزم الأمر
}

// تبديل حالة المهمة (مكتملة/غير مكتملة)
function toggleComplete(button) {
    const listItem = button.closest('li');
    listItem.classList.toggle('completed');
    const key = currentDate.toDateString();
    const text = listItem.querySelector('span').textContent;
    const task = tasks[key].find(task => task.text === text);
    task.completed = !task.completed;
    saveTasks();
}

// حذف المهمة
function deleteTask(button) {
    const listItem = button.closest('li');
    const key = currentDate.toDateString();
    const text = listItem.querySelector('span').textContent;
    tasks[key] = tasks[key].filter(task => task.text !== text); // إزالة المهمة من القائمة
    listItem.remove(); // إزالة المهمة من DOM
    saveTasks();
}

// الانتقال بين الأيام
document.getElementById('prev-day').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 1); // الذهاب إلى اليوم السابق
    updateDate();
});

document.getElementById('next-day').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 1); // الذهاب إلى اليوم التالي
    updateDate();
});

// إضافة مستمع للنقر على زر "إضافة المهمة"
document.getElementById('add-task-btn').addEventListener('click', addTask);

// تحميل المهام عند بدء التشغيل
window.onload = () => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || {}; // تحميل المهام المحفوظة
    updateDate();
};
