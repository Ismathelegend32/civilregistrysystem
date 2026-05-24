let crsAllBirths = [];
let crsAllDeaths = [];

async function crsLoadReportData() {
    const [birthRes, deathRes] = await Promise.all([
        apiRequest('birth?action=list'),
        apiRequest('death?action=list')
    ]);
    if (birthRes.success) crsAllBirths = birthRes.data;
    if (deathRes.success) crsAllDeaths = deathRes.data;
}

function crsRecordMatchesFilters(record, dateField, from, to, gender) {
    if (gender !== 'all' && record.gender !== gender) return false;
    const dateVal = (record[dateField] || '').slice(0, 10);
    if (from && dateVal < from) return false;
    if (to && dateVal > to) return false;
    return true;
}

function crsGenerateReport() {
    const type = document.getElementById('reportType').value;
    const from = document.getElementById('dateFrom').value;
    const to = document.getElementById('dateTo').value;
    const gender = document.getElementById('genderFilter').value;
    const rows = [];
    if (type === 'all' || type === 'birth') {
        crsAllBirths.filter(b => crsRecordMatchesFilters(b, 'date_of_birth', from, to, gender))
            .forEach(b => rows.push({ type: 'Birth', name: b.full_name, gender: b.gender, date: b.date_of_birth, details: `F: ${b.father_name}, M: ${b.mother_name}`, id: b.id, certType: 'birth' }));
    }
    if (type === 'all' || type === 'death') {
        crsAllDeaths.filter(d => crsRecordMatchesFilters(d, 'date_of_death', from, to, gender))
            .forEach(d => rows.push({ type: 'Death', name: d.full_name, gender: d.gender, date: d.date_of_death, details: d.cause_of_death || '—', id: d.id, certType: 'death' }));
    }
    rows.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    crsDisplayReportResults(rows);
}

function crsDisplayReportResults(rows) {
    document.getElementById('reportCount').textContent = rows.length;
    document.getElementById('reportResults').classList.remove('hidden');
    const tbody = document.getElementById('reportTableBody');
    const labels = ['Type', 'Name', 'Gender', 'Date', 'Details', 'Certificate'];
    if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-gray-500">No records found</td></tr>';
        return;
    }
    tbody.innerHTML = rows.map(r => `
        <tr>
            <td data-label="${labels[0]}" class="px-3 py-3"><span class="px-2 py-1 rounded-full text-xs font-semibold ${r.type === 'Birth' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}">${r.type}</span></td>
            <td data-label="${labels[1]}" class="px-3 py-3 font-medium">${r.name}</td>
            <td data-label="${labels[2]}" class="px-3 py-3">${r.gender}</td>
            <td data-label="${labels[3]}" class="px-3 py-3">${r.date}</td>
            <td data-label="${labels[4]}" class="px-3 py-3 text-sm">${r.details}</td>
            <td data-label="${labels[5]}" class="px-3 py-3"><button type="button" onclick="crsOpenCertificate('${r.certType}',${r.id})" class="text-blue-600 text-xs font-medium"><i class="fas fa-certificate mr-1"></i>Shahaado</button></td>
        </tr>`).join('');
}

function crsOpenCertificate(type, id) {
    if (type === 'birth') openBirthCertificate(id);
    else openDeathCertificate(id);
}

function crsInitReportsForm() {
    document.getElementById('reportForm')?.addEventListener('submit', e => { e.preventDefault(); crsGenerateReport(); });
}
