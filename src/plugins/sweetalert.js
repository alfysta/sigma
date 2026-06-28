import Swal from 'sweetalert2'

// 🎨 Palette Warna Premium
const colors = {
    primary: '#4F46E5',
    success: '#059669',
    error: '#DC2626',
    warning: '#D97706',
    info: '#4F46E5',
}

const customClass = {
    popup: 'swal2-popup-glass',
    title: 'swal2-title-premium',
    htmlContainer: 'swal2-html-premium',
    confirmButton: 'swal2-confirm-premium',
    cancelButton: 'swal2-cancel-premium',
}

const swalPremium = Swal.mixin({
    heightAuto: false,
    scrollbarPadding: false,
    background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    color: '#F8FAFC',
    backdrop: 'rgba(0, 0, 0, 0.6)',
    customClass: { ...customClass },
})

export const useSwal = () => {
    return {

        // ═══════════════════════════════════════════
        // SUKSES PREMIUM
        // ═══════════════════════════════════════════
        successPremium: (title, text = '') => {
            return Swal.fire({
                html: `
          <div style="text-align:center;">
            <div style="position:relative;width:90px;height:90px;margin:0 auto 1.5rem;">
              <div style="position:absolute;inset:-6px;border-radius:50%;border:2px solid rgba(16,185,129,0.15);animation:swalRingPulse 2s ease-in-out infinite;"></div>
              <div style="position:absolute;inset:-3px;border-radius:50%;border:2px solid rgba(16,185,129,0.25);animation:swalRingPulse 2s ease-in-out 0.3s infinite;"></div>
              <div style="position:relative;width:78px;height:78px;border-radius:50%;background:linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.1));border:2px solid rgba(16,185,129,0.5);display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:2rem;color:#10b981;filter:drop-shadow(0 0 12px rgba(16,185,129,0.6));">
                ✅
              </div>
            </div>
            <h2 style="color:#fbbf24;font-family:'Plus Jakarta Sans',sans-serif;font-size:1.5rem;font-weight:800;letter-spacing:0.5px;margin-bottom:0.5rem;text-shadow:0 0 20px rgba(251,191,36,0.3);">${title}</h2>
            ${text ? `<p style="color:#d1d5db;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;font-weight:500;margin-bottom:0.5rem;">${text}</p>` : ''}
            <div style="width:80px;height:3px;margin:1rem auto 0;border-radius:10px;background:linear-gradient(90deg,transparent,#10b981,#34d399,#10b981,transparent);"></div>
          </div>
        `,
                showConfirmButton: true,
                confirmButtonText: 'OK',
                background: 'linear-gradient(135deg, #0f0720 0%, #1a0a2e 50%, #0f0720 100%)',
                customClass: {
                    popup: 'swal-premium-popup-success',
                    confirmButton: 'swal-premium-confirm-success',
                },
                buttonsStyling: false,
                heightAuto: false,
                scrollbarPadding: false,
            })
        },

        // ═══════════════════════════════════════════
        // ERROR PREMIUM
        // ═══════════════════════════════════════════
        errorPremium: (title, text = '') => {
            return Swal.fire({
                html: `
          <div style="text-align:center;">
            <div style="position:relative;width:90px;height:90px;margin:0 auto 1.5rem;">
              <div style="position:absolute;inset:-6px;border-radius:50%;border:2px solid rgba(239,68,68,0.15);animation:swalRingPulse 2s ease-in-out infinite;"></div>
              <div style="position:relative;width:78px;height:78px;border-radius:50%;background:linear-gradient(135deg,rgba(239,68,68,0.2),rgba(185,28,28,0.1));border:2px solid rgba(239,68,68,0.5);display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:2.5rem;color:#ef4444;filter:drop-shadow(0 0 12px rgba(239,68,68,0.6));">
                ❌
              </div>
            </div>
            <h2 style="color:#fbbf24;font-family:'Plus Jakarta Sans',sans-serif;font-size:1.5rem;font-weight:800;letter-spacing:0.5px;margin-bottom:0.5rem;">${title}</h2>
            ${text ? `<p style="color:#d1d5db;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;font-weight:500;">${text}</p>` : ''}
          </div>
        `,
                showConfirmButton: true,
                confirmButtonText: 'OK',
                background: 'linear-gradient(135deg, #0f0720 0%, #1a0a2e 50%, #0f0720 100%)',
                customClass: {
                    popup: 'swal-premium-popup-error',
                    confirmButton: 'swal-premium-confirm-error',
                },
                buttonsStyling: false,
                heightAuto: false,
                scrollbarPadding: false,
            })
        },

        // ═══════════════════════════════════════════
        // WARNING PREMIUM
        // ═══════════════════════════════════════════
        warningPremium: (title, text = '') => {
            return Swal.fire({
                html: `
          <div style="text-align:center;">
            <div style="position:relative;width:90px;height:90px;margin:0 auto 1.5rem;">
              <div style="position:relative;width:78px;height:78px;border-radius:50%;background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(217,119,6,0.1));border:2px solid rgba(245,158,11,0.5);display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:2rem;color:#f59e0b;filter:drop-shadow(0 0 12px rgba(245,158,11,0.6));">
                ⚠️
              </div>
            </div>
            <h2 style="color:#fbbf24;font-family:'Plus Jakarta Sans',sans-serif;font-size:1.5rem;font-weight:800;">${title}</h2>
            ${text ? `<p style="color:#d1d5db;font-size:0.9rem;">${text}</p>` : ''}
          </div>
        `,
                showConfirmButton: true,
                confirmButtonText: 'OK',
                background: 'linear-gradient(135deg, #0f0720 0%, #1a0a2e 50%, #0f0720 100%)',
                customClass: {
                    popup: 'swal-premium-popup-warning',
                    confirmButton: 'swal-premium-confirm-warning',
                },
                buttonsStyling: false,
                heightAuto: false,
                scrollbarPadding: false,
            })
        },

        // ═══════════════════════════════════════════
        // KONFIRMASI HAPUS
        // ═══════════════════════════════════════════
        confirmDelete: async () => {
            const result = await swalPremium.fire({
                title: 'Konfirmasi Hapus',
                html: `
          <div style="text-align:center;">
            <p style="font-size:0.9rem; color:#94A3B8; line-height:1.6; margin:0;">
              Data yang dihapus <span style="color:#F59E0B; font-weight:600;">tidak dapat dikembalikan</span>.
            </p>
          </div>
        `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#DC2626',
                cancelButtonColor: '#475569',
                reverseButtons: true,
                focusCancel: true,
                customClass: {
                    ...customClass,
                    confirmButton: 'swal2-confirm-premium swal2-confirm-delete',
                    cancelButton: 'swal2-cancel-premium swal2-cancel-delete',
                    popup: 'swal2-popup-glass swal2-popup-delete',
                },
            })
            return result.isConfirmed
        },

        // ═══════════════════════════════════════════
        // LOADING
        // ═══════════════════════════════════════════
        loading: (title = 'Memproses...') => {
            swalPremium.fire({
                title: `
          <div style="display:flex;align-items:center;gap:12px;justify-content:center;">
            <div class="swal2-loading-spinner"></div>
            <span style="font-weight:500;font-family:'Plus Jakarta Sans',sans-serif;">${title}</span>
          </div>
        `,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                customClass: { popup: 'swal2-popup-glass' },
            })
        },

        closeLoading: () => Swal.close(),
    }
}
