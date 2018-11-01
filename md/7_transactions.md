# Transaktionen


## Transaktionsprobleme
* Dirty Read
* Phantom Read


## Transkationen in JPA

JTA zur Verwaltung genutzt

* Container Managed
  * automatisch gestartet und commited
  * Rollback bei Exceptions
* Bean Managed
  * manuell Transaktions-Scope aufspannen


## Container Managed Transactions

* bei JavaEE der Default
* Container startet Transaktion vor Aufruf einer EJB
  * Transaktion nur über Container Managed Beans
  * kein `this.do()` oder `new Bean().do()`
* Commit bei Return
* Rollback bei Exception
  * alternativ: EJBContext.setRollbackOnly()
  * manuelles commit/rollback nicht möglich!


## Transaction Scope

<figure cite="http://java.sun.com/j2ee/tutorial/3-fcs/doc/Transaction3.html">
<img src="img/transaction_scope.png"></img>
<figcaption><small>Quelle: Oracle, The J2EE Tutorial, Transactions<small></figcaption>
</figure>


## Transaction Scopes

Annotation der Methode
```java
@TransactionAttribute(TransactionAttributeType.???)
```
* `REQUIRED`
* `REQUIRES_NEW`
* `MANDATORY`
* `NOT_SUPPORTED`
* `SUPPORTS`
* `NEVER`


## Transaction Attributes

<figure cite="http://java.sun.com/j2ee/tutorial/3-fcs/doc/Transaction3.html" class="stretch">
<img src="img/transaction_scopes.png"></img>
</figure>


## Beispiel

```java
public class HarbourMaster {
	@EJB Dock dock;

	public void loadCargo(Collection<Cargo> cargo) {
		for (Cargo cargoItem : cargo) {
			dock.load(cargoItem);
		}
	}
}
```

```java
@Stateless
public class Dock {
	@PersistenceContext EntityManager em;

	@TransactionAttribute(TransactionAttributeType.???)
	public void load(Cargo cargo){
		em.persist(cargo);
	}
}
```


## Bean Managed Transactions

* Auf Bean-Ebene konfiguriert
* User Transaction injecten oder lookup
  * mehrere begin/commit Zyklen möglich
* Rollback nicht zwingend erforderlich
  * Container räumt nach Ende des Requests auf


## Beispiel

```java
@Stateless
@TransactionManagement(TransactionManagementType.BEAN)
public class Dock {

	@PersistenceContext(name = "ARRRR") EntityManager em;
	@Resource UserTransaction utx;

	public void load(Cargo cargo) {
		try {
			utx.begin();
			em.persist(cargo);
			utx.commit();
		} catch (Exception e) {
			log.error("We dumped this into the sea: {}", cargo, e);
		}
	}
}
```


## Transaktionen - Diskussion

* Erinnerung: keine „Nested Transactions“
* Verhalten
  * Locking
  * Performance
  * Isolation
* Bean Managed Transactions?
