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
