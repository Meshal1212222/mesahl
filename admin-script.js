// Check authentication
(function checkAuth() {
    const session = localStorage.getItem('adminSession');
    if (!session) {
        window.location.href = 'admin-login.html';
        return;
    }

    const data = JSON.parse(session);
    const loginTime = new Date(data.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

    if (hoursDiff >= 24) {
        localStorage.removeItem('adminSession');
        window.location.href = 'admin-login.html';
        return;
    }

    // Display user info
    document.getElementById('userName').textContent = data.name;
    const roleMap = {
        'admin': 'مدير النظام',
        'supervisor': 'مشرف',
        'reports': 'إدارة التقارير',
        'quality': 'مراقبة الجودة'
    };
    document.getElementById('userRole').textContent = roleMap[data.role] || data.role;
})();

// Initialize data from index.html (get default data)
let libraryData = {
    responses: [],
    procedures: [],
    teamRoles: [
        {
            name: 'يزيد (Yazeed)',
            role: 'مسؤول عن التقرير اليومي للمبيعات، إعداد تقارير الأداء، متابعة معدلات التحويل، تحليل البيانات اليومية'
        },
        {
            name: 'عبدالعزيز (Abdulaziz)',
            role: 'مراقبة ومتابعة التقارير من هنوف ويزيد، اتخاذ الإجراءات ورفعها للمدير المباشر للاعتماد، إرسال الإجراءات المعتمدة للموارد البشرية، مسؤول عن تقرير المكالمات اليومي'
        },
        {
            name: 'إبراهيم (Ibrahim)',
            role: 'دعم العملاء عبر المحادثة فقط - ممنوع منعاً باتاً الرد خارج النصوص المحددة في المكتبة'
        },
        {
            name: 'مصطفى (Mostafa)',
            role: 'دعم العملاء عبر المحادثة فقط - ممنوع منعاً باتاً الرد خارج النصوص المحددة في المكتبة'
        },
        {
            name: 'هنوف (Hanouf)',
            role: 'مراقبة وسماع جودة المكالمات حسب شروط الأداء، تقارير جودة المحادثات، مراقبة الأداء اليومي، فحص العقارات اليومي'
        }
    ]
};

// Load saved data or use defaults
function loadData() {
    const saved = localStorage.getItem('libraryData');
    if (saved) {
        libraryData = JSON.parse(saved);
        // إذا كانت البيانات القديمة أقل من 38 رد، نحدث البيانات
        if (!libraryData.responses || libraryData.responses.length < 38) {
            libraryData.responses = getDefaultResponses();
            libraryData.procedures = getDefaultProcedures();
            saveData();
        }
    } else {
        // Initialize with default data
        libraryData.responses = getDefaultResponses();
        libraryData.procedures = getDefaultProcedures();
        saveData();
    }
    updateStats();
}

function saveData() {
    localStorage.setItem('libraryData', JSON.stringify(libraryData));
    updateStats();
}

function updateStats() {
    document.getElementById('totalResponses').textContent = libraryData.responses.length;
    document.getElementById('totalProcedures').textContent = libraryData.procedures.length;
}

// Log activity
function logActivity(action) {
    const session = JSON.parse(localStorage.getItem('adminSession'));
    const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    activityLog.unshift({
        user: session.name,
        action: action,
        timestamp: new Date().toISOString()
    });
    // Keep only last 100 activities
    if (activityLog.length > 100) activityLog.length = 100;
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
    loadRecentActivity();
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');

    // Load section data
    if (sectionId === 'responses') loadResponsesTable();
    if (sectionId === 'procedures') loadProceduresManagement();
    if (sectionId === 'reports') loadReports();
    if (sectionId === 'team') loadTeamManagement();
    if (sectionId === 'activity') loadActivityLog();
    if (sectionId === 'stats') loadStatistics();
}

// Dashboard
function loadRecentActivity() {
    const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    const html = activityLog.slice(0, 5).map(activity => `
        <div class="activity-item">
            <div class="activity-user">${activity.user}</div>
            <div>${activity.action}</div>
            <div class="activity-time">${new Date(activity.timestamp).toLocaleString('ar-SA')}</div>
        </div>
    `).join('');
    document.getElementById('recentActivity').innerHTML = html || '<p>لا توجد نشاطات حديثة</p>';
}

// Responses Management
function loadResponsesTable() {
    const tbody = document.querySelector('#responsesTable tbody');
    tbody.innerHTML = libraryData.responses.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.title}</td>
            <td>${r.category}</td>
            <td>${r.priority || 'medium'}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editResponse(${r.id})">✏️ تعديل</button>
                <button class="action-btn btn-delete" onclick="deleteResponse(${r.id})">🗑️ حذف</button>
            </td>
        </tr>
    `).join('');
}

function filterResponses() {
    const search = document.getElementById('searchResponses').value.toLowerCase();
    const tbody = document.querySelector('#responsesTable tbody');
    const filtered = libraryData.responses.filter(r =>
        r.title.toLowerCase().includes(search) ||
        r.problem.toLowerCase().includes(search) ||
        r.response.toLowerCase().includes(search)
    );
    tbody.innerHTML = filtered.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.title}</td>
            <td>${r.category}</td>
            <td>${r.priority || 'medium'}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editResponse(${r.id})">✏️ تعديل</button>
                <button class="action-btn btn-delete" onclick="deleteResponse(${r.id})">🗑️ حذف</button>
            </td>
        </tr>
    `).join('');
}

function showAddResponseModal() {
    document.getElementById('responseModalTitle').textContent = 'إضافة رد جديد';
    document.getElementById('responseForm').reset();
    document.getElementById('responseId').value = '';
    document.getElementById('responseModal').classList.add('show');
}

function editResponse(id) {
    const response = libraryData.responses.find(r => r.id === id);
    if (!response) return;

    document.getElementById('responseModalTitle').textContent = 'تعديل الرد';
    document.getElementById('responseId').value = response.id;
    document.getElementById('responseTitle').value = response.title;
    document.getElementById('responseCategory').value = response.category;
    document.getElementById('responseProblem').value = response.problem;
    document.getElementById('responseText').value = response.response;
    document.getElementById('responsePriority').value = response.priority || 'medium';
    document.getElementById('responseTags').value = response.tags.join('، ');
    document.getElementById('responseNote').value = response.note || '';
    document.getElementById('responseModal').classList.add('show');
}

function closeResponseModal() {
    document.getElementById('responseModal').classList.remove('show');
}

function saveResponse(event) {
    event.preventDefault();

    const id = document.getElementById('responseId').value;
    const newResponse = {
        id: id ? parseInt(id) : Date.now(),
        category: document.getElementById('responseCategory').value,
        title: document.getElementById('responseTitle').value,
        problem: document.getElementById('responseProblem').value,
        response: document.getElementById('responseText').value,
        priority: document.getElementById('responsePriority').value,
        tags: document.getElementById('responseTags').value.split('،').map(t => t.trim()),
        note: document.getElementById('responseNote').value
    };

    if (id) {
        const index = libraryData.responses.findIndex(r => r.id === parseInt(id));
        libraryData.responses[index] = newResponse;
        logActivity(`تم تعديل الرد: ${newResponse.title}`);
    } else {
        libraryData.responses.push(newResponse);
        logActivity(`تم إضافة رد جديد: ${newResponse.title}`);
    }

    saveData();
    closeResponseModal();
    loadResponsesTable();
    alert('تم الحفظ بنجاح!');
}

function deleteResponse(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الرد؟')) return;

    const response = libraryData.responses.find(r => r.id === id);
    libraryData.responses = libraryData.responses.filter(r => r.id !== id);
    saveData();
    loadResponsesTable();
    logActivity(`تم حذف الرد: ${response.title}`);
    alert('تم الحذف بنجاح!');
}

// Procedures Management
function loadProceduresManagement() {
    const html = libraryData.procedures.map((proc, idx) => `
        <div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h3>${proc.title}</h3>
            <ul>
                ${proc.steps.map(step => `<li>${step}</li>`).join('')}
            </ul>
            <div style="margin-top: 1rem;">
                <button class="action-btn btn-edit" onclick="editProcedure(${idx})">✏️ تعديل</button>
                <button class="action-btn btn-delete" onclick="deleteProcedure(${idx})">🗑️ حذف</button>
            </div>
        </div>
    `).join('');
    document.getElementById('proceduresManagement').innerHTML = html || '<p>لا توجد إجراءات</p>';
}

function showAddProcedureModal() {
    const title = prompt('عنوان الإجراء:');
    if (!title) return;

    const steps = [];
    while (true) {
        const step = prompt('أضف خطوة (اضغط Cancel للإنهاء):');
        if (!step) break;
        steps.push(step);
    }

    if (steps.length === 0) {
        alert('يجب إضافة خطوة واحدة على الأقل!');
        return;
    }

    libraryData.procedures.push({ title, steps });
    saveData();
    loadProceduresManagement();
    logActivity(`تم إضافة إجراء جديد: ${title}`);
}

function deleteProcedure(index) {
    if (!confirm('هل أنت متأكد من حذف هذا الإجراء؟')) return;
    const proc = libraryData.procedures[index];
    libraryData.procedures.splice(index, 1);
    saveData();
    loadProceduresManagement();
    logActivity(`تم حذف الإجراء: ${proc.title}`);
}

// Team Management
function loadTeamManagement() {
    const html = libraryData.teamRoles.map((member, idx) => `
        <div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h3>${member.name}</h3>
            <p>${member.role}</p>
            <div style="margin-top: 1rem;">
                <button class="action-btn btn-edit" onclick="editTeamMember(${idx})">✏️ تعديل</button>
                <button class="action-btn btn-delete" onclick="deleteTeamMember(${idx})">🗑️ حذف</button>
            </div>
        </div>
    `).join('');
    document.getElementById('teamManagement').innerHTML = html;
}

function showAddTeamModal() {
    const name = prompt('اسم العضو:');
    if (!name) return;
    const role = prompt('الدور والمسؤوليات:');
    if (!role) return;

    libraryData.teamRoles.push({ name, role });
    saveData();
    loadTeamManagement();
    logActivity(`تم إضافة عضو جديد: ${name}`);
}

function deleteTeamMember(index) {
    if (!confirm('هل أنت متأكد من حذف هذا العضو؟')) return;
    const member = libraryData.teamRoles[index];
    libraryData.teamRoles.splice(index, 1);
    saveData();
    loadTeamManagement();
    logActivity(`تم حذف العضو: ${member.name}`);
}

// Activity Log
function loadActivityLog() {
    const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    const html = activityLog.map(activity => `
        <div class="activity-item">
            <div class="activity-user">${activity.user}</div>
            <div>${activity.action}</div>
            <div class="activity-time">${new Date(activity.timestamp).toLocaleString('ar-SA')}</div>
        </div>
    `).join('');
    document.getElementById('activityLog').innerHTML = html || '<p>لا توجد نشاطات</p>';
}

function clearActivityLog() {
    if (!confirm('هل أنت متأكد من مسح سجل النشاطات؟')) return;
    localStorage.setItem('activityLog', '[]');
    loadActivityLog();
}

// Statistics
function loadStatistics() {
    const categories = {};
    libraryData.responses.forEach(r => {
        categories[r.category] = (categories[r.category] || 0) + 1;
    });

    const html = Object.keys(categories).map(cat => `
        <div style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
            <strong>${cat}</strong>: ${categories[cat]} ردود
        </div>
    `).join('');
    document.getElementById('categoryStats').innerHTML = html;

    document.getElementById('usageStats').innerHTML = `
        <p><strong>إجمالي الردود:</strong> ${libraryData.responses.length}</p>
        <p><strong>إجمالي الإجراءات:</strong> ${libraryData.procedures.length}</p>
        <p><strong>أعضاء الفريق:</strong> ${libraryData.teamRoles.length}</p>
    `;
}

// Export/Import
function exportAllData() {
    const data = {
        responses: libraryData.responses,
        procedures: libraryData.procedures,
        teamRoles: libraryData.teamRoles,
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `library-data-${Date.now()}.json`;
    a.click();
    logActivity('تم تصدير البيانات');
}

function exportResponses() {
    const blob = new Blob([JSON.stringify(libraryData.responses, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `responses-${Date.now()}.json`;
    a.click();
    logActivity('تم تصدير الردود');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (confirm('هل تريد استبدال البيانات الحالية؟')) {
                libraryData = data;
                saveData();
                alert('تم استيراد البيانات بنجاح!');
                logActivity('تم استيراد بيانات جديدة');
                location.reload();
            }
        } catch (error) {
            alert('خطأ في قراءة الملف!');
        }
    };
    reader.readAsText(file);
}

function backupData() {
    exportAllData();
    alert('تم إنشاء نسخة احتياطية!');
}

function resetAllData() {
    if (!confirm('هل أنت متأكد من إعادة تعيين جميع البيانات؟ سيتم حذف كل شيء!')) return;
    if (!confirm('تحذير أخير! هذا الإجراء لا يمكن التراجع عنه!')) return;

    localStorage.removeItem('libraryData');
    libraryData.responses = getDefaultResponses();
    libraryData.procedures = getDefaultProcedures();
    saveData();
    alert('تم إعادة تعيين البيانات!');
    logActivity('تم إعادة تعيين جميع البيانات');
    location.reload();
}

// Settings
function changePassword(event) {
    event.preventDefault();
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (newPass !== confirm) {
        alert('كلمات المرور غير متطابقة!');
        return;
    }

    // Verify current password
    const session = JSON.parse(localStorage.getItem('adminSession'));
    const users = JSON.parse(localStorage.getItem('adminUsers') || '{}');
    const user = users[session.username];

    if (user && user.password !== current) {
        alert('كلمة المرور الحالية غير صحيحة!');
        return;
    }

    // Update password
    users[session.username] = { ...user, password: newPass };
    localStorage.setItem('adminUsers', JSON.stringify(users));
    alert('تم تغيير كلمة المرور بنجاح!');
    logActivity('تم تغيير كلمة المرور');
    event.target.reset();
}

// Logout
function logout() {
    if (!confirm('هل تريد تسجيل الخروج؟')) return;
    logActivity('تسجيل خروج');
    localStorage.removeItem('adminSession');
    window.location.href = 'admin-login.html';
}

// Default Data
function getDefaultResponses() {
    // Return all 38 responses from admin-data.js
    return ALL_RESPONSES;
}

function getDefaultProcedures() {
    // Return all 12 procedures from admin-data.js
    return ALL_PROCEDURES;
}

// ==================== REPORTS MANAGEMENT ====================

function loadReports(filter = 'all') {
    const reports = JSON.parse(localStorage.getItem('customerReports') || '[]');
    const container = document.getElementById('reportsManagement');

    // Update pending count
    const pendingCount = reports.filter(r => r.status === 'pending').length;
    document.getElementById('pendingReportsCount').textContent = pendingCount > 0 ? `${pendingCount} بلاغ جديد` : '';

    let filteredReports = reports;
    if (filter !== 'all') {
        filteredReports = reports.filter(r => r.status === filter);
    }

    if (filteredReports.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666; padding:2rem;">لا توجد بلاغات</p>';
        return;
    }

    container.innerHTML = filteredReports.map(report => `
        <div class="report-card">
            <div class="report-header">
                <div>
                    <span class="status-badge status-${report.status}">
                        ${report.status === 'pending' ? 'جديد' :
                          report.status === 'in_progress' ? 'قيد المعالجة' : 'تم الحل'}
                    </span>
                </div>
                <div class="report-meta">
                    <strong>${report.employeeName || 'موظف'}</strong> • ${report.date}
                </div>
            </div>

            <div class="report-content">
                <h4 style="color: var(--primary-purple); margin-bottom:0.5rem;">📋 ${report.category || 'بلاغ عام'}</h4>
                <p style="margin-bottom:0.5rem;"><strong>الموضوع:</strong> ${report.subject}</p>
                <p style="line-height:1.8;">${report.message}</p>
                ${report.customerInfo ? `
                    <div style="margin-top:1rem; padding:0.8rem; background:#f0f0f0; border-radius:5px;">
                        <strong>معلومات العميل:</strong><br>
                        ${report.customerInfo}
                    </div>
                ` : ''}
            </div>

            ${report.response ? `
                <div class="report-response">
                    <strong>✅ رد المشرف:</strong><br>
                    ${report.response}
                </div>
            ` : ''}

            <div class="report-actions">
                ${report.status !== 'in_progress' ? `
                    <button class="btn btn-primary" onclick="updateReportStatus('${report.id}', 'in_progress')">
                        🔄 بدء المعالجة
                    </button>
                ` : ''}
                ${report.status !== 'resolved' ? `
                    <button class="btn btn-success" onclick="showReportResponseModal('${report.id}')">
                        ✅ حل البلاغ
                    </button>
                ` : ''}
                <button class="btn btn-warning" onclick="deleteReport('${report.id}')">
                    🗑️ حذف
                </button>
            </div>
        </div>
    `).join('');
}

function filterReportsByStatus(status) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    loadReports(status);
}

function updateReportStatus(reportId, newStatus) {
    const reports = JSON.parse(localStorage.getItem('customerReports') || '[]');
    const report = reports.find(r => r.id === reportId);

    if (report) {
        report.status = newStatus;
        localStorage.setItem('customerReports', JSON.stringify(reports));

        const statusText = newStatus === 'in_progress' ? 'قيد المعالجة' :
                          newStatus === 'resolved' ? 'تم الحل' : 'جديد';
        logActivity(`تغيير حالة البلاغ "${report.subject}" إلى: ${statusText}`);

        loadReports();
    }
}

function showReportResponseModal(reportId) {
    const response = prompt('أدخل الرد على البلاغ:');

    if (response && response.trim()) {
        const reports = JSON.parse(localStorage.getItem('customerReports') || '[]');
        const report = reports.find(r => r.id === reportId);

        if (report) {
            report.response = response.trim();
            report.status = 'resolved';
            report.resolvedDate = new Date().toLocaleString('ar-SA');
            localStorage.setItem('customerReports', JSON.stringify(reports));

            logActivity(`تم حل البلاغ: "${report.subject}"`);
            loadReports();
            alert('✅ تم حل البلاغ وإرسال الرد');
        }
    }
}

function deleteReport(reportId) {
    if (confirm('هل أنت متأكد من حذف هذا البلاغ؟')) {
        let reports = JSON.parse(localStorage.getItem('customerReports') || '[]');
        reports = reports.filter(r => r.id !== reportId);
        localStorage.setItem('customerReports', JSON.stringify(reports));

        logActivity('حذف بلاغ');
        loadReports();
    }
}

// ==================== TEAM MANAGEMENT ====================

function loadTeamManagement() {
    const team = libraryData.team;
    const container = document.getElementById('teamManagement');

    container.innerHTML = `
        <div style="overflow-x: auto;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>الدور</th>
                        <th>القسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>الهاتف</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${team.map(member => `
                        <tr>
                            <td><strong>${member.name}</strong></td>
                            <td>${member.role}</td>
                            <td>${member.department || '-'}</td>
                            <td>${member.email || '-'}</td>
                            <td>${member.phone || '-'}</td>
                            <td>
                                <span class="status-badge ${member.active ? 'status-resolved' : 'status-pending'}">
                                    ${member.active ? 'نشط' : 'غير نشط'}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-primary" style="padding:0.3rem 0.8rem; font-size:0.85rem;"
                                        onclick="editTeamMember('${member.id}')">تعديل</button>
                                <button class="btn btn-warning" style="padding:0.3rem 0.8rem; font-size:0.85rem;"
                                        onclick="toggleTeamMemberStatus('${member.id}')">
                                    ${member.active ? 'تعطيل' : 'تفعيل'}
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function showAddTeamModal() {
    const name = prompt('اسم العضو:');
    if (!name) return;

    const role = prompt('الدور (مشرف / موظف دعم / مسؤول جودة):');
    if (!role) return;

    const department = prompt('القسم:');
    const email = prompt('البريد الإلكتروني:');
    const phone = prompt('رقم الهاتف:');

    const newMember = {
        id: 'member_' + Date.now(),
        name: name.trim(),
        role: role.trim(),
        department: department?.trim() || '',
        email: email?.trim() || '',
        phone: phone?.trim() || '',
        active: true
    };

    libraryData.team.push(newMember);
    saveData();
    loadTeamManagement();
    logActivity(`إضافة عضو جديد: ${newMember.name}`);
    alert('✅ تم إضافة العضو بنجاح');
}

function editTeamMember(memberId) {
    const member = libraryData.team.find(m => m.id === memberId);
    if (!member) return;

    const name = prompt('اسم العضو:', member.name);
    if (name === null) return;

    const role = prompt('الدور:', member.role);
    if (role === null) return;

    const department = prompt('القسم:', member.department);
    const email = prompt('البريد الإلكتروني:', member.email);
    const phone = prompt('رقم الهاتف:', member.phone);

    member.name = name.trim();
    member.role = role.trim();
    member.department = department?.trim() || '';
    member.email = email?.trim() || '';
    member.phone = phone?.trim() || '';

    saveData();
    loadTeamManagement();
    logActivity(`تعديل بيانات: ${member.name}`);
    alert('✅ تم تحديث البيانات');
}

function toggleTeamMemberStatus(memberId) {
    const member = libraryData.team.find(m => m.id === memberId);
    if (!member) return;

    member.active = !member.active;
    saveData();
    loadTeamManagement();
    logActivity(`${member.active ? 'تفعيل' : 'تعطيل'} العضو: ${member.name}`);
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadData();
    loadRecentActivity();

    // Load reports if on reports page
    if (document.getElementById('reportsManagement')) {
        loadReports();
    }

    // Load team if on team page
    if (document.getElementById('teamManagement')) {
        loadTeamManagement();
    }
});
