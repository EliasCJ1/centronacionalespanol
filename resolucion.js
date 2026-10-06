(() => {
    const anchoReferencia = 1440;

    const ajustarEscala = () => {
        const anchoVentana = document.documentElement.clientWidth;
        const escala = Math.max(1, anchoVentana / anchoReferencia);

        document.documentElement.style.setProperty('--escala-pantalla', escala);
    };

    ajustarEscala();
    window.addEventListener('resize', ajustarEscala);

    const raiz = document.documentElement;

    const esFullscreenSoportado = () => {
        return Boolean(
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled ||
            typeof raiz.requestFullscreen === 'function' ||
            typeof raiz.webkitRequestFullscreen === 'function' ||
            typeof raiz.mozRequestFullScreen === 'function' ||
            typeof raiz.msRequestFullscreen === 'function'
        );
    };

    if (!esFullscreenSoportado()) {
        return;
    }

    const obtenerElementoFullscreen = () => {
        return document.fullscreenElement ||
               document.webkitFullscreenElement ||
               document.mozFullScreenElement ||
               document.msFullscreenElement ||
               null;
    };

    const solicitarPantallaCompleta = async () => {
        if (obtenerElementoFullscreen()) {
            return;
        }

        const pedirFS = raiz.requestFullscreen ||
                        raiz.webkitRequestFullscreen ||
                        raiz.mozRequestFullScreen ||
                        raiz.msRequestFullscreen;

        if (typeof pedirFS !== 'function') {
            return;
        }

        try {
            const promesa = pedirFS.call(raiz, { navigationUI: 'hide' });
            if (promesa && typeof promesa.catch === 'function') {
                promesa.catch(() => {});
            }
        } catch {
            // Silenciosamente ignorar si el navegador requiere interacción del usuario
        }
    };

    const activarConInteraccion = (evento) => {
        if (!evento.isTrusted) {
            return;
        }

        if (evento.type === 'keydown' &&
            (evento.key === 'Escape' || evento.key === 'Tab' ||
             evento.ctrlKey || evento.altKey || evento.metaKey)) {
            return;
        }

        solicitarPantallaCompleta();
    };

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach((tipoEvento) => {
        document.addEventListener(tipoEvento, () => {
            ajustarEscala();
        });
    });

    const opcionesEvento = { capture: true, passive: true };
    ['pointerdown', 'touchstart', 'click'].forEach((tipoEvento) => {
        document.addEventListener(tipoEvento, activarConInteraccion, opcionesEvento);
    });
    document.addEventListener('keydown', activarConInteraccion, { capture: true });

    // Intento automático inmediato al cargar la página
    solicitarPantallaCompleta();
    if (document.readyState !== 'complete') {
        window.addEventListener('load', () => {
            solicitarPantallaCompleta();
        }, { once: true });
    }
})();
