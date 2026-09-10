### DQL — Data Query Language
DQL — язык запроса данных. Команды DQL позволяют извлекать данные из базы.  
SELECT, JOIN, UNION, GROUP BY, HAVING  

___

### SELECT
SELECT <столбец 1>, <столбец 2>, … <столбец n>  
FROM <имя_схемы>.<имя_таблицы>;  

```
SELECT * FROM s_test.users; - выгрузить всё
SELECT name, phone FROM s_test.users; 
```

WHERE

SELECT <столбец 1>, <столбец 2>, … <столбец n>  
FROM <имя_схемы>.<имя_таблицы>  
WHERE <условие>;  

```
SELECT phone 
FROM users 
WHERE name = 'Иванов Иван Иванович';
```

