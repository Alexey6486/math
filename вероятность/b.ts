/** Бросает n костей с m гранями (значения от 1 до m) */
function rollDice(n: number, m: number): number[] {
    return Array.from({ length: n }, () => Math.floor(Math.random() * m) + 1);
}

/**
 * Проверяет, есть ли значение, которое выпало хотя бы k раз
 */
function hasAtLeastKMatches(values: number[], k: number): boolean {
    const counts = new Map<number, number>();
    for (const v of values) {
        counts.set(v, (counts.get(v) ?? 0) + 1);
    }
    for (const c of counts.values()) {
        if (c >= k) return true;
    }
    return false;
}

/**
 * Считает вероятность методом Монте‑Карло
 */
function monteCarloProbability(
    n: number,
    m: number,
    k: number,
    trials: number
): number {
    let success = 0;
    for (let i = 0; i < trials; i++) {
        const roll = rollDice(n, m);
        if (hasAtLeastKMatches(roll, k)) {
            success++;
        }
    }
    return success / trials;
}

// Пример: 10 костей, 300 граней, хотим вероятность хотя бы 3 совпадений
const diceCount = 10;
const faces = 300;
const k = 3;
const trials = 1_000_000;

const prob = monteCarloProbability(diceCount, faces, k, trials);
console.log(`P(хотя бы ${k} совпадений) ≈ ${prob.toFixed(4)}`);
