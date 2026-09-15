### Функции и операторы для работы с текстом. Целые строки  
Начнём с целых строк. Вот что можно сделать с ними, используя функции и операторы:  
**LENGTH** — посчитать количество символов в строке.  
```
SELECT title, LENGTH(title) AS len
FROM movie
ORDER BY len
LIMIT 10;
```
**LOWER, UPPER и INITCAP** — изменить регистр символа в строке.  
```
SELECT title, LOWER(title) AS lower_title, UPPER(title) AS upper_title
FROM movie
LIMIT 5;
```
**CONCAT, CONCAT_WS и ||** — объединить несколько строк в одну.  
```
SELECT CONCAT(release_year, ' — ', title, ' (', description, ')') AS movie_info
FROM movie
LIMIT 5;

Объединяя строки, функция CONCAT игнорирует значения NULL. 

CONCAT_WS('разделитель', 'строка_1', 'строка_2', … 'строка_n')
В качестве разделителя может быть любое значение, кроме NULL.
SELECT CONCAT_WS(' ', first_name, last_name, email) AS staff_info
FROM staff
LIMIT 5;
```
Также для объединения заданных значений в одну строку можно использовать оператор конкатенации **||**.  
Это аналог функции CONCAT.  
```
SELECT (release_year || ' — ' || title || ' (' || description || ')') AS movie_info
FROM movie
LIMIT 5;

В отличие от функции CONCAT, оператор || не сможет объединить последовательность значений, содержащих NULL.
В этом случае результатом станет NULL
```
**STRING_AGG** — объединить несколько строк в одну при агрегации данных.  
```
STRING_AGG('строка', 'разделитель'[ORDER BY порядок сортировки значений])

SELECT a.title AS album, STRING_AGG(t.name, ', ') AS track_list
FROM track t
JOIN album a ON t.album_id = a.album_id 
GROUP BY a.title
LIMIT 3;

SELECT 
    city, 
    STRING_AGG((first_name || ' ' || last_name), ', ' ORDER BY last_name) AS staff
FROM staff
GROUP BY city;
```

### Функции и операторы для работы с текстом. Подстроки  

**TRIM** — удаляем подстроки в строке  
```
TRIM('строка', 'символы_подстроки')

SELECT TRIM('   Текст с лишними пробелами с двух сторон   ');

чтобы удалить первую группу цифр в начале адреса:
SELECT address AS address_full, TRIM(address, '1234567890') AS address_trimmed
FROM staff
LIMIT 3;

результат 11120 Jasper Ave NW = Jasper Ave NW
```
```
Результат работы функции зависит от регистра переданных символов:
SELECT 
    address AS address_full, 
    TRIM(address, '1234567890SNWE') AS address_trimmed_1, 
    TRIM(address, '1234567890sNwE') AS address_trimmed_2
FROM staff
LIMIT 3;
11120 Jasper Ave NW - Jasper Ave - Jasper Ave NW
```
```
SELECT phone, TRIM(LTRIM(RTRIM(phone, '-0123456789'), '+1')) AS phone_trimmed
FROM staff
LIMIT 3;

+1 (780) 428-9482 - (780)
```

**REPLACE** — меняем подстроку
```
REPLACE('строка', 'подстрока для замены', 'замещающая подстрока')

SELECT title, REPLACE(title, '&', 'and') AS title_corr
FROM album
WHERE title LIKE '%&%'
LIMIT 3;

С помощью REPLACE также можно удалять ненужные символы или подстроки,
если в качестве замещающей подстроки указать пустую строку — пару одинарных кавычек ''.
```

**SPLIT_PART** разделяет строку по заданному символу-разделителю и выдаёт определённую n-подстроку, которую необходимо извлечь.  
```
SPLIT_PART('строка', 'разделитель', 'номер элемента')

SELECT 
    SPLIT_PART('Петров Александр Александрович', ' ', 1) as surname,
    SPLIT_PART('Петров Александр Александрович', ' ', -2) as name;
    
Если указанный номер элемента превышает количество выделенных элементов, функция вернёт NULL.
```
**SUBSTR** если нужно выделить подстроку, которая начинается с определённой позиции в исходной строке.  
```
SUBSTR('строка', 'номер стартовой позиции' [, 'длина выделяемой подстроки'])

SELECT 
    SUBSTR('Петров Александр Александрович', 8) as first_and_middle_name,
    SUBSTR('Петров Александр Александрович', 8, 9) as first_name;
```
**STRPOS** — подсчитываем начальную позицию первого вхождения подстроки в строке  
```
STRPOS('строка', 'подстрока')

SELECT STRPOS('Петров Александр Александрович', 'Александр') as name_position;

Функция чувствительна к регистру. 
Аналог функции STRPOS — функция POSITION, её синтаксис немного отличается:

POSITION('подстрока' in 'строка').
```

Пример, "Брусок строганный, 5х5, 5 шт, заказ №0008857 от 26.07.2023 "
Нужно выделить номер заказа в отдельную строку, при этом оставив только численные значения без нулей в левой части заказа.  
Номер подстроки с заказом, которая начинается с символа №, определит функция STRPOS. Оставить только правую часть строки после символа № поможет функция SUBSTR. Разделить выделенную на предыдущем шаге строку на подстроки, используя в качестве разделителя пробел, а также выделить первую по счёту подстроку, которая будет содержать номер заказа, — работа для функции SPLIT_PART. Функция LTRIM удалит из левой части номера заказа лишние нули.  
```
CREATE TEMPORARY TABLE orders_example (
    id SERIAL PRIMARY KEY,
    order_info VARCHAR(256)
);

INSERT INTO orders_example (order_info)
VALUES
    ('Фанера ФК 15 мм, 5 листов, заказ №3547 от 25.07.2023'),      
    ('Брусок строганный, 5х5, 5 шт, заказ №0008857 от 26.07.2023');
    
SELECT 
    order_info,
    LTRIM(SPLIT_PART(SUBSTR(order_info, STRPOS(order_info, '№')+1), ' ', 1), '№0') AS order_id
FROM orders_example;
```
