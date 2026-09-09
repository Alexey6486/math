### DDL — Data Definition Language
DDL — язык описания данных. Команды DDL позволяют создавать, изменять и удалять объекты баз данных.  
CREATE, ALTER, DROP

### DML — Data Manipulation Language
DML — язык манипулирования данными. Команды DML позволяют изменять данные, хранящиеся в таблицах.  
INSERT, UPDATE, DELETE

### DQL — Data Query Language
DQL — язык запроса данных. Команды DQL позволяют извлекать данные из базы.  
SELECT, JOIN, UNION, GROUP BY, HAVING

### TCL — Transaction Control Language
TCL — язык управления транзакциями.  
COMMIT, ROLLBACK, SAVEPOINT

### DCL — Data Control Language
DCL — язык управления доступа к данным.  
GRANT, REVOKE

---

### Создание БД:
CREATE DATABASE имя_бд 
[ OWNER [=] имя_пользователя ]  
[ TEMPLATE [=] шаблон ]  
[ ENCODING [=] кодировка ]  
[ STRATEGY [=] стратегия ]  
[ LOCALE [=] локаль ]  
[ LC_COLLATE [=] категория_сортировки ]  
[ LC_CTYPE [=] категория_типов_символов ]  
[ ICU_LOCALE [=] локаль_icu ]  
[ LOCALE_PROVIDER [=] провайдер_локали ]  
[ COLLATION_VERSION [=] версия_правил_сортировки ]  
[ TABLESPACE [=] табл_пространство ]  
[ ALLOW_CONNECTIONS [=] разр_подключения ]  
[ CONNECTION LIMIT [=] предел_подключений ]  
[ IS_TEMPLATE [=] это_шаблон ]  
[ OID [=] oid ]  

```
CREATE DATABASE music
LOCALE 'sv_SE.utf8'
TEMPLATE template0;
```

### Создание схемы:
Чтобы создать дополнительную схему в созданной базе, подключитесь к ней.
Чтобы подключиться к базе в консоли psql, выполните команду \c music (music — имя базы данных)
CREATE SCHEMA имя_схемы;

### Создание таблицы:
CREATE TABLE имя_схемы.имя_таблицы (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL
);

```
\l - посмотрели список бд
\с music - перешли в нужную
\dn - посмотрели список схем
CREATE SCHEMA s_test; - добавили новую схему и создаем таблицу в ней
```
обращаться и работать с таблицами, если они не дефолтные public, нужно через укзание имя схемы  
или можно добавить схему в дефолтную  
```
ALTER USER ваш_пользователь SET search_path TO s_test, public;
```
иначе sql search_path не увидит их
```
CREATE TABLE s_test.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);
```

### Добавление записи в таблицу:
INSERT INTO имя_таблицы (колонка1, колонка2, ...)
VALUES (значение1, значение2, ...);  
```
INSERT INTO s_test.users (name)
VALUES ('Анна');
```
SELECT * FROM s_test.users;

### Изменение данных в строке
UPDATE имя_схемы.имя_таблицы
SET имя_колонки = 'новое_значение'
WHERE <условие>;
```
UPDATE s_test.users
SET name = 'Игорь'
WHERE id = 1;
```

### Удаление
Таблица DROP TABLE IF EXISTS s_test.users;  
Схема DROP SCHEMA IF EXISTS s_test;  
Схема, если в ней отстались не удаленные табилцы DROP SCHEMA IF EXISTS s_test CASCADE;  
БД DROP DATABASE music;  
БД если отстались подключенные пользователи DROP DATABASE music WITH (FORCE);  

### Редактирование
Название БД, схемы, таблицы:  
ALTER DATABASE/SCHEMA/TABLE -- тип объекта  
<имя_объекта>  
RENAME TO <новое имя>;  
```
ALTER DATABASE shop RENAME TO supermarket;  
ALTER SCHEMA shop RENAME TO supermarket; 
ALTER TABLE products RENAME TO goods;  
```
___
Столбцы (добавить, удалить, изменить тип), ограничения:    
Название БД, схемы, таблицы:  
ALTER TABLE <имя_таблицы>  
ADD/DROP/ALTER -- действие  
COLUMN/CONSTRAINT -- компонент таблицы  
<параметры> -- в случае добавления или изменения компонента.  
-- DROP выполняется без параметров;  

ALTER TABLE <имя_таблицы> ADD COLUMN <имя_столбца> <тип_данных>;  
```
ALTER TABLE users ADD COLUMN address TEXT;  

ALTER TABLE suppliers
    ADD COLUMN comments TEXT,
    ADD COLUMN debt DECIMAL(12, 2);
```

ALTER TABLE <имя_таблицы> ALTER COLUMN <имя_столбца> TYPE <новый_тип_данных>;  
```
ALTER TABLE users ALTER COLUMN address TYPE VARCHAR(300);  
```

ALTER TABLE <имя_таблицы> DROP COLUMN <имя_столбца>;  
```
ALTER TABLE users DROP COLUMN phone;  
```

ALTER TABLE <имя_таблицы> ALTER COLUMN <имя_столбца> SET/DROP NOT NULL;  
```
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;  
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;  
```

ALTER TABLE <имя_таблицы>  
ADD CONSTRAINT <имя_ограничения>  
UNIQUE (<имя_столбца>);  
-- если нужно обеспечить уникальность по нескольким столбцам,  
-- перечисляем их имена через запятую:  
-- <имя_столбца1, имя_столбца2, ...>  
```
-- так вы зададите уникальность номера телефона в столбце
ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone);

-- так вы избежите повтора сочетания серии и номера паспорта в таблице
ALTER TABLE users
    ADD CONSTRAINT users_passport_unique 
    UNIQUE (passport_series, passport_number);
    
ALTER TABLE users DROP CONSTRAINT users_passport_unique;
```

ALTER TABLE <имя_таблицы>  
ADD PRIMARY KEY (<имя_столбца>);  
-- или несколько имен в случае композитного PK  

ALTER TABLE <имя_таблицы> DROP CONSTRAINT <имя_первичного_ключа>;  
```
ALTER TABLE users DROP CONSTRAINT users_pkey;
ALTER TABLE users ADD PRIMARY KEY (id); 
```
