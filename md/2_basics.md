# Basics


## Installation

* JPA-Spec
  * in Java EE enthalten
  * jpa-2.2-api-[VERSION].jar
* Persistence Provider
  * durch Container bereitgestellt
  * hibernate-entitymanager-[VERSION].jar


## Konfiguration

### persistence.xml
  * Konfiguration sog. „persistence untits“
  * Datenbankverbindung
  * Transaktionsmanagement
  * zugehörige Klassen


## persistence.xml (JavaEE)

```xml
<persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence"
    version="2.2">

<persistence-unit name="sample">
  <jta-data-source>java:/DefaultDS</jta-data-source>
  <jar-file>MyApp.jar</jar-file>
  <properties>
    <property 
      name="hibernate.hbm2ddl.auto" 
      value="create-drop"/>
  </properties>
</persistence-unit>

</persistence>
```


## persistence.xml (Java SE)

```xml
<persistence>
  <persistence-unit name="sample" 
                    transaction-type="RESOURCE_LOCAL">
    <class>bb.see.Pirat</class>
    <class>bb.see.Schiff</class>
    <properties>
	  <property name="javax.persistence.jdbc.driver"
				value="org.hsqldb.JdbcDriver"/>
      <property name="javax.persistence.jdbc.user" 
                value="sa"/>
      <property name="javax.persistence.jdbc.url" 
                value="jdbc:hsqldb:."/>
	</properties>
  </persistence-unit>
</persistence>
```


## Annotations

* Wie mache ich eine Java-Klasse persistent?
* Welche Attribute sollen gespeichert werden?
* Wie sieht die Datenbank aus?
* Wie soll die Datenbank aussehen?


## Entities (I)

* prinzipiell können POJOs persistente Entities sein
* Entity sollten Beans-Spec genügen
  * muss default Konstruktor, mindestens protected
  * muss Top-Level Klasse sein
  * Felder sollten Properties sein
    * `getField()`, `isField()`, `setField(T value)`


## Entities (II)
* nur Klassen persistierbar (kein Interface/Enum)
* muss Primärschlüssel besitzen (auch via Vererbung)
* darf nicht final sein
* sollte ggf. Serializable implementieren


## Annotations

* mit Java 5 eingeführt
* ersetzen XML-Konfiguration
* mit @ eingeleitet
* können Parameter enthalten
* z.B: `@Override`


## Meta-Daten via XML

persistence.xml

```xml
<mapping-file>META-INF/additional-orm.xml</mapping-file>
```

mapping-orm.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<entity-mappings ...>

<package>bb.see</package>

<entity class="Pirat">
...
</entity>
</entity-mappings>
```


## Quickstart

* `@Entity`
  * name
* `@Basic`
  * optional
  * fetch(LAZY/EAGER)
* `@Temporal`
  * TemporalType.DATE/TIME/TIMESTAMP
* `@Transient`
* `@Id` & `@GeneratedValue`


## Beispiel

```java
@Entity
public class Pirate {
	
	@Id @GeneratedValue
	private Long id;
	
	@Basic(optional=false)
	private String name;
	
	private String bekanntAls;
	private int kaperfahrten;
	private double kopfgeld;
	
	@Temporal(TemporalType.DATE)
	private Date letzterLandgang;
}
```


## Was annotieren?

* Klasse mit @Annotation
* Attribute:
  * am Feld
  * am Getter ("field accessor")

beide Vorgehen gemischt verwendbar (seit JPA2)
* mit `@Access` ist Annotation an Feld und Zugriff über Getter/Setter möglich
  * auf Klassenebene definierbar
  * je Feld definierbar


## Beispiel Accessors

```java
@Entity @Access(AccessType.PROPERTY)
public class Pirate {
	
	@Basic private String name;
	
	public String getName() {
		if (title == null) { return "John Doe"; }
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	/* [...] */
}
```


## Übung 1

1. Setup
2. H2 Starten
3. 01-Basics importieren
  * Book Klasse in der PersistenceUnit registrieren
  * Klasse ergänzen und annotieren
  * alle Unit-Tests des Projekts ausführen



## Relationen

* `@OneToOne`
* `@OneToMany` / `@ManyToOne`
* `@ManyToMany`


## Exkurs: Collections in Java

* Collections: oberstes Interface
* List: feste Reihenfolge
* Set: jedes Element nur einmal  
* SortedSet: festgelegte Sortierreihenfolge
* Map: Zuordnung zu einem eindeutigen Schlüssel

Note:
* Map benötigt @Map-Key-Column (JPA 2.0)
* SortedSet nicht explizit von JPA unterstützt
* NestedCollections nicht unterstützt (map und ValueObject benutzen)


## One-To-One

<div class="uml">
[Pirat|kiste: Seemannskiste]1 -> 1..0[Seemannskiste]
</div>

<div class="uml">
[piraten|id;kisten_id] -> [kisten|id]
</div>


## One-To-Many

<div class="uml">
[Schiff|crew: Collection]1 o-> *[Pirat|schiff: Schiff]
</div>

<div class="uml">
[schiffe|id] <- [piraten|id; schiff_id]
</div>


## Many-To-Many

<div class="uml">
[Schatz|besitzer: Collection ]* <-> *[Pirat|beute: Collection]
</div>

<div class="uml">
[schaetze|id] <- [beute|pirat_id; schatz_id]
[beute] -> [piraten|id]
</div>


## Relationen

* können uni- oder bi-direktional
* Relationen werden von einer Seite „gemanaged“
* JPA verwaltet bidirektionale Relationen nicht
  * Änderungen an der Gegenseite gehen verloren
  * führt u.U. zu Exceptions
* Änderungen an Relationen können kaskadiert werden
  * Speichern/Löschen(!)/Neuladen
* Sonderfall: `deleteOrphan`


## Attribute

* `optional(boolean)`
* `fetch(FetchType)`
* `targetEntity(Class)`
* `cascade(CascadeType[])`
  * `ALL, PERSIST, MERGE, REMOVE, REFRESH`
* `orphanRemoval(boolean)`
* `mappedBy(String)`
  * nur an der inversen Seite der Relation
  * Pflicht bei zwei Relationen zum selben Typ


## Übung 2
1. Relationen zwischen Klassen erstellen
   * Book verwaltet alle Relationen
   * Beim Speichern/Aktualiseren eines Buchs, sollen auch Autoren und Verlag gespeichert werden.
   * Jede Operation auf Book wirkt sich auf ISBN aus.
2. Unit-Tests vervollständigen und ausführen
  * Wie wird Autor/Verlag ein Buch hinzugefügt?
  * Wie lässt sich das Verknüpfen sicherer gestalten?
3. Welche Tabellen und Schlüssel wurden erstellt?



## Entity-Manager

* Verbindung zur Datenbank
* verwaltet Sessions und Transaktionen
* führt Abfragen aus
* verwaltet Persistenz-Lifecycle


## Entity Lifecycle

<div class="uml">
#spacing: 130
[<state>new] em.persist() -> [<state>managed]
[<state>detached] em.detach(), em.close() <-> em.merge() [<state>managed]
[<state>managed] -> em.remove() [<state>removed]
</div>


### Entity-Manager-Factory

* erstellt EntityManager für jeweiligen PersistenceContext
* lädt Mapping aus Annotations oder XML
* Konfiguration über persistence.xml
* initialisiert über statische Methode
  ```java
  Persistence.createEntityManagerFactory("Pirates");
  ```
* Konstruktion sehr teuer!


## Entity-Manager

```java
EntityManagerFactory emf =
  Persistence.createEntityManagerFactory("Pirates");

EntityManager em = emf.getEntityManager();

em.persist(...)
em.merge(...)
em.find(...)
em.remove(...)
em.refresh(...)
```


## Entity-Manager-Transactions

```java
Transaction tx = EntityTransaction.getTransaction();
try {
    tx.begin();
    /* ... */
    tx.commit();
} catch(Exception e) {
    tx.rollback();
}
```


## Übung 3

Entferne die Cascade-Option in Book für publisher. Was passiert nun, wenn ein neues Buch mit neuem Verlag gespeichert wird?


## Provider Specific Annotations

* mischen von Standard- und Vendor-Annotations möglich → Verhalten **nicht** spezifiziert
* unter Umständen für nicht im Standard abgedeckte Fälle notwendig (insb. JPA1)
* Kompatibilität?
* Vendor/Version?
* Abhängigkeiten?
