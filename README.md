# Doneasy (Adonis.js + Nuxt.js)

## Índice
1. [Descrição](#descrição)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Funcionalidades do MVP](#funcionalidades-do-mvp)
4. [Pré-requisitos](#pré-requisitos)
5. [Passos para Configuração Local](#passos-para-configuração-local)
6. [Padrão de Commits](#padrão-de-commits)
7. [Scripts Disponíveis](#scripts-disponíveis)
8. [Features Futuras](#features-futuras)
9. [Versionamento](#versionamento)
10. [Licença](#licença)

---

## Descrição [↑](#índice)
Doneasy é um projeto para gerenciar tarefas com funcionalidades básicas como autenticação, CRUD de tarefas, reordenação de tarefas via drag-and-drop e modais para detalhes das tarefas. O projeto será desenvolvido em TypeScript com Adonis.js para o back-end e Nuxt.js para o front-end, utilizando boas práticas como commits padronizados, testes e integração contínua.

---

## Stack Tecnológica [↑](#índice)
- **Back-end**: Adonis.js (TypeScript)
- **Front-end**: Nuxt.js (TypeScript)
- **Banco de Dados**: PostgreSQL (Docker)
- **Containerização**: Docker e Docker Compose
- **Testes**: Japa (back-end), Cypress (front-end)
- **Linting e Formatação**: ESLint, Prettier
- **Controle de Versão**: Git (GitHub)
- **CI/CD**: GitHub Actions

---

## Funcionalidades do MVP [↑](#índice)
1. Autenticação de usuários (login e registro).
2. CRUD de tarefas com os seguintes campos:
    - Título
    - Descrição
    - Prioridade
    - Status
    - Cor
3. Reordenação de tarefas (drag-and-drop).
4. Modal para detalhes das tarefas, incluindo:
    - Estimativa de conclusão
    - Datas relevantes
5. Layout básico com dashboard e menu lateral.

---

## Pré-requisitos [↑](#índice)
- Node.js (versão LTS)
- Docker e Docker Compose
- Editor de código (recomendado: VS Code)
- Gerenciador de pacotes: npm ou yarn

---

## Passos para Configuração Local [↑](#índice)
### 1. Clonar o repositório
```bash
git clone https://github.com/usuario/doneasy.git
cd doneasy
```

### 2. Configurar e iniciar com Docker
```bash
docker-compose up -d
```
Certifique-se de que o banco de dados está funcionando corretamente.

### 3. Configurar o Back-end
```bash
cd backend
npm install
node ace migration:run
```

### 4. Configurar o Front-end
```bash
cd frontend
npm install
npm run dev
```

### 5. Acessar o projeto
Abra o navegador e acesse `http://localhost:3000` para visualizar o front-end.

---

## Padrão de Commits [↑](#índice)
Este projeto utiliza o padrão [Conventional Commits](https://www.conventionalcommits.org/).

Exemplos de mensagens:
- `feat: add user authentication`
- `fix: correct task deletion bug`
- `docs: update README with setup instructions`
- `chore: add initial Docker setup`

---

## Scripts Disponíveis [↑](#índice)
### Back-end
- `npm run dev` - Inicia o servidor Adonis.js em modo de desenvolvimento.
- `node ace migration:run` - Executa as migrations no banco de dados.
- `npm run lint` - Executa o ESLint.

### Front-end
- `npm run dev` - Inicia o servidor Nuxt.js em modo de desenvolvimento.
- `npm run lint` - Executa o ESLint.

---

## Features Futuras [↑](#índice)
1. Upload de imagens para anexos nas tarefas.
2. Integração com IA para análise e criação automática de tarefas.
3. Notificações via e-mail para tarefas vencidas.

---

## Versionamento [↑](#índice)
Este projeto segue o padrão **Semantic Versioning [SemVer](https://semver.org/lang/pt-BR/)**. O controle da versão é gerenciado através de um arquivo `VERSION` localizado na raiz do projeto. As versões são incrementadas de acordo com as seguintes regras:

- **MAJOR**: Mudanças incompatíveis com versões anteriores.
- **MINOR**: Novas funcionalidades adicionadas de forma retrocompatível.
- **PATCH**: Correções de bugs ou pequenas melhorias retrocompatíveis.

### Exemplos de versões:
- `1.0.0`: Primeira versão estável.
- `1.1.0`: Nova funcionalidade adicionada.
- `1.1.1`: Correção de bug.

---

## Licença [↑](#índice)
Este projeto está sob a licença aberta, mas o uso comercial não é permitido. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
