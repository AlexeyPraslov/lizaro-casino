const sectors = [
    { color: "#FF6384", label: "Приз 1" },
    { color: "#36A2EB", label: "Приз 2" },
    { color: "#FFCE56", label: "Приз 3" },
    { color: "#4BC0C0", label: "Приз 4" },
    { color: "#9966FF", label: "Приз 5" },
    { color: "#FF9F40", label: "Приз 6" },
];

const wheelSection = document.querySelector(".wheel-fortune");
if (wheelSection) {
    const canvas = wheelSection.querySelector(".wheel-fortune__canvas");
    const button = wheelSection.querySelector(".wheel-fortune__button");
    const popup = wheelSection.querySelector(".wheel-fortune__popup");
    const prizeSpan = wheelSection.querySelector(".wheel-fortune__prize");
    const closeBtn = wheelSection.querySelector(".wheel-fortune__popup-close");

    const ctx = canvas.getContext("2d");
    const dia = canvas.width;
    const rad = dia / 2;
    const PI = Math.PI;
    const TAU = 2 * PI;
    const tot = sectors.length;
    const arc = TAU / tot;

    // === ПАРАМЕТРЫ АНИМАЦИИ (сделаны короче) ===
    const friction = 0.975; // Быстрее тормозит (было 0.991)
    const angVelMin = 0.002;
    let angVelMax = 0;
    let angVel = 0;
    let ang = 0;
    let isSpinning = false;
    let isAccelerating = false;
    let animFrame = null;

    // === Закрытие попапа ===
    const closePopup = () => {
        popup.classList.remove("wheel-fortune__popup_active");
    };
    closeBtn.addEventListener("click", closePopup);
    popup.addEventListener("click", (e) => {
        if (e.target === popup) closePopup();
    });

    // === Определение сектора (как раньше) ===
    const getCurrentSectorIndex = () => {
        const normalizedAng = ((ang % TAU) + TAU) % TAU;
        return Math.floor(tot - (normalizedAng / TAU) * tot) % tot;
    };

    // === Отрисовка ===
    const drawWheel = () => {
        sectors.forEach((sector, i) => {
            const startAng = arc * i;
            const endAng = startAng + arc;

            ctx.beginPath();
            ctx.fillStyle = sector.color;
            ctx.moveTo(rad, rad);
            ctx.arc(rad, rad, rad, startAng, endAng);
            ctx.closePath();
            ctx.fill();

            ctx.save();
            ctx.translate(rad, rad);
            ctx.rotate(startAng + arc / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            ctx.font = "bold 18px sans-serif";
            ctx.fillText(sector.label, rad - 20, 8);
            ctx.restore();
        });
    };

    // === Вращение через CSS ===
    const rotateCanvas = () => {
        canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    };

    // === Анимационный цикл (ускоренный) ===
    const animate = () => {
        if (!isSpinning) return;

        // Ускорение — быстрее
        if (isAccelerating) {
            if (!angVel) angVel = 0.05; // Больше начальный импульс
            angVel *= 1.12; // Быстрее разгон
            if (angVel >= angVelMax) isAccelerating = false;
        }

        // Замедление — резче
        if (!isAccelerating) {
            angVel *= friction; // Трение выше → быстрее остановка
            if (angVel < angVelMin) {
                angVel = 0;
                isSpinning = false;
                cancelAnimationFrame(animFrame);

                // Показ результата
                const idx = getCurrentSectorIndex();
                prizeSpan.textContent = sectors[idx].label;
                popup.classList.add("wheel-fortune__popup_active");

                button.textContent = "SPIN";
                return;
            }
        }

        ang += angVel;
        rotateCanvas();
        animFrame = requestAnimationFrame(animate);
    };

    // === Запуск ===
    button.addEventListener("click", () => {
        if (isSpinning) return;
        isSpinning = true;
        isAccelerating = true;
        // Макс. скорость — чуть выше, но разгон короче
        angVelMax = 0.35 + Math.random() * 0.1;
        animate();
    });

    // Инициализация
    drawWheel();
    rotateCanvas();
}
