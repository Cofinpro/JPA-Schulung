# Advanced Mappings


## Vererbung

* Konzept in RDBMS nicht vorhanden
* Mapping notwendig
* Polymorphie
  * Abfragen
  * Assoziationen

Fragen:
* Wie werden Abfragen durchgeführt?
* Typenhierarchie vollständig abbildbar?


## Domain Model

<div class="uml">
#direction: down
[<abstract>Seemann|name: String|singen()]
[<abstract>Seemann] <:- [Pirat|papagei: Papagei|pluendern()]
[<abstract>Seemann] <:- [Matrose|heuer: BigDecimal]


## Vererbungs-Strategien

* unterschiedliche Strategien möglich
  * Single Table
  * Table per Class
  * Joined
* definiert am generalisierten Typen

```java
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Seemann implements Serializable {
```


## Mappingstrategie
### Single-Table

eine Tabelle für alle Klassen
* Discriminator notwendig
* alle Attribute abgeleiteter Klassen nullable

<div class="uml">
[seemaenner|-id: number;-dtype: varchar;-name: varchar;-heuer: decimal;-papagei_id: number]
</div>


## Mappingstrategie
### Table-Per-Class

eine Tabelle je konkreter Klasse
* in JPA optional
* kein Diskriminator notwendig

<div class="uml">
#orientation: right
[piraten|-id: number;-name: varchar;-papagei_id: number] -/- [matrosen|-id: number;-name: varchar;-heuer: decimal]
</div>


## Mappingstrategie
### Table-Per-Class

* Änderungen an Seemann?
* Query auf alle Seemann?
* Query auf bestimmten Piraten?
* Polymorphe Assoziation auf Seemann?


## Mappingstrategie
### Joined

* eine Tabelle pro Klasse
* Diskriminator nicht notwendig, aber möglich
* IDs gleichzeitig FK und PK

<div class="uml">
#orientation: down
[seemaenner|-id: number;-name: varchar]
[piraten|-id: number;-papagei_id: number] -> [seemaenner]
[seemaenner] <- [matrosen|-id: number;-heuer: decimal]
</div>


## Inheritance Strategie
Wann welche Strategie?

* einfache Struktur: Single Table
* keine Polymorphie: Table per Class
* Polymorphie, hohe Integritätsanforderung: Joined


## EmbeddedClasses

* ähnlich One-To-One
* Attribute werden in Entity-Tabelle übernommen
* Embedded darf nicht NULL sein

```java
@Embeddable
public class Seemannskiste {...}
```

```java
public class Pirat {
    @Embedded
	private Seemannskiste kiste;
```


## IDs und Schlüssel

Anforderungen an IDs
* nicht NULL
* eindeutig
* immutable


## Generation Strategies

`@GeneratedValue(strategy=GenerationType)`

* `IDENTITY`
  * Nutzt Identity/Auto-Increment Columns
  * z.B. MySQL, DB2, MS-SQL
* `TABLE`
  * nutzt eigene Tabelle für Eindeutigkeit
  * Hi/Lo Algorithmus (Hibernate)
* `SEQUENCE`
  * z.B. PostgreSQL, Oracle
* `AUTO`: Provider entscheidet anhand des DBMS


## Sequence Generator

```java
@Entity
@SequenceGenerator(name="piratIdGenerator",
    sequenceName="SEQ_PIRATEN")
public class Pirat {

    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE,
        generator="piratIdGenerator")
    private Long id;

}
```


## Antipattern: ID aus Hashcode

Bitte nicht:

```java
this.id = this.hashCode();
```

Warum?


## Natürliche IDs

### `@IdClass`
* mehrere `@Id` Felder
* IdClass enthält identische Felder

### `@EmbeddedId`
* Id-Klasse @Embeddable
* Entity enthält Feld mit ID-Klassen-Instanz


## HashCode und Equals

* Identifizierung von Entitäten
  * Problem: ID?
* u.a. für Collections relevant
  * vermeiden von Duplikaten

immer beides implementieren


## Legacy Mapping

* Legacy Datenbanken
* Datenbankdesign ≠ Objektorientierung
* JPA nutzt eigene Naming Strategy
* Mapping notwendig


## Schema Generation

* Standardisiert ab JPA 2.1
* Provider generiert automatisch DB-Schema bei Initialisierung der EntityManagerFactory

```xml
<property 
    name="javax.persistence.schema-generation.database.action" 
    value="create-drop"/>
```
```xml
<property name="hibernate.hbm2ddl.auto" value="create-drop"/>
```


## Naming Strategie

* Tabellenname = Entity
* Spaltenname = Feld/Propertyname
  * Unterstrich statt Camel-Case
  * Typ abhängig vom gewählten Dialekt
* Relationen
  * erstellt Join-Tabellen für N:M-Relationen
  * Ref-Constraints automatisch erstellt
* weitere Constraints möglich

anpassbar via LegacyMapping-Annotationen


## Legacy Mappings

* `@Table`
* `@Column`
* `@JoinColumn`
* ...

Auch Standard-Annotation besitzen Schema-Generation relevante Parameter.


## `@Table`

* definiert Table für eine Entity
* Schema, Name
* feldübergreifende Unique Constraints

```java
@Entity
@Table(name="PRTS", schema="ARRRR")
public class Pirat {  }
```

```java
@Entity
@Table(name = "BIRDIES",
    uniqueConstraints = @UniqueConstraint(
    columnNames = {"FARBE", "NAME" }))
public class Papagei { }
```


## `@Embeddable`

```java
public class Pirat {
    protected String name;
    @Embedded protected Seemanskiste kiste;
}
```

```java
@Embeddable public class Seemannskiste {
    protected BigDecimal gold;
}
```

Attribute der Klasse werden in Tabelle der referenzierenden Entity übernommen


## Secondary Table

```java
@Entity
@Table(name="CUSTOMER")
@SecondaryTable(name="CUST_DETAIL",
pkJoinColumns=@PrimaryKeyJoinColumn(name="CUST_ID"))
public class Customer { ... }
```

* Attribute der Entity über mehrere Tabellen verteilt
* Tabelle des jeweiligen Attributs in @Column(table=“„) definieren

Verwendung von @Embedded in Betracht ziehen!


## `@Column`

```java
@Column(name="v_name", nullable=false, length=512)
public String vorname;
```

```java
@Column(name="PLUNDER_LOOT",
    updatable=false, precision=12, scale=2)
public BigDecimal getBeute() { return beute; }
```

* definiert eine Spalte
* Typ der Spalte wird automatisch ermittelt
* Optionen zur Definition der Spaltenparameter
* einige Optionen generieren Constraints
* SQL Fragment des DDL konfigurierbar
  * natives SQL!


## `@JoinColumn`

```java
@ManyToOne
@JoinColumn(name="birdy_id")
public Papagei getPapagei() { return papagei; }
```

```java
@OneToMany
@JoinColumn(name = "SHIP_ID")
// join column is in table for Pirat
public Set<Pirat> getCrew() {return crew;}
```

* definiert den Namen der JOIN-Spalte
* für OneToOne, siehe auch `@PrimaryKeyJoinColumn`


## `@JoinTable`

```java
@JoinTable(name = "SCHATZSUCHEN",
   joinColumns = @JoinColumn(name = "PIRAT_ID"))
@Column(name = "PIRAT", nullable = false)
private Set<Schatzsuche> sections;
```

* definiert den Namen einer JoinTable
* insb. für ManyToMany verwendet
* ab JPA2 für alle Relationstypen möglich
  * Nutzen?