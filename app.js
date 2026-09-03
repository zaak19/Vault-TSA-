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

});

// Utilitaires pour brancher sur un vrai backend plus tard :
// - tel:+33600000000  -> ouvre l'application d'appel du téléphone
// - https://wa.me/33600000000 -> ouvre WhatsApp directement sur la conversation
