#!/bin/bash
npx tsx -e "import('./src/infrastructure/persistence/ParticipantDirectory').then(m => {
    const d = new m.ParticipantDirectory(); \
    d.add('p1', 'Ana'); 
    d.remove('p2');
    console.log(d.nameOf('p1'), d.size);
    d.remove('p1');
    console.log(d.nameOf('p1'), d.size) 
    });
"
# Ana 1
# undefined 0   — remover id inexistente não lançou

# com o servidor rodando e logando directory.size:
npx tsx -e "
  import('socket.io-client').then(({ io }) => {
  const a = io('http://localhost:3000'), b = io('http://localhost:3000');
  setTimeout(
    () => a.close(), 500);
        setTimeout(() => { 
            b.close(); 
            process.exit(0) 
        }, 1500) 
  })"
# o log do servidor sobe pra 2, cai pra 1, cai pra 0 — sem exceção no meio


npx tsx -e "
  import('socket.io-client').then(({ io }) => {
    const s = io('http://localhost:3000');
    s.on('connect_error', (e) => {
      console.log('recusado:', e.message);
      s.close() 
    })
  })
"
# recusado: INVALID_AUTHOR_NAME

npx tsx -e "
  import('socket.io-client').then(({ io }) => { \
    const s = io('http://localhost:3000', { auth: { name: 'Ana' } }); \
    s.on('welcome', (w) => {
      console.log(w.name, w.messages.length);
      s.close() 
    })
  })"
# Ana <n>   — welcome com o histórico atual

# terminal 1 — ouvinte:
npx tsx -e "
import('socket.io-client').then(({ io }) => { \
  const s = io('http://localhost:3000', { auth: { name: 'Ana' } }); \
  s.on(
    'message', (m) => console.log('tempo real:', m.text)
  )
})"

# terminal 2:
curl -sS -X POST http://localhost:3000/api/messages \
  -H 'content-type: application/json' -d '{"author":"Bob","text":"via REST"}'
# o terminal 1 imprime "tempo real: via REST" — sem nunca ter falado com o curl


# com LoggingBroadcaster ativo, publique por REST:
curl -sS -X POST http://localhost:3000/api/messages \
  -H 'content-type: application/json' -d '{"author":"Ana","text":"oi"}'
# o servidor loga [broadcast] message {...} e o cliente conectado NÃO recebe nada
# git diff src/application/PostMessage.ts   → vazio