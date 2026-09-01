/** Mural de avisos — cliente: carga inicial por REST, tempo real por Socket.IO. */
const messagesEl = document.getElementById('messages')
const composerEl = document.getElementById('composer')
const textEl = document.getElementById('text')
const errorEl = document.getElementById('error')
const statusEl = document.getElementById('status')
const statusLabelEl = document.getElementById('status-label')

const socket = io('http://localhost:3000', { auth: { name: 'luiz' } })
const timeFormat = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

function render(message) {
  const item = document.createElement('li')
  item.className = 'py-2.5 px-3 rounded-lg bg-slate-800'

  const body = document.createElement('p')
  body.className = 'break-words whitespace-pre-wrap'
  body.textContent = message.text // textContent, nunca innerHTML: o texto vem de terceiros.

  const time = document.createElement('time')
  time.className = 'block mt-1 text-xs text-slate-400'
  time.dateTime = message.postedAt
  time.textContent = timeFormat.format(new Date(message.postedAt))

  item.append(body, time)
  messagesEl.append(item)
  messagesEl.scrollTop = messagesEl.scrollHeight
}

const showError = (text = '') => {
  errorEl.textContent = text
  errorEl.hidden = !text
}

function setStatus(state, label) {
  statusEl.dataset.state = state
  statusLabelEl.textContent = label
}

async function loadInitial() {
  try {
    const response = await fetch('http://localhost:3000/api/messages')
    if (!response.ok) throw new Error(response.statusText)
    const { messages } = await response.json()
    messages.forEach(render)
  } catch {
    showError('Não foi possível carregar os avisos já publicados.')
  }
}

setStatus('connecting', 'Conectando…')

socket.on('connect', async (e) => {
  if (socket.connected === false) {
    showError(socket?.error?.message ?? socket.message)
  }

  if (socket.connected === true) {
    setStatus('online', 'Conectado')
    return
  }
})
socket.on('welcome', (w) => w.messages.forEach(render))
socket.on('disconnect', () => setStatus('offline', 'Desconectado'))
socket.on('connect_error', (e) => setStatus('offline', e.message ?? 'Sem conexão'))
socket.on('connect_error', (e) => {
  aviso.textContent = e.message
})
// Toda mensagem publicada por qualquer cliente chega por aqui — inclusive as
// minhas, então não há eco otimista para conciliar depois.
socket.on('message', async (data) => {
  let message = await data
  render(message)
})

composerEl.addEventListener('submit', (event) => {
  event.preventDefault()

  const text = textEl.value.trim()
  if (text.length === 0) return

  showError()
  socket.emitWithAck('post', { text }, async (ack) => {
    if (ack && ack.ok) {
      textEl.value = ''
      textEl.focus()
      return
    }
    // O servidor recusou por regra de negócio (vazio, longo demais).
    showError((ack && ack.message) || 'Não foi possível publicar o aviso.')
  })
})

loadInitial()
