// إدارة تسجيل الدخول
class AuthManager {
    constructor() {
        this.setupEventListeners();
        this.checkAuthState();
    }

    setupEventListeners() {
        // زر Google
        document.getElementById('googleLogin').addEventListener('click', () => {
            this.loginWithGoogle();
        });

        // زر إظهار نموذج الإيميل
        document.getElementById('showEmailForm').addEventListener('click', () => {
            this.toggleEmailForm();
        });

        // أزرار الإيميل
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.loginWithEmail();
        });

        document.getElementById('signupBtn').addEventListener('click', () => {
            this.signupWithEmail();
        });
    }

    async loginWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            this.showStatus('جاري تسجيل الدخول...', 'info');
            const result = await auth.signInWithPopup(provider);
            this.handleSuccessfulLogin(result.user);
        } catch (error) {
            this.showStatus('خطأ في تسجيل الدخول: ' + error.message, 'error');
        }
    }

    async loginWithEmail() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            this.showStatus('يرجى إدخال البريد الإلكتروني وكلمة المرور', 'error');
            return;
        }

        try {
            this.showStatus('جاري تسجيل الدخول...', 'info');
            const result = await auth.signInWithEmailAndPassword(email, password);
            this.handleSuccessfulLogin(result.user);
        } catch (error) {
            this.showStatus('خطأ في تسجيل الدخول: ' + error.message, 'error');
        }
    }

    async signupWithEmail() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            this.showStatus('يرجى إدخال البريد الإلكتروني وكلمة المرور', 'error');
            return;
        }

        if (password.length < 6) {
            this.showStatus('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }

        try {
            this.showStatus('جاري إنشاء الحساب...', 'info');
            const result = await auth.createUserWithEmailAndPassword(email, password);
            await this.createUserProfile(result.user);
            this.handleSuccessfulLogin(result.user);
        } catch (error) {
            this.showStatus('خطأ في إنشاء الحساب: ' + error.message, 'error');
        }
    }

    async createUserProfile(user) {
        await db.collection('users').doc(user.uid).set({
            name: user.displayName || 'مستخدم جديد',
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            languages: [],
            progress: {},
            level: 1,
            points: 0
        });
    }

    handleSuccessfulLogin(user) {
        this.showStatus('تم تسجيل الدخول بنجاح! مرحباً ' + (user.displayName || user.email), 'success');
        
        // الانتقال لصفحة Dashboard بعد ثانيتين
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }

    toggleEmailForm() {
        const form = document.getElementById('emailForm');
        form.classList.toggle('hidden');
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('statusMessage');
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type}`;
        statusDiv.classList.remove('hidden');

        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                statusDiv.classList.add('hidden');
            }, 3000);
        }
    }

    checkAuthState() {
        auth.onAuthStateChanged(user => {
            if (user) {
                // المستخدم مسجل دخول
                console.log('المستخدم مسجل دخول:', user.email);
            }
        });
    }
}

// تشغيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});
