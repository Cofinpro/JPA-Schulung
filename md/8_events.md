# Events


## Callback Methoden

* per Annotation gekennzeichnet
  * mindestens protected
  * return Type `void`
* keine Parameter
* automatisch im Persistenzzyklus ausgeführt
* mehrere Methoden für ein Event möglich


## Events

`@PostLoad`

`@PrePersist` & `@PostPersist`

`@PreUpdate` & `@PostUpdate`

`@PreRemove` & `@PostRemove`


## Beispiele

```java
@PostRemove
protected void logDeletion(){
    log.info("Book {} has been deleted.", this);
}
```

```java
@PreUpdate
@PrePersist
protected void updateTimestamp(){
    this.lastUpdate = new Date();
}
```

```java
@PreRemove
protected void removeAssociations() {
    publisher.removeBook(this);
}
```


## Use-Cases

* Audit-Logging
* Timestamps
* Konsistenz sicherstellen
  * insbesondere komplexe Objektbäume
* Validierung (?)
* ID-Generierung (?)
