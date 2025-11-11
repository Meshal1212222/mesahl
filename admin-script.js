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

    // Professional table view
    container.innerHTML = `
        <div style="overflow-x: auto;">
            <table class="data-table" style="font-size: 0.9rem;">
                <thead>
                    <tr>
                        <th style="min-width: 100px;">رقم البلاغ</th>
                        <th style="min-width: 120px;">الموظف</th>
                        <th style="min-width: 120px;">نوع البلاغ</th>
                        <th style="min-width: 200px;">تفاصيل البلاغ</th>
                        <th style="min-width: 150px;">وقت رفع البلاغ</th>
                        <th style="min-width: 150px;">وقت استقبال البلاغ</th>
                        <th style="min-width: 150px;">وقت حل البلاغ</th>
                        <th style="min-width: 120px;">مستلم البلاغ</th>
                        <th style="min-width: 200px;">ملخص حل البلاغ</th>
                        <th style="min-width: 100px;">الحالة</th>
                        <th style="min-width: 120px;">المراجعة</th>
                        <th style="min-width: 180px;">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredReports.map(report => {
                        const reportNum = report.id.replace('report_', '').substring(0, 8);
                        const timeSpent = calculateTimeSpent(report);

                        return `
                        <tr>
                            <td><strong>#${reportNum}</strong></td>
                            <td>${report.employeeName || '-'}</td>
                            <td><span style="font-size:0.85rem;">📋 ${report.category || '-'}</span></td>
                            <td>
                                <div style="max-width: 300px;">
                                    <strong style="color: var(--primary-purple);">${report.subject}</strong><br>
                                    <span style="font-size:0.85rem; color:#666;">${report.message.substring(0, 80)}${report.message.length > 80 ? '...' : ''}</span>
                                    ${report.customerInfo ? `<br><span style="font-size:0.8rem; color:#888;">👤 ${report.customerInfo.substring(0, 50)}</span>` : ''}
                                    <br><button onclick="viewReportDetails('${report.id}')" style="font-size:0.75rem; margin-top:0.3rem; padding:0.2rem 0.5rem; border:1px solid #ddd; background:white; cursor:pointer; border-radius:4px;">عرض التفاصيل الكاملة</button>
                                </div>
                            </td>
                            <td>${report.submitTime || report.date}</td>
                            <td>${report.receivedTime || '-'}</td>
                            <td>${report.resolvedTime || '-'}</td>
                            <td>${report.receivedBy || '-'}</td>
                            <td>
                                ${report.resolutionSummary ?
                                    `<div style="max-width:250px; font-size:0.85rem;">${report.resolutionSummary.substring(0, 100)}${report.resolutionSummary.length > 100 ? '...' : ''}</div>`
                                    : '-'}
                            </td>
                            <td>
                                <span class="status-badge status-${report.status}">
                                    ${report.status === 'pending' ? 'جديد' :
                                      report.status === 'in_progress' ? 'قيد المعالجة' : 'تم الحل'}
                                </span>
                                ${timeSpent ? `<br><small style="color:#666;">${timeSpent}</small>` : ''}
                            </td>
                            <td>
                                ${report.review ? `
                                    <div style="font-size:0.9rem;">
                                        <div style="color:#FFD700;">${'⭐'.repeat(report.review.rating)}</div>
                                        <small style="color:#666;">${report.review.comment || ''}</small>
                                    </div>
                                ` : '-'}
                            </td>
                            <td>
                                <div style="display:flex; flex-direction:column; gap:0.3rem;">
                                    ${report.status === 'pending' ? `
                                        <button class="btn btn-primary" style="padding:0.4rem 0.6rem; font-size:0.8rem;"
                                                onclick="acceptReport('${report.id}')">
                                            ✅ استلام
                                        </button>
                                    ` : ''}
                                    ${report.status === 'in_progress' ? `
                                        <button class="btn btn-success" style="padding:0.4rem 0.6rem; font-size:0.8rem;"
                                                onclick="showResolveModal('${report.id}')">
                                            ✓ حل البلاغ
                                        </button>
                                    ` : ''}
                                    <button class="btn btn-warning" style="padding:0.4rem 0.6rem; font-size:0.8rem;"
                                            onclick="deleteReport('${report.id}')">
                                        🗑️ حذف
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
        </div>

        <!-- Report Statistics -->
        <div style="margin-top:2rem; padding:1.5rem; background:#f8f9fa; border-radius:10px;">
            <h3 style="margin-bottom:1rem; color:var(--primary-purple);">📊 إحصائيات البلاغات</h3>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
                <div style="background:white; padding:1rem; border-radius:8px;">
                    <div style="font-size:1.5rem; font-weight:700; color:#FFC107;">${reports.filter(r => r.status === 'pending').length}</div>
                    <div style="color:#666;">بلاغات جديدة</div>
                </div>
                <div style="background:white; padding:1rem; border-radius:8px;">
                    <div style="font-size:1.5rem; font-weight:700; color:#2196F3;">${reports.filter(r => r.status === 'in_progress').length}</div>
                    <div style="color:#666;">قيد المعالجة</div>
                </div>
                <div style="background:white; padding:1rem; border-radius:8px;">
                    <div style="font-size:1.5rem; font-weight:700; color:#4CAF50;">${reports.filter(r => r.status === 'resolved').length}</div>
                    <div style="color:#666;">تم الحل</div>
                </div>
                <div style="background:white; padding:1rem; border-radius:8px;">
                    <div style="font-size:1.5rem; font-weight:700; color:var(--primary-purple);">${calculateAverageTime(reports)}</div>
                    <div style="color:#666;">متوسط وقت الحل</div>
                </div>
            </div>
        </div>
    `;
}

function calculateTimeSpent(report) {
    if (!report.submitTime) return null;

    const start = new Date(report.submitTime);
    const end = report.resolvedTime ? new Date(report.resolvedTime) : new Date();
    const diff = end - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `${days} يوم`;
    } else if (hours > 0) {
        return `${hours} ساعة`;
    } else {
        return `${minutes} دقيقة`;
    }
}

function calculateAverageTime(reports) {
    const resolved = reports.filter(r => r.status === 'resolved' && r.submitTime && r.resolvedTime);
    if (resolved.length === 0) return '-';

    const totalMinutes = resolved.reduce((sum, r) => {
        const start = new Date(r.submitTime);
        const end = new Date(r.resolvedTime);
        return sum + (end - start) / (1000 * 60);
    }, 0);

    const avgMinutes = Math.floor(totalMinutes / resolved.length);
    if (avgMinutes > 60) {
        const hours = Math.floor(avgMinutes / 60);
        return `${hours} ساعة`;
    }
    return `${avgMinutes} دقيقة`;
}

function viewReportDetails(reportId) {
    const reports = JSON.parse(localStorage.getItem('customerReports') || '[]');
    const report = reports.find(r => r.id === reportId);

    if (!report) return;

    const details = `
📋 تفاصيل البلاغ الكاملة
━━━━━━━━━━━━━━━━━━━━━━
الموظف: ${report.employeeName}
نوع البلاغ: ${report.category}
الموضوع: ${report.subject}

التفاصيل:
${report.message}

${report.customerInfo ? `معلومات العميل:\n${report.customerInfo}\n` : ''}
${report.resolutionSummary ? `\nالحل:\n${report.resolutionSummary}` : ''}
    `;

    alert(details);
}

function acceptReport(reportId) {
    const session = JSON.parse(localStorage.getItem('adminSession'));
    const reports = JSON.parse(localStorage.getItem('customerReports') || '[]');
    const report = reports.find(r => r.id === reportId);

    if (report) {
        report.status = 'in_progress';
        report.receivedTime = new Date().toLocaleString('ar-SA');
        report.receivedBy = session.name;
        localStorage.setItem('customerReports', JSON.stringify(reports));

        logActivity(`استلام البلاغ: "${report.subject}" من ${report.employeeName}`);
        loadReports();
    }
}

function showResolveModal(reportId) {
    const summary = prompt('أدخل ملخص حل البلاغ (مفصل):');

    if (summary && summary.trim()) {
        const reports = JSON.parse(localStorage.getItem('customerReports') || '[]');
        const report = reports.find(r => r.id === reportId);

        if (report) {
            report.resolutionSummary = summary.trim();
            report.status = 'resolved';
            report.resolvedTime = new Date().toLocaleString('ar-SA');
            localStorage.setItem('customerReports', JSON.stringify(reports));

            logActivity(`تم حل البلاغ: "${report.subject}"`);
            loadReports();
            alert('✅ تم حل البلاغ بنجاح! يمكن للموظف الآن مراجعة الحل.');
        }
    }
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
