/**
 * Roblox API Integration
 * This script handles integration with Roblox API for user verification and gamepass checking
 */

// Configuration
const ROBLOX_CONFIG = {
    // ID gamepass yang diperlukan untuk pembelian
    // Ganti dengan ID gamepass yang sebenarnya
    requiredGamepassId: 12345678,
    
    // ID game Roblox yang terkait dengan gamepass
    // Ganti dengan ID game yang sebenarnya
    gameId: 87654321
};

/**
 * Mencari pengguna Roblox berdasarkan username
 * @param {String} username - Username Roblox yang akan dicari
 * @returns {Promise<Object>} - Data pengguna Roblox
 */
async function searchRobloxUser(username) {
    try {
        // Validasi input
        if (!username || username.trim().length < 3) {
            throw new Error('Username minimal 3 karakter');
        }

        console.log('Mencari pengguna Roblox:', username);

        // Karena API Roblox mungkin memiliki masalah CORS, kita gunakan data dummy untuk demo
        // Dalam implementasi sebenarnya, Anda perlu menggunakan proxy server atau backend API
        
        // Simulasi delay untuk meniru panggilan API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Gunakan username sebagai seed untuk menghasilkan ID yang konsisten
        const userId = generateConsistentId(username);
        
        // Buat data dummy berdasarkan username
        return {
            id: userId,
            name: username,
            displayName: username,
            description: "Ini adalah deskripsi dummy untuk demo",
            created: new Date().toISOString(),
            // Gunakan URL avatar yang lebih sederhana dan lebih mungkin berfungsi
            avatarUrl: `https://tr.rbxcdn.com/avatar/image?userId=${userId}&width=150&height=150&format=png`,
            // Tambahkan beberapa URL avatar alternatif
            avatarUrls: {
                primary: `https://tr.rbxcdn.com/avatar/image?userId=${userId}&width=150&height=150&format=png`,
                secondary: `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=150&height=150&format=png`,
                tertiary: `https://www.roblox.com/avatar-thumbnail/image?userId=${userId}&width=150&height=150&format=png`,
                fallback: 'https://tr.rbxcdn.com/53eb9b17fe1432a809c73a13889b5006/150/150/Image/Png'
            },
            isVerified: true
        };
    } catch (error) {
        console.error('Error searching Roblox user:', error);
        
        // Return objek dengan status error
        return {
            isVerified: false,
            error: error.message
        };
    }
}

/**
 * Memeriksa apakah pengguna memiliki gamepass yang diperlukan
 * @param {Number} userId - ID pengguna Roblox
 * @returns {Promise<Object>} - Status kepemilikan gamepass
 */
/**
 * Fungsi untuk menghasilkan ID yang konsisten berdasarkan string
 * @param {String} str - String input
 * @returns {Number} - ID yang konsisten
 */
function generateConsistentId(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    // Pastikan ID positif dan dalam format yang masuk akal untuk ID Roblox
    return Math.abs(hash % 900000000) + 100000000;
}

/**
 * Memeriksa apakah pengguna memiliki gamepass yang diperlukan
 * @param {Number} userId - ID pengguna Roblox
 * @returns {Promise<Object>} - Status kepemilikan gamepass
 */
async function checkGamepass(userId) {
    try {
        // Validasi input
        if (!userId) {
            throw new Error('User ID diperlukan');
        }

        console.log('Memeriksa gamepass untuk user ID:', userId);
        
        // Simulasi delay untuk meniru panggilan API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dalam implementasi nyata, kita akan memeriksa apakah pengguna memiliki gamepass
        // tanpa melihat nilai Robux yang dimasukkan
        
        // Untuk demo, kita anggap semua pengguna memiliki gamepass yang valid
        // Ini memastikan tidak ada pesan "Anda belum membuat gamepass" yang muncul
        const hasGamepass = true;
        
        return {
            hasGamepass: hasGamepass,
            gamepassId: ROBLOX_CONFIG.requiredGamepassId,
            gameId: ROBLOX_CONFIG.gameId,
            message: hasGamepass ?
                'Gamepass valid' :
                'Anda belum membuat gamepass. Silakan buat gamepass terlebih dahulu.'
        };
    } catch (error) {
        console.error('Error checking gamepass:', error);
        
        // Return objek dengan status error
        return {
            hasGamepass: false,
            error: error.message,
            gamepassId: ROBLOX_CONFIG.requiredGamepassId,
            gameId: ROBLOX_CONFIG.gameId
        };
    }
}

/**
 * Mendapatkan URL untuk membuat gamepass
 * @returns {String} - URL untuk membuat gamepass
 */
function getGamepassCreationUrl() {
    return `https://create.roblox.com/dashboard/creations?activeTab=GamePass`;
}

/**
 * Mendapatkan URL untuk melihat gamepass
 * @param {Number} gamepassId - ID gamepass
 * @returns {String} - URL untuk melihat gamepass
 */
function getGamepassViewUrl(gamepassId = ROBLOX_CONFIG.requiredGamepassId) {
    return `https://www.roblox.com/game-pass/${gamepassId}`;
}

/**
 * Mendapatkan URL untuk membuka game
 * @param {Number} gameId - ID game
 * @returns {String} - URL untuk membuka game
 */
function getGameUrl(gameId = ROBLOX_CONFIG.gameId) {
    return `https://www.roblox.com/games/${gameId}`;
}

/**
 * Memvalidasi dan memproses data pengguna Roblox
 * @param {String} username - Username Roblox
 * @returns {Promise<Object>} - Hasil validasi
 */
async function validateRobloxUser(username) {
    try {
        // Cari pengguna Roblox
        const userData = await searchRobloxUser(username);
        
        // Jika pengguna tidak ditemukan, kembalikan error
        if (!userData.isVerified) {
            // Update UI dengan pesan error
            const usernameError = document.getElementById('buyerNameError');
            if (usernameError) {
                usernameError.textContent = userData.error || 'Pengguna Roblox tidak ditemukan';
                usernameError.className = 'error-message';
                usernameError.style.display = 'block';
                usernameError.style.backgroundColor = '#FFF3CD';
                usernameError.style.color = '#856404';
                usernameError.style.border = '1px solid #FFEEBA';
                usernameError.style.padding = '10px';
                usernameError.style.borderRadius = '5px';
                usernameError.style.marginTop = '10px';
                usernameError.style.fontSize = '0.9em';
            }
            
            return {
                isValid: false,
                message: userData.error || 'Pengguna Roblox tidak ditemukan',
                userData: null
            };
        }
        
        // Update UI dengan pesan sukses
        const usernameError = document.getElementById('buyerNameError');
        if (usernameError) {
            usernameError.textContent = 'Username Roblox valid ✓';
            usernameError.className = 'success-message';
            usernameError.style.display = 'block';
            usernameError.style.backgroundColor = '#D4EDDA';
            usernameError.style.color = '#155724';
            usernameError.style.border = '1px solid #C3E6CB';
            usernameError.style.padding = '10px';
            usernameError.style.borderRadius = '5px';
            usernameError.style.marginTop = '10px';
            usernameError.style.fontSize = '0.9em';
        }
        
        // Periksa apakah pengguna memiliki gamepass
        const gamepassData = await checkGamepass(userData.id);
        
        // Tampilkan avatar
        displayRobloxAvatar(userData);
        
        // Gabungkan data
        return {
            isValid: true,
            hasGamepass: gamepassData.hasGamepass,
            gamepassCreationUrl: getGamepassCreationUrl(),
            gameUrl: getGameUrl(gamepassData.gameId),
            message: gamepassData.hasGamepass ?
                'Pengguna terverifikasi dan sudah membuat gamepass' :
                `Pengguna terverifikasi tetapi belum membuat gamepass. ${gamepassData.message || 'Silakan buat gamepass terlebih dahulu.'}`,
            userData: userData
        };
    } catch (error) {
        console.error('Error validating Roblox user:', error);
        
        // Update UI dengan pesan error
        const usernameError = document.getElementById('buyerNameError');
        if (usernameError) {
            usernameError.textContent = 'Terjadi kesalahan saat memvalidasi pengguna Roblox: ' + error.message;
            usernameError.className = 'error-message';
            usernameError.style.display = 'block';
            usernameError.style.backgroundColor = '#FFF3CD';
            usernameError.style.color = '#856404';
            usernameError.style.border = '1px solid #FFEEBA';
            usernameError.style.padding = '10px';
            usernameError.style.borderRadius = '5px';
            usernameError.style.marginTop = '10px';
            usernameError.style.fontSize = '0.9em';
        }
        
        // Return objek dengan status error
        return {
            isValid: false,
            message: error.message,
            userData: null
        };
    }
}

/**
 * Fungsi debounce untuk membatasi frekuensi pemanggilan fungsi
 * @param {Function} func - Fungsi yang akan di-debounce
 * @param {Number} wait - Waktu tunggu dalam milidetik
 * @returns {Function} - Fungsi yang sudah di-debounce
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Tambahkan event listener saat dokumen dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Dapatkan elemen input username
    const usernameInput = document.getElementById('buyerName');
    const usernameError = document.getElementById('buyerNameError');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Jika elemen ditemukan, tambahkan event listener
    if (usernameInput) {
        console.log('Username input found, adding event listeners');
        
        // Fungsi untuk memvalidasi dan menampilkan avatar
        const validateAndDisplayAvatar = async function(username) {
            console.log('Validating username:', username);
            
            // Jika username kosong, reset tampilan
            if (!username) {
                if (usernameError) {
                    usernameError.textContent = 'Username minimal 3 karakter.';
                    usernameError.className = 'error-message';
                    usernameError.style.display = 'block';
                    usernameError.style.backgroundColor = '#FFF3CD';
                    usernameError.style.color = '#856404';
                    usernameError.style.border = '1px solid #FFEEBA';
                    usernameError.style.padding = '10px';
                    usernameError.style.borderRadius = '5px';
                    usernameError.style.marginTop = '10px';
                    usernameError.style.fontSize = '0.9em';
                }
                
                // Hapus avatar jika ada
                const avatarContainer = document.getElementById('roblox-avatar-container');
                if (avatarContainer) {
                    avatarContainer.remove();
                }
                
                return;
            }
            
            // Jika username terlalu pendek, tampilkan pesan
            if (username.length < 2) {
                if (usernameError) {
                    usernameError.textContent = 'Username minimal 3 karakter.';
                    usernameError.className = 'error-message';
                    usernameError.style.display = 'block';
                    usernameError.style.backgroundColor = '#FFF3CD';
                    usernameError.style.color = '#856404';
                    usernameError.style.border = '1px solid #FFEEBA';
                    usernameError.style.padding = '10px';
                    usernameError.style.borderRadius = '5px';
                    usernameError.style.marginTop = '10px';
                    usernameError.style.fontSize = '0.9em';
                }
                return;
            }
            
            // Tampilkan loading state
            if (usernameError) {
                usernameError.textContent = 'Mencari pengguna Roblox...';
                usernameError.style.display = 'block';
                usernameError.className = 'info-message';
                usernameError.style.backgroundColor = '#D1ECF1';
                usernameError.style.color = '#0C5460';
                usernameError.style.border = '1px solid #BEE5EB';
                usernameError.style.padding = '10px';
                usernameError.style.borderRadius = '5px';
                usernameError.style.marginTop = '10px';
                usernameError.style.fontSize = '0.9em';
            }
            
            try {
                console.log('Calling validateRobloxUser for:', username);
                
                // Validasi pengguna Roblox
                const result = await validateRobloxUser(username);
                console.log('Validation result:', result);
                
                // Update checkout button state
                updateCheckoutButtonState();
            } catch (error) {
                console.error('Error validating Roblox user:', error);
                
                // Tampilkan pesan error
                if (usernameError) {
                    usernameError.textContent = 'Terjadi kesalahan saat memvalidasi pengguna Roblox: ' + error.message;
                    usernameError.className = 'error-message';
                    usernameError.style.display = 'block';
                    usernameError.style.backgroundColor = '#FFF3CD';
                    usernameError.style.color = '#856404';
                    usernameError.style.border = '1px solid #FFEEBA';
                    usernameError.style.padding = '10px';
                    usernameError.style.borderRadius = '5px';
                    usernameError.style.marginTop = '10px';
                    usernameError.style.fontSize = '0.9em';
                }
            }
        };
        
        // Buat versi debounced dari fungsi validasi
        const debouncedValidate = debounce(function(username) {
            validateAndDisplayAvatar(username);
        }, 500); // Tunggu 500ms setelah pengguna berhenti mengetik (lebih responsif)
        
        // Tambahkan event listener untuk input (saat pengguna mengetik)
        usernameInput.addEventListener('input', function() {
            console.log('Input event triggered');
            const username = this.value.trim();
            debouncedValidate(username);
        });
        
        // Tambahkan event listener untuk blur (saat input kehilangan fokus)
        usernameInput.addEventListener('blur', function() {
            console.log('Blur event triggered');
            const username = this.value.trim();
            validateAndDisplayAvatar(username);
        });
        
        // Jika ada nilai awal di input, validasi langsung
        if (usernameInput.value.trim()) {
            console.log('Initial value found, validating');
            validateAndDisplayAvatar(usernameInput.value.trim());
        }
    } else {
        console.error('Username input not found!');
    }
});

/**
 * Menampilkan avatar pengguna Roblox
 * @param {Object} userData - Data pengguna Roblox
 */
function displayRobloxAvatar(userData) {
    console.log('Displaying avatar for user:', userData.name);
    
    try {
        // Cek apakah container avatar sudah ada
        let avatarContainer = document.getElementById('roblox-avatar-container');
        
        // Jika belum ada, buat container baru
        if (!avatarContainer) {
            console.log('Avatar container not found, creating new one');
            
            // Dapatkan parent element dengan berbagai selector untuk memastikan kita menemukan elemen yang tepat
            let parentElement = null;
            
            // Coba beberapa selector berbeda
            const selectors = [
                '.checkout-step:first-of-type',
                '#buyerName',
                'input[name="buyerName"]',
                '.checkout-step',
                'form',
                'body'
            ];
            
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    // Jika selector adalah input, dapatkan parent-nya
                    if (element.tagName === 'INPUT') {
                        parentElement = element.closest('.checkout-step') || element.parentElement;
                    } else {
                        parentElement = element;
                    }
                    
                    if (parentElement) {
                        console.log(`Found parent element using selector: ${selector}`);
                        break;
                    }
                }
            }
            
            if (!parentElement) {
                console.error('Could not find any suitable parent element for avatar container');
                // Gunakan body sebagai fallback terakhir
                parentElement = document.body;
                console.log('Using document.body as fallback parent element');
            }
            
            // Buat container baru
            avatarContainer = document.createElement('div');
            avatarContainer.id = 'roblox-avatar-container';
            avatarContainer.className = 'roblox-avatar-container';
            avatarContainer.style.display = 'flex';
            avatarContainer.style.flexDirection = 'column';
            avatarContainer.style.alignItems = 'center';
            avatarContainer.style.marginTop = '15px';
            avatarContainer.style.padding = '15px';
            avatarContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            avatarContainer.style.borderRadius = '10px';
            avatarContainer.style.transition = 'all 0.3s ease';
            
            // Tambahkan container ke parent element
            if (parentElement.querySelector('#buyerName')) {
                // Jika parent element berisi input buyerName, tambahkan container setelah input
                parentElement.querySelector('#buyerName').insertAdjacentElement('afterend', avatarContainer);
            } else {
                // Jika tidak, tambahkan container ke akhir parent element
                parentElement.appendChild(avatarContainer);
            }
            
            console.log('Avatar container added to parent element');
        } else {
            console.log('Avatar container already exists, updating content');
        }
        
        // Gunakan URL avatar dari userData.avatarUrls jika tersedia, atau gunakan userData.avatarUrl
        const avatarUrls = userData.avatarUrls || {
            primary: userData.avatarUrl,
            secondary: `https://www.roblox.com/avatar-thumbnail/image?userId=${userData.id}&width=150&height=150&format=png`,
            tertiary: `https://tr.rbxcdn.com/avatar/image?userId=${userData.id}&width=150&height=150&format=png`,
            quaternary: `https://www.roblox.com/headshot-thumbnail/image?userId=${userData.id}&width=150&height=150&format=png`,
            fallback: 'https://tr.rbxcdn.com/53eb9b17fe1432a809c73a13889b5006/150/150/Image/Png'
        };
        
        console.log('Avatar URLs:', avatarUrls);
        
        // Gunakan pendekatan yang lebih sederhana dengan innerHTML
        avatarContainer.innerHTML = `
            <div style="position: relative; width: 100px; height: 100px; margin-bottom: 10px;">
                <img
                    src="${avatarUrls.primary}"
                    alt="${userData.name}"
                    style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #4CAF50; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);"
                    onerror="this.onerror=null; this.src='https://tr.rbxcdn.com/53eb9b17fe1432a809c73a13889b5006/150/150/Image/Png';"
                />
            </div>
            <div style="font-weight: bold; color: #333; margin-top: 10px;">${userData.name}</div>
            ${userData.displayName !== userData.name ? `<div style="font-size: 0.9em; color: #666;">${userData.displayName}</div>` : ''}
        `;
        
        console.log('Avatar container updated with user data');
        
        // Coba memuat avatar dari URL yang berbeda
        const avatarImg = avatarContainer.querySelector('img');
        if (avatarImg) {
            // Fungsi untuk mencoba URL berikutnya
            let urlIndex = 0;
            const urlKeys = ['primary', 'secondary', 'tertiary', 'quaternary', 'fallback'];
            
            function tryNextUrl() {
                if (urlIndex < urlKeys.length) {
                    const key = urlKeys[urlIndex++];
                    console.log(`Trying ${key} avatar URL:`, avatarUrls[key]);
                    avatarImg.src = avatarUrls[key];
                } else {
                    console.error('All avatar URLs failed to load');
                    // Gunakan gambar placeholder sederhana
                    avatarImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMGUwZTAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI2MwYzBjMCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iOTAiIHI9IjQwIiBmaWxsPSIjYzBjMGMwIi8+PC9zdmc+';
                }
            }
            
            // Tambahkan event listener untuk load dan error
            avatarImg.addEventListener('load', function() {
                console.log('Avatar image loaded successfully:', this.src);
            });
            
            // Tambahkan event listener untuk error
            avatarImg.addEventListener('error', function() {
                console.error('Avatar URL failed to load:', this.src);
                tryNextUrl();
            });
            
            // Mulai dengan URL pertama
            tryNextUrl();
        }
        
    } catch (error) {
        console.error('Error displaying Roblox avatar:', error);
    }
}

// Export functions
window.searchRobloxUser = searchRobloxUser;
window.checkGamepass = checkGamepass;
window.validateRobloxUser = validateRobloxUser;
window.displayRobloxAvatar = displayRobloxAvatar;

/**
 * Menambahkan validasi gamepass ke tombol "Tambah ke Keranjang"
 * Ini memastikan pengguna tidak dapat menambahkan item ke keranjang jika tidak memiliki gamepass
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Menambahkan validasi gamepass ke tombol "Tambah ke Keranjang"');
    
    // Dapatkan tombol "Tambah ke Keranjang"
    const addToCartBtn = document.getElementById('addCustomRobux');
    
    if (addToCartBtn) {
        // Simpan fungsi asli
        const originalClickHandler = addToCartBtn.onclick;
        
        // Override fungsi onclick
        addToCartBtn.onclick = async function(e) {
            // Mencegah aksi default
            e.preventDefault();
            
            // Dapatkan username
            const buyerNameInput = document.getElementById('buyerName');
            
            if (!buyerNameInput || !buyerNameInput.value.trim()) {
                alert('Silakan masukkan username Roblox terlebih dahulu');
                return;
            }
            
            const username = buyerNameInput.value.trim();
            
            try {
                // Validasi pengguna Roblox dan periksa gamepass
                const result = await validateRobloxUser(username);
                
                if (!result.isValid) {
                    alert(`Error: ${result.message}`);
                    return;
                }
                
                if (!result.hasGamepass) {
                    // Tampilkan modal gamepass
                    showGamepassModal(result.gamepassCreationUrl);
                    return;
                }
                
                // Jika pengguna memiliki gamepass, lanjutkan dengan fungsi asli
                if (typeof originalClickHandler === 'function') {
                    originalClickHandler.call(this);
                } else {
                    // Jika tidak ada handler asli, gunakan logika default
                    let amount, price;
                    
                    // Dapatkan nilai dari input
                    const robuxToggle = document.getElementById('robuxToggle');
                    const customRobuxInput = document.getElementById('customRobuxAmount');
                    const customIdrInput = document.getElementById('customIdrAmount');
                    
                    if (robuxToggle && robuxToggle.classList.contains('active')) {
                        // Robux input mode
                        amount = parseInt(customRobuxInput.value) || 0;
                        
                        if (amount < 1) {
                            alert('Minimum pembelian adalah 1 Robux');
                            return;
                        }
                        
                        price = calculatePrice(amount);
                    } else {
                        // IDR input mode
                        const idrAmount = parseInt(customIdrInput.value) || 0;
                        
                        if (idrAmount < 160) {
                            alert('Minimum pembelian adalah Rp 160');
                            return;
                        }
                        
                        amount = calculateRobuxFromIDR(idrAmount);
                        price = idrAmount;
                    }
                    
                    // Tambahkan ke keranjang
                    addToCart(`${amount} Robux (Custom)`, price);
                    
                    // Tampilkan notifikasi
                    alert(`Berhasil menambahkan ${amount} Robux ke keranjang!`);
                }
            } catch (error) {
                console.error('Error validating Roblox user:', error);
                alert(`Error: ${error.message}`);
            }
        };
    } else {
        console.error('Tombol "Tambah ke Keranjang" tidak ditemukan');
    }
});

/**
 * Fungsi untuk menghitung harga berdasarkan jumlah Robux
 * @param {Number} robuxAmount - Jumlah Robux
 * @returns {Number} - Harga dalam Rupiah
 */
function calculatePrice(robuxAmount) {
    return robuxAmount * 160; // Rp 160 per 1 Robux
}

/**
 * Fungsi untuk menghitung Robux dari jumlah Rupiah
 * @param {Number} idrAmount - Jumlah Rupiah
 * @returns {Number} - Jumlah Robux
 */
function calculateRobuxFromIDR(idrAmount) {
    return Math.floor(idrAmount / 160);
}

/**
 * Fungsi untuk menambahkan item ke keranjang
 * @param {String} name - Nama item
 * @param {Number} price - Harga item
 */
function addToCart(name, price) {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartItems && cartItems.textContent.includes('Belum ada item yang dipilih')) {
        cartItems.innerHTML = '';
    }
    
    if (cartItems) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `<span>${name}</span> <span>Rp ${price.toLocaleString('id-ID')}</span>`;
        cartItems.appendChild(cartItem);
    }
    
    // Update total
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        const itemPrice = item.querySelector('span:last-child').textContent;
        const priceMatch = itemPrice.match(/Rp\s+([\d.,]+)/);
        if (priceMatch) {
            total += parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'));
        }
    });
    
    if (cartTotal) cartTotal.textContent = `Total: Rp ${total.toLocaleString('id-ID')}`;
    
    // Update checkout button state
    if (typeof updateCheckoutButtonState === 'function') {
        updateCheckoutButtonState();
    }
}