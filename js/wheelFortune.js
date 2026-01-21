const sectors = [
    { color: "#FF6384", label: "Free Spins" },
    { color: "#36A2EB", label: "Bonus " },
    { color: "#FFCE56", label: "Freebet" },
    { color: "#4BC0C0", label: "Cashback" },
    { color: "#9966FF", label: "Crab" },
    { color: "#FF9F40", label: "Monety" },
];

const wheelSection = document.querySelector(".wheel-fortune");
if (wheelSection) {
    const canvas = wheelSection.querySelector(".wheel-fortune__canvas");
    const button = wheelSection.querySelector(".wheel-fortune__button");
    const popup = wheelSection.querySelector(".wheel-fortune__popup");
    const prizeSpan = wheelSection.querySelector(".wheel-fortune__prize");
    const closeBtn = wheelSection.querySelector(".wheel-fortune__cta-btn");

    const ctx = canvas.getContext("2d");
    const dia = canvas.width;
    const rad = dia / 2;
    const PI = Math.PI;
    const TAU = 2 * PI;
    const tot = sectors.length;
    const arc = TAU / tot;

    const friction = 0.975;
    const angVelMin = 0.002;
    let angVelMax = 0;
    let angVel = 0;
    let ang = 0;
    let isSpinning = false;
    let isAccelerating = false;
    let animFrame = null;

    const closePopup = () => {
        popup.classList.remove("wheel-fortune__popup_active");
    };

    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closePopup();
    });

    popup.addEventListener("click", (e) => {
        if (e.target === popup) closePopup();
    });

    const getCurrentSectorIndex = () => {
        const normalizedAng = ((ang % TAU) + TAU) % TAU;
        return Math.floor(tot - (normalizedAng / TAU) * tot) % tot;
    };

    const drawWheel = () => {
        ctx.clearRect(0, 0, dia, dia);
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
            ctx.fillStyle = "#4E342E";
            ctx.font = "bold 18px sans-serif";
            ctx.fillText(sector.label, rad - 20, 8);
            ctx.restore();
        });
    };

    const rotateCanvas = () => {
        canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    };

    const animate = () => {
        if (!isSpinning) return;

        if (isAccelerating) {
            if (!angVel) angVel = 0.05;
            angVel *= 1.12;
            if (angVel >= angVelMax) isAccelerating = false;
        }

        if (!isAccelerating) {
            angVel *= friction;
            if (angVel < angVelMin) {
                angVel = 0;
                isSpinning = false;
                cancelAnimationFrame(animFrame);

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

    button.addEventListener("click", () => {
        if (isSpinning) return;
        isSpinning = true;
        isAccelerating = true;
        angVelMax = 0.35 + Math.random() * 0.1;
        animate();
    });

    drawWheel();
    rotateCanvas();
}
