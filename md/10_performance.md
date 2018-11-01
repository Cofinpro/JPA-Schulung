# Performance Tuning


## Ansatzpunkte

* Normalisierung
* Lazy Loading
* N+1 Problem
* SQL-Tuning
* Caching
* Database-Tuning


## Lazy-Loading

Collection Initialization

```java
Schiff schiff = entityManager.find(Schiff.class, 1L);
schiff.getCrew().get(0);
```

Fetch Type

```java
@ManyToMany(fetch=FetchType.EAGER)
private List<Pirat> crew;
```


## N+1 Problem

```java
public void nplus1Problem(){
	List<Schiff> schiffe = entityManager
	    .createQuery("select s from schiff s", Schiff.class)
	    .getResultList();

	for (Schiff schiff : schiffe) {
		schiff.getCrew();
	}
}
```
