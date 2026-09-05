(() => {
  "use strict";
  const city = JSON.parse(document.getElementById("atlas-data").textContent);
  const $ = (selector) => document.querySelector(selector);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!document.body.dataset.landmark) {
    const cover = $("#cover"), atlas = $("#atlas"), scroller = $(".panorama-window");
    const items = [...document.querySelectorAll(".landmark")];
    const indexButtons = [...document.querySelectorAll(".index-button")];
    const range = $("#panorama-position");
    let selected = 0, drag = null, suppressClick = false;
    function select(index, scroll = false) {
      const landmark = city.landmarks[index];
      if (!landmark) return;
      selected = index;
      $(".panorama-strip").style.setProperty("--focus-x", items[index].dataset.focus + "%");
      items.forEach((item, i) => item.classList.toggle("selected", i === index));
      indexButtons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
      $("#info-english").textContent = landmark.english;
      $("#info-name").textContent = landmark.name;
      $("#info-era").textContent = landmark.era + " / " + landmark.area;
      $("#info-description").textContent = landmark.description;
      $("#info-visit").textContent = landmark.visit;
      $("#detail-link").href = items[index].href;
      if (scroll) scroller.scrollTo({
        left: items[index].offsetLeft - (scroller.clientWidth - items[index].offsetWidth) / 2,
        behavior: reduced ? "instant" : "smooth"
      });
      const url = new URL(location.href);
      url.searchParams.set("landmark", landmark.slug);
      history.replaceState(null, "", url);
    }
    function enter() {
      cover.hidden = true; atlas.hidden = false;
      document.body.dataset.view = "atlas";
      const url = new URL(location.href);
      url.searchParams.set("enter", "1");
      history.replaceState(null, "", url);
      const requested = city.landmarks.findIndex(item => item.slug === url.searchParams.get("landmark"));
      select(requested < 0 ? 0 : requested, true);
      syncScroll();
    }
    $("#enter").addEventListener("click", () => { enter(); $("#back-cover").focus(); });
    $("#back-cover").addEventListener("click", () => {
      cover.hidden = false; atlas.hidden = true;
      document.body.dataset.view = "cover";
      history.replaceState(null, "", location.pathname);
      $("#enter").focus();
    });
    items.forEach((item, index) => {
      item.addEventListener("mouseenter", () => { if (!drag) select(index); });
      item.addEventListener("focus", () => select(index));
      item.addEventListener("click", event => {
        if (suppressClick) { event.preventDefault(); suppressClick = false; }
      });
    });
    indexButtons.forEach((button, index) => button.addEventListener("click", () => select(index, true)));
    function syncScroll() {
      const max = scroller.scrollWidth - scroller.clientWidth;
      range.value = max > 0 ? Math.round(scroller.scrollLeft / max * 1000) : 0;
      $(".prev").disabled = scroller.scrollLeft < 2;
      $(".next").disabled = scroller.scrollLeft >= max - 2;
    }
    scroller.addEventListener("scroll", syncScroll, {passive: true});
    addEventListener("resize", syncScroll);
    range.addEventListener("input", () => {
      scroller.scrollLeft = Number(range.value) / 1000 * (scroller.scrollWidth - scroller.clientWidth);
    });
    $(".prev").addEventListener("click", () => select(Math.max(0, selected - 1), true));
    $(".next").addEventListener("click", () => select(Math.min(items.length - 1, selected + 1), true));
    scroller.addEventListener("keydown", event => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        select(Math.max(0, Math.min(items.length - 1, selected + (event.key === "ArrowRight" ? 1 : -1))), true);
      }
    });
    scroller.addEventListener("pointerdown", event => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      suppressClick = false;
      drag = {x: event.clientX, left: scroller.scrollLeft, id: event.pointerId};
    });
    scroller.addEventListener("pointermove", event => {
      if (!drag) return;
      const delta = event.clientX - drag.x;
      if (Math.abs(delta) > 6) {
        suppressClick = true;
        scroller.setPointerCapture(event.pointerId);
        scroller.classList.add("dragging");
        scroller.scrollLeft = drag.left - delta;
      }
    });
    const release = () => {
      if (drag && scroller.hasPointerCapture(drag.id)) scroller.releasePointerCapture(drag.id);
      drag = null; scroller.classList.remove("dragging");
    };
    scroller.addEventListener("pointerup", release);
    scroller.addEventListener("pointercancel", release);
    scroller.addEventListener("lostpointercapture", release);
    scroller.addEventListener("dragstart", event => event.preventDefault());
    if (new URLSearchParams(location.search).get("enter") === "1") enter();
    syncScroll();
    return;
  }

  const landmark = city.landmarks.find(item => item.slug === document.body.dataset.landmark);
  const frame = $(".art-frame"), art = $("#detail-art"), card = $("#detail-card");
  const spots = [...document.querySelectorAll(".hotspot")];
  const lens = $("#magnifier"), toggle = $("#toggle-magnifier");
  let active = null, magnify = false;
  function showPoint(index) {
    const point = landmark.points[index];
    if (!point) return;
    active = index;
    card.hidden = false;
    card.classList.toggle("on-left", point.x >= 50);
    $("#detail-card-title").textContent = point.title;
    $("#detail-card-lead").textContent = point.lead;
    $("#detail-card-text").textContent = point.text;
    const crop = $(".detail-crop");
    crop.style.backgroundImage = "url(" + art.getAttribute("src") + ")";
    crop.style.backgroundPosition = point.x + "% " + point.y + "%";
    spots.forEach((spot, i) => spot.setAttribute("aria-expanded", String(i === index)));
  }
  function closePoint() {
    card.hidden = true;
    spots.forEach(spot => spot.setAttribute("aria-expanded", "false"));
    if (active !== null) spots[active].focus({preventScroll: true});
    active = null;
  }
  spots.forEach((spot, index) => {
    spot.addEventListener("pointerenter", event => { if (event.pointerType === "mouse") showPoint(index); });
    spot.addEventListener("click", () => showPoint(index));
  });
  $("#close-detail").addEventListener("click", closePoint);
  addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (!card.hidden) closePoint();
      magnify = false; lens.hidden = true; toggle.setAttribute("aria-pressed", "false");
    }
  });
  toggle.addEventListener("click", () => {
    magnify = !magnify; toggle.setAttribute("aria-pressed", String(magnify));
    if (!magnify) lens.hidden = true;
  });
  frame.addEventListener("pointermove", event => {
    if (!magnify || event.target.closest(".hotspot")) { lens.hidden = true; return; }
    const rect = frame.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    lens.hidden = false;
    lens.style.left = x + "px"; lens.style.top = y + "px";
    lens.style.backgroundImage = "url(" + art.getAttribute("src") + ")";
    lens.style.backgroundSize = (rect.width * 2.5) + "px " + (rect.height * 2.5) + "px";
    lens.style.backgroundPosition = (90 - x * 2.5) + "px " + (90 - y * 2.5) + "px";
  });
  frame.addEventListener("pointerleave", () => { lens.hidden = true; });
  $("#show-overview").addEventListener("click", () => {
    const overview = $("#overview");
    overview.hidden = !overview.hidden;
    if (!overview.hidden) overview.scrollIntoView({behavior: reduced ? "instant" : "smooth", block: "nearest"});
  });
})();
