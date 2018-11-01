# Validierung


## Bean-Validation

* JSR 303
* Referenzimplementierung: Hibernate Validator
* Annotation basiert
* Validierung wird automatisch ausgeführt
  * nach `@Pre`... Callbacks
* besser geeignet als Legacy Mapping (in DB)
* feldübergreifende Validierung möglich


## Setup

* ValidationProvider im Classpath
* `META_INF/validation.xml` (optional bei EE)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<validation-config>

<default-provider>
  org.hibernate.validator.HibernateValidator
</default-provider>

</validation-config>
```


## Beispiel

<small>(ohne JPA-Annotationen)</small>

```java
@Basic(optional=false)
@Size(min=1,message="pirated.name.notBlank")
private String name;

@Pattern(regexp="(schiffsjunge|maat|kapitain)")
private String rang;

@NotNull
private Schiff schiff;

@DecimalMin("0")
private int saebel;

@DecimalMax("2")
private int holzbeine;

@Past
private Date letzte_schatzsuche;
```


## Constraints

```java
@Pattern
@AssertFalse
@NotNull
@Size
@Null
@Future
@Past
@Max
@DecimalMax
@Min
@Digits
@DecimalMin
@AssertTrue
```


## Gruppen

* mehrere Constraints je Element
* Validatoren in Gruppen
* Gruppe einfach leeres Interface

```java
@DecimalMin.List({
	@DecimalMin(value="1", groups=LandrattenValidation.class),
	@DecimalMin(value="100", groups=HaudegenValidation.class)
})
private int schatzsuchen;
```


## mehr Constrains

* CustomContrains einfach zu implementieren
* Hibernate Validator enthält deutlich umfassendere Bibliothek
* mehr: siehe Internet