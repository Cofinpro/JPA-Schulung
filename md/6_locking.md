# Locking


## Locking-Probleme

* Lost-Update-Problematik
* Non-Repeatable-Reads


## JPA Mechanismen
* Optimistic Locking
* Pessimistic Locking

Unterschiede in:
* Performance
* Concurrency
* Fehlerverhalten


## Pessimistic Locking

* Entities werden auf Datenbankebene gesperrt
* Muss bei Queries berücksichtigt werden
* Verwendet Datenbanklocks

```java
em.find(Entity, 4711L, LockModeType.PESSIMISTIC_WRITE);
query.setLockMode(PESSIMISTIC_READ)
```


## Standardverhalten

Verwendet Versionsspalte

```java
@Version
@Column(name="OPTLOCK")
public Integer getVersion() { ... }
```

auch andere Implementierungen möglich
