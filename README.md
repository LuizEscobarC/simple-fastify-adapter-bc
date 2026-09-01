# simple-fastify-adapter-bc

Exercício de arquitetura hexagonal (ports & adapters) com Fastify + Socket.IO em TypeScript.

Um mural de recados simples: mensagens são publicadas via HTTP e propagadas em tempo real
via WebSocket. O caso de uso não conhece o Socket.IO — ele fala com a porta `Broadcaster`,
e o `SocketIoBroadcaster` é o adaptador que a implementa.

## Estrutura

```
src/
  domain/        # regras e value objects (MessageText, NoticeBoard, ...)
  application/
    ports/       # Broadcaster, Clock — interfaces que o domínio exige
    use-cases/   # PostMessage, ListMessages
  infrastructure/
    adapter/     # SocketIoBroadcaster — implementa a porta Broadcaster
    persistence/ # ParticipantDirectory
  routes/        # rotas HTTP (Fastify)
  plugins/       # static
public/          # front-end
```

## Rodando

```bash
npm install
npm run dev     # tsx watch src/server.ts
npm run build   # tsc
```
