# Java Persistence Query Language (JPQL)


## Einführung

* Historie: basiert auf Hibernate Query Language (HQL)
* eng an SQL angelehnt
  * SQL Syntax
  * case-insensitiv
* operiert auf JPA Entities
* Klassen und Felder case-sensitiv
* abstrahiert DBMS-Spezifika
* unterstützt SELECT, UPDATE, DELETE
* kein INSERT


## SQL

```sql
SELECT * FROM piraten p WHERE p.holzbeine=1;
```

* `piraten` entspricht Tabellenname
* `p` ist ein Alias (optional)
* `p.holzbeine` ist eine Tabellenspalte
* als Ergebnis werden einzelne Spalten, oder alle (`*`) spezifiziert
* häufig Trennzeichen (`;`)


## JPQL

```sql
SELECT p FROM Pirat p WHERE p.holzbeine=1
```

* `Pirat` ist eine Entity
* `p` ist ein Alias (Pflicht)
* `p.holzbeine` ist eine Feldname/Property
* als Ergebnis werden Entities, Felder oder Projektionen spezifiziert
* Semikolon entfällt


## JPA-Kurzform (Achtung!)

```sql
SELECT p FROM Pirat p WHERE p.holzbeine=1
```

```sql
FROM Pirat p WHERE p.holzbeine=1
```

in JPA 2.0 nicht mehr geduldet!

<small>(Hibernate drückt aber ein Auge zu)</small>


## Parameter

### WHERE clause
```sql
SELECT p FROM Pirat p WHERE p.holzbeine=1
```

* logische Operatoren AND/NOT/OR
* Vergleichsoperatoren
  * `<,<=,>,>=,=,<>, between`
  * `like` mit Wildcards `%` und `_`
  * `is null, is not null, is empty`
  * Mengenvergleich mit `in ()`
  * Subqueries mit `all` und `any`


## Subqueries

### ALL

```sql
Select p from Pirat p
where p.shiff.name <> 'Black Pearl'
and p.papageien > ALL
    (Select p2.papageien from Pirat p2
    where p2.schiff.name = 'Black Pearl')
```


## Modifikatoren

* String
  * `concat() lower() upper() length() substring() trim() locate()`
* mathematisch
  * `+ - * /`
  * `abs() sqrt() mod(n,n)`


## Join

inner/outer analog zu SQL

```sql
select c,p from Schiff s inner join s.crew p
```
<small>liefert alle Piraten mit ihrem zugehörigen Schiff</small>

implizieter JOIN

```
Select s from Schiff s where s.crew.holzbeine >= 1
```


## Parameter Binding

* Parameter mit Doppelpunkt gekennzeichnet
* setzbar via Name oder Position
* keine Typprüfung!
* JPA2: auch Collections möglich (für `in()`)

```java
Pirat pirat = new Pirat("Pete");
TypedQuery<Schiff> query =
    entityManager.createQuery(
        "select p from Schiff s where s.captain = :captain",
         Schiff.class);
query.setParameter("captain", pirat);
```


## Queries ausführen

```java
Query query = entityManager.
    createQuery("select p from Pirat p");
@SuppressWarnings("unchecked")
List<Pirat> books = query.getResultList();
```

```java
TypedQuery<Pirat> query = entityManager.
    createQuery("select p from Pirat p", Pirat.class);
List<Pirat> piraten = query.getResultList();
```


## Named Queries

* bei Erstellung der EM-Factory geprüft
* beliebiebige Parameter möglich
* Queryhints
  * bei Definition
  * zur Laufzeit

```java
@NamedQuery(name="pirat.all",query="select p from Pirat p")
public class Pirat implements Serializable { ...
```

```java
em.createNamedQuery("pirat.all",Pirat.class).getResultList();
```


## SingleResult

* alternativ: `getSingleResult()`
* genau 1 Ergebnis

```java
public Pirat findPirate(String name) throws NonUniqueResultException {
	try {
		return entityManager.createQuery(
            "select p from Pirat p where p.name = :name",
             Pirat.class)
        .setParameter("name", name)
	    .getSingleResult();
	} catch (NoResultException e) {
		return null;
	}
}
```


## Streams

neu in JPA 2.2
```java
Stream<Pirat> em
    .createNamedQuery("pirat.all", Pirat.class)
    .getResultStream();
```

* Implementierung Provider-abhängig
    * Hibernate verwendet Cursor
* bitte vorsichtig verwenden! (filtering, sorting...)


# Übung?


## Fluent Interface

```java
Pirat pirat = entityManager
        .createNamedQuery("pirat.byName", Pirat.class)
		.setParameter("vorname", "Guybrush")
		.setParameter("nachname", "Threepwood")
		.getSingleResult();
```


## Pagination

* Performance-Tipp!
* typischer Use-Case: Web-Anwendungen

```java
public List<Pirat> list(int resultCount, int offset) {
    return entityManager
    .createNamedQuery("pirat.all", Pirat.class)
	.setFirstResult(offset)
	.setMaxResults(resultCount)
	.getResultList();
}
```