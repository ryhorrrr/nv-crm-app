// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Показать имя пользователя
const user = tg.initDataUnsafe?.user;
if (user) {
    document.getElementById('user-name').textContent =
        `Менеджер: ${user.first_name || user.username}`;
}

// ТВОИ ДАННЫЕ — замени на свои
const SHEET_ID = '1a1UHy0_oMgwvKhR6vGVRZwu2qaK6wbSHCPmdzXQRhOQ';
const API_KEY = 'AIzaSyDe1CkIvfAvU4gi8Xtp_vzPE8wsN0Tn3eA'; // получишь на Этапе 3
const SHEET_NAME = 'Clients'; // имя листа

async function loadClients() {
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const table = document.getElementById('clients-table');

    try {
        // Читаем через Google Sheets API v4
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const rows = data.values;

        if (!rows || rows.length < 2) {
            loading.textContent = 'Нет данных. Добавьте первого клиента через бота.';
            return;
        }

        // Первая строка — заголовки, пропускаем
        const headers = rows[0];
        const clients = rows.slice(1);

        const tbody = document.getElementById('clients-body');
        tbody.innerHTML = '';

        clients.forEach(row => {
            const tr = document.createElement('tr');
            // Колонки: A=ID, B=Название, C=УНП, D=Адрес, E=Отрасль, F=Контакт, G=Телефон
            [row[1], row[2], row[4], row[5], row[6]].forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell || '—';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        loading.style.display = 'none';
        table.style.display = 'table';

    } catch (err) {
        loading.style.display = 'none';
        errorDiv.style.display = 'block';
        errorDiv.textContent = `Ошибка загрузки: ${err.message}. Проверь API-ключ и доступ к таблице.`;
    }
}

loadClients();
