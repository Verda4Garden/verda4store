/**
 * Payment Processing System
 * This script handles payment processing and instructions
 */

// Payment account details
const PAYMENT_ACCOUNTS = {
    bri: {
        accountNumber: "0082-01-168996-50-9",
        accountName: "muhammad walid fahril basri",
        bankName: "Bank BRI",
        appDeepLink: "bri://home" // Deep link untuk membuka aplikasi BRI Mobile
    },
    gopay: {
        phoneNumber: "085651205765",
        accountName: "Verda4Garden",
        appDeepLink: "gojek://home" // Deep link untuk membuka aplikasi Gojek
    },
    shopeepay: {
        phoneNumber: "085651205765",
        accountName: "Verda4Garden",
        appDeepLink: "shopee://home" // Deep link untuk membuka aplikasi Shopee
    },
    dana: {
        phoneNumber: "085651205765",
        accountName: "Verda4Garden",
        appDeepLink: "dana://home" // Deep link untuk membuka aplikasi DANA
    }
};

/**
 * Generate payment instructions based on payment method
 * @param {String} paymentMethod - Payment method (bri, gopay, shopeepay, dana)
 * @param {Number} amount - Payment amount
 * @param {String} invoiceId - Invoice ID for reference
 * @returns {Object} - Payment instructions
 */
function generatePaymentInstructions(paymentMethod, amount, invoiceId) {
    const formattedAmount = amount.toLocaleString('id-ID');
    let instructions = {
        title: `Instruksi Pembayaran ${getPaymentMethodName(paymentMethod)}`,
        steps: [],
        accountDetails: {},
        notes: `Silakan transfer tepat Rp ${formattedAmount} dan sertakan ID Invoice: ${invoiceId} pada keterangan transfer.`
    };
    
    switch(paymentMethod) {
        case 'bri':
            instructions.accountDetails = {
                accountNumber: PAYMENT_ACCOUNTS.bri.accountNumber,
                accountName: PAYMENT_ACCOUNTS.bri.accountName,
                bankName: PAYMENT_ACCOUNTS.bri.bankName
            };
            instructions.steps = [
                "Buka aplikasi BRI Mobile atau Internet Banking BRI",
                "Pilih menu Transfer",
                "Pilih Transfer ke Rekening BRI",
                `Masukkan nomor rekening: ${PAYMENT_ACCOUNTS.bri.accountNumber}`,
                `Masukkan nominal: Rp ${formattedAmount}`,
                `Masukkan keterangan: ${invoiceId}`,
                "Konfirmasi dan selesaikan pembayaran",
                "Simpan bukti pembayaran"
            ];
            break;
            
        case 'gopay':
            instructions.accountDetails = {
                phoneNumber: PAYMENT_ACCOUNTS.gopay.phoneNumber,
                accountName: PAYMENT_ACCOUNTS.gopay.accountName
            };
            instructions.steps = [
                "Buka aplikasi Gojek",
                "Pilih menu Pay",
                "Pilih 'Ke Nomor HP'",
                `Masukkan nomor: ${PAYMENT_ACCOUNTS.gopay.phoneNumber}`,
                `Masukkan nominal: Rp ${formattedAmount}`,
                `Masukkan keterangan: ${invoiceId}`,
                "Konfirmasi dan selesaikan pembayaran",
                "Simpan bukti pembayaran"
            ];
            break;
            
        case 'shopeepay':
            instructions.accountDetails = {
                phoneNumber: PAYMENT_ACCOUNTS.shopeepay.phoneNumber,
                accountName: PAYMENT_ACCOUNTS.shopeepay.accountName
            };
            instructions.steps = [
                "Buka aplikasi Shopee",
                "Pilih menu ShopeePay",
                "Pilih 'Kirim'",
                `Masukkan nomor: ${PAYMENT_ACCOUNTS.shopeepay.phoneNumber}`,
                `Masukkan nominal: Rp ${formattedAmount}`,
                `Masukkan keterangan: ${invoiceId}`,
                "Konfirmasi dan selesaikan pembayaran",
                "Simpan bukti pembayaran"
            ];
            break;
            
        case 'dana':
            instructions.accountDetails = {
                phoneNumber: PAYMENT_ACCOUNTS.dana.phoneNumber,
                accountName: PAYMENT_ACCOUNTS.dana.accountName
            };
            instructions.steps = [
                "Buka aplikasi DANA",
                "Pilih menu 'Kirim'",
                "Pilih 'Kirim ke Teman'",
                `Masukkan nomor: ${PAYMENT_ACCOUNTS.dana.phoneNumber}`,
                `Masukkan nominal: Rp ${formattedAmount}`,
                `Masukkan keterangan: ${invoiceId}`,
                "Konfirmasi dan selesaikan pembayaran",
                "Simpan bukti pembayaran"
            ];
            break;
            
        default:
            instructions.title = "Metode Pembayaran Tidak Dikenal";
            instructions.steps = ["Silakan pilih metode pembayaran yang valid."];
            break;
    }
    
    return instructions;
}

/**
 * Get payment method display name
 * @param {String} paymentMethod - Payment method code
 * @returns {String} - Display name
 */
function getPaymentMethodName(paymentMethod) {
    const names = {
        'bri': 'Bank BRI',
        'gopay': 'GoPay',
        'shopeepay': 'ShopeePay',
        'dana': 'DANA'
    };
    
    return names[paymentMethod] || paymentMethod;
}

/**
 * Generate HTML for payment instructions modal
 * @param {Object} instructions - Payment instructions
 * @param {Object} orderData - Order data
 * @returns {String} - HTML content
 */
function generatePaymentInstructionsHTML(instructions, orderData) {
    const paymentMethod = orderData.paymentMethodCode || 'unknown';
    const appDeepLink = PAYMENT_ACCOUNTS[paymentMethod]?.appDeepLink || '#';
    
    let html = `
        <div class="payment-instructions-container">
            <div class="payment-header">
                <h3>${instructions.title}</h3>
                <p class="payment-amount">Total: Rp ${orderData.total.toLocaleString('id-ID')}</p>
            </div>
            
            <div class="open-app-button-container">
                <a href="${appDeepLink}" class="open-app-button">
                    <i class="fas fa-external-link-alt"></i> Buka Aplikasi ${getPaymentMethodName(paymentMethod)}
                </a>
            </div>
            
            <div class="account-details">
                <h4>Detail Akun</h4>
                <div class="account-info">
    `;
    
    // Add account details based on payment method
    if (orderData.paymentMethod.toLowerCase().includes('bri')) {
        html += `
            <div class="account-row">
                <span>Bank:</span>
                <span>${instructions.accountDetails.bankName}</span>
            </div>
            <div class="account-row">
                <span>Nomor Rekening:</span>
                <span class="highlight-info">${instructions.accountDetails.accountNumber}</span>
            </div>
            <div class="account-row">
                <span>Atas Nama:</span>
                <span>${instructions.accountDetails.accountName}</span>
            </div>
        `;
    } else {
        html += `
            <div class="account-row">
                <span>Nomor:</span>
                <span class="highlight-info">${instructions.accountDetails.phoneNumber}</span>
            </div>
            <div class="account-row">
                <span>Atas Nama:</span>
                <span>${instructions.accountDetails.accountName}</span>
            </div>
        `;
    }
    
    html += `
                </div>
            </div>
            
            <div class="payment-steps">
                <h4>Langkah Pembayaran</h4>
                <ol>
    `;
    
    // Add payment steps
    instructions.steps.forEach(step => {
        html += `<li>${step}</li>`;
    });
    
    html += `
                </ol>
            </div>
            
            <div class="payment-notes">
                <p><i class="fas fa-info-circle"></i> ${instructions.notes}</p>
            </div>
            
            <div class="payment-confirmation">
                <p>Setelah melakukan pembayaran, silakan kirim bukti pembayaran ke:</p>
                <div class="confirmation-options">
                    <a href="https://wa.me/6285651205765?text=Konfirmasi%20pembayaran%20untuk%20Invoice%20${orderData.invoiceId}" target="_blank" class="confirmation-button">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                    <a href="https://t.me/verda4garden" target="_blank" class="confirmation-button">
                        <i class="fab fa-telegram"></i> Telegram
                    </a>
                    <button onclick="confirmPayment('${orderData.invoiceId}')" class="confirmation-button primary">
                        <i class="fas fa-check-circle"></i> Konfirmasi Pembayaran
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return html;
}

/**
 * Confirm payment and send notification to Telegram
 * @param {String} invoiceId - Invoice ID
 */
function confirmPayment(invoiceId) {
    // Get transaction data from localStorage
    const transactionData = JSON.parse(localStorage.getItem(invoiceId));
    
    if (!transactionData) {
        alert('Data transaksi tidak ditemukan!');
        return;
    }
    
    // Prepare payment confirmation data
    const paymentData = {
        invoiceId: transactionData.invoiceId,
        buyerName: transactionData.buyerName,
        paymentMethod: transactionData.paymentMethod,
        amount: transactionData.total,
        paymentDate: new Date().toLocaleString('id-ID'),
        notes: 'Pembayaran dikonfirmasi oleh pelanggan'
    };
    
    // Send payment confirmation to Telegram
    sendPaymentConfirmationToTelegram(paymentData)
        .then(success => {
            if (success) {
                // Show success message
                alert('Konfirmasi pembayaran berhasil dikirim!');
                
                // Update transaction status in localStorage
                transactionData.status = 'paid';
                transactionData.paymentDate = paymentData.paymentDate;
                localStorage.setItem(invoiceId, JSON.stringify(transactionData));
                
                // Disable the confirmation button
                const confirmButton = document.querySelector('.confirmation-button.primary');
                if (confirmButton) {
                    confirmButton.disabled = true;
                    confirmButton.innerHTML = '<i class="fas fa-check"></i> Pembayaran Terkonfirmasi';
                    confirmButton.style.backgroundColor = '#4CAF50';
                }
            } else {
                alert('Gagal mengirim konfirmasi pembayaran. Silakan coba lagi.');
            }
        });
}

// Add CSS for the open app button
const paymentProcessorStyles = document.createElement('style');
paymentProcessorStyles.textContent = `
    .open-app-button-container {
        text-align: center;
        margin: 15px 0;
    }
    
    .open-app-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 20px;
        background-color: #4CAF50;
        color: white;
        border-radius: 8px;
        font-weight: bold;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .open-app-button:hover {
        background-color: #45a049;
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    
    .confirmation-button.primary {
        background-color: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
    }
    
    .confirmation-button.primary:hover {
        background-color: #d43a50;
    }
    
    .confirmation-button.primary:disabled {
        background-color: #4CAF50;
        cursor: not-allowed;
        opacity: 0.8;
    }
`;
document.head.appendChild(paymentProcessorStyles);

// Export functions
window.generatePaymentInstructions = generatePaymentInstructions;
window.generatePaymentInstructionsHTML = generatePaymentInstructionsHTML;
window.confirmPayment = confirmPayment;
