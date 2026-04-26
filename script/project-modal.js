document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("projectModal");
  const iframe = document.getElementById("projectModalFrame");
  const title = document.getElementById("projectModalTitle");
  const liveLink = document.getElementById("projectModalLink");

  const openButtons = document.querySelectorAll(".js-open-project");
  const closeButtons = document.querySelectorAll("[data-close-project]");

  if (!modal || !iframe || !title || !liveLink) return;

  function openModal(url, projectTitle) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    iframe.src = url;
    title.textContent = projectTitle || "Project preview";
    liveLink.href = url;

    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    iframe.src = "";
    document.body.classList.remove("modal-open");
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const url = button.dataset.url;
      const projectTitle = button.dataset.title;

      if (!url) return;

      openModal(url, projectTitle);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
});