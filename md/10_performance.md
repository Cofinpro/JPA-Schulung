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
@ManyToMany(fetch=FetchType.EAGER)p
private List<Pirat> crew;
```


## N+1 Problem

```java
public void nplus1Problem(){
	List<Book> books = entityManager
	    .createQuery("select b from Book b", Book.class)
	    .getResultList();
	
	for (Book book :books) {
		book.getPublisher();
	}
}
```


## N+1 Problem

```sql
select book.id as id, book.isbn as isbn, 
    book.pages as pages, book.price as price, 
    book.published as published, 
    book.publisher_id as publisher7_, 
    book.title as title from Book book

select p.id as id2_, p.name as name2_ from Publisher p 
    where p.id=?
select p.id as id2_, p.name as name2_ from Publisher p 
    where p.id=?
select p.id as id2_, p.name as name2_ from Publisher p 
    where p.id=?
```


## Join-Fetches

* impliziert EAGER-Fetching
* Fetch-Verhalten nicht über Annotation konfigurierbar
* `FetchType.EAGER` führt nicht zu JOIN Fetch

mehrere Assoziationen in einer Entity?


## Join-Fetches

```java
entityManager.createQuery(
    "select b from Book b LEFT JOIN FETCH b.publisher"
);
```

```sql
select [...] from Book book 
left outer join Publisher publisher 
on book.publisher_id=publisher.id
```


## Join-Fetches
### Fail!

```java
@Test
public void nplus1ProblemCount(){
	Query query = entityManager.createQuery(
        "select count(b) from Book b");
	int count = ((Long) query.getSingleResult()).intValue();
		
	query = entityManager.createQuery(
        "select b from Book b LEFT JOIN FETCH b.authors");
	List<Book> books = query.getResultList();
	assertThat(books.size(),is(equalTo(count)));
}
```


## Join-Fetches
### Maybe?

```java
@Test
public void nplus1ProblemCount(){
	Query query = entityManager.createQuery(
        "select count(b) from Book b");
	int count = ((Long) query.getSingleResult()).intValue();
		
	query = entityManager.createQuery(
        "select b from Book b LEFT JOIN FETCH b.authors");
	Set<Book> books = new HashSet(query.getResultList());
	assertThat(books.size(),is(equalTo(count)));
}
```


## SQL-Tuning

* erlaubt Ausführen nativer DB-Queries
* Unmarshalling trotzdem möglich

```java
Query nquery = entityManager.createNativeQuery(
    "SELECT * FROM book WHERE book.isbn LIKE '978%'",
     Book.class);
List<Book> isbn13Books = query.getResultList();
```

*Sinnvoll verwenden!*


## JQL-Batches

### Batch-Update

```java
Query query = entityManager.createQuery(
    "update Book b set b.author = 'newname' " 
  + "where b.author = 'oldname'");
int updateCount = query.executeUpdate();
```

### Batch-Delete

```java
Query query = entityManager.createQuery(
    "delete Book b where b.author = 'oldname'");
int deleted = query.executeUpdate();
```