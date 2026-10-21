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

// --- НАСТРОЙКИ ---
const SHEET_ID = '1a1UHy0_oMgwvKhR6vGVRZwu2qaK6wbSHCPmdzXQRhOQ';
const API_KEY = 'AIzaSyDe1CkIvfAvU4gi8Xtp_vzPE8wsN0Tn3eA';
const SHEET_NAME = 'Clients';

async function loadClients() {
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const table = document.getElementById('clients-table');

    try {
        // Запрос к Google Sheets API v4
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
        const response = await fetch(url);

        // Если API вернул ошибку (404, 403 и т.д.)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || response.statusText;
            throw new Error(`Ошибка API (${response.status}): ${errorMessage}`);
        }

        const data = await response.json();
        const rows = data.values;

        // Если таблица пустая
        if (!rows || rows.length < 2) {
            loading.textContent = 'В таблице пока нет данных. Добавьте первого клиента через бота.';
            return;
        }

        // Первая строка — заголовки, пропускаем
        // rows[0] = ["ID", "Название", "УНП", "Адрес", "Отрасль", "Контакт", "Телефон", "Сумма"]
        const clients = rows.slice(1);

        const tbody = document.getElementById('clients-body');
        tbody.innerHTML = '';

        clients.forEach(row => {
            const tr = document.createElement('tr');
            // Берем нужные колонки по индексам (сдвиг на 1, т.к. A=ID)
            // B=Название(1), C=УНП(2), E=Отрасль(4), F=Контакт(5), G=Телефон(6)
            const cellsToShow = [row[1], row[2], row[4], row[5], row[6]];
            
            cellsToShow.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell || '—';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        // Прячем загрузку, показываем таблицу
        loading.style.display = 'none';
        table.style.display = 'table';

    } catch (err) {
        loading.style.display = 'none';
        errorDiv.style.display = 'block';
        // Выводим ошибку на экран для отладки
        errorDiv.textContent = `Ошибка загрузки: ${err.message}`;
        console.error(err);
    }
}

// Запуск
loadClients();
