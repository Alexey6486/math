### Команды sql shell

\l - список бд

\dn - список схем и их владельцев
\dn+ - список схем и их владельцев с расширенной информацией
\dn* - таблицы во всех схемах

SELECT schema_name FROM information_schema.schemata;

___

\dt - список таблиц в текущей схеме (или во всех, если схема не ограничена)
\dt+ - таблицы с расширенной информацией
\dt* - таблицы во всех схемах

\dt имя_схемы.* - посмотреть таблицы определенной схемы

SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;

Сменить кодировку консоли на win1251
\! chcp 1251  

Переключиться на другую БД:
\c другая_база

Посмотреть, к какой БД и под каким пользователем ты сейчас подключён:
SELECT current_database(), current_user;

Очистить консоль:
\! cls

