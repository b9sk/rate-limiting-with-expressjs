import expressBrute from 'express-brute';

const store = new expressBrute.MemoryStore();

const bruteforce = new expressBrute(store, {
    // Количество попыток X (но одна неудачная попытка минимум, т.е. 3 + 2 = 5, если хотим 5 попыток)
    freeRetries: 3,
    // Время жизни счетчика попыток (Y минут)
    lifetime: 1 * 60,
    // Минимальное время ожидания после блокировки (Z минут)
    minWait: 5 * 60 * 1000, 
});

export default bruteforce;