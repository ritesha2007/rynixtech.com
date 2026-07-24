document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    document.body.style.backgroundPosition = `${50 + x}% ${50 + y}%`;

    const logo = document.querySelector(".hero-logo");
    if (logo) {
        logo.style.transform = `translate(${x/4}px, ${y/4}px)`;
    }
});

document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const x = (touch.clientX / window.innerWidth - 0.5) * 20;
    const y = (touch.clientY / window.innerHeight - 0.5) * 20;

    document.body.style.backgroundPosition = `${50 + x}% ${50 + y}%`;

    const logo = document.querySelector(".hero-logo");
    if (logo) {
        logo.style.transform = `translate(${x/4}px, ${y/4}px)`;
    }
}, { passive: true });

window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    const hero = document.querySelector(".hero");

    if (hero) {
        hero.style.transform = `translateY(${scroll * 0.15}px)`;
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
});

document.querySelectorAll("section").forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(50px)";
    section.style.transition = "all 1s ease";
    observer.observe(section);
});