# Criteria API


![Wozu?](img/criteria-api-motivation.png)


## Criteria API

JPQL: Flexibilität durch Parameter

Criteria API: Flexibilität der Abfragestruktur
* typsichere Abfragen
* DSL ähnliche Syntax
* arbeitet auf Metamodell
    * statisches Metamodell (generiert)
    * dynamisches Metamodell


![Criteria API](img/criteria_api.png)


## statisches Metamodell

```java
// Select p from Pirate p where p.name = 'Blackbeard'
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Pirat> q = cb.createQuery(Pirat.class);
Root<Pirat> pirat = q.from(Pirat.class);
q.select(pirat).where(
    cb.equal(pirat.get(Pirat_.title), "Blackbeard")
);
```


## dynamisches Metamodell

```java
EntityType<Pirat> metaPirat =
    em.getMetamodel().entity(Pirat.class);

// Select p from Pirat p where p.name = 'Animal Farm'
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Pirat> q = cb.createQuery(Pirat.class);
Root<Pirat> pirat = q.from(Pirat.class);
SingularAttribute<? super Pirat, ?> name =
	metaPirat.getSingularAttribute("name");
q.select(pirat)
    .where(cb.equal(pirat.get(name), "Blackbeard"));
```


## Query Builder

Vergleich JPQL
* Aussagekraft
* Lesbarkeit?

Konfiguration vs. Coding
