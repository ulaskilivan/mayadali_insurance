document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navbar = document.querySelector(".navbar");
  const drawer = document.getElementById("mobileDrawer");
  const drawerOverlay = document.getElementById("mobileDrawerOverlay");
  const openBtn = document.getElementById("mobileMenuToggle");
  const closeBtn = document.getElementById("mobileMenuClose");

  const openDrawer = () => {
    if (!drawer || !drawerOverlay) return;
    drawer.classList.add("open");
    drawerOverlay.classList.add("open");
    body.classList.add("no-scroll");
  };

  const closeDrawer = () => {
    if (!drawer || !drawerOverlay) return;
    drawer.classList.remove("open");
    drawerOverlay.classList.remove("open");
    body.classList.remove("no-scroll");
  };

  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);

  const submenuParents = document.querySelectorAll(".drawer-parent");
  submenuParents.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const submenu = targetId ? document.getElementById(targetId) : null;
      if (!submenu) return;
      submenu.classList.toggle("open");
    });
  });

  const drawerLinks = document.querySelectorAll(".mobile-drawer a");
  drawerLinks.forEach((link) => link.addEventListener("click", closeDrawer));

  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    }, { threshold: 0.15 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const counters = document.querySelectorAll(".counter");
  const animateCounter = (el) => {
    const target = Number(el.getAttribute("data-target") || 0);
    const step = Math.max(1, Math.ceil(target / 80));
    let value = 0;
    const tick = () => {
      value += step;
      if (value >= target) {
        el.textContent = String(target);
        return;
      }
      el.textContent = String(value);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 12) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  const isDesktop = window.matchMedia("(min-width: 992px)").matches;
  if (isDesktop) {
    const navDropdowns = document.querySelectorAll(".navbar .dropdown");
    const closeDropdown = (dropdownEl) => {
      const menuEl = dropdownEl.querySelector(".dropdown-menu");
      const toggleEl = dropdownEl.querySelector(".dropdown-toggle");
      dropdownEl.classList.remove("show");
      if (menuEl) menuEl.classList.remove("show");
      if (toggleEl) toggleEl.setAttribute("aria-expanded", "false");
    };

    const closeAllDropdowns = () => {
      navDropdowns.forEach((dropdownEl) => closeDropdown(dropdownEl));
    };

    navDropdowns.forEach((dropdownEl) => {
      const menuEl = dropdownEl.querySelector(".dropdown-menu");
      const toggleEl = dropdownEl.querySelector(".dropdown-toggle");
      if (!toggleEl || !menuEl) return;

      // Desktop'ta click ile sabit acik kalmayi engelle.
      toggleEl.removeAttribute("data-bs-toggle");
      toggleEl.addEventListener("click", (event) => {
        event.preventDefault();
      });

      dropdownEl.addEventListener("mouseenter", () => {
        closeAllDropdowns();
        dropdownEl.classList.add("show");
        menuEl.classList.add("show");
        toggleEl.setAttribute("aria-expanded", "true");
      });

      dropdownEl.addEventListener("mouseleave", () => {
        closeDropdown(dropdownEl);
      });
    });

    if (navbar) {
      navbar.addEventListener("mouseleave", closeAllDropdowns);
    }
  }

  const assistantOutcomes = {
    trafik: {
      title: "Zorunlu Trafik Sigortası",
      reason: "Aracınızda yasal zorunluluğu tamamlamak ve karşı tarafın hasar riskini güvenceye almak istiyorsunuz.",
      href: "trafik.html"
    },
    kasko: {
      title: "Kasko Sigortası",
      reason: "Kendi aracınızı çarpma, çalınma, yanma ve doğal afetlere karşı korumak istiyorsunuz.",
      href: "kasko.html"
    },
    dask: {
      title: "DASK",
      reason: "Ev sahibisiniz ve önceliğiniz zorunlu deprem teminatını hızlıca tamamlamak.",
      href: "dask.html"
    },
    konutDask: {
      title: "Konut Sigortası + DASK",
      reason: "Evinizi depremin yanında yangın, hırsızlık ve eşya risklerine karşı tam korumak istiyorsunuz.",
      href: "konut.html"
    },
    konutEsya: {
      title: "Konut Sigortası (Eşya Teminatlı)",
      reason: "Kiracı olarak eşyalarınızı hırsızlık, yangın ve su hasarlarına karşı güvenceye almak istiyorsunuz.",
      href: "konut.html"
    },
    tss: {
      title: "Tamamlayıcı Sağlık Sigortası (TSS)",
      reason: "SGK güvenceniz var ve özel hastanelerde fark ücretini minimumda tutmak istiyorsunuz.",
      href: "tamamlayici-saglik.html"
    },
    oss: {
      title: "Özel Sağlık Sigortası (ÖSS)",
      reason: "SGK'dan bağımsız, daha geniş hastane ağı ve yüksek limitli sağlık güvencesi arıyorsunuz.",
      href: "ozel-saglik-sigortasi.html"
    },
    yabanci: {
      title: "Yabancı Sağlık Sigortası",
      reason: "İkamet izni sürecinde yasal şartları karşılayan ve Türkiye'de sağlık erişimini destekleyen poliçeye ihtiyacınız var.",
      href: "yabanci-saglik-sigortasi.html"
    },
    seyahat: {
      title: "Seyahat Sağlık Sigortası",
      reason: "Yurt dışı seyahatinizde vize süreci ve acil sağlık riskleri için koruma istiyorsunuz.",
      href: "seyahat-sigortasi.html"
    },
    hekim: {
      title: "Hekim Sorumluluk Sigortası",
      reason: "Mesleki uygulamalar sırasında oluşabilecek tazminat ve yargılama risklerine karşı yasal koruma istiyorsunuz.",
      href: "diger-sigortalar.html#hekim-sorumluluk"
    },
    isyeri: {
      title: "İş Yeri Paket Sigortası",
      reason: "İş yerinizdeki bina, demirbaş ve stokları yangın, hırsızlık ve benzeri risklere karşı korumak istiyorsunuz.",
      href: "isyeri-sigortasi.html"
    },
    allRisk: {
      title: "All Risk (İnşaat) Sigortası",
      reason: "Devam eden inşaat projenizde doğal afet, hasar ve üçüncü şahıs sorumluluklarını güvenceye almak istiyorsunuz.",
      href: "diger-sigortalar.html#all-risk"
    },
    bes: {
      title: "Bireysel Emeklilik Sistemi (BES)",
      reason: "Uzun vadeli birikim hedefiniz var ve devlet katkısından yararlanmak istiyorsunuz.",
      href: "axa-bireysel-emeklilik.html"
    },
    hayat: {
      title: "Hayat Sigortası",
      reason: "Vefat riskine karşı ailenizin finansal güvenliğini ve borç yönetimini güvenceye almak istiyorsunuz.",
      href: "diger-sigortalar.html#hayat-sigortasi"
    },
    ferdiKaza: {
      title: "Ferdi Kaza Sigortası",
      reason: "Daha uygun bütçeyle kaza kaynaklı vefat veya sakatlık riskine karşı tazminat güvencesi arıyorsunuz.",
      href: "diger-sigortalar.html#ferdi-kaza"
    }
  };

  const assistantNodes = {
    root: {
      question: "Öncelikle, neyi korumak istiyorsunuz?",
      options: [
        { label: "Aracımı", hint: "Trafik, kasko ve araç hasar riskleri", icon: "fa-solid fa-car-side", next: "vehicle" },
        { label: "Evimi / Eşyamı", hint: "Deprem, yangın, hırsızlık ve eşya koruması", icon: "fa-solid fa-house", next: "home" },
        { label: "Sağlığımı", hint: "Yurt içi, yabancı sağlık ve seyahat teminatları", icon: "fa-solid fa-heart-pulse", next: "health" },
        { label: "İşimi / Mesleğimi", hint: "Mesleki ve ticari faaliyet riskleri", icon: "fa-solid fa-briefcase", next: "business" },
        { label: "Geleceğimi / Ailemi", hint: "Birikim, vefat ve kaza güvencesi", icon: "fa-solid fa-piggy-bank", next: "future" }
      ]
    },
    vehicle: {
      question: "Aracınız için önceliğiniz nedir?",
      options: [
        { label: "Sadece yasal zorunluluk olsun", hint: "Polis çevirmesinde ceza yemeyeyim, karşı tarafın masrafı karşılansın", icon: "fa-solid fa-file-shield", result: "trafik" },
        { label: "Kendi aracım da korunsun", hint: "Çarpma, çalınma, yanma veya sel gibi risklere karşı", icon: "fa-solid fa-car-burst", result: "kasko" }
      ]
    },
    home: {
      question: "Oturduğunuz evdeki durumunuz nedir?",
      options: [
        { label: "Ev sahibiyim", hint: "Mülkümü ve eşyalarımı korumak istiyorum", icon: "fa-solid fa-key", next: "homeOwnerDetail" },
        { label: "Kiracıyım", hint: "Eşyalarımı güvence altına almak istiyorum", icon: "fa-solid fa-house-user", result: "konutEsya" }
      ]
    },
    homeOwnerDetail: {
      question: "Ev sahibi olarak hangi koruma seviyesini istiyorsunuz?",
      options: [
        { label: "Sadece zorunlu deprem", hint: "Yasal DASK poliçesi yeterli", icon: "fa-solid fa-house-crack", result: "dask" },
        { label: "Tam koruma", hint: "Eşyalar + yangın + deprem dahil geniş kapsam", icon: "fa-solid fa-shield-halved", result: "konutDask" }
      ]
    },
    health: {
      question: "Bu sigortayı kimin için ve nerede kullanacaksınız?",
      options: [
        { label: "Kendim / Ailem için (Yurt İçi)", hint: "Türkiye içinde özel hastane erişimi", icon: "fa-solid fa-user-group", next: "healthSgk" },
        { label: "Yabancı misafir için", hint: "Türkiye'de ikamet izni başvurusu için", icon: "fa-solid fa-passport", result: "yabanci" },
        { label: "Seyahat için", hint: "Yurt dışı çıkışım var", icon: "fa-solid fa-plane-departure", result: "seyahat" }
      ]
    },
    healthSgk: {
      question: "Aktif bir SGK güvenceniz var mı?",
      options: [
        { label: "Evet, var", hint: "Fiyat/performans odaklı çözüm istiyorum", icon: "fa-solid fa-circle-check", result: "tss" },
        { label: "Hayır, yok / en üst limit olsun", hint: "SGK'dan bağımsız geniş kapsam istiyorum", icon: "fa-solid fa-star", result: "oss" }
      ]
    },
    business: {
      question: "Hangi alanda faaliyet gösteriyorsunuz?",
      options: [
        { label: "Hekim / Diş Hekimiyim", hint: "Mesleki hatalara karşı zorunlu poliçe", icon: "fa-solid fa-user-doctor", result: "hekim" },
        { label: "İş yeri sahibiyim", hint: "Dukkan/ofis ve malları korumak istiyorum", icon: "fa-solid fa-shop", result: "isyeri" },
        { label: "Müteahhit / İnşaat firmasıyım", hint: "Devam eden projelerde risk güvencesi", icon: "fa-solid fa-helmet-safety", result: "allRisk" }
      ]
    },
    future: {
      question: "Finansal hedefiniz tam olarak nedir?",
      options: [
        { label: "Birikim yapmak", hint: "Emeklilikte rahat etmek, devlet katkısı almak", icon: "fa-solid fa-coins", result: "bes" },
        { label: "Ailemi korumak", hint: "Vefat durumunda sevdiklerime toplu güvence kalsın", icon: "fa-solid fa-users", result: "hayat" },
        { label: "Kaza güvencesi", hint: "Düşük bütçeyle kaza tazminatı almak", icon: "fa-solid fa-user-injured", result: "ferdiKaza" }
      ]
    }
  };

  const assistantStartMap = {
    vehicle: "vehicle",
    home: "home",
    health: "health",
    future: "future"
  };

  const assistantHtml = `
    <button type="button" id="assistantStickyButton" class="assistant-sticky-btn" aria-label="Akıllı Sigorta Asistanı">
      <i class="fa-solid fa-robot"></i>
      <span class="assistant-sticky-text">Kararsız mı kaldınız? Yardım edelim</span>
    </button>
    <div id="assistantModal" class="assistant-modal" aria-hidden="true">
      <div class="assistant-modal-card" role="dialog" aria-modal="true" aria-labelledby="assistantModalTitle">
        <div class="assistant-modal-header">
          <div>
            <h2 id="assistantModalTitle" class="h5 fw-bold mb-1">30 Saniyede İhtiyacınızı Bulalım</h2>
            <p class="mb-0 text-muted small">Birkaç kısa soruyla size en uygun ürünü belirleyelim.</p>
          </div>
          <button type="button" id="assistantCloseButton" class="btn btn-sm btn-outline-secondary" aria-label="Kapat"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="assistant-progress-wrap">
          <div class="assistant-progress-track">
            <div id="assistantProgressBar" class="assistant-progress-bar"></div>
          </div>
          <span id="assistantProgressText" class="assistant-progress-text">Adım 1/3</span>
        </div>
        <div id="assistantQuestionArea" class="assistant-question-area"></div>
        <div class="assistant-modal-footer">
          <button type="button" id="assistantBackButton" class="btn btn-outline-secondary btn-sm">Geri</button>
          <button type="button" id="assistantRestartButton" class="btn btn-outline-danger btn-sm">Baştan</button>
        </div>
      </div>
    </div>
  `;

  body.insertAdjacentHTML("beforeend", assistantHtml);

  const assistantModal = document.getElementById("assistantModal");
  const assistantQuestionArea = document.getElementById("assistantQuestionArea");
  const assistantProgressBar = document.getElementById("assistantProgressBar");
  const assistantProgressText = document.getElementById("assistantProgressText");
  const assistantStickyButton = document.getElementById("assistantStickyButton");
  const assistantCloseButton = document.getElementById("assistantCloseButton");
  const assistantBackButton = document.getElementById("assistantBackButton");
  const assistantRestartButton = document.getElementById("assistantRestartButton");
  const quickAssistantButtons = document.querySelectorAll("[data-assistant-start]");

  const assistantState = {
    currentNode: "root",
    history: []
  };

  const openAssistant = (startNode) => {
    assistantState.history = [];
    assistantState.currentNode = assistantStartMap[startNode] || "root";
    renderAssistantNode();
    assistantModal.classList.add("show");
    assistantModal.setAttribute("aria-hidden", "false");
    body.classList.add("no-scroll");
  };

  const closeAssistant = () => {
    assistantModal.classList.remove("show");
    assistantModal.setAttribute("aria-hidden", "true");
    body.classList.remove("no-scroll");
  };

  const setProgress = () => {
    const rawStep = assistantState.history.length + 1;
    const step = Math.min(3, rawStep);
    const percent = (step / 3) * 100;
    assistantProgressBar.style.width = `${percent}%`;
    assistantProgressText.textContent = `Adım ${step}/3`;
  };

  const renderResult = (resultKey) => {
    const result = assistantOutcomes[resultKey];
    if (!result) return;
    assistantQuestionArea.innerHTML = `
      <div class="assistant-result-card">
        <div class="assistant-result-badge"><i class="fa-solid fa-circle-check me-2"></i>Sonucunuz hazır</div>
        <h3 class="h5 fw-bold mt-2">Sizin için en uygun ürün: ${result.title}</h3>
        <p class="text-muted mb-3"><strong>Neden bu ürün?</strong> ${result.reason}</p>
        <a href="${result.href}" class="btn btn-danger rounded-pill px-4 mb-2">Ürün Hakkında Bilgi Al</a>
      </div>
    `;
    setProgress();
    assistantBackButton.disabled = assistantState.history.length === 0;
  };

  const renderAssistantNode = () => {
    const node = assistantNodes[assistantState.currentNode];
    if (!node) return;

    const optionCards = node.options.map((option, idx) => `
      <button type="button" class="assistant-option-card" data-option-index="${idx}">
        <span class="assistant-option-icon"><i class="${option.icon}"></i></span>
        <span class="assistant-option-text">
          <strong>${option.label}</strong>
          <small>${option.hint}</small>
        </span>
        <i class="fa-solid fa-chevron-right assistant-option-arrow"></i>
      </button>
    `).join("");

    assistantQuestionArea.innerHTML = `
      <div class="assistant-question-card">
        <h3 class="h6 fw-bold mb-3">${node.question}</h3>
        <div class="assistant-option-list">${optionCards}</div>
      </div>
    `;

    assistantQuestionArea.querySelectorAll("[data-option-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const optionIndex = Number(button.getAttribute("data-option-index"));
        const selectedOption = node.options[optionIndex];
        assistantState.history.push(assistantState.currentNode);
        if (selectedOption.result) {
          renderResult(selectedOption.result);
          return;
        }
        assistantState.currentNode = selectedOption.next;
        renderAssistantNode();
      });
    });

    setProgress();
    assistantBackButton.disabled = assistantState.history.length === 0;
  };

  if (assistantStickyButton) {
    assistantStickyButton.addEventListener("click", () => openAssistant());
  }
  if (assistantCloseButton) {
    assistantCloseButton.addEventListener("click", closeAssistant);
  }
  if (assistantModal) {
    assistantModal.addEventListener("click", (event) => {
      if (event.target === assistantModal) closeAssistant();
    });
  }
  if (assistantBackButton) {
    assistantBackButton.addEventListener("click", () => {
      if (!assistantState.history.length) return;
      assistantState.currentNode = assistantState.history.pop();
      renderAssistantNode();
    });
  }
  if (assistantRestartButton) {
    assistantRestartButton.addEventListener("click", () => openAssistant());
  }

  quickAssistantButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const startNode = button.getAttribute("data-assistant-start");
      openAssistant(startNode || undefined);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && assistantModal.classList.contains("show")) {
      closeAssistant();
    }
  });
});
