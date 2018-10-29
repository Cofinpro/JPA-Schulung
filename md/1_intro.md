# Einführung

* Historie
* Motivation
* Überblick


## Einführung

<figure>
<blockquote cite="http://blogs.tedneward.com/post/the-vietnam-of-computer-science/">
Object-Relational mapping is the Vietnam of our industry
</blockquote>
<figcaption>Ted Neward</figcaption>
<figure>


## Wozu ORM?

* objekteorientierte Software
  * Klassen, Instanzen
  * Vererbung

* relationale Datenbanken
  * zweidimensionale Tabellen, Zeilen
  * Schlüssel (Primär, Fremd)
  * nur skalare Datentypen


## Impendance Missmatch

* Granularität
* Vererbung
* Objektidentität
* Relationen
* Navigation

**1:1 Abbildung objektorientierter Modelle in relationalen DBMS unvorteilhaft** <!-- .element: class="fragment" -->


## Aufgaben eines ORM

* Adapter zw. Objektorientierung & relationalen DB
  * Objekte in relationale Datenbanken schreiben
  * Objekte aus relationalen Datenbanken erstellen

* Konvertierung von Datentypen
* Abfragen
* Transaktionsverwaltung
* Concurrency und Locking
* Abstraktion des verwendeten DBMS


## Pro und Kontra

<div style="display: flex;">
<div class="fragment" style="flex: 1;">
    <h3>Vorteile</h3>
    <ul>
        <li>reduziert Codeaufwand (boiler plate code)</li>
        <li>Portabilität</li>
        <li>senkt Einstiegshürden</li>
    </ul>
</div>
<div class="fragment" style="flex: 1;">
    <h3>Nachteile</h3>
    <ul>
        <li>Performance-Verluste</li>
        <ul>
            <li>Bulk-Operationen</li>
            <li>Joins</li>
        </ul>
        <li>führt ggf. zu schlecht durchdachten Datenbanken</li>
    </ul>
</div>
</div>


## Alternativen

* JDBC
* SQL-Templating (JOOQ, MyBatis)
* Object-Graph-Mapper (Hibernate OGM)
* Repositories (Spring Data)


## Friedhof

* Java-Data-Objects (JDO)
* EJB 2 Entity-Beans
* Service-Data-Objects


## Java OR-Mapper

* JPA ist nur eine Spezifikation
* mehrere "Persistence Provider"
    * Hibernate (RedHat)
    * TopLink (Oracle)
    * EclipseLink (IBM)
    * OpenJPA (Apache)
