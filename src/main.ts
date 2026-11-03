const namaAplikasi = import.meta.env.VITE_APP_NAME;
const versiAplikasi = import.meta.env.VITE_APP_VERSION;

document.title = `${namaAplikasi} - v${versiAplikasi}`;

const judulAplikasi = document.querySelector("header h1");

if (judulAplikasi) {
    judulAplikasi.textContent = namaAplikasi;
}
interface Task {
    id: number;
    title: string;
    deadline: string;
    completed: boolean;
}

type TaskStatus = "Belum Selesai" | "Selesai";

// Contoh tipe data dasar TypeScript
const namaMahasiswa: string = "Suci Ramadhani";
const semester: number = 5;
const aplikasiAktif: boolean = true;

// Contoh generic
function getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error(`Elemen ${id} tidak ditemukan`);
    }

    return element as T;
}

const form = getElement<HTMLFormElement>("taskForm");
const taskInput = getElement<HTMLInputElement>("taskInput");
const deadlineInput = getElement<HTMLInputElement>("deadlineInput");
const taskList = getElement<HTMLDivElement>("taskList");

// Contoh array dengan tipe Task
let tasks: Task[] = loadTasks();

// Mengambil data dari localStorage
function loadTasks(): Task[] {
    try {
        const savedTasks = localStorage.getItem("daftarTugas");

        if (!savedTasks) return [];

        const parsed: unknown = JSON.parse(savedTasks);

        if (!Array.isArray(parsed)) return [];

        return parsed as Task[];
    } catch {
        return [];
    }
}

// Menyimpan data ke localStorage
function saveTasks(): void {
    localStorage.setItem("daftarTugas", JSON.stringify(tasks));
}

function getStatus(completed: boolean): TaskStatus {
    return completed ? "Selesai" : "Belum Selesai";
}

// Menampilkan tugas
function renderTasks(): void {
    taskList.replaceChildren();

    if (tasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent =
            "Belum ada tugas. Yuk, tambahkan tugasmu!";
        taskList.appendChild(emptyMessage);
        return;
    }

    tasks.forEach((task) => {
        const card = document.createElement("article");
        card.className = "task-card";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const deadline = document.createElement("p");
        deadline.textContent = `Deadline: ${task.deadline}`;

        const status = document.createElement("p");
        status.textContent = `Status: ${getStatus(task.completed)}`;

        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed
            ? "Batalkan Selesai"
            : "Tandai Selesai";
        completeButton.dataset.action = "complete";
        completeButton.dataset.id = String(task.id);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.dataset.action = "edit";
        editButton.dataset.id = String(task.id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = String(task.id);

        card.append(
            title,
            deadline,
            status,
            completeButton,
            editButton,
            deleteButton
        );

        taskList.appendChild(card);
    });
}

// Menambahkan tugas baru
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = taskInput.value.trim();
    const deadline = deadlineInput.value;

    if (!title || !deadline) {
        alert("Nama tugas dan deadline harus diisi!");
        return;
    }

    tasks.push({
        id: Date.now(),
        title: title,
        deadline: deadline,
        completed: false
    });

    saveTasks();
    form.reset();
    renderTasks();
});

// Mengedit, menghapus, dan mengubah status
taskList.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>(
        "button[data-action]"
    );

    if (!button) return;

    const id = Number(button.dataset.id);
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) return;

    const action = button.dataset.action;

    if (action === "complete") {
        tasks[index].completed = !tasks[index].completed;
    }

    if (action === "edit") {
        const newTitle = prompt(
            "Masukkan nama tugas baru:",
            tasks[index].title
        );

        if (newTitle !== null && newTitle.trim() !== "") {
            tasks[index].title = newTitle.trim();
        }
    }

    if (action === "delete") {
        const confirmation = confirm(
            "Yakin ingin menghapus tugas ini?"
        );

        if (confirmation) {
            tasks.splice(index, 1);
        }
    }

    saveTasks();
    renderTasks();
});

// Menampilkan data ketika aplikasi dibuka
renderTasks();

console.log("Nama:", namaMahasiswa);
console.log("Semester:", semester);
console.log("Aplikasi aktif:", aplikasiAktif);
