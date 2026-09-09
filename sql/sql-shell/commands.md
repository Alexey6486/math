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

SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;
