const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações de segurança básicas
app.disable('x-powered-by');

// Middleware CORS
app.use(cors());

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Configuração para servir arquivos estáticos com cache
const staticOptions = {
    setHeaders: (res, filePath) => {
        // Configura o tipo MIME correto para arquivos PDF
        if (filePath.endsWith('.pdf')) {
            res.setHeader('Content-Type', 'application/pdf');
            // Cache de 1 dia para arquivos PDF (86400 segundos)
            res.setHeader('Cache-Control', 'public, max-age=86400');
        } else {
            // Cache de 1 hora para outros arquivos estáticos
            res.setHeader('Cache-Control', 'public, max-age=3600');
        }
    }
};

app.use(express.static(__dirname, staticOptions));

// Rota para a página inicial
app.get('/', (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, 'index.html'));
    } catch (error) {
        next(error);
    }
});

// Rota para o livro PDF
app.get('/books/memoriasBras.pdf', (req, res, next) => {
    try {
        const pdfPath = path.join(__dirname, 'books', 'memoriasBras.pdf');
        
        // Verifica se o arquivo existe
        if (fs.existsSync(pdfPath)) {
            // Configura cabeçalhos para streaming eficiente de arquivos grandes
            const stat = fs.statSync(pdfPath);
            const fileSize = stat.size;
            const range = req.headers.range;

            if (range) {
                // Suporte a range requests para streaming
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = (end - start) + 1;
                const file = fs.createReadStream(pdfPath, { start, end });
                
                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'application/pdf',
                    'Cache-Control': 'public, max-age=86400'
                });
                
                file.pipe(res);
            } else {
                // Se não houver range request, envia o arquivo inteiro
                res.setHeader('Content-Length', fileSize);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Cache-Control', 'public, max-age=86400');
                
                const fileStream = fs.createReadStream(pdfPath);
                fileStream.pipe(res);
            }
        } else {
            res.status(404).json({ error: 'Livro não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao servir o arquivo PDF:', error);
        next(error);
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
