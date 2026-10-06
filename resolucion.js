(() => {
    const ajustarEscala = () => {
        document.documentElement.style.setProperty('--escala-pantalla', 1);
        const altoContenido = document.documentElement.scrollHeight;
        const escala = Math.min(1, (window.innerHeight / altoContenido) * 0.98);
        document.documentElement.style.setProperty('--escala-pantalla', escala);
    };

    window.addEventListener('resize', ajustarEscala);
    window.addEventListener('load', ajustarEscala, { once: true });
    ajustarEscala();
})();
