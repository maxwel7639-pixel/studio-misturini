/* Estudio Misturini — interacoes do site
   Sem dependencias: cabecalho, menu, revelacao, lightbox da galeria e
   botao flutuante que muda de texto conforme o publico da secao visivel. */
(function () {
  "use strict";

  var ZAP = "https://wa.me/5551999615071";
  var reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- cabecalho solido ---------- */
  var cab = document.querySelector(".cab");
  var zap = document.getElementById("zap");

  function aoRolar() {
    var y = window.scrollY;
    if (cab) cab.classList.toggle("solida", y > 24);
    if (zap) zap.classList.toggle("visivel", y > 500);
  }
  aoRolar();
  window.addEventListener("scroll", aoRolar, { passive: true });

  /* ---------- menu mobile ---------- */
  var hamb = document.querySelector(".hamb");
  var menu = document.getElementById("menu-mob");

  function fecharMenu() {
    if (!hamb || !menu) return;
    hamb.setAttribute("aria-expanded", "false");
    hamb.setAttribute("aria-label", "Abrir menu");
    menu.hidden = true;
    soltarScroll();
  }

  if (hamb && menu) {
    hamb.addEventListener("click", function () {
      if (hamb.getAttribute("aria-expanded") === "true") {
        fecharMenu();
      } else {
        hamb.setAttribute("aria-expanded", "true");
        hamb.setAttribute("aria-label", "Fechar menu");
        menu.hidden = false;
        travarScroll();
      }
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", fecharMenu);
    });
    window.matchMedia("(min-width: 1000px)").addEventListener("change", function (e) {
      if (e.matches) fecharMenu();
    });
  }

  /* o menu e o lightbox travam o scroll: um contador evita que fechar um
     deles solte o scroll enquanto o outro ainda esta aberto */
  var travas = 0;
  function travarScroll() {
    travas++;
    document.body.style.overflow = "hidden";
  }
  function soltarScroll() {
    travas = Math.max(0, travas - 1);
    if (!travas) document.body.style.overflow = "";
  }


  /* ---------- CAPA: cortina que abre com a rolagem ----------
     A secao fica com 230vh e o miolo gruda na tela (sticky). O progresso da
     rolagem dentro dela move os dois lados para fora e revela o poster da
     secao de casamentos atras.

     A classe .capa--cortina so entra aqui, nunca no HTML: sem JS, ou com
     prefers-reduced-motion, a capa continua sendo o diptico estatico. */
  (function () {
    var capa = document.querySelector(".capa");
    if (!capa || reduzir) return;
    if (!CSS.supports || !CSS.supports("position", "sticky")) return;

    var fixo = capa.querySelector(".capa__fixo");
    var lados = capa.querySelectorAll(".dip__lado");
    var revelo = capa.querySelector(".revelo");
    var titulo = capa.querySelector(".capa__titulo");
    var ponte = capa.querySelector(".capa__ponte");
    if (!fixo || lados.length !== 2 || !revelo || !titulo || !ponte) return;

    capa.classList.add("capa--cortina");

    var esq = lados[0], dir = lados[1];
    var pedido = false;

    function faixa(p, a, b) {
      return Math.min(1, Math.max(0, (p - a) / (b - a)));
    }
    function suavizar(t) {          // smoothstep: sem solavanco nas pontas
      return t * t * (3 - 2 * t);
    }

    function pintar() {
      pedido = false;
      var curso = capa.offsetHeight - window.innerHeight;
      if (curso <= 0) return;
      var p = Math.min(1, Math.max(0, -capa.getBoundingClientRect().top / curso));

      // as cortinas abrem ate 72% do curso; o resto e respiro antes de soltar
      var abre = suavizar(faixa(p, 0, 0.72));
      esq.style.transform = "translate3d(" + (-101 * abre) + "%,0,0)";
      dir.style.transform = "translate3d(" + (101 * abre) + "%,0,0)";
      // depois de abertas, nao podem mais interceptar cliques
      var passou = abre > 0.92 ? "none" : "";
      esq.style.pointerEvents = passou;
      dir.style.pointerEvents = passou;

      var ap = faixa(p, 0.06, 0.6);
      revelo.style.opacity = ap;
      revelo.style.transform = "scale(" + (0.88 + 0.12 * suavizar(ap)) + ")";

      titulo.style.opacity = 1 - faixa(p, 0, 0.34);

      var pp = faixa(p, 0.62, 0.9);
      ponte.style.opacity = pp;
      ponte.setAttribute("data-off", pp < 0.5 ? "1" : "0");
      ponte.querySelector("a").tabIndex = pp < 0.5 ? -1 : 0;
    }

    function agendar() {
      if (pedido) return;
      pedido = true;
      requestAnimationFrame(pintar);
    }

    pintar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
  })();

  /* ---------- galeria vazia nao ocupa espaco ----------
     A galeria corporativa nasce sem <figure> (so com o comentario-modelo).
     O :empty do CSS nao e confiavel com quebras de linha dentro do elemento,
     entao quem decide e o JS: sem foto, sem grid. */
  document.querySelectorAll(".galeria").forEach(function (g) {
    if (!g.querySelector(".foto")) g.style.display = "none";
  });

  /* ---------- revelacao no scroll ----------
     A classe entra pelo JS, nunca pelo HTML: .revelar comeca com opacity 0,
     e num portfolio as fotos SAO o produto — se o JS falhasse, a pagina
     inteira ficaria invisivel. Sem JS, tudo aparece normalmente. */
  var paraRevelar = ".bloco__cabeca, .galeria .foto, .corp__foto, .corp__texto, " +
                    ".sobre__num, .sobre__texto, .prova__bloco, .estudio__texto, " +
                    ".estudio__midia, .final__bloco";
  document.querySelectorAll(paraRevelar).forEach(function (el) {
    el.classList.add("revelar");
  });

  var alvos = document.querySelectorAll(".revelar");
  if (reduzir || !("IntersectionObserver" in window)) {
    alvos.forEach(function (el) { el.classList.add("dentro"); });
  } else {
    var obsRev = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var irmaos = el.parentElement
          ? Array.prototype.filter.call(el.parentElement.children, function (n) {
              return n.classList && n.classList.contains("revelar");
            })
          : [];
        var i = irmaos.indexOf(el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 6) * 80 : 0) + "ms";
        el.classList.add("dentro");
        obsRev.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    alvos.forEach(function (el) { obsRev.observe(el); });
  }


  /* ---------- GALERIA DE CASAMENTOS: 3D no desktop ----------
     Cada foto se inclina conforme a distancia do centro da tela e recua no
     eixo Z, como se as fotos estivessem espalhadas numa mesa e voce passasse
     por cima delas. No hover, ela acompanha o cursor.

     No celular este modulo nao roda: la o efeito e o empilhamento, que e
     puro CSS (position:sticky). */
  (function () {
    var gal = document.querySelector(".galeria--cas");
    if (!gal || reduzir) return;

    var mq = window.matchMedia("(min-width: 700px)");
    var fotos = [];
    var pedido = false;
    var ligado = false;

    function escrever(el) {
      var sx = el._sx || 0, hx = el._hx || 0, hy = el._hy || 0, z = el._z || 0;
      el.style.transform =
        "perspective(1200px) rotateX(" + (sx + hx).toFixed(2) + "deg) rotateY(" +
        hy.toFixed(2) + "deg) translateZ(" + z.toFixed(1) + "px)";
    }

    function pintar() {
      pedido = false;
      if (!ligado) return;
      var meio = window.innerHeight / 2;
      for (var i = 0; i < fotos.length; i++) {
        var el = fotos[i];
        var r = el.getBoundingClientRect();
        if (r.bottom < -240 || r.top > window.innerHeight + 240) continue;
        var d = ((r.top + r.height / 2) - meio) / window.innerHeight;
        if (d > 1) d = 1; else if (d < -1) d = -1;
        el._sx = d * 8;                     // inclina para o centro
        el._z = -Math.abs(d) * 80;          // afasta quem esta longe
        el.style.opacity = (1 - Math.abs(d) * 0.4).toFixed(3);
        escrever(el);
      }
    }

    function agendar() {
      if (pedido || !ligado) return;
      pedido = true;
      requestAnimationFrame(pintar);
    }

    function aoMover(e) {
      var el = e.currentTarget;
      var r = el.getBoundingClientRect();
      el._hy = (((e.clientX - r.left) / r.width) - 0.5) * 11;
      el._hx = (0.5 - ((e.clientY - r.top) / r.height)) * 7;
      escrever(el);
    }
    function aoSair(e) {
      var el = e.currentTarget;
      el._hx = 0; el._hy = 0;
      escrever(el);
    }

    function ligar() {
      if (ligado) return;
      ligado = true;
      fotos = Array.prototype.slice.call(gal.querySelectorAll(".foto"));
      fotos.forEach(function (el) {
        // o modulo de revelacao poe .revelar nestas fotos, e a transicao de
        // 700ms dele faria o 3D arrastar atras da rolagem. Aqui a entrada
        // passa a ser o proprio 3D, entao a classe sai.
        el.classList.remove("revelar", "dentro");
        el.style.transition = "none";
        el.addEventListener("mousemove", aoMover);
        el.addEventListener("mouseleave", aoSair);
      });
      pintar();
    }

    function desligar() {
      if (!ligado) return;
      ligado = false;
      fotos.forEach(function (el) {
        el.removeEventListener("mousemove", aoMover);
        el.removeEventListener("mouseleave", aoSair);
        // limpa tudo: no celular quem manda e o sticky do CSS
        el.style.transform = "";
        el.style.opacity = "";
        el.style.transition = "";
        el._sx = el._hx = el._hy = el._z = 0;
      });
      fotos = [];
    }

    function avaliar() {
      if (mq.matches) ligar(); else desligar();
      agendar();
    }

    avaliar();
    mq.addEventListener("change", avaliar);
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
  })();

  /* ---------- botao flutuante por publico ----------
     O site atende dois publicos com intencoes diferentes. O botao acompanha
     a secao que o visitante esta lendo e ja abre o WhatsApp com a mensagem
     certa, em vez de jogar todo mundo no mesmo texto generico. */
  var textos = {
    casamento: {
      rotulo: "Falar sobre casamento",
      aria: "Falar sobre casamento no WhatsApp",
      msg: "Ola, Giovani! Vim pelo site e quero falar sobre a fotografia do meu casamento."
    },
    corporativo: {
      rotulo: "Falar sobre retrato",
      aria: "Falar sobre retrato corporativo no WhatsApp",
      msg: "Ola, Giovani! Vim pelo site e quero falar sobre um retrato corporativo."
    },
    padrao: {
      rotulo: "Fale comigo",
      aria: "Falar comigo no WhatsApp",
      msg: "Ola, Giovani! Vim pelo site e gostaria de conversar."
    }
  };

  var zapTxt = document.getElementById("zap-txt");
  var secoes = document.querySelectorAll("[data-secao]");
  var atual = "";

  function aplicarZap(chave) {
    if (!zap || !zapTxt || chave === atual) return;
    atual = chave;
    var t = textos[chave] || textos.padrao;
    zapTxt.textContent = t.rotulo;
    zap.setAttribute("aria-label", t.aria);
    zap.href = ZAP + "?text=" + encodeURIComponent(t.msg);
  }
  aplicarZap("padrao");

  if (secoes.length && "IntersectionObserver" in window) {
    var visiveis = {};
    var obsSec = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        var nome = e.target.getAttribute("data-secao");
        visiveis[nome] = e.isIntersecting ? e.intersectionRatio : 0;
      });
      // vence a secao que ocupa a maior parte da tela
      var melhor = "padrao", maior = 0.18;
      Object.keys(visiveis).forEach(function (k) {
        if (visiveis[k] > maior && textos[k]) { maior = visiveis[k]; melhor = k; }
      });
      aplicarZap(melhor);
    }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });
    secoes.forEach(function (s) { obsSec.observe(s); });
  }

  /* ---------- LIGHTBOX ----------
     Le as fotos do proprio DOM, entao acrescentar <figure> na galeria ja
     entra no lightbox sem tocar neste arquivo. */
  var lb = document.getElementById("lb");
  var lbImg = document.getElementById("lb-img");
  var lbLeg = document.getElementById("lb-leg");
  var fotos = [];
  var indice = 0;
  var focoAnterior = null;

  function coletar() {
    fotos = Array.prototype.slice.call(document.querySelectorAll(".galeria .foto"));
  }

  function mostrar(i) {
    if (!fotos.length) return;
    indice = (i + fotos.length) % fotos.length;
    var fig = fotos[indice];
    var img = fig.querySelector("img");
    var leg = fig.querySelector("figcaption");
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || "";
    lbLeg.textContent = leg ? leg.textContent : "";
    lbLeg.hidden = !leg;
  }

  function abrir(i) {
    if (!lb) return;
    focoAnterior = document.activeElement;
    mostrar(i);
    lb.hidden = false;
    travarScroll();
    var fechar = lb.querySelector(".lb__fechar");
    if (fechar) fechar.focus();
  }

  function fecharLb() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    lbImg.removeAttribute("src");
    lbImg.alt = "";
    soltarScroll();
    if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
  }

  if (lb && lbImg) {
    coletar();

    // delegacao: fotos adicionadas depois funcionam sem religar nada
    document.addEventListener("click", function (e) {
      var fig = e.target.closest ? e.target.closest(".galeria .foto") : null;
      if (!fig) return;
      coletar();
      var i = fotos.indexOf(fig);
      if (i >= 0) abrir(i);
    });

    // as fotos precisam ser alcancaveis por teclado
    document.querySelectorAll(".galeria .foto").forEach(function (fig) {
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      var leg = fig.querySelector("figcaption");
      fig.setAttribute("aria-label", "Ampliar foto" + (leg ? ": " + leg.textContent : ""));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var fig = document.activeElement;
      if (!fig || !fig.classList || !fig.classList.contains("foto")) return;
      e.preventDefault();
      coletar();
      var i = fotos.indexOf(fig);
      if (i >= 0) abrir(i);
    });

    lb.querySelector(".lb__fechar").addEventListener("click", fecharLb);
    lb.querySelector(".lb__nav--ant").addEventListener("click", function () { mostrar(indice - 1); });
    lb.querySelector(".lb__nav--prox").addEventListener("click", function () { mostrar(indice + 1); });

    // clicar no fundo fecha; clicar na foto, nao
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lb__palco")) fecharLb();
    });

    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") fecharLb();
      else if (e.key === "ArrowLeft") mostrar(indice - 1);
      else if (e.key === "ArrowRight") mostrar(indice + 1);
      else if (e.key === "Tab") {
        // prende o Tab dentro do lightbox enquanto ele estiver aberto
        var focaveis = lb.querySelectorAll("button");
        var primeiro = focaveis[0];
        var ultimo = focaveis[focaveis.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault(); ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault(); primeiro.focus();
        }
      }
    });
  }
})();
