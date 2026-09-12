### DML — Data Manipulation Language
DML — язык манипулирования данными. Команды DML позволяют изменять данные, хранящиеся в таблицах.  
INSERT, UPDATE, DELETE  

___

### Добавление записи в таблицу:
INSERT INTO <имя_схемы>.<имя_таблицы> (<столбец 1>, <столбец 2>, ... <столбец n>)
VALUES (<значение 1>, <значение 2>, ... <значение n>), - одна строка
       (<значение 1>, <значение 2>, ... <значение n>); - вторая и т.д.
```
INSERT INTO users (name, phone, email) 
VALUES 
    ('Петров Сергей Петрович', '+7 (495) 123-56-78', 'petrov@yandex.ru'),
    ('Зайцева Елена Ивановна', '+7 (495) 345-86-98', 'zayceva@yandex.ru'),
    ('Медведев Семён Семёнович', '+7 (495) 369-85-12', 'medvedev@yandex.ru');
```

Вот как выглядит запрос с DEFAULT:  
```
INSERT INTO users (
    id, 
    name, 
    phone, 
    email,
    birthday,
    created_at
) 
VALUES 
    (
        DEFAULT,  -- значение по умолчанию для SERIAL - автоинкрекмент
        'Петрова Ольга Петровна', 
        '+7 (495) 236-56-98', 
        'o.petrova@yandex.ru', 
        '2001-05-06', 
        DEFAULT -- значение по умолчанию - текущий момент времени
    );
```

Имена столбцов в запросе можно не перечислять (не лучшая практика). Если вы не прописали список колонок, он сгенерируется автоматически. В таком случае слева направо будут перечислены все столбцы таблицы в том порядке, в котором они были перечислены при создании таблицы. В блоке VALUES необходимо указать значения для всех колонок таблицы в этом же порядке. Если последними идут столбцы, в которых допустим NULL, то в списке значений NULL можно не указывать.  
```
INSERT INTO users VALUES (
    DEFAULT,  -- id
    'Кузнецов Сергей Алексеевич', -- name
    'kuznetzov@yandex.ru',        -- email
    '+7 (495) 316-64-80',         -- phone
    '1985-03-16', -- birthday
    DEFAULT,      -- значение по умолчанию - текущий момент времени
    NULL          -- NULL для колонки deleted_at
); 
```
___

### UPDATE - изменение данных в строке

UPDATE <имя_схемы>.<имя_таблицы>
SET
-- список обновляемых полей и их новых значениий через запятую
-- в таком формате
<поле 1> = <значение 1>,
<поле 2> = <значение 2>,
-- ...
<поле n> = <значение n>
WHERE <условия>;

```
UPDATE users
SET 
    phone = '+7 (123) 456-78-90',
    email = 'ivanov.i@mail.ru'
WHERE name = 'Иванов Иван Иванович'; - если поле содержит НЕ уникальное значение, то для всех строк  
с аналогичным именем произойдут изменения

изменение значения поля для ВСЕХ строк таблицы
UPDATE products
SET price = price * 1.1; - 

изменение значения поля для ОПРЕДЕЛЕННЫХ строк таблицы
UPDATE products
SET price = price * 1.1
WHERE category IN ('Средства гигиены', 'Косметика');

UPDATE products
SET price = price * 1.15
WHERE category NOT IN ('Средства гигиены', 'Косметика', 'Продукты питания', 'Напитки');
```

___

### DROP - удаление самих БД, схемы, таблицы

Таблица DROP TABLE IF EXISTS s_test.users;  
Схема DROP SCHEMA IF EXISTS s_test;  
Схема, если в ней отстались не удаленные табилцы DROP SCHEMA IF EXISTS s_test CASCADE;  
БД DROP DATABASE music;  
БД если отстались подключенные пользователи DROP DATABASE music WITH (FORCE);  

___

### DELETE .. WHERE удаление ИЗ таблицы

DELETE FROM <имя таблицы>  
WHERE <условие>;  

```
DELETE FROM products; - удалит все данные, процесс удаления построчный, занимает время
```
```
DELETE FROM products
WHERE amount = 0;
```
```
TRUNCATE TABLE <имя таблицы>;
  - очистка таблицы целиком сразу, быстрее чем DELETE;
  - нельзя использовать WHERE
  - сохраняется инкремент PK, если нужно сбросить добавляется команда ...RESTART IDENTITY;
```

### INSERT INTO … SELECT — добавление результатов выборки в другую таблицу

Создание новой таблицы с данными на основе старой или преобразовать данные, чтобы хранить их в другом виде.  

```
INSERT INTO <имя таблицы 1> (
    <поле 1 таблицы 1>,
    <поле 2 таблицы 1>,
    -- ---
    <поле n таблицы 1>
) SELECT
    <поле 1 таблицы 2>,
    <поле 2 таблицы 2>,
    -- ---
    <поле n таблицы 2>
FROM <имя таблицы 2>
-- только в случае, если вы переносите не все строки из таблицы 2 в таблицу 1
WHERE <условия>;  
```

Эта конструкция объединяет INSERT с перечислением колонок и выборку SELECT.  
Список колонок в INSERT — их количество и порядок — должен соответствовать списку колонок в выборке SELECT.  

```
Такой запрос создаст таблицу с тремя полями, но при переносе выберет только два: id и price.  
У поля created_at значение по умолчанию current_timestamp, поэтому оно автоматически сохранит  
в себе дату, когда внесли цены. Если выполнять эту операцию при каждом изменении цен,  
получится сохранить историю изменений в базе.

INSERT INTO product_price_history (id, price)
SELECT id, price FROM products; 
```

Кроме того, во время переноса данные можно обновить.  
Например, нужно внести данные о стоимости товаров на текущий момент.  

```
INSERT INTO product_equity (id, equity, report_date)
SELECT id, price * amount, current_date 
FROM products
WHERE amount > 0;
```

### UPSERT — предотвращение конфликтов при добавлении

```
INSERT INTO users (name, phone, email, birthday)
VALUES ('Петрова О. П.', '+7 (495) 236-56-98', 'o.petrova@yandex.ru', '2001-05-06');

-- ERROR:  duplicate key value violates unique constraint "users_email_key"
-- SQL state: 23505
-- Detail: Key (email)=(o.petrova@yandex.ru) already exists.
```

Разрешать конфликты можно двумя способами.  
Пассивным ON CONFLICT (<ограничение>) DO NOTHING — в случае конфликта ничего не произойдёт.  
```
INSERT INTO users (name, phone, email, birthday)
VALUES ('Петрова О. П.', '+7 (495) 236-56-98', 'o.petrova@yandex.ru', '2001-05-06')
ON CONFLICT DO NOTHING;
```

Активным ON CONFLICT (<ограничение>) DO UPDATE SET ….  
```
INSERT INTO users (name, phone, email, birthday)
VALUES ('Петрова О. П.', '+7 (495) 5678888', 'o.petrova@yandex.ru', '1998-02-23')
ON CONFLICT (email) DO UPDATE SET
name = excluded.name,
phone = excluded.phone,
birthday = excluded.birthday; 
```

В случае конфликта либо выполнится команда INSERT и новое значение добавится  
в таблицу, либо значение в таблице обновится.  
Эта операция также известна как UPSERT — «UPDATE или INSERT».  
В примере выше значения name, phone, birthday в строке с адресом o.petrova@yandex.ru обновятся.  
При этом excluded указывает, что для обновления полей будет использоваться значение из виртуальной таблицы.  
Эта таблица содержит значения для вставки в выражении VALUES, исключённые из‑за конфликта.  

### RETURNING — возврат данных изменённых строк

RETURNING можно применять не только с INSERT, но и с UPDATE и DELETE.  

Например, при вставке строк в таблицу с автоинкрементом важно проверить,  
какие значения получило это поле. В таких ситуациях используют ключевое слово  
RETURNING в конце запроса INSERT и перечисляют интересующие столбцы.  

```
INSERT INTO users (name, phone, email)
VALUES ('Зверева Инга Фёдоровна', '+7 (495) 678-34-76', 'zvereva.if@yandex.ru')
RETURNING id, created_at, deleted_at;
```

Если нужно получить все колонки, используют звёздочку, как в запросе SELECT, вот так: RETURNING *.  
```
UPDATE users
SET phone = '+7 (495) 678-34-79'
WHERE id = 11
RETURNING *;
```

Также RETURNING позволяет получить данные из удаляемых строк.  
```
DELETE FROM users
WHERE birthday ISNULL
RETURNING id, name, email;
```
