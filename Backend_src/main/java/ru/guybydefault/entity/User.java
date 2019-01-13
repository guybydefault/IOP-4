package ru.guybydefault.entity;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Table(name = "users")
@Entity
public class User extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String password;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    @OrderBy("id ASC")
    private List<AreaCheckResult> areaCheckResults;

    public User() {
    }

    public User(String name, String password) {
        this.name = name;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void addCheckResult(AreaCheckResult areaCheckResult) {
        areaCheckResults.add(areaCheckResult);
    }

    public List<AreaCheckResult> getAreaCheckResults() {
        return areaCheckResults;
    }

    public void setAreaCheckResults(List<AreaCheckResult> areaCheckResults) {
        this.areaCheckResults = areaCheckResults;
    }
}
