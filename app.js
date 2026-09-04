// ============================================
// Vault TSA — interactions communes
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // Interrupteurs (toggle on/off)
  document.querySelectorAll('.switch').forEach(sw => {
    sw.addEventListener('click', () => sw.classList.toggle('on'));
  });

  // Badges de catégorie (sélection unique)
  document.querySelectorAll('.chip-group').forEach(group => {
    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
      });
    });
  });

  // Curseur de prix synchronisé avec le champ de saisie
  const priceRange = document.getElementById('price-range');
  const priceInput = document.getElementById('price-input');
  if (priceRange && priceInput) {
    priceRange.addEventListener('input', () => {
      priceInput.value = Number(priceRange.value).toLocaleString('fr-FR');
    });
    priceInput.addEventListener('change', () => {
      const val = parseInt(priceInput.value.replace(/\D/g, ''), 10) || 0;
      const clamped = Math.min(200000, Math.max(50, val));
      priceRange.value = clamped;
      priceInput.value = clamped.toLocaleString('fr-FR');
    });
  }

  // Case CGU : active le bouton "Continuer" seulement si cochée
  const termsCheck = document.getElementById('terms-check');
  const termsContinue = document.getElementById('terms-continue');
  if (termsCheck && termsContinue) {
    termsContinue.classList.add('btn-disabled');
    termsContinue.setAttribute('aria-disabled', 'true');
    termsCheck.addEventListener('change', () => {
      if (termsCheck.checked) {
        termsContinue.classList.remove('btn-disabled');
        termsContinue.removeAttribute('aria-disabled');
      } else {
        termsContinue.classList.add('btn-disabled');
        termsContinue.setAttribute('aria-disabled', 'true');
      }
    });
  }

  // Empêche la navigation si le bouton est désactivé
  document.querySelectorAll('.btn-disabled').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('btn-disabled')) e.preventDefault();
    });
  });

  // Sélecteur de genre (figurine) sur l'écran profil
  document.querySelectorAll('.gender-select .gender-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.gender-select .gender-option').forEach(o => {
        o.classList.remove('selected');
      });
      opt.classList.add('selected');
    });
  });

  // Aperçu des photos vendeur (3 emplacements)
  document.querySelectorAll('.seller-photo-slot input[type="file"]').forEach(input => {
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      const slot = input.closest('.seller-photo-slot');
      if (!file || !slot) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        let img = slot.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          slot.appendChild(img);
        }
        img.src = e.target.result;
        slot.classList.add('filled');
      };
      reader.readAsDataURL(file);
    });
  });

  // ---- Sélecteur de pays (fenêtre coulissante) ----
  if (typeof VAULT_COUNTRIES !== 'undefined') {
    initCountryPickers();
  }

});

function initCountryPickers() {
  // Construit une seule fenêtre partagée, réutilisée pour chaque sélecteur
  const overlay = document.createElement('div');
  overlay.className = 'country-picker-overlay';
  overlay.innerHTML = `
    <div class="country-picker-sheet">
      <div class="country-picker-header">
        <p>Choisir un pays</p>
        <button type="button" class="country-picker-close" aria-label="Fermer">&times;</button>
      </div>
      <input type="text" class="country-picker-search" placeholder="Rechercher un pays...">
      <div class="country-picker-list"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const searchInput = overlay.querySelector('.country-picker-search');
  const listEl = overlay.querySelector('.country-picker-list');
  const closeBtn = overlay.querySelector('.country-picker-close');
  let activeTrigger = null;
  let activeMode = 'residence'; // 'residence' affiche le nom du pays, 'dial' affiche l'indicatif

  function renderList(filter) {
    const q = (filter || '').trim().toLowerCase();
    const items = VAULT_COUNTRIES.filter(c => c.name.toLowerCase().includes(q));
    listEl.innerHTML = items.map(c => `
      <div class="country-picker-item" data-code="${c.code}">
        <span class="flag">${vaultFlagEmoji(c.code)}</span>
        <span class="name">${c.name}</span>
        <span class="dial">${c.dial}</span>
      </div>
    `).join('');
  }

  function openPicker(trigger, mode) {
    activeTrigger = trigger;
    activeMode = mode;
    searchInput.value = '';
    renderList('');
    overlay.classList.add('open');
    setTimeout(() => searchInput.focus(), 50);
  }

  function closePicker() {
    overlay.classList.remove('open');
    activeTrigger = null;
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePicker();
  });
  closeBtn.addEventListener('click', closePicker);
  searchInput.addEventListener('input', () => renderList(searchInput.value));

  listEl.addEventListener('click', (e) => {
    const item = e.target.closest('.country-picker-item');
    if (!item || !activeTrigger) return;
    const country = VAULT_COUNTRIES.find(c => c.code === item.dataset.code);
    if (!country) return;

    if (activeMode === 'residence') {
      const flagSpan = activeTrigger.querySelector('.picker-flag');
      const nameSpan = activeTrigger.querySelector('.picker-name');
      if (flagSpan) flagSpan.textContent = vaultFlagEmoji(country.code);
      if (nameSpan) nameSpan.textContent = country.name;
      activeTrigger.dataset.countryCode = country.code;
    } else {
      const flagSpan = activeTrigger.querySelector('.picker-flag');
      const dialSpan = activeTrigger.querySelector('.picker-dial');
      if (flagSpan) flagSpan.textContent = vaultFlagEmoji(country.code);
      if (dialSpan) dialSpan.textContent = country.dial;
      activeTrigger.dataset.countryCode = country.code;

      // Répercute l'indicatif sur le champ WhatsApp si l'attribut de liaison est présent
      const linkedId = activeTrigger.dataset.syncTarget;
      if (linkedId) {
        const linkedTrigger = document.getElementById(linkedId);
        if (linkedTrigger) {
          const lFlag = linkedTrigger.querySelector('.picker-flag');
          const lDial = linkedTrigger.querySelector('.picker-dial');
          if (lFlag) lFlag.textContent = vaultFlagEmoji(country.code);
          if (lDial) lDial.textContent = country.dial;
          linkedTrigger.dataset.countryCode = country.code;
        }
      }
    }
    closePicker();
  });

  // Attache les déclencheurs présents sur la page
  document.querySelectorAll('[data-country-picker="residence"]').forEach(trigger => {
    trigger.addEventListener('click', () => openPicker(trigger, 'residence'));
  });
  document.querySelectorAll('[data-country-picker="dial"]').forEach(trigger => {
    trigger.addEventListener('click', () => openPicker(trigger, 'dial'));
  });
}

// Utilitaires pour brancher sur un vrai backend plus tard :
// - tel:+33600000000  -> ouvre l'application d'appel du téléphone
// - https://wa.me/33600000000 -> ouvre WhatsApp directement sur la conversation

// ============================================
// Verrouillage des modifications (1 fois / 3 mois)
// ============================================
// À brancher sur un vrai backend : ici on simule avec localStorage
// pour que le comportement soit démontrable dans ce prototype statique.

const VAULT_EDIT_LOCK_MONTHS = 3;

function vaultNextEditDate(lastEditISO) {
  const d = new Date(lastEditISO);
  d.setMonth(d.getMonth() + VAULT_EDIT_LOCK_MONTHS);
  return d;
}

function vaultFormatDateFR(date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Vérifie si une section est verrouillée, désactive les champs si besoin,
 * et affiche un bandeau d'information avec la date de déverrouillage.
 * @param {string} storageKey - clé localStorage unique pour cette section
 * @param {string} formSelector - sélecteur CSS du conteneur des champs à verrouiller
 * @param {string} bannerContainerSelector - sélecteur où insérer le bandeau d'info
 * @param {string} submitBtnSelector - sélecteur du bouton de validation à désactiver
 */
function applyVaultEditLock(storageKey, formSelector, bannerContainerSelector, submitBtnSelector) {
  const lastEdit = localStorage.getItem(storageKey);
  const bannerContainer = document.querySelector(bannerContainerSelector);
  const formEl = document.querySelector(formSelector);
  const submitBtn = submitBtnSelector ? document.querySelector(submitBtnSelector) : null;

  if (!lastEdit) return; // jamais modifié -> pas de verrou

  const nextDate = vaultNextEditDate(lastEdit);
  const now = new Date();

  if (now < nextDate) {
    // Verrouillé : on désactive les champs et on informe l'utilisateur
    if (formEl) {
      formEl.querySelectorAll('input, textarea, button[type="submit"], .chip, .switch, .country-select, .country-code').forEach(el => {
        el.classList.add('vault-locked');
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.disabled = true;
        else el.style.pointerEvents = 'none';
        el.style.opacity = '0.55';
      });
    }
    if (submitBtn) {
      submitBtn.classList.add('btn-disabled');
      submitBtn.style.opacity = '0.5';
      submitBtn.style.pointerEvents = 'none';
    }
    if (bannerContainer) {
      const banner = document.createElement('div');
      banner.className = 'info-box';
      banner.style.marginBottom = '18px';
      banner.innerHTML = `
        <i class="ti ti-lock" style="font-size:16px; color:var(--blue-deep); margin-top:1px;"></i>
        <p>Ces informations ne sont modifiables qu'une fois tous les 3 mois.
        Prochaine modification possible à partir du <strong>${vaultFormatDateFR(nextDate)}</strong>.</p>
      `;
      bannerContainer.prepend(banner);
    }
  }
}

/** À appeler lorsqu'une modification est validée avec succès, pour démarrer le verrou. */
function vaultRecordEdit(storageKey) {
  localStorage.setItem(storageKey, new Date().toISOString());
}
