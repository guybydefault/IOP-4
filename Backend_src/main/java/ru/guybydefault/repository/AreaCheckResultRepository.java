package ru.guybydefault.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;
import ru.guybydefault.entity.AreaCheckResult;
import ru.guybydefault.entity.User;

import java.util.Collection;
import java.util.List;


@Transactional(readOnly = true)
public interface AreaCheckResultRepository extends CrudRepository<AreaCheckResult, Integer> {

    List<AreaCheckResult> findFirst50ByUserOrderByIdDesc(User user);

}
