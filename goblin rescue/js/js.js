var musicaMenu = document.getElementById("musicaMenu");
musicaMenu.play();
musicaMenu.volume = 0.2;
function start() { // inicio start()

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    $('#inicio').hide();
    var musicaFundo = document.getElementById("musicaFundo");
    musicaFundo.play();
    musicaFundo.volume = 0.2;
    $('#fundoGame').append('<div id="jogador" class="anima1"></div>');
    $('#fundoGame').append('<div id="inimigo1" class="anima2"></div>');
    $('#fundoGame').append('<div id="inimigo2" class="anima5"></div>');
    $('#fundoGame').append('<div id="amigo" class="anima3"></div>');
    $('#fundoGame').append("<div id='placar'></div>");
    $('#fundoGame').append("<div id='energia'></div>");

    // variáveis do jogo
    var jogo = {}
    var velocidade = 5;
    var posicaoYInimigo1 = parseInt(Math.random() * 500);
    var posicaoYInimigo2 = parseInt(Math.random() * 500);
    var posicaoYAmigo = parseInt(Math.random() * 500);
    var podeAtirar = true;
    var fimdejogo = false;
    var inimigo3Adicionado = false;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;
    var TECLA = {
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        SPACE: 32
    }
    jogo.pressionou = [];
    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });

    //game loop
    jogo.timer = setInterval(loop, 30);

    function loop() {
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
        ajustaVelocidade();
        verificaInimigo3();
    } // fim do loop()

    function movefundo() {
        let esquerda = parseInt($('#fundoGame').css('background-position'));
        $('#fundoGame').css('background-position', esquerda - (4+(velocidade/3)));
    } // fim do movefundo()

    function movejogador() {
        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($('#jogador').css('top'));
            var novoTopo = topo - (4 + (velocidade / 3));
            if (novoTopo <= 0) novoTopo = 0;
            $('#jogador').css('top', novoTopo);
        }
        if (jogo.pressionou[TECLA.A]) {
            var esquerda = parseInt($('#jogador').css('left'));
            var novaEsquerda = esquerda - (4 + (velocidade / 3));
            if (novaEsquerda <= 0) novaEsquerda = 0;
            $('#jogador').css('left', novaEsquerda);
        }
        if (jogo.pressionou[TECLA.S]) {
            var topo = parseInt($('#jogador').css('top'));
            var novoTopo = topo + (4 + (velocidade / 3));
            if (novoTopo >= 515) novoTopo = 515; // Ajuste conforme necessário para o limite inferior
            $('#jogador').css('top', novoTopo);
        }
        if (jogo.pressionou[TECLA.D]) {
            var esquerda = parseInt($('#jogador').css('left'));
            var novaEsquerda = esquerda + (4 + (velocidade / 3));
            if (novaEsquerda >= 840) novaEsquerda = 840; // Ajuste conforme necessário para o limite direito
            $('#jogador').css('left', novaEsquerda);
        }
        if (jogo.pressionou[TECLA.SPACE]) {
            // função Disparo
            disparo();

        }
    } // fim moverjogador()

    function moveinimigo1() {
        let posicaoX = parseInt($('#inimigo1').css('left'));
        $('#inimigo1').css('left', posicaoX - velocidade);
        $('#inimigo1').css('top', posicaoYInimigo1);
        if (posicaoX <= 10) {
            posicaoYInimigo1 = parseInt(Math.random() * 500);
            $('#inimigo1').css('left', 870);
            $('#inimigo1').css('top', posicaoYInimigo1);
        }
    } // fim moveinimigo1()

    function moveinimigo2() {
        let posicaoX = parseInt($('#inimigo2').css('left'));
        $('#inimigo2').css('left', posicaoX - (velocidade + 2));
        $('#inimigo2').css('top', posicaoYInimigo2);
        if (posicaoX <= 10) {
            posicaoYInimigo2 = parseInt(Math.random() * 500);
            $('#inimigo2').css('left', 870);
            $('#inimigo2').css('top', posicaoYInimigo2);
        }
    } // fim moveinimigo2()
    
    function moveamigo() {
        let posicaoX = parseInt($('#amigo').css('left'));
        $('#amigo').css('left', posicaoX + (velocidade/3));
        $('#amigo').css('top', posicaoYAmigo);
        if (posicaoX >= 860) {
            $("#amigo").remove();
            energiaAtual -= 1;
            var somvidaperdida = new Audio('sons/sfx_vidaperdida.wav');
            somvidaperdida.volume = 0.5;
            somvidaperdida.play();
            reposicionaAmigo();
        }
    } // fim moveamigo()

    var cooldownTime = 500; // Tempo de cooldown em milissegundos (1 segundo)

    function disparo() {
        if (podeAtirar) {
            podeAtirar = false;
            var somDisparo = new Audio('sons/sfx_tiro.wav');
            somDisparo.volume = 0.2;
            somDisparo.playbackRate = 2.0;
            somDisparo.play();
            topo = parseInt($("#jogador").css("top"));
            posicaoX = parseInt($("#jogador").css("left"));
            tiroX = posicaoX + 100;
            topoTiro = topo + 37;
            $("#fundoGame").append("<div class='disparo'></div>");
            var $novoDisparo = $(".disparo").last();
            $novoDisparo.css("top", topoTiro);
            $novoDisparo.css("left", tiroX);
            var tempoDisparo = window.setInterval(executaDisparo, 30, $novoDisparo);

            // Define o cooldown para o próximo disparo
            setTimeout(function() {
                podeAtirar = true;
            }, cooldownTime);
        } // fecha podeAtirar

        function executaDisparo($disparo) {
            var posicaoX = parseInt($disparo.css("left"));
            $disparo.css("left", posicaoX + 25);
            if (posicaoX > 900) {
                $disparo.remove();
                window.clearInterval(tempoDisparo);
            }
        } // fim executaDisparo()
    } // fim disparo

    function colisao() {
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($(".disparo").collision($("#inimigo1")));
        var colisao4 = ($(".disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
        var colisao7 = ($("#inimigo1").collision($("#amigo")));
        var colisao8 = ($("#jogador").collision($(".inimigo3")));
        var colisao9 = ($(".disparo").collision($(".inimigo3")));
        var colisao10 = ($(".inimigo3").collision($("#amigo")));
        // jogador com o inimigo1
        if (colisao1.length > 0) {
            var somvidaperdida = new Audio('sons/sfx_vidaperdida.wav');
            somvidaperdida.volume = 0.5;
            somvidaperdida.play();
            energiaAtual--;
            inimigo1X = $("#inimigo1").css("left");
            inimigo1Y = $("#inimigo1").css("top");
            explosao1(inimigo1X, inimigo1Y);
            posicaoYInimigo1 = parseInt(Math.random()*500);
            $("#inimigo1").css("left", 870);
            $("#inimigo1").css("top", posicaoYInimigo1);
        }
        // jogador com o inimigo2
        if (colisao2.length > 0) {
            var somvidaperdida = new Audio('sons/sfx_vidaperdida.wav');
            somvidaperdida.volume = 0.5;
            somvidaperdida.play();
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);
            $("#inimigo2").remove();
            reposicionaInimigo2();
        }
        // disparo com o inimigo1
        $(".disparo").each(function() {
            var $disparo = $(this);
            var colisao3 = ($disparo.collision($("#inimigo1")));
            var colisao4 = ($disparo.collision($("#inimigo2")));
            
            if (colisao3.length > 0) {
                var somperda = new Audio('sons/sfx_perda.wav');
                somperda.volume = 0.1;
                somperda.play();
                pontos += 10;
                inimigo1X = parseInt($("#inimigo1").css("left"));
                inimigo1Y = parseInt($("#inimigo1").css("top"));
                explosao1(inimigo1X, inimigo1Y);
                $disparo.remove(); // Remove apenas o disparo que colidiu com o inimigo1
                posicaoYInimigo1 = parseInt(Math.random() * 500);
                $("#inimigo1").css("left", 870);
                $("#inimigo1").css("top", posicaoYInimigo1);
            }
            if (colisao4.length > 0) {
                var somperda = new Audio('sons/sfx_perda.wav');
                somperda.volume = 0.1;
                somperda.play();
                pontos += 30;
                inimigo2X = parseInt($("#inimigo2").css("left"));
                inimigo2Y = parseInt($("#inimigo2").css("top"));
                explosao2(inimigo2X, inimigo2Y);
                $disparo.remove(); // Remove apenas o disparo que colidiu com o inimigo2
                $("#inimigo2").remove();
                reposicionaInimigo2();
            }
        });
        // jogador com o amigo
        if (colisao5.length > 0) {
            var somresgate = new Audio('sons/sfx_resgate.wav');
            somresgate.volume = 0.2;
            somresgate.play();
            salvos++;
            energiaAtual += 1;
            pontos += 100;
            reposicionaAmigo();
            $("#amigo").remove();
        }
        
        if (colisao6.length>0) {
            var somperda = new Audio('sons/sfx_perda.wav');
            somperda.volume = 0.1;
            somperda.play();
            perdidos++;
            energiaAtual -= 1;
            velocidade += 1;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
            $("#amigo").remove();
            reposicionaAmigo();
        }

        if (colisao7.length>0) {
            var somperda = new Audio('sons/sfx_perda.wav');
            somperda.volume = 0.1;
            somperda.play();
            perdidos++;
            energiaAtual -= 1;
            velocidade += 1;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
            $("#amigo").remove();
            reposicionaAmigo();
        }
        if (colisao8.length > 0) {
            var somRisada = new Audio('sons/sfx_laugh.mp3');
            somRisada.volume = 0.5;
            somRisada.playbackRate = 4.0;
            energiaAtual -= 3;
            inimigo3X = parseInt($(".inimigo3").css("left"));
            inimigo3Y = parseInt($(".inimigo3").css("top"));
            explosao4(inimigo3X, inimigo3Y);
            $(".inimigo3").remove();
        }

        // disparo com o inimigo3
        if (colisao9.length > 0) {
            var somperda = new Audio('sons/sfx_perda.wav');
            somperda.volume = 0.1;
            somperda.play();
            pontos += 150;
            inimigo3X = parseInt($(".inimigo3").css("left"));
            inimigo3Y = parseInt($(".inimigo3").css("top"));
            explosao4(inimigo3X, inimigo3Y);
            $(".disparo").css("left", 950);
            $(".inimigo3").remove();
        }

        // inimigo3 com o amigo
        if (colisao10.length > 0) {
            var somperda = new Audio('sons/sfx_perda.wav');
            somperda.volume = 0.1;
            somperda.play();
            perdidos++;
            energiaAtual -= 3;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);
            $("#amigo").remove();
            reposicionaAmigo();
        }

    } // fim colisao
    function explosao1(inimigo1X, inimigo1Y) {
        $("#fundoGame").append('<div class="explosao"></div>');
        var $explosao = $(".explosao").last();
        $explosao.css("background-image", "url(imgs/explosao.png)");
        $explosao.css("top", inimigo1Y);
        $explosao.css("left", inimigo1X);
        $explosao.animate({width:160, opacity: 0}, "slow");
        var tempoExplosao = window.setInterval(removeExplosao, 1000);
        function removeExplosao() {
            $explosao.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    } // fim explosao1
    function explosao2(inimigo2X, inimigo2Y) {
        $("#fundoGame").append("<div class='explosao'></div>");
        var $explosao = $(".explosao").last();
        $explosao.css("background-image", "url(imgs/explosao.png)");
        $explosao.css("top", inimigo2Y);
        $explosao.css("left", inimigo2X);
        $explosao.animate({width: 160, opacity: 0}, "slow");
        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);
        function removeExplosao2() {
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
        }
    } // fim da explosao2

    function explosao3(amigoX, amigoY) {
        $("#fundoGame").append("<div class='explosao'></div>");
        var $explosao = $(".explosao").last();
        $explosao.css("background-image", "url(imgs/explosao.png)");
        $explosao.css("top", amigoY);
        $explosao.css("left", amigoX);
        $explosao.animate({width: 160, opacity: 0}, "slow");
        var tempoExplosao3 = window.setInterval(removeExplosao, 1000);
        function removeExplosao() {
            $explosao.remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }
    }

    function explosao4(inimigo3X, inimigo3Y) {
        $("#fundoGame").append("<div class='explosao'></div>");
        var $explosao = $(".explosao").last();
        $explosao.css("background-image", "url(imgs/explosao.png)");
        $explosao.css("top", inimigo3Y);
        $explosao.css("left", inimigo3X);
        $explosao.animate({width: 160, opacity: 0}, "slow");
        var tempoExplosao4 = window.setInterval(removeExplosao, 1000);
        function removeExplosao() {
            $explosao.remove();
            window.clearInterval(tempoExplosao4);
            tempoExplosao4 = null;
        }
    }
    // reposiciona Inimigo2
    function reposicionaInimigo2() {
        var tempoColisao4 = window.setInterval(reposiciona4);
        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;
            if (fimdejogo == false) {
                var posicaoY = parseInt(Math.random() * 500);
                posicaoYInimigo2 = posicaoY; // Atualiza a variável global posicaoYInimigo2
                $("#inimigo2").remove(); // Remove o inimigo 2 da tela
                $("#fundoGame").append("<div id='inimigo2' class='anima5'></div>"); // Adiciona o inimigo 2 de volta à tela
                $("#inimigo2").css("top", posicaoYInimigo2 + "px"); // Define a nova posição Y do inimigo 2
                $("#inimigo2").css("left", "870px");
            }
        }
    } // fim reposicionaInimigo2()

    function verificaInimigo3() {
        if (pontos >= 3000 && !inimigo3Adicionado) {
            inimigo3Adicionado = true;
            adicionaInimigo3();
        }
    
        if ($(".inimigo3").length > 0) {
            var inimigo3X = parseInt($(".inimigo3").css("left"));
            $(".inimigo3").css("left", inimigo3X - (velocidade*2));
            if (inimigo3X <= 0) {
                $(".inimigo3").remove();
            }
        }
    }

    function adicionaInimigo3() {
        var somrisada = new Audio('sons/sfx_laugh.mp3');
        somrisada.volume = 1;
        somrisada.play();
        somrisada.playbackRate = 10;
        $("#fundoGame").append("<div class='inimigo3 anima6'></div>"); // Corrigido para adicionar a classe correta
        $(".inimigo3").css("left", "870px"); // Correção: Usar a posição correta
        $(".inimigo3").css("top", "314px"); // Correção: Adicionar 'px' para CSS válido
    }
    

    // reposicionaAmigo
    function reposicionaAmigo() {
        posicaoYAmigo = parseInt(Math.random() * 500);
        var indicador = $("<div class='indicador'></div>");
            $("#fundoGame").append(indicador);
            indicador.css({
                "top": posicaoYAmigo,
                "left": "0px"
            })

        var tempoAmigo = window.setInterval(reposiciona6, 6000);
        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
            if (fimdejogo == false) {
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
                $("#amigo").css("top", posicaoYAmigo);
                indicador.css({
                    "top": posicaoYAmigo,
                    "left": "20px"
                });
            }
            indicador.remove();
        }
    } // fim reposicionaAmigo()
    // função placar ()
    function placar() {
        $("#placar").html("<h2> PONTOS: " + pontos + " | PROTEGIDOS: " + salvos + " | PERDIDOS: " + perdidos + "</h2>");
        if (pontos < 0) {
            pontos = 0;
        }
    } // fim da função placar ()

    function ajustaVelocidade() {
        velocidade = 5 + (pontos/150);
    }

    // barra de energia
    function energia() {
        var status = "";
        for (var i = 0; i < energiaAtual; i++) {
            status += "+";
        }
        if (energiaAtual >= 3) {
            energiaAtual = 3;
            $("#energia").html("<h2>STATUS: " + status).removeClass("perigo");
        }
        if (energiaAtual == 2) {
            $("#energia").html("<h2>STATUS: " + status).removeClass("perigo");
        }
        if (energiaAtual == 1) {
            $("#energia").html("<h2>STATUS: " + status).addClass("perigo");
        }
        if (energiaAtual <= 0) {
            // Game Over
            $("#energia").html("<h2>MORTO</h2>").removeClass("perigo");
            gameOver();
        }
    }

    // função game over
    function gameOver () {
        fimdejogo = true;
        musicaFundo.pause();
        var somGameOver = new Audio("sons/ost_menu.mp3");
        somGameOver.volume = 0.5;
        somGameOver.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        $("#fundoGame").append("<div id='fim'></div>")
        $("#fim").html("<h1> FIM DE JOGO </h1> <p> Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3> Jogar Novamente</h3></div>");
    }
} // fim start()
