export function initFaq() {
  const faqItems = document.querySelectorAll(".faq__item");

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq__button");

    button?.addEventListener("click", () => {
      const isOpen = item.classList.contains("faq__item--open");

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("faq__item--open");
          otherItem
            .querySelector(".faq__button")
            ?.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("faq__item--open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}
