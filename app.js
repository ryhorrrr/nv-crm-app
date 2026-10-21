// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Автоматически применяем цветовую тему Telegram (светлая/темная)
document.body.style.backgroundColor = tg.backgroundColor || '#1a1a2e';

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
    const list = document.getElementById('clients-list');

    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || 'Ошибка доступа к таблице');
        }

        const data = await response.json();
        const rows = data.values;

        if (!rows || rows.length < 2) {
            loading.textContent = 'В таблице пока нет данных.';
            return;
        }

        const clients = rows.slice(1);
        list.innerHTML = ''; // Очищаем перед заполнением

        clients.forEach(row => {
            // Пропускаем пустые строки
            if (!row[1]) return;

            // Создаем карточку
            const card = document.createElement('div');
            card.className = 'client-card';

            // Заголовок карточки (Название)
            const title = document.createElement('h3');
            title.textContent = row[1] || 'Без названия';
            card.appendChild(title);

            // Функция для добавления строки данных
            const addRow = (label, value) => {
                if (!value) return; // Не показываем пустые поля
                const div = document.createElement('div');
                div.className = 'client-row';
                div.innerHTML = `<span class="client-label">${label}</span><span class="client-value">${value}</span>`;
                card.appendChild(div);
            };

            // Добавляем данные (индексы колонок: УНП=2, Отрасль=4, Контакт=5, Телефон=6)
            addRow('УНП', row[2]);
            addRow('Отрасль', row[4]);
            addRow('Контакт', row[5]);
            addRow('Телефон', row[6]);

            list.appendChild(card);
        });

        loading.style.display = 'none';
        list.style.display = 'block';

    } catch (err) {
        loading.style.display = 'none';
        errorDiv.style.display = 'block';
        errorDiv.textContent = `Ошибка: ${err.message}`;
    }
}

loadClients();
