(() => {
  "use strict";
  const input = document.getElementById("city-search");
  const cards = [...document.querySelectorAll(".city-card")];
  const normalize = value => value.normalize("NFKC").toLowerCase().replace(/[\s’'·-]/g, "");
  input.addEventListener("input", () => {
    const query = normalize(input.value);
    let count = 0;
    cards.forEach(card => {
      card.hidden = !normalize(card.dataset.search).includes(query);
      if (!card.hidden) count++;
    });
    document.getElementById("city-count").textContent = count + " 座城市";
    document.getElementById("city-empty").hidden = count !== 0;
  });
})();
