// ========== نظام الشركات ==========

// تحميل وعرض الشركات
function loadCompanies() {
    const companies = JSON.parse(localStorage.getItem('wathafni_companies')) || [];
    const container = document.getElementById('companiesList');
    
    if (!container) return; // إذا لم يكن العنصر موجود (مثل صفحة الرئيسية)
    
    container.innerHTML = '';
    
    if (companies.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-building" style="font-size: 50px; color: #6b7280; margin-bottom: 20px;"></i>
                <h3 style="color: #4b5563;">لا توجد شركات مسجلة بعد</h3>
                <p style="color: #9ca3af;">كن أول من يسجل شركته!</p>
                <button class="btn btn-primary" onclick="showRegisterModal('company')">
                    <i class="fas fa-plus"></i> إضافة شركة
                </button>
            </div>
        `;
        return;
    }
    
    companies.forEach(company => {
        // إنشاء النجوم للتقييم
        const fullStars = Math.floor(company.rating);
        const hasHalfStar = company.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        stars += '★'.repeat(fullStars);
        if (hasHalfStar) stars += '½';
        stars += '☆'.repeat(emptyStars);
        
        // نص التقييم
        let ratingText = '';
        if (company.rating >= 4.5) ratingText = 'ممتاز';
        else if (company.rating >= 4) ratingText = 'جيد جداً';
        else if (company.rating >= 3) ratingText = 'جيد';
        else ratingText = 'مقبول';
        
        const card = `
            <div class="company-detail-card" data-id="${company.id}" 
                 data-industry="${company.industry}" 
                 data-rating="${company.rating}"
                 data-city="${company.city || 'بغداد'}">
                <div class="company-header">
                    <div class="company-logo-large">
                        <i class="${company.logo || 'fas fa-building'}"></i>
                    </div>
                    <div class="company-info">
                        <h3>${company.name}</h3>
                        <p>${company.industry}</p>
                        <div class="rating-large" title="تقييم ${company.rating} من 5">
                            ${stars} <span style="color: #6b7280; font-size: 16px;">${company.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="company-stats">
                    <div class="stat">
                        <h4>${company.jobs || 0}</h4>
                        <p>وظيفة شاغرة</p>
                    </div>
                    <div class="stat">
                        <h4>${ratingText}</h4>
                        <p>التقييم العام</p>
                    </div>
                    <div class="stat">
                        <h4>${company.city || 'بغداد'}</h4>
                        <p>المقر الرئيسي</p>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="viewCompany(${company.id})" style="width: 100%;">
                    <i class="fas fa-eye"></i> عرض التفاصيل
                </button>
            </div>
        `;
        
        container.innerHTML += card;
    });
}

// البحث في الشركات
function searchCompanies() {
    const searchTerm = document.getElementById('companySearch').value.toLowerCase();
    const industryFilter = document.getElementById('industryFilter').value;
    const cityFilter = document.getElementById('cityFilter').value;
    const ratingFilter = parseFloat(document.getElementById('ratingFilter').value) || 0;
    
    const cards = document.querySelectorAll('.company-detail-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const companyName = card.querySelector('h3').textContent.toLowerCase();
        const companyIndustry = card.dataset.industry;
        const companyCity = card.dataset.city;
        const companyRating = parseFloat(card.dataset.rating);
        
        let matches = true;
        
        // تطبيق الفلاتر
        if (searchTerm && !companyName.includes(searchTerm)) {
            matches = false;
        }
        
        if (industryFilter && companyIndustry !== industryFilter) {
            matches = false;
        }
        
        if (cityFilter && companyCity !== cityFilter) {
            matches = false;
        }
        
        if (ratingFilter > 0 && companyRating < ratingFilter) {
            matches = false;
        }
        
        if (matches) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // عرض رسالة إذا لم توجد نتائج
    if (visibleCount === 0) {
        document.getElementById('companiesList').innerHTML += `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 50px; color: #6b7280; margin-bottom: 20px;"></i>
                <h3 style="color: #4b5563;">لم نعثر على نتائج</h3>
                <p style="color: #9ca3af;">حاول تغيير كلمات البحث أو الفلاتر</p>
                <button class="btn btn-outline" onclick="resetFilters()">
                    <i class="fas fa-redo"></i> إعادة الضبط
                </button>
            </div>
        `;
    }
}

// إعادة تعيين الفلاتر
function resetFilters() {
    document.getElementById('companySearch').value = '';
    document.getElementById('industryFilter').value = '';
    document.getElementById('cityFilter').value = '';
    document.getElementById('ratingFilter').value = '0';
    
    const cards = document.querySelectorAll('.company-detail-card');
    cards.forEach(card => {
        card.style.display = 'block';
    });
}

// فلاتر خاصة
function filterTopRated() {
    document.getElementById('ratingFilter').value = '4.5';
    searchCompanies();
}

function filterMostJobs() {
    // هنا يمكن إضافة منطق لتصفية الشركات حسب عدد الوظائف
    alert('قريباً: سيتم عرض الشركات ذات الوظائف الأكثر');
}

function filterNewCompanies() {
    alert('قريباً: سيتم عرض الشركات الناشئة');
}

// عرض تفاصيل الشركة
function viewCompany(id) {
    const companies = JSON.parse(localStorage.getItem('wathafni_companies')) || [];
    const company = companies.find(c => c.id === id);
    
    if (company) {
        const modalContent = `
            <div style="text-align: center; padding: 20px;">
                <div class="company-logo-large" style="margin: 0 auto 20px;">
                    <i class="${company.logo}"></i>
                </div>
                <h3 style="color: #1e3a8a; margin-bottom: 10px;">${company.name}</h3>
                <p style="color: #6b7280; margin-bottom: 20px;">${company.industry}</p>
                <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-around; margin-bottom: 15px;">
                        <div>
                            <h4 style="color: #1e3a8a;">${company.jobs || 0}</h4>
                            <p style="color: #6b7280; font-size: 14px;">وظيفة شاغرة</p>
                        </div>
                        <div>
                            <h4 style="color: #1e3a8a;">${company.rating.toFixed(1)}/5</h4>
                            <p style="color: #6b7280; font-size: 14px;">التقييم العام</p>
                        </div>
                    </div>
                    <p style="color: #4b5563;">${company.description || 'شركة عراقية رائدة في مجالها'}</p>
                </div>
                <button class="btn btn-primary" onclick="closeModal(); applyToCompany(${id})" style="width: 100%;">
                    <i class="fas fa-paper-plane"></i> التقديم على وظيفة
                </button>
            </div>
        `;
        
        showCustomModal(modalContent, 'تفاصيل الشركة');
    } else {
        alert('الشركة غير موجودة');
    }
}

function applyToCompany(companyId) {
    alert(`جارٍ توجيهك للتقديم على وظائف الشركة رقم ${companyId}`);
    // هنا يمكن توجيه المستخدم لصفحة التقديم
}

// ========== نظام التسجيل ==========

function showRegisterModal(type) {
    const modal = document.getElementById('registerModal');
    modal.style.display = 'flex';
    switchTab(type);
}

function showCustomModal(content, title = '') {
    // إنشاء نافذة منبثقة مخصصة
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'customModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            ${title ? `<h3>${title}</h3>` : ''}
            ${content}
            <button class="btn btn-text" onclick="closeCustomModal()" style="margin-top: 20px;">
                إغلاق
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // إغلاق عند النقر خارج المحتوى
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCustomModal();
        }
    });
}

function closeCustomModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.remove();
    }
}

function closeModal() {
    const modal = document.getElementById('registerModal');
    modal.style.display = 'none';
}

function switchTab(type) {
    const candidateForm = document.getElementById('candidateForm');
    const companyForm = document.getElementById('companyForm');
    const tabs = document.querySelectorAll('.tab-btn');
    const modalTitle = document.getElementById('modalTitle');
    
    if (type === 'candidate') {
        candidateForm.style.display = 'flex';
        companyForm.style.display = 'none';
        modalTitle.textContent = 'انضم كباحث عن عمل';
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        candidateForm.style.display = 'none';
        companyForm.style.display = 'flex';
        modalTitle.textContent = 'انضم كمسؤول توظيف';
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
}

// تسجيل المستخدم
function registerUser(type) {
    if (type === 'candidate') {
        const name = document.getElementById('candidateName').value.trim();
        const email = document.getElementById('candidateEmail').value.trim();
        const password = document.getElementById('candidatePassword').value;
        const phone = document.getElementById('candidatePhone').value.trim();
        
        if (!name || !email || !password) {
            showAlert('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        if (password.length < 6) {
            showAlert('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        const user = {
            id: Date.now(),
            name,
            email,
            phone,
            type: 'candidate',
            date: new Date().toLocaleDateString('ar-IQ'),
            verified: false
        };
        
        saveUser(user);
        showAlert('تم تسجيل حسابك بنجاح! يمكنك الآن تسجيل الدخول', 'success');
        closeModal();
        resetForm('candidate');
        
    } else {
        const name = document.getElementById('company