import expressBrute from 'express-brute';


const store = new expressBrute.MemoryStore();

const bruteforce = new expressBrute(store, {
    freeRetries: 5, // Количество попыток X
    lifetime: 1 * 60, // Время жизни счетчика попыток (Y минут)
    minWait: 5 * 60 * 1000, // Минимальное время ожидания после блокировки (Z минут)
});

export default bruteforce;