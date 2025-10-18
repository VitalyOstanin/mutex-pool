# Пул воркеров с использованием async mutex

[![npm version](https://img.shields.io/npm/v/@vitalyostanin/mutex-pool.svg)](https://www.npmjs.com/package/@vitalyostanin/mutex-pool)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/VitalyOstanin/mutex-pool/actions/workflows/ci.yml/badge.svg)](https://github.com/VitalyOstanin/mutex-pool/actions)

Простая библиотека для управления пулом воркеров с использованием семафоров из [async-mutex](https://github.com/DirtyHairy/async-mutex).

## Возможности

- Ограничение количества параллельно выполняемых задач
- Простой API на основе async/await
- TypeScript типы из коробки
- Легковесная реализация
- Полностью протестирована

## Установка

```bash
npm install @vitalyostanin/mutex-pool
```

## Использование

### Базовый пример

```typescript
import { MutexPool } from "@vitalyostanin/mutex-pool";

// Создаем пул с максимум 3 параллельными задачами
const pool = new MutexPool(3);

// Обрабатываем задачи из асинхронного итератора
for await (const jobData of asyncInputIterator) {
  const job = async () => {
    console.log('Обработка задачи', { jobData });
    // Ваша асинхронная логика здесь
  };

  await pool.start(job);
}

// Ждем завершения всех задач
await pool.allJobsFinished();
```

### Продвинутый пример

```typescript
import { MutexPool } from "@vitalyostanin/mutex-pool";

async function processItems(items: string[]) {
  const pool = new MutexPool(5); // Максимум 5 задач одновременно
  const results: string[] = [];

  for (const item of items) {
    const job = async () => {
      // Симуляция API запроса или долгой операции
      const result = await fetchData(item);
      results.push(result);
    };

    await pool.start(job);
  }

  // Ждем завершения всех задач
  await pool.allJobsFinished();

  return results;
}
```

### Отслеживание прогресса

```typescript
import { MutexPool } from "@vitalyostanin/mutex-pool";

const pool = new MutexPool(3);
const tasks = Array.from({ length: 10 }, (_, i) => i);

for (const taskId of tasks) {
  const job = async () => {
    console.log(`Задача ${taskId} запущена`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Задача ${taskId} завершена`);
  };

  await pool.start(job);

  // Проверяем количество доступных слотов
  const available = pool.getSemaphoreValue();
  console.log(`Доступно слотов: ${available}`);
}

await pool.allJobsFinished();
console.log('Все задачи выполнены!');
```

## API

### `MutexPool`

#### `constructor(size: number)`

Создает новый пул с указанным размером.

**Параметры:**
- `size` - максимальное количество параллельно выполняемых задач

**Пример:**
```typescript
const pool = new MutexPool(5);
```

#### `start(job: Job): Promise<{ jobFinished: Promise<void> }>`

Запускает задачу в пуле. Возвращается сразу после начала выполнения задачи, не ожидая ее завершения.

**Параметры:**
- `job` - асинхронная функция для выполнения

**Возвращает:**
- Объект с промисом `jobFinished`, который резолвится после завершения задачи

**Пример:**
```typescript
const { jobFinished } = await pool.start(async () => {
  await someAsyncOperation();
});

// Можно дождаться завершения конкретной задачи
await jobFinished;
```

#### `allJobsFinished(): Promise<void>`

Ждет завершения всех запущенных задач.

**Пример:**
```typescript
await pool.allJobsFinished();
console.log('Все задачи завершены');
```

#### `getSemaphoreValue(): number`

Возвращает количество доступных слотов в пуле.

**Возвращает:**
- Количество доступных слотов (0 означает, что все слоты заняты)

**Пример:**
```typescript
const available = pool.getSemaphoreValue();
console.log(`Доступно слотов: ${available}`);
```

### Типы

#### `Job`

```typescript
type Job = () => Promise<void>;
```

Тип для функции задачи, которая не принимает параметров и возвращает Promise<void>.

## Почему не другие библиотеки?

### [p-limit](https://github.com/sindresorhus/p-limit)

Я знаю только один способ дождаться завершения всех задач:
```javascript
await Promise.all(limitedFnList);
```

Но в моем случае нет готового `limitedFnList`, и я не хочу строить его из асинхронного генератора входных данных.

### [p-ratelimit](https://github.com/natesilva/p-ratelimit)

Вы можете использовать `mutex-pool` в комбинации с `p-ratelimit`, где `mutex-pool` отвечает за потребление входных данных, а `p-ratelimit` отвечает за вызовы внешних ресурсов.

## Лицензия

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Автор

Vitaly Ostanin <vitaly.ostanin@mail.ru>
