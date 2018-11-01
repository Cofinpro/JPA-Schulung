# Caching


## Welche Caches gibt es?

* Object Cache
* 1st Level Cache
* 2nd Level Cache
* Query Cache
* providerspezifische


## 1st Level Cache

* an den Entity-Manager gebunden
* Transaction Persistence Context (DEFAULT)
  * umfasst z.B. Request/Response Roundtrip
* Extended Persistence Context
  * für Conversation-Szenarien
  * Entities bleiben `MANAGED`
  * evtl. `merge()` verwenden


## 2nd Level Cache#

### Vorteil
* vermeidet Datenbankzugriff für geladene Entities

### Nachteil
* verbraucht viel Speicherplatz
* Update-Problem
    * Lesend
    * Schreibend
    * weniger kritisch, falls einziger Nutzer des DBMS


## `@Cacheable`
```java
@Entity
@Cacheable
public class Pirat {
  ...
}
```


## 2nd Level Cache

* Unterstützung durch Provicer optional
* Über Persistence XML global konfigurierbar

```xml
<shared-cache-mode>ENABLE_SELECTIVE</shared-cache-mode>
```

Optionen:
ALL, NONE, DISABLE_SELECTIVE, ENABLE_SELECTIVE, UNSPECIFIED


## 2nd Level Cache

* Read/Write Policy konfigurierbar über
  * persistence.xml
  * EntityManager
  * Query-Hint
* Property
  * `javax.persistence.cache.retrieveMode`
  * `javax.persistence.cache.storeMode`
* Enumeration
  * `javax.persistence.CacheRetrieveMode`
  * `javax.persistence.CacheStoreMode`


## Read/Write Policy

* Read-Policy
 * USE: Cache verwenden, außer bei `refresh()`
 * BYPASS
* Write-Police
  * USE
    * beim Lesen/Schreiben Cache aktualisieren
    * wenn bereits vorhanden, nicht aktualisieren
  * BYPASS
  * REFRESH: beim Schreiben immer aktualisieren


## L2-Cache

nutzbar wenn:
* oft lesend zugegriffen
* selten geändert
* unkritisch, falls nicht aktuell

ToDo
* Optimistic Locking Exceptions
* Retention Policy konfigurieren
* ggf. Hints verwenden


## Query-Cache

* Cache für Query Ergebnisse (nicht Objekte!)
* basiert auf Query-Name und Parameter
  (`@NamedQuery`)
* interagiert mit Object-Cache
* für ID basierte Queries weniger nützlich
* Vorteil bei komplexen Queries
  * langlaufend (viele Joins/Conditions)
  * häufig verwendet
* auch hier: Stale-Data


## Cache-Implementierung

* Hibernate unterstützt unterschiedliche Cache-Implementierungen
* Konfiguration über `persistence.xml`
* Unterschiede vor Allem im Concurrency- und Transaktions-Verhalten


## Zusammenfassung

* Vorteil: deutlicher Geschwindigkeitsvorteil
* Gotchas:
    * Stale-Data
    * Transaktionskontext auch im Cache
    * Vorsicht im Cluster
      * Distributed Cache
      * Cache Coordination
    * Speicherverbrauch
      * write-to-disk Strategy
