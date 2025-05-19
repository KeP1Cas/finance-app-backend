Вот исправленный и немного улучшенный текст:

---

# 1. JavaScript (Core)

## 1.1. Структуры данных

**Set vs Map**

**Ответ:**

- **Set** — это коллекция уникальных значений.
  
  ```javascript
  const set = new Set([1, 2, 2, 3]); // Set {1, 2, 3}
  ```

- **Map** — это коллекция пар ключ-значение, где ключи могут быть любого типа.
  
  ```javascript
  const map = new Map();
  map.set('name', 'Alice'); // Map {'name' => 'Alice'}
  ```

**Различия:**

| Характеристика     | Set            | Map                       |
|---------------------|----------------|---------------------------|
| Уникальность        | Только значения | Ключи уникальны           |
| Доступ по ключу     | Нет            | Да (map.get(key))         |
| Использование       | Удаление дубликатов | Словари, кэши           |


## 1.2. Замыкания (Closures)

**Ответ:**

Замыкание — это функция, которая запоминает лексическое окружение, в котором она была создана.

**Пример:**

```javascript
function createCounter() {
  let count = 0;
  return () => count++;
}
const counter = createCounter();
counter(); // 1
counter(); // 2
```

**Применение:**

- Инкапсуляция состояния (например, в React до использования hooks).
- Модули (IIFE).

## 1.3. `this` и контекст

**Ответ:**

`this` определяется в момент вызова функции:

- В методе объекта: `obj.method()` → `this = obj`.
- В стрелочной функции: берется из внешнего контекста.
- Через `call/apply`: явная привязка.
- Глобально: `window` (или `undefined` в строгом режиме).

## 1.4. `var`, `let`, `const`

| Критерий             | `var`          | `let`         | `const`       |
|----------------------|----------------|---------------|---------------|
| Область видимости    | Функция       | Блок ({})     | Блок ({})     |
| Поднятие (hoisting)  | Да (undefined) | Да (недоступен) | Да (недоступен) |
| Переопределение      | Да            | Нет           | Нет           |

## 1.5. Event Loop

**Ответ:**

JavaScript однопоточный, но Event Loop обрабатывает асинхронность через:

- Стек вызовов (синхронный код).
- Очередь микрозадач (Promise, `queueMicrotask`).
- Очередь макрозадач (setTimeout, setInterval).

**Пример:**

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// Порядок: 1, 4, 3, 2
```

## 1.6. Прототипы и наследование

**Ответ:**

Каждый объект имеет свойство `__proto__`, ссылающееся на `prototype` его конструктора. Цепочка прототипов: поиск свойства идет вверх по `__proto__`.

**Пример:**

```javascript
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { console.log(this.name); };
const cat = new Animal('Мурзик');
cat.speak(); // "Мурзик"
```

---

# 2. React

## 2.1. Hooks

**Ответ:**

- **useState**: для хранения состояния.
- **useEffect**: для работы с сайд-эффектами (аналог `componentDidMount`/`componentDidUpdate`).
- **useMemo/useCallback**: для оптимизации рендеров.

**Пример:**

```javascript
const [count, setCount] = useState(0);
useEffect(() => { document.title = `Count: ${count}`; }, [count]);
```

## 2.2. React.memo vs useMemo

| Критерий            | `React.memo`   | `useMemo`                  |
|---------------------|----------------|-----------------------------|
| Применение          | Компонент      | Значение внутри компонента   |
| Оптимизация         | Рендеры        | Вычисления                   |

## 2.3. Keys в React

**Ответ:**

Ключи помогают React идентифицировать элементы при изменении списка.

```javascript
items.map(item => <li key={item.id}>{item.text}</li>);
```

**Ошибка:** Использование индекса массива как ключа (может привести к багам).

---

# 3. TypeScript

## 3.1. interface vs type

| Критерий            | `interface`      | `type`                  |
|---------------------|------------------|-------------------------|
| Расширение          | `extends`        | `&` (intersection)      |
| Реализация          | Классы (implements) | Не поддерживается       |
| Совместимость       | Декларативное    | Алиасы для любых типов  |

**Пример:**

```typescript
interface User { name: string; }
type ID = string | number;
```

## 3.2. Generics

**Ответ:**

Generics позволяют создавать универсальные компоненты и функции.

**Пример:**

```typescript
function identity<T>(arg: T): T { return arg; }
identity<string>("hello");
```

---

# 4. Архитектура и паттерны

## 4.1. Lifting State Up

**Ответ:**

Перенос состояния в ближайшего общего родителя для синхронизации данных между компонентами.

**Пример:**

```javascript
function Parent() {
  const [value, setValue] = useState('');
  return (
    <>
      <ChildA value={value} onChange={setValue} />
      <ChildB value={value} />
    </>
  );
}
```

---

# 5. Оптимизация

## 5.1. Оптимизация рендеринга в React

- `React.memo`: мемоизация компонента.
- `useMemo/useCallback`: кэширование значений и функций.
- Code Splitting: `React.lazy(() => import('./Component'))`.

---

# 6. Дополнительные вопросы

## 6.1. Чистые функции

**Ответ:**

Чистая функция — это функция, которая:

- Не имеет сайд-эффектов.
- Всегда возвращает одинаковый результат для одних и тех же аргументов.

**Пример:**

```javascript
const sum = (a, b) => a + b; // Чистая
const impure = (a) => a + Math.random(); // Нечистая
```

## 6.2. Иммутабельность

**Ответ:**

Иммутабельность данных важна для корректной работы сравнения пропсов и состояния в React.

**Пример:**

```javascript
// Плохо:
state.items.push(newItem); // Мутация! 

// Хорошо:
setItems([...items, newItem]); // Новый массив
```

---

**Итог:**
Подготовьтесь к вопросам по следующим темам:

- **JavaScript**: замыкания, `this`, Event Loop, прототипы.
- **React**: hooks, оптимизация, управление состоянием.
- **TypeScript**: типы, generics.
- **Архитектура**: паттерны (HOC, Render Props), оптимизация.
