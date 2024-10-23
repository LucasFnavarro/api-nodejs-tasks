function response(status, mensagem, aftrows, data = null) {
    return {
        status: status,
        mensagem: mensagem,
        aftrows: aftrows,
        data: data,
        timestamp: new Date().toLocaleDateString('PT-BR', { weekday: "long", year: "numeric", month: "short", day: "numeric" })
    };
}

module.exports = {
    response
}