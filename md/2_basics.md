# Basics


## Installation

* JPA-Spec
  * in Java EE enthalten
  * hibernate-jpa-2.1-api-[VERSION].jar
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

```
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
    <class>de.cofinpro.bookStore.Book</class>
    <class>de.cofinpro.bookStore.Author</class>
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

<package>com.mysite</package>

<entity class="Book">
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
public class Book {
	
	@Id @GeneratedValue
	private Long id;
	
	@Basic(optional=false)
	private String title;
	
	private String author;
	private int pages;
	private double price;
	
	@Temporal(TemporalType.DATE)
	private Date published;
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
public class Book {
	
	@Basic private String title;
	
	public String getTitle() {
		if (title == null) { return "Unknown"; }
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
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
