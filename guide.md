# Queries

**Teammates**

See all the teammates of a certain player across the player's clubs.

```
MATCH (p:Player {name: 'Christen Press'})-[f:PLAYED_FOR]->(t:Team)<-[a:PLAYED_FOR]-(m:Player)-[:PLAYED_WITH]->(p)
RETURN p, f, t, m, a ORDER BY t, m
```

![find teammates](./example-images/find-teammates.png)

**Shortest Connection**

See the shortest path of how two players are connected.

```
MATCH (a:Player),(b:Player)
WHERE a.name='Savannah King' AND b.name='Ally Sentnor'
MATCH p = shortestPath((a)-[*]-(b))
RETURN p
```

![shorest connection](./example-images/shortest-connection.png)
![shorest connection2](./example-images/shortest-connection-2.png)

**Most Teammates**

Returns the top 10 players with the most amount of teammates.
![most teammates](./example-images/most-teammates.png)
