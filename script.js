//Definição de constantes e váriaveis para o código gerar tentivas e para o tabuleiro
const TAMANHO_PALAVRA = 6;
const NUMERO_DE_LINHAS = 6;
const TENTATIVAS_MAXIMAS_POR_LINHA = 6;
let tentativasRestantes = 6;

const palavraAdivinhar = "SENSOR";
const letrasCorretas = Array(TAMANHO_PALAVRA * NUMERO_DE_LINHAS).fill(false);

// Função para gerar o tabuleiro
function gerarTabuleiro() {
    const tabuleiro = document.getElementById("tabuleiro");

    for (let i = 0; i < NUMERO_DE_LINHAS; i++) {
        const linha = document.createElement("div");
        linha.className = "linha"; // cria a linha

        for (let j = 0; j < TAMANHO_PALAVRA; j++) {
            const caixa = document.createElement("div");
            caixa.className = "caixa";
            linha.appendChild(caixa); // Adiciona a caixa à linha
        }

        tabuleiro.appendChild(linha); // Adiciona a linha ao tabuleiro
    }
}

let tentativas = 7; // aqui tem 7, porque eu pensei assim, eu colocava 6 tentativas mas na ultima linha não estava trocando as cores quando eu dava enter, entao aumentei o numero de quantidade de enter para que consequentemente meu usuario soubesse na ultima linha quais ele acertou!

// Função para adicionar eventos para as caixas de texto
function adicionarListeners() {
    const caixas = document.querySelectorAll(".caixa");

    caixas.forEach((caixa, index) => {
        caixa.contentEditable = true; // Torna as caixas editáveis

        caixa.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Previne a criação de uma nova linha
                tentativas--;
                if (tentativas <= 0) {
                    desativarEntradaDados();
                    alert("Você atingiu o limite de 6 tentativas!");
                } else {
                    verificarPalavraAdivinhada();
                    const proximaLinha = Math.floor((index + 1) / TAMANHO_PALAVRA);
                    const primeiraCaixaProximaLinha = caixas[proximaLinha * TAMANHO_PALAVRA];
                    if (primeiraCaixaProximaLinha) {
                        setTimeout(() => primeiraCaixaProximaLinha.focus(), 0); // Move o foco para a primeira caixa da próxima linha
                    }
                }
            } else if (event.key === "Backspace") {
                this.innerText = ""; // Limpa a caixa
            } else if (!/^[a-zA-Z]$/.test(event.key)) {
                event.preventDefault(); // Ignora caracteres não alfabéticos
            }
        });
            // Mantém a cor do texto preta até que "Enter" seja pressionado unica maneira que consegui fazer para achar e neste mesmo codigo muda automaticamente para a proxima linha após adcionar a letra
        caixa.addEventListener("input", function(event) {
            this.style.color = "black"; 
            if (this.innerText.length === 1) {
                this.innerText = this.innerText.toUpperCase(); // usei isso aqui pra deixar maiuscula fiz igual o do senhor é mais simples :D
                if (index % TAMANHO_PALAVRA < TAMANHO_PALAVRA - 1 && index < TAMANHO_PALAVRA * NUMERO_DE_LINHAS - 1) {
                    setTimeout(() => caixas[index + 1].focus(), 0); // Move o foco para a próxima caixa
                }
            }
        });
    });
}

// Essa função criada tem propósito de verificar se a palavra está correta ou não, nela vai entrar toda a parte de codificação de cores, laranja, vermelho e verde, obs: não sei se fiz da melhor maneira mas funcionou.
function verificarPalavraAdivinhada() {
    const letrasDigitadas = document.querySelectorAll(".caixa");
    let palavraCorreta = true;

    letrasDigitadas.forEach((caixa, index) => {
        const letraDigitada = caixa.innerText.toUpperCase();
        const posicaoCorreta = index;

        if (letraDigitada === palavraAdivinhar[posicaoCorreta % TAMANHO_PALAVRA]) {
            caixa.style.color = "green"; // Letra correta na posição correta
            letrasCorretas[posicaoCorreta] = true;
        } else {
            palavraCorreta = false;
            if (palavraAdivinhar.includes(letraDigitada)) {
                caixa.style.color = "orange"; // Letra correta, mas na posição errada
            } else {
                caixa.style.color = "red"; // Letra errada
            }
        }
    });

    tentativasRestantes--;  // Decrementa o número de tentativas restantes está sem numero pelo fato de que  cada vez que essa linha é executada, o número de tentativas restantes é reduzido em 1 achei melhor de entender.
    
    // Verifica se o jogo acabou

    if (tentativasRestantes === 0 || palavraCorreta) {
        jogoAcabou = true;
        desativarEntradaDados(); // Desativa a entrada de dados
        if (palavraCorreta) {
            alert("Parabéns!! Você acertou a palavra :)");
        } else {
            alert("Fim de jogo! Você usou todas as tentativas.");
        }
    }
}

// Função para desativar a entrada de dados nesse caso aqui  ele é aplicado a todo o documento, afetando todas as teclas pressionadas.
function desativarEntradaDados() {
    const caixas = document.querySelectorAll(".caixa");
    const botoes = document.querySelectorAll("#teclado-virtual button");

    caixas.forEach(caixa => {
        caixa.contentEditable = false;
    });

    botoes.forEach(botao => {
        botao.disabled = true;
    });
}

// Função para adicionar um teclado virtual, optei em fazer com todas as letras por uma razão como comentei quero implementar em outros projetos, logo facilitaria ter todas as letras pra que eu possa fazer diversidade de palavras futuramente
function adicionarTecladoVirtual() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const teclado = document.createElement('div');
    teclado.id = 'teclado-virtual';

    for (let i = 0; i < letras.length; i++) {
        const botao = document.createElement('button');
        botao.innerText = letras[i];
        botao.addEventListener('click', function() {
            const caixas = document.querySelectorAll(".caixa");
            const letra = this.innerText;
            for (let caixa of caixas) {
                if (caixa.innerText === '') {
                    caixa.innerText = letra;
                    break;
                }
            }
        });
        teclado.appendChild(botao);
    }

    document.body.appendChild(teclado);
}

// Chama as funções para gerar o tabuleiro, adicionar os listeners e o teclado virtual após o carregamento do DOM
window.onload = function() {
    gerarTabuleiro();
    adicionarListeners();
    adicionarTecladoVirtual();
};

// Bloqueia a entrada de dados via teclado quando o jogo acabar
document.addEventListener('keydown', function(event) {
    if (jogoAcabou) {
        event.preventDefault();
    }
});

// Função para obter uma palavra do backend
async function obterPalavraDoBackend() {
    try {
        const response = await fetch('URL_DA_SUA_API_DE_GERACAO_DE_PALAVRAS');
        if (!response.ok) {
            throw new Error('Erro ao obter a palavra do backend');
        }
        const data = await response.json();
        return data.SEUNOME_palavra; // Substitua 'SEUNOME' pelo seu nome
    } catch (error) {
        console.error('Erro ao obter a palavra do backend:', error);
        return null;
    }
}

// Função para iniciar o jogo com a palavra obtida do backend
async function iniciarJogoComPalavraDoBackend() {
    const palavra = await obterPalavraDoBackend();
    if (palavra) {
        // Use a palavra obtida para iniciar o jogo
        console.log('Palavra obtida do backend:', palavra);
        iniciarJogo(palavra); // Supondo que você tenha uma função chamada iniciarJogo()
    } else {
        console.error('Não foi possível obter a palavra do backend. O jogo não pode ser iniciado.');
    }
}


// obs final: tinha como ser mais simplificado mas sempre que eu tentava perdia alguns pontos necessários, corrija com amor, Valeu Walbão <3  
