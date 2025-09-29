const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Configuração para servir arquivos estáticos
app.use(express.static(__dirname, {
    setHeaders: (res, filePath) => {
        // Configura o tipo MIME correto para arquivos PDF
        if (filePath.endsWith('.pdf')) {
            res.setHeader('Content-Type', 'application/pdf');
        }
    }
}));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para o livro PDF
app.get('/books/memoriasBras.pdf', (req, res) => {
    const pdfPath = path.join(__dirname, 'books', 'memoriasBras.pdf');
    
    // Verifica se o arquivo existe
    if (fs.existsSync(pdfPath)) {
        res.sendFile(pdfPath);
    } else {
        res.status(404).send('Livro não encontrado');
    }
});

// Rota para verificar a saúde da aplicação
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota para lidar com erros 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({ 
        error: 'Ocorreu um erro no servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar o servidor
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Rejeição não tratada em:', promise, 'motivo:', reason);
    // Encerra o processo com falha para que o gerenciador de processos possa reiniciá-lo
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('Exceção não capturada:', error);
    // Encerra o processo com falha para que o gerenciador de processos possa reiniciá-lo
    process.exit(1);
});
