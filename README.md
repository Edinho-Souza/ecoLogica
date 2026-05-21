# ecoLogica

Aplicacao web para cadastro de usuarios, empresas recicladoras/apoiadoras, pontos de coleta, campanhas, solicitacoes de coleta e pontuacao por reciclagem.

## Estrutura

- `backend/`: API Spring Boot 3, Java 17, Spring Security JWT, JPA e MySQL.
- `frontend/`: HTML, CSS e JavaScript servidos por Express.
- `database/dumps/`: script SQL de criacao e carga inicial.
- `docs/`: documentos de requisitos e regras de negocio.

## Requisitos

- Java 17 ou superior.
- Node.js 20 ou superior.
- Docker Desktop ou MySQL 8 local.

## Como rodar localmente

### Opção recomendada

Na raiz do projeto, use um unico comando. Ele sobe o MySQL, o backend e o frontend e mantem os dois servidores ativos no terminal:

```powershell
npm start
```

Acesse:

- Frontend: http://localhost:3000
- API: http://localhost:8080/api

Use `Ctrl+C` para encerrar backend e frontend juntos.

### Opção manual

Se preferir rodar manualmente, use terminais separados. O backend fica preso em primeiro plano enquanto esta rodando; por isso o frontend precisa estar em outro terminal.

1. Suba o banco:

```powershell
docker compose up -d mysql
```

2. Instale/atualize dependencias do frontend:

```powershell
cd frontend
npm install
```

3. Rode o backend:

```powershell
cd ..\backend
$env:MAVEN_USER_HOME='.mvn-local'
cmd /c mvnw.cmd spring-boot:run
```

4. Em outro terminal, rode o frontend:

```powershell
cd frontend
npm start
```

5. Acesse:

- Frontend: http://localhost:3000
- API: http://localhost:8080/api

Tambem funciona com Live Server/VS Code em `http://127.0.0.1:5500`, desde que o backend seja reiniciado depois das alteracoes de CORS.

## Credenciais seed

Todas usam a senha `123456789`.

- Admin: `admin@sistema.com`
- Recicladora: `contato@verde.com`
- Apoiadora: `eco@apoio.com`

## Variaveis de ambiente

Veja `.env.example`. O backend aceita:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `SERVER_PORT`
- `APP_CORS_ALLOWED_ORIGINS` (lista separada por virgulas, padrao: `http://localhost:3000,http://127.0.0.1:3000,http://localhost:5500,http://127.0.0.1:5500`)

## Validacao rapida

```powershell
cd backend
$env:MAVEN_USER_HOME='.mvn-local'
cmd /c mvnw.cmd -q -DskipTests package

cd ..\frontend
npm audit --omit=dev
node --check js\api.js
```
