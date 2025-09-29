# Leitor de PDF - Memórias Póstumas de Brás Cubas

Este é um leitor de PDF otimizado para o livro "Memórias Póstumas de Brás Cubas" de Machado de Assis.

## Como fazer deploy no Render

1. Crie uma conta no [Render](https://render.com/) se ainda não tiver uma.

2. Faça o upload deste projeto para um repositório no GitHub.

3. No painel do Render, clique em "New" e depois em "Web Service".

4. Conecte sua conta do GitHub e selecione o repositório do projeto.

5. Configure o serviço:
   - **Name**: pdf-leitor-bras-cubas (ou o nome que preferir)
   - **Region**: Escolha a região mais próxima de você
   - **Branch**: main (ou a branch que contém o código)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Clique em "Create Web Service".

7. Aguarde o deploy ser concluído. O Render irá:
   - Instalar as dependências
   - Construir o projeto
   - Iniciar o servidor

8. Após o deploy ser concluído com sucesso, você receberá uma URL para acessar sua aplicação (algo como `https://seu-app.onrender.com`).

## Configurações adicionais

### Variáveis de ambiente

O arquivo `.env` pode ser usado para configurar variáveis de ambiente. Exemplo:

```
NODE_ENV=production
PORT=3000
```

### Verificando a saúde da aplicação

A aplicação possui um endpoint de saúde que pode ser acessado em:

```
GET /health
```

## Estrutura do projeto

- `index.html` - Página inicial da aplicação
- `js/app.js` - Lógica principal do leitor de PDF
- `css/styles.css` - Estilos da aplicação
- `books/memoriasBras.pdf` - O livro em formato PDF
- `server.js` - Servidor Node.js
- `package.json` - Dependências e scripts do projeto

## Desenvolvimento local

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação em `http://localhost:3000`

## Licença

Este projeto está licenciado sob a licença MIT.
