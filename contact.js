document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.getElementById("backButton");
  const form = document.getElementById("offerForm");
  const phoneInput = document.getElementById("phone");
  const submitBtn = document.getElementById("submitBtn");
  const submitLabel = submitBtn?.querySelector(".submit-label");
  const spinner = submitBtn?.querySelector(".spinner-border");

  const statusModal = document.getElementById("submitStatusModal");
  const statusIcon = document.getElementById("submitStatusIcon");
  const statusTitle = document.getElementById("submitStatusTitle");
  const statusText = document.getElementById("submitStatusText");
  const statusClose = document.getElementById("submitStatusClose");

  const setSubmitting = (submitting) => {
    if (!submitBtn || !submitLabel || !spinner) return;
    submitBtn.disabled = submitting;
    submitLabel.textContent = submitting ? "Gönderiliyor..." : "Gönder";
    spinner.classList.toggle("d-none", !submitting);
  };

  const showStatus = (type, title, text) => {
    if (!statusModal || !statusIcon || !statusTitle || !statusText) return;
    statusModal.classList.add("show");
    statusModal.setAttribute("aria-hidden", "false");
    statusIcon.className = `submit-status-icon ${type}`;
    statusTitle.textContent = title;
    statusText.textContent = text;

    if (type === "success") {
      statusIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
    } else {
      statusIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    }
  };

  const closeStatus = () => {
    if (!statusModal) return;
    statusModal.classList.remove("show");
    statusModal.setAttribute("aria-hidden", "true");
  };

  statusClose?.addEventListener("click", closeStatus);
  statusModal?.addEventListener("click", (event) => {
    if (event.target === statusModal) closeStatus();
  });

  // Dynamic back button logic
  if (backButton) {
    const referrer = document.referrer;
    const isSameOrigin = referrer && referrer.startsWith(window.location.origin);
    if (isSameOrigin) {
      const previousUrl = new URL(referrer);
      if (previousUrl.pathname !== window.location.pathname) {
        backButton.href = previousUrl.pathname + previousUrl.search + previousUrl.hash;
      }
    }
  }

  const normalizeDigits = (value) => value.replace(/\D/g, "").slice(0, 10);

  const formatPhone = (digits) => {
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 8);
    const p4 = digits.slice(8, 10);
    return [p1, p2, p3, p4].filter(Boolean).join(" ");
  };

  const isValidPhone = (digits) => /^5\d{9}$/.test(digits);
  const productLabels = {
    trafik: "Trafik Sigortasi",
    kasko: "Kasko Sigortasi",
    imm: "Ihtiyari Mali Mesuliyet (IMM)",
    "koltuk-ferdi-kaza": "Koltuk Ferdi Kaza Sigortasi",
    asistans: "Asistans Hizmeti",
    "tamamlayici-saglik": "Tamamlayici Saglik Sigortasi",
    dask: "DASK",
    konut: "Konut Sigortasi",
    isyeri: "Is Yeri Sigortasi",
    seyahat: "Seyahat Sigortasi"
  };

  phoneInput?.addEventListener("input", () => {
    const digits = normalizeDigits(phoneInput.value);
    phoneInput.value = formatPhone(digits);
    if (digits.length > 0 && digits[0] !== "5") {
      phoneInput.setCustomValidity("Telefon numarası 5 ile başlamalıdır.");
    } else if (digits.length > 0 && digits.length < 10) {
      phoneInput.setCustomValidity("Telefon numarası eksik görünüyor.");
    } else if (digits.length === 10 && !isValidPhone(digits)) {
      phoneInput.setCustomValidity("Geçerli bir telefon numarası giriniz.");
    } else {
      phoneInput.setCustomValidity("");
    }
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName")?.value.trim() || "";
    const product = document.getElementById("product")?.value || "";
    const note = document.getElementById("note")?.value.trim() || "";
    const phoneDigits = normalizeDigits(phoneInput?.value || "");

    if (!fullName || !product || !isValidPhone(phoneDigits)) {
      showStatus(
        "error",
        "Bilgileri Kontrol Edin",
        "Lutfen ad-soyad, urun ve telefon alanlarini dogru doldurun."
      );
      return;
    }

    const phone = `+90${phoneDigits}`;
    setSubmitting(true);

    try {
      const productText = productLabels[product] || "Belirtilmedi";
      const noteText = note ? note : "Not eklenmedi";
      const message = [
        "Merhaba, yeni bir teklif talebi olusturmak istiyorum.",
        "",
        `Ad Soyad: ${fullName}`,
        `Ilgilenilen Urun: ${productText}`,
        `Telefon: ${phone}`,
        `Not: ${noteText}`
      ].join("\n");
      const waUrl = `https://wa.me/905353086874?text=${encodeURIComponent(message)}`;

      showStatus(
        "success",
        "WhatsApp Yonlendirmesi",
        "Teklif bilgileriniz hazirlandi. WhatsApp uzerinden mesaj ekranina yonlendiriliyorsunuz."
      );

      setTimeout(() => {
        const popup = window.open(waUrl, "_blank", "noopener,noreferrer");
        if (!popup) {
          window.location.href = waUrl;
        }
      }, 500);

      form.reset();
      if (phoneInput) phoneInput.value = "";
    } catch (error) {
      showStatus(
        "error",
        "Gonderim Basarisiz",
        error.message || "Bir hata olustu. Lutfen tekrar deneyin."
      );
    } finally {
      setSubmitting(false);
    }
  });
});
