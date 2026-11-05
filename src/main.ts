
import './style.css'

type TaskStatus = 'Belum Selesai' | 'Selesai'

interface Task {
  id: number
  title: string
  status: TaskStatus
  deadline: string
  createdAt: string
}

const appName: string = import.meta.env.VITE_APP_NAME || 'Task Manager Mahasiswa'
const appVersion: string = import.meta.env.VITE_APP_VERSION || '1.0.0'

document.title = `${appName} - v${appVersion}`

const heading = document.querySelector<HTMLHeadingElement>('header h1')
if (heading) heading.textContent = appName

const getElement = <T extends HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector)

  if (!element) {
    throw new Error(`Elemen ${selector} tidak ditemukan`)
  }

  return element
}

const taskForm = getElement<HTMLFormElement>('#taskForm')
const taskInput = getElement<HTMLInputElement>('#taskInput')
const deadlineInput = getElement<HTMLInputElement>('#deadlineInput')
const taskList = getElement<HTMLUListElement>('#taskList')
const emptyState = getElement<HTMLParagraphElement>('#emptyState')

const totalCount = getElement<HTMLElement>('#totalCount')
const pendingCount = getElement<HTMLElement>('#pendingCount')
const doneCount = getElement<HTMLElement>('#doneCount')
const taskTotalLabel = getElement<HTMLElement>('#taskTotalLabel')
const formMessage = getElement<HTMLElement>('#formMessage')

const STORAGE_KEY = 'task-manager-mahasiswa-tasks'

let tasks: Task[] = loadTasks()

function loadTasks(): Task[] {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) return []

  try {
    const parsed = JSON.parse(saved) as Task[]

    // Menyesuaikan data tugas lama yang belum memiliki deadline.
    return parsed.map(task => ({
      ...task,
      deadline: task.deadline || ''
    }))
  } catch {
    return []
  }
}

function saveTasks(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function formatDeadline(deadline: string): string {
  if (!deadline) return 'Belum diatur'

  const date = new Date(deadline)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function renderTasks(): void {
  taskList.innerHTML = ''

  emptyState.hidden = tasks.length > 0

  totalCount.textContent = String(tasks.length)

  pendingCount.textContent = String(
    tasks.filter(task => task.status === 'Belum Selesai').length
  )

  doneCount.textContent = String(
    tasks.filter(task => task.status === 'Selesai').length
  )

  taskTotalLabel.textContent = `${tasks.length} tugas`

  tasks.forEach(task => {
    const item = document.createElement('li')

    item.className = `task-item ${
      task.status === 'Selesai' ? 'is-done' : ''
    }`

    const info = document.createElement('div')
    info.className = 'task-info'

    const title = document.createElement('strong')
    title.textContent = task.title

    const deadline = document.createElement('span')
    deadline.className = 'deadline-text'
    deadline.textContent = `📅 Deadline: ${formatDeadline(task.deadline)}`

    const status = document.createElement('span')
    status.className = 'status'
    status.textContent = task.status

    info.append(title, deadline, status)

    const actions = document.createElement('div')
    actions.className = 'task-actions'

    const toggleButton = document.createElement('button')
    toggleButton.className = 'small-button'
    toggleButton.textContent =
      task.status === 'Selesai' ? 'Batalkan' : 'Selesaikan'

    toggleButton.addEventListener('click', () => {
      task.status =
        task.status === 'Selesai' ? 'Belum Selesai' : 'Selesai'

      saveTasks()
      renderTasks()
    })

    const editButton = document.createElement('button')
    editButton.className = 'small-button'
    editButton.textContent = 'Edit'

    editButton.addEventListener('click', () => {
      const updatedTitle = window.prompt(
        'Ubah nama tugas:',
        task.title
      )

      if (updatedTitle === null) return

      if (!updatedTitle.trim()) {
        window.alert('Nama tugas tidak boleh kosong.')
        return
      }

      const updatedDeadline = window.prompt(
        'Ubah deadline (format: YYYY-MM-DDTHH:mm):',
        task.deadline
      )

      if (updatedDeadline === null) return

      if (!updatedDeadline.trim() || Number.isNaN(new Date(updatedDeadline).getTime())) {
        window.alert('Format deadline tidak valid.')
        return
      }

      task.title = updatedTitle.trim()
      task.deadline = updatedDeadline

      saveTasks()
      renderTasks()
    })

    const deleteButton = document.createElement('button')
    deleteButton.className = 'small-button delete-button'
    deleteButton.textContent = 'Hapus'

    deleteButton.addEventListener('click', () => {
      if (!window.confirm(`Hapus tugas "${task.title}"?`)) return

      tasks = tasks.filter(current => current.id !== task.id)

      saveTasks()
      renderTasks()
    })

    actions.append(toggleButton, editButton, deleteButton)

    item.append(info, actions)

    taskList.append(item)
  })
}

taskForm.addEventListener('submit', event => {
  event.preventDefault()

  const title = taskInput.value.trim()
  const deadline = deadlineInput.value

  if (!title || !deadline) {
    formMessage.textContent = 'Nama tugas dan deadline harus diisi.'
    return
  }

  const newTask: Task = {
    id: Date.now(),
    title,
    status: 'Belum Selesai',
    deadline,
    createdAt: new Date().toISOString()
  }

  tasks.unshift(newTask)

  saveTasks()
  renderTasks()

  taskInput.value = ''
  deadlineInput.value = ''

  formMessage.textContent = 'Tugas berhasil ditambahkan!'

  taskInput.focus()
})

renderTasks()
