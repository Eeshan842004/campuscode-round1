// Small effects for the Login/Register forms, using the browser's built-in Web Animations API.

const EASE = "cubic-bezier(.16, 1, .3, 1)";

// Captcha refresh: the ↻ icon spins once and the new code drops in.
export function animateCaptchaRefresh(icon: HTMLElement | null, canvas: HTMLElement | null) {
  icon?.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 500, easing: EASE });
  canvas?.animate(
    [{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "none" }],
    { duration: 320, easing: EASE }
  );
}

// Wrong input: the field box shakes 4px left/right twice. It can repeat on every submit.
export function shake(el: HTMLElement | null) {
  el?.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 320, easing: "ease-out" }
  );
}
